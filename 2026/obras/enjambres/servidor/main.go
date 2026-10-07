// ENJAMBRES · servidor
// Orquesta de Laptops UC (OLUC) · IEE2003
//
// Una sola aplicación, sin dependencias ni instalación: doble clic y queda
// funcionando. Hace dos cosas:
//  1. Sirve la carpeta Web/ por HTTP para que las demás laptops abran
//     http://<ip-de-esta-laptop>:8080 sin internet. Si la app no está dentro
//     de Web/, sirve la copia de Enjambres que lleva incorporada.
//  2. Por WebSocket (/enjambres) hace de central entre la maestra y las laptops:
//     reenvía a todas las laptops cada cuadro binario de la simulación (unos 30
//     por segundo), les reparte la configuración, reserva el número de cada
//     laptop y le pasa a la maestra lo que cada una pide (crear, quitar, mutear
//     agentes, sus parámetros, sus salidas).
//
// La simulación NO corre aquí: corre en la página de la maestra (en un Worker).
// El servidor guarda un respaldo del enjambre que la maestra le manda cada 2 s,
// para devolvérselo si esa página se recarga.
//
// Basado en el servidor de In C (mismo WebSocket escrito a mano, misma
// búsqueda de Web/, mismas direcciones de red local).
// Compilar: ver construir.sh (solo hace falta para modificarlo).
package main

import (
	"bufio"
	"crypto/sha1"
	"embed"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"log"
	"mime"
	"net"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"path"
	"path/filepath"
	"runtime"
	"sort"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"syscall"
	"time"
)

const (
	app          = "oluc-enjambres"
	version      = "1.0"
	puertoDef    = 8080
	rutaWS       = "/enjambres"
	pingCada     = 4 * time.Second  // latido hacia cada navegador
	muertoTras   = 12 * time.Second // sin respuesta en este lapso = desconectado
	vigencia     = 3 * time.Hour    // un respaldo más viejo que esto no se devuelve
	maxMensaje   = 2 << 20          // 2 MB: el respaldo de un enjambre grande
	maxNum       = 99
	guidWS       = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
	archRespaldo = "oluc-enjambres-respaldo.json"
	archBitacora = "oluc-enjambres.log"
	obra         = "/obras/enjambres/"
)

//go:embed incorporado
var incorporado embed.FS

/* ============================================================
   Estado
   ============================================================ */

type Laptop struct {
	Num     int    `json:"num"`
	ID      string `json:"id"`
	Salidas int    `json:"salidas"`
	con     *Conexion
}

var (
	mu         sync.Mutex
	conexiones = map[*Conexion]bool{}
	laptops    = map[int]*Laptop{} // número → laptop (conectada o no)
	maestra    *Conexion
	config     []byte // últimos config y partitura de la maestra, para quien llegue
	partitura  []byte
	reloj      relojMsg
	webDir     string // carpeta Web/ en disco ("" si se sirve la copia incorporada)
	respaldo   json.RawMessage
	tRespaldo  time.Time
	puerto     int
	bitacora   *log.Logger
	cuadros    atomic.Int64
)

func jsonDe(v any) []byte { b, _ := json.Marshal(v); return b }

func rutaRespaldo() string { return filepath.Join(os.TempDir(), archRespaldo) }

type guardado struct {
	Guardado int64           `json:"guardado"`
	Estado   json.RawMessage `json:"estado"`
}

func guardarRespaldo() { // con mu tomado
	b := jsonDe(guardado{tRespaldo.UnixMilli(), respaldo})
	_ = os.WriteFile(rutaRespaldo(), b, 0o644)
}

func restaurarRespaldo() {
	b, err := os.ReadFile(rutaRespaldo())
	if err != nil {
		return
	}
	var g guardado
	if json.Unmarshal(b, &g) != nil || len(g.Estado) == 0 {
		return
	}
	t := time.UnixMilli(g.Guardado)
	if time.Since(t) > vigencia {
		return
	}
	respaldo, tRespaldo = g.Estado, t
	bitacora.Printf("hay un respaldo del enjambre de hace %s", time.Since(t).Round(time.Second))
}

func conectadas() []*Laptop { // con mu tomado
	var l []*Laptop
	for _, x := range laptops {
		if x.con != nil {
			l = append(l, x)
		}
	}
	sort.Slice(l, func(i, j int) bool { return l[i].Num < l[j].Num })
	return l
}

func ocupados() []int { // con mu tomado
	n := []int{}
	for _, x := range conectadas() {
		n = append(n, x.Num)
	}
	return n
}

// El reloj de la partitura viaja como ms transcurridos (sin internet no hay NTP);
// a quien llega tarde se le suma lo que pasó desde que lo mandó la maestra.
type relojMsg struct {
	T      string  `json:"t"`
	Estado string  `json:"estado"`
	Ms     float64 `json:"ms"`
	desde  time.Time
}

func relojAhora() []byte { // con mu tomado
	if reloj.Estado == "" {
		return nil
	}
	r := reloj
	if r.Estado == "corriendo" {
		r.Ms += float64(time.Since(r.desde).Milliseconds())
	}
	return jsonDe(r)
}

// lo que tiene que saber una laptop o una proyección al llegar
func ponerAlDia(c *Conexion) { // con mu tomado
	for _, b := range [][]byte{config, partitura, relojAhora()} {
		if b != nil {
			c.texto(b)
		}
	}
}

func aLaptops(f []byte) { // con mu tomado; f ya es un marco. Laptops y proyecciones.
	for c := range conexiones {
		if c.laptop != nil || c.vista {
			c.enviar(f)
		}
	}
}

func aMaestra(v any) { // con mu tomado
	if maestra != nil {
		maestra.texto(jsonDe(v))
	}
}

/* ============================================================
   Mensajes
   ============================================================ */

type mensaje struct {
	T         string          `json:"t"`
	Rol       string          `json:"rol"`
	ID        json.RawMessage `json:"id"` // en 'hola' es la identidad (texto); en 'cmd', el número de un agente
	Num       int             `json:"num"`
	Salidas   int             `json:"salidas"`
	Estado    json.RawMessage `json:"estado"`
	Partitura json.RawMessage `json:"partitura"`
}

// Escribe la partitura como partitura.js junto a las páginas: así la cargan la maestra
// al abrir y cada laptop en modo ensayo, incluso abierta con doble clic (sin servidor).
func guardarPartitura(p json.RawMessage) map[string]any {
	if webDir == "" {
		return map[string]any{"t": "guardada", "ok": false, "error": "la app no está dentro de la carpeta Web/: no hay dónde guardar"}
	}
	var o map[string]any
	if len(p) == 0 || json.Unmarshal(p, &o) != nil {
		return map[string]any{"t": "guardada", "ok": false, "error": "partitura inválida"}
	}
	ruta := filepath.Join(webDir, "obras", "enjambres", "partitura.js")
	txt := "/* Partitura de Enjambres (solo mensajes). La escribe el Servidor Enjambres\n   al apretar \"guardar\" en la maestra; se puede editar a mano con cuidado. */\n" +
		"window.ENJAMBRES_PARTITURA = " + string(p) + ";\n"
	if err := os.WriteFile(ruta, []byte(txt), 0o644); err != nil {
		return map[string]any{"t": "guardada", "ok": false, "error": err.Error()}
	}
	bitacora.Printf("partitura guardada en %s", ruta)
	return map[string]any{"t": "guardada", "ok": true, "ruta": "obras/enjambres/partitura.js"}
}

func recibir(c *Conexion, texto []byte) {
	var m mensaje
	if json.Unmarshal(texto, &m) != nil {
		return
	}
	mu.Lock()
	defer mu.Unlock()

	if m.T == "hola" {
		if m.Rol == "maestra" {
			holaMaestra(c)
		} else if m.Rol == "vista" {
			c.vista = true
			c.texto(jsonDe(map[string]any{"t": "bienvenida", "rol": "vista", "maestra": maestra != nil}))
			ponerAlDia(c)
			bitacora.Printf("entra   una proyección (%s)", c.ip)
		} else {
			holaLaptop(c, m)
		}
		return
	}

	/* ---------- de la maestra ---------- */
	if c == maestra {
		switch m.T {
		case "config":
			config = append([]byte(nil), texto...)
			aLaptops(marco(0x1, config))
		case "partitura":
			partitura = append([]byte(nil), texto...)
			aLaptops(marco(0x1, partitura))
		case "reloj":
			var r relojMsg
			if json.Unmarshal(texto, &r) == nil {
				r.desde = time.Now()
				reloj = r
				aLaptops(marco(0x1, texto))
			}
		case "guardarPartitura":
			c.texto(jsonDe(guardarPartitura(m.Partitura)))
		case "respaldo":
			if len(m.Estado) > 0 {
				respaldo, tRespaldo = append(json.RawMessage(nil), m.Estado...), time.Now()
				guardarRespaldo()
			}
		case "apagar":
			bitacora.Printf("apagado desde la maestra")
			go func() { time.Sleep(300 * time.Millisecond); os.Exit(0) }()
		}
		return
	}

	/* ---------- de una laptop: todo lo demás se le pasa a la maestra con SU número ---------- */
	if l := c.laptop; l != nil && m.T == "cmd" {
		var o map[string]any
		if json.Unmarshal(texto, &o) != nil {
			return
		}
		o["num"] = l.Num // una laptop solo puede tocar lo suyo
		if a, _ := o["accion"].(string); a == "salidas" {
			if n, ok := o["n"].(float64); ok {
				l.Salidas = int(n)
			}
		}
		aMaestra(o)
	}
}

func holaMaestra(c *Conexion) {
	if !c.control {
		c.texto([]byte(`{"t":"rechazado"}`))
		bitacora.Printf("rechazada una maestra desde %s: solo la laptop servidora puede serlo", c.ip)
		return
	}
	if maestra != nil && maestra != c {
		vieja := maestra
		vieja.texto([]byte(`{"t":"reemplazado"}`))
		vieja.cerrarCon(4000)
	}
	maestra = c
	c.esMaestra = true
	b := map[string]any{"t": "bienvenida", "rol": "maestra", "version": version,
		"direcciones": direcciones(), "laptops": conectadas()}
	if respaldo != nil && time.Since(tRespaldo) < vigencia {
		b["respaldo"] = respaldo
	}
	c.texto(jsonDe(b))
	aLaptops(marco(0x1, []byte(`{"t":"maestra","si":true}`)))
	bitacora.Printf("maestra conectada (%s)", c.ip)
}

func holaLaptop(c *Conexion, m mensaje) {
	var id string
	_ = json.Unmarshal(m.ID, &id)
	if len(id) > 40 {
		id = id[:40]
	}
	if id == "" || m.Num < 1 || m.Num > maxNum {
		c.texto([]byte(`{"t":"error","motivo":"número o identidad inválidos"}`))
		return
	}
	l := laptops[m.Num]
	if l != nil && l.con != nil && l.ID != id {
		c.texto(jsonDe(map[string]any{"t": "ocupado", "num": m.Num, "ocupados": ocupados()}))
		return
	}
	/* si esta misma identidad tenía otro número, lo suelta */
	for n, x := range laptops {
		if x.ID == id && n != m.Num {
			if x.con != nil {
				x.con.laptop = nil
				x.con.cerrarCon(4001)
			}
			delete(laptops, n)
			aMaestra(map[string]any{"t": "sale", "num": n})
		}
	}
	if l != nil && l.con != nil && l.con != c { // misma identidad desde otra conexión: gana la nueva
		vieja := l.con
		vieja.laptop = nil
		vieja.texto([]byte(`{"t":"reemplazado"}`))
		vieja.cerrarCon(4000)
	}
	if l == nil {
		l = &Laptop{Num: m.Num}
		laptops[m.Num] = l
	}
	l.ID, l.con = id, c
	l.Salidas = min(8, max(1, m.Salidas))
	c.laptop = l
	c.texto(jsonDe(map[string]any{"t": "bienvenida", "rol": "laptop", "num": l.Num, "maestra": maestra != nil}))
	ponerAlDia(c)
	aMaestra(map[string]any{"t": "entra", "num": l.Num, "id": l.ID, "salidas": l.Salidas})
	bitacora.Printf("entra   laptop %d (%s)", l.Num, c.ip)
}

func alCerrar(c *Conexion) {
	mu.Lock()
	defer mu.Unlock()
	delete(conexiones, c)
	if l := c.laptop; l != nil && l.con == c {
		l.con = nil
		aMaestra(map[string]any{"t": "sale", "num": l.Num})
		bitacora.Printf("sale    laptop %d (%s)", l.Num, c.ip)
	}
	c.laptop = nil
	if maestra == c {
		maestra = nil
		aLaptops(marco(0x1, []byte(`{"t":"maestra","si":false}`)))
		bitacora.Printf("maestra desconectada")
	}
}

/* ---------- ¿la conexión viene de esta misma laptop? ---------- */

func ipsPropias() map[string]bool {
	s := map[string]bool{"127.0.0.1": true, "::1": true}
	if addrs, err := net.InterfaceAddrs(); err == nil {
		for _, a := range addrs {
			if n, ok := a.(*net.IPNet); ok {
				s[n.IP.String()] = true
			}
		}
	}
	return s
}

func normIP(hostport string) string {
	h, _, err := net.SplitHostPort(hostport)
	if err != nil {
		h = hostport
	}
	return strings.TrimPrefix(h, "::ffff:")
}

// variable para que las pruebas puedan simular laptops remotas
var esControl = func(ip string, r *http.Request) bool { return ipsPropias()[ip] }

// direcciones IPv4 de la red local por las que las demás laptops llegan aquí
func direcciones() []string {
	var out []string
	ifs, _ := net.Interfaces()
	for _, i := range ifs {
		if i.Flags&net.FlagUp == 0 || i.Flags&net.FlagLoopback != 0 {
			continue
		}
		addrs, _ := i.Addrs()
		for _, a := range addrs {
			if n, ok := a.(*net.IPNet); ok && esDeLaRedLocal(i.Name, n.IP) {
				out = append(out, fmt.Sprintf("%s:%d", n.IP.String(), puerto))
			}
		}
	}
	return out
}

// Deja fuera lo que no sirve a las laptops del ensamble: VPN y redes virtuales
// (Tailscale, WireGuard, ZeroTier, máquinas virtuales, Docker) y el rango
// 100.64.0.0/10, que es el que usa Tailscale.
var (
	_, cgnat, _       = net.ParseCIDR("100.64.0.0/10")
	prefijosVirtuales = []string{"utun", "tun", "tap", "tailscale", "wg", "zt", "ppp", "ipsec", "gif", "stf",
		"bridge", "vmnet", "vboxnet", "docker", "veth", "virbr", "awdl", "llw", "anpi"}
)

func esDeLaRedLocal(iface string, ip net.IP) bool {
	ip4 := ip.To4()
	if ip4 == nil || ip4.IsLinkLocalUnicast() || ip4.IsLoopback() || cgnat.Contains(ip4) {
		return false
	}
	nombre := strings.ToLower(iface)
	for _, p := range prefijosVirtuales {
		if strings.HasPrefix(nombre, p) {
			return false
		}
	}
	return true
}

/* ============================================================
   WebSocket mínimo (RFC 6455), escrito a mano: sin dependencias.
   Marcos de texto y binarios, ping/pong, cierre.
   ============================================================ */

type Conexion struct {
	c         net.Conn
	br        *bufio.Reader
	sal       chan []byte
	fin       chan struct{}
	unaVez    sync.Once
	vivo      atomic.Int64
	ip        string
	control   bool
	esMaestra bool    // protegido por mu
	vista     bool    // proyección: recibe todo, no manda nada (protegido por mu)
	laptop    *Laptop // protegido por mu
}

func marco(op byte, p []byte) []byte {
	n := len(p)
	var h []byte
	switch {
	case n < 126:
		h = []byte{0x80 | op, byte(n)}
	case n < 65536:
		h = []byte{0x80 | op, 126, byte(n >> 8), byte(n)}
	default:
		h = make([]byte, 10)
		h[0], h[1] = 0x80|op, 127
		binary.BigEndian.PutUint64(h[2:], uint64(n))
	}
	return append(h, p...)
}

// Encola sin bloquear nunca. Si la cola está llena: un cuadro se salta (llegará
// el siguiente en 33 ms); cualquier otro mensaje cierra la conexión, y la
// página se reconecta sola.
func (c *Conexion) enviar(f []byte) {
	select {
	case <-c.fin:
	case c.sal <- f:
	default:
		if f[0]&0x0f != 0x2 {
			go c.cerrar()
		}
	}
}
func (c *Conexion) texto(b []byte) { c.enviar(marco(0x1, b)) }

func (c *Conexion) cerrarCon(codigo uint16) {
	p := make([]byte, 2)
	binary.BigEndian.PutUint16(p, codigo)
	c.enviar(marco(0x8, p))
	time.AfterFunc(300*time.Millisecond, c.cerrar)
}

func (c *Conexion) cerrar() {
	c.unaVez.Do(func() {
		close(c.fin)
		c.c.Close()
		alCerrar(c)
	})
}

func (c *Conexion) escritor() {
	for {
		select {
		case <-c.fin:
			return
		case f := <-c.sal:
			c.c.SetWriteDeadline(time.Now().Add(5 * time.Second))
			if _, err := c.c.Write(f); err != nil {
				c.cerrar()
				return
			}
		}
	}
}

func (c *Conexion) lector() {
	defer c.cerrar()
	var frag []byte
	var fragOp byte
	cab := make([]byte, 14)
	for {
		if _, err := io.ReadFull(c.br, cab[:2]); err != nil {
			return
		}
		c.vivo.Store(time.Now().UnixMilli())
		fin, op, masc := cab[0]&0x80 != 0, cab[0]&0x0f, cab[1]&0x80 != 0
		largo := uint64(cab[1] & 0x7f)
		switch largo {
		case 126:
			if _, err := io.ReadFull(c.br, cab[:2]); err != nil {
				return
			}
			largo = uint64(binary.BigEndian.Uint16(cab[:2]))
		case 127:
			if _, err := io.ReadFull(c.br, cab[:8]); err != nil {
				return
			}
			largo = binary.BigEndian.Uint64(cab[:8])
		}
		if largo > maxMensaje || !masc { // el navegador siempre enmascara
			return
		}
		var m [4]byte
		if _, err := io.ReadFull(c.br, m[:]); err != nil {
			return
		}
		p := make([]byte, largo)
		if _, err := io.ReadFull(c.br, p); err != nil {
			return
		}
		for i := range p {
			p[i] ^= m[i&3]
		}
		switch op {
		case 0x8: // cierre
			c.enviar(marco(0x8, []byte{0x03, 0xe8}))
			time.AfterFunc(200*time.Millisecond, c.cerrar)
			return
		case 0x9: // ping -> pong
			c.enviar(marco(0xA, p))
			continue
		case 0xA: // pong: ya se anotó 'vivo'
			continue
		case 0x1, 0x2:
			frag, fragOp = p, op
		case 0x0:
			if frag == nil {
				continue
			}
			if len(frag)+len(p) > maxMensaje {
				return
			}
			frag = append(frag, p...)
		default:
			continue
		}
		if fin && frag != nil {
			if fragOp == 0x1 {
				recibir(c, frag)
			} else {
				difundirCuadro(c, frag)
			}
			frag = nil
		}
	}
}

// Un cuadro binario de la maestra va tal cual a todas las laptops.
func difundirCuadro(c *Conexion, p []byte) {
	mu.Lock()
	defer mu.Unlock()
	if c != maestra || len(p) < 2 || p[0] != 'E' {
		return
	}
	cuadros.Add(1)
	aLaptops(marco(0x2, p))
}

func manejarWS(w http.ResponseWriter, r *http.Request) {
	clave := r.Header.Get("Sec-WebSocket-Key")
	if clave == "" || !strings.EqualFold(r.Header.Get("Upgrade"), "websocket") {
		http.Error(w, "se esperaba WebSocket", http.StatusBadRequest)
		return
	}
	hj, ok := w.(http.Hijacker)
	if !ok {
		http.Error(w, "sin hijack", http.StatusInternalServerError)
		return
	}
	nc, rw, err := hj.Hijack()
	if err != nil {
		return
	}
	h := sha1.Sum([]byte(clave + guidWS))
	acepta := base64.StdEncoding.EncodeToString(h[:])
	nc.SetWriteDeadline(time.Now().Add(5 * time.Second))
	if _, err := nc.Write([]byte("HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n" +
		"Sec-WebSocket-Accept: " + acepta + "\r\n\r\n")); err != nil {
		nc.Close()
		return
	}
	if tc, ok := nc.(*net.TCPConn); ok {
		tc.SetNoDelay(true)
	}
	ip := normIP(r.RemoteAddr)
	c := &Conexion{c: nc, br: rw.Reader, sal: make(chan []byte, 128), fin: make(chan struct{}), ip: ip, control: esControl(ip, r)}
	c.vivo.Store(time.Now().UnixMilli())
	mu.Lock()
	conexiones[c] = true
	mu.Unlock()
	go c.escritor()
	go c.lector()
}

/* ============================================================
   HTTP: archivos de Web/ (o la copia incorporada)
   ============================================================ */

var raiz fs.FS // Web/ en disco o la copia incorporada
var raizTxt string

// Busca hacia arriba desde el ejecutable una carpeta que contenga obras/enjambres/maestra.html.
// Así funciona igual dentro de "Servidor Enjambres.app/Contents/MacOS/" que suelto.
func buscarWeb() string {
	exe, err := os.Executable()
	if err != nil {
		return ""
	}
	if r, err := filepath.EvalSymlinks(exe); err == nil {
		exe = r
	}
	d := filepath.Dir(exe)
	for i := 0; i < 10; i++ {
		if st, err := os.Stat(filepath.Join(d, "obras", "enjambres", "maestra.html")); err == nil && !st.IsDir() {
			return d
		}
		p := filepath.Dir(d)
		if p == d {
			break
		}
		d = p
	}
	return ""
}

func init() {
	mime.AddExtensionType(".musicxml", "application/vnd.recordare.musicxml+xml")
	mime.AddExtensionType(".md", "text/plain; charset=utf-8")
	mime.AddExtensionType(".js", "text/javascript; charset=utf-8")
}

func manejarArchivos(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		http.Error(w, "método no permitido", http.StatusMethodNotAllowed)
		return
	}
	ruta := r.URL.Path
	/* la raíz lleva a cada uno a su página: la laptop servidora a la maestra, las demás a la de laptop */
	if ruta == "/" || ruta == "/enjambres" || ruta == "/enjambres/" {
		destino := obra
		if esControl(normIP(r.RemoteAddr), r) {
			destino = obra + "maestra.html"
		}
		http.Redirect(w, r, destino, http.StatusFound)
		return
	}
	limpia := path.Clean(ruta)
	for _, seg := range strings.Split(limpia, "/") {
		if strings.HasPrefix(seg, ".") {
			http.NotFound(w, r)
			return
		}
	}
	nombre := strings.TrimPrefix(limpia, "/")
	st, err := fs.Stat(raiz, nombre)
	if err != nil {
		http.Error(w, "no encontrado: "+ruta, http.StatusNotFound)
		return
	}
	if st.IsDir() {
		if !strings.HasSuffix(ruta, "/") {
			http.Redirect(w, r, ruta+"/", http.StatusMovedPermanently)
			return
		}
		nombre = path.Join(nombre, "index.html")
		if st, err = fs.Stat(raiz, nombre); err != nil || st.IsDir() {
			http.NotFound(w, r)
			return
		}
	}
	f, err := raiz.Open(nombre)
	if err != nil {
		http.NotFound(w, r)
		return
	}
	defer f.Close()
	w.Header().Set("Cache-Control", "no-cache")
	if ct := mime.TypeByExtension(path.Ext(nombre)); ct != "" {
		w.Header().Set("Content-Type", ct)
	}
	if rs, ok := f.(io.ReadSeeker); ok {
		http.ServeContent(w, r, nombre, st.ModTime(), rs)
		return
	}
	io.Copy(w, f)
}

func manejarInfo(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	b := jsonDe(map[string]any{"app": app, "version": version, "direcciones": direcciones(),
		"ocupados": ocupados(), "maestra": maestra != nil})
	mu.Unlock()
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Write(b)
}

/* ============================================================
   Arranque
   ============================================================ */

func abrirNavegador(url string) {
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "darwin":
		cmd = exec.Command("open", url)
	case "windows":
		cmd = exec.Command("rundll32", "url.dll,FileProtocolHandler", url)
	default:
		cmd = exec.Command("xdg-open", url)
	}
	_ = cmd.Start()
}

// ¿ya hay un servidor de Enjambres en ese puerto? (segundo doble clic)
func esNuestro(p int) bool {
	cl := http.Client{Timeout: 800 * time.Millisecond}
	res, err := cl.Get(fmt.Sprintf("http://127.0.0.1:%d/enjambres/info", p))
	if err != nil {
		return false
	}
	defer res.Body.Close()
	var info map[string]any
	return json.NewDecoder(res.Body).Decode(&info) == nil && info["app"] == app
}

func main() {
	sinNavegador := false
	pedido := 0
	for _, a := range os.Args[1:] {
		if a == "-sin-navegador" || a == "--sin-navegador" {
			sinNavegador = true
		} else if n, err := strconv.Atoi(a); err == nil {
			pedido = n
		}
	}
	if pedido == 0 {
		if n, err := strconv.Atoi(os.Getenv("PUERTO")); err == nil {
			pedido = n
		}
	}

	var salidas []io.Writer = []io.Writer{os.Stdout}
	if f, err := os.OpenFile(filepath.Join(os.TempDir(), archBitacora), os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o644); err == nil {
		salidas = append(salidas, f)
	}
	bitacora = log.New(io.MultiWriter(salidas...), "", log.Ltime)

	if d := buscarWeb(); d != "" {
		raiz, raizTxt, webDir = os.DirFS(d), d, d
	} else {
		sub, _ := fs.Sub(incorporado, "incorporado")
		raiz, raizTxt = sub, "(copia incorporada de Enjambres)"
	}

	/* puerto: el pedido, o el primero libre entre 8080 y 8089 (In C puede estar en
	   el 8080). Si ya hay un servidor de Enjambres corriendo, solo se abre su maestra. */
	candidatos := []int{pedido}
	if pedido == 0 {
		candidatos = nil
		for p := puertoDef; p < puertoDef+10; p++ {
			candidatos = append(candidatos, p)
		}
	}
	var ln net.Listener
	for _, p := range candidatos {
		l, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%d", p))
		if err == nil {
			ln, puerto = l, p
			break
		}
		if esNuestro(p) {
			bitacora.Printf("ya hay un servidor de Enjambres en el puerto %d; abro su maestra", p)
			if !sinNavegador {
				abrirNavegador(fmt.Sprintf("http://localhost:%d%smaestra.html", p, obra))
			}
			return
		}
		if !errors.Is(err, syscall.EADDRINUSE) {
			bitacora.Printf("no puedo usar el puerto %d: %v", p, err)
		}
	}
	if ln == nil {
		bitacora.Printf("no encontré un puerto libre (probé %v)", candidatos)
		os.Exit(1)
	}

	restaurarRespaldo()

	mux := http.NewServeMux()
	mux.HandleFunc(rutaWS, manejarWS)
	mux.HandleFunc(rutaWS+"/info", manejarInfo)
	mux.HandleFunc("/", manejarArchivos)
	srv := &http.Server{Handler: mux, ReadHeaderTimeout: 10 * time.Second}

	go func() {
		ping := marco(0x9, nil)
		for range time.Tick(pingCada) {
			mu.Lock()
			ahora := time.Now().UnixMilli()
			var muertas []*Conexion
			for c := range conexiones {
				if ahora-c.vivo.Load() > muertoTras.Milliseconds() {
					muertas = append(muertas, c)
				} else {
					c.enviar(ping)
				}
			}
			mu.Unlock()
			for _, c := range muertas {
				c.cerrar()
			}
		}
	}()
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt, syscall.SIGTERM)
	go func() { <-sig; bitacora.Printf("detenido"); os.Exit(0) }()

	fmt.Println()
	fmt.Println("  ENJAMBRES · servidor · Orquesta de Laptops UC")
	fmt.Println()
	if ds := direcciones(); len(ds) > 0 {
		fmt.Println("  Las demás laptops abren en el navegador:")
		for _, d := range ds {
			fmt.Println("     " + d)
		}
	} else {
		fmt.Println("  (no encontré una red: ¿está conectado el Wi-Fi o el cable?)")
	}
	fmt.Printf("\n  Esta laptop (la maestra):\n     http://localhost:%d%smaestra.html\n\n", puerto, obra)
	bitacora.Printf("sirviendo %s en el puerto %d", raizTxt, puerto)

	if !sinNavegador {
		go func() {
			time.Sleep(300 * time.Millisecond)
			abrirNavegador(fmt.Sprintf("http://localhost:%d%smaestra.html", puerto, obra))
		}()
	}
	if err := srv.Serve(ln); err != nil {
		bitacora.Printf("error: %v", err)
		os.Exit(1)
	}
}
