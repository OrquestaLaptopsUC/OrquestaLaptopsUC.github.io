// IN C · capa de conjunto · servidor
// Orquesta de Laptops UC (OLUC) · IEE2003
//
// Una sola aplicación, sin dependencias ni instalación: doble clic y queda
// funcionando. Hace dos cosas:
//  1. Sirve la carpeta Web/ por HTTP para que las demás laptops abran
//     http://<ip-de-esta-laptop>:8080 sin internet. Si la app no está dentro
//     de Web/, sirve la copia de In C que lleva incorporada.
//  2. Mantiene por WebSocket (/conjunto) la tabla de quién está en qué
//     patrón, el reloj de la obra y la paleta, y la difunde 4 veces por segundo.
//
// Es PURAMENTE INFORMATIVO: el audio corre en cada navegador. Si este
// programa se cierra, la música sigue; las pantallas lo indican y se
// reconectan solas cuando vuelve.
//
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
	"math"
	"mime"
	"net"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"path"
	"path/filepath"
	"regexp"
	"runtime"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"syscall"
	"time"
	"unicode"
)

const (
	version      = "1.0"
	puertoDef    = 8080
	rutaWS       = "/conjunto"
	difusionMs   = 250 * time.Millisecond // tabla a todos, 4 veces por segundo
	pingCada     = 4 * time.Second        // latido hacia cada navegador
	muertoTras   = 12 * time.Second       // sin respuesta en este lapso = desconectado
	olvidoTras   = 10 * time.Minute       // un desconectado se borra de la tabla
	vigencia     = 3 * time.Hour          // estado guardado de hace menos de esto se restaura
	maxMensaje   = 64 * 1024
	guidWS       = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
	archEstado   = "oluc-in-c-estado.json"
	archBitacora = "oluc-in-c.log"
)

//go:embed incorporado
var incorporado embed.FS

/* ============================================================
   Estado
   ============================================================ */

type Interprete struct {
	ID        string `json:"id"`
	Nombre    string `json:"nombre"`
	Patron    int    `json:"patron"`
	Sonando   bool   `json:"sonando"`
	Pulso     bool   `json:"pulso"`
	Conectado bool   `json:"conectado"`
	con       *Conexion
	desde     time.Time
}

type Reloj struct {
	Estado    string `json:"estado"`    // espera | corriendo | detenido
	Inicio    int64  `json:"inicio"`    // ms de época, cuando corre
	Congelado int64  `json:"congelado"` // ms transcurridos, cuando está detenido
}

type Paleta struct {
	Nombre  string   `json:"nombre"`
	Colores []string `json:"colores"`
}

// Guía: en qué patrón "deberían" estar todos según el reloj de la obra.
// Cada navegador la calcula con su propio reloj, así que sigue sin servidor.
type Guia struct {
	Modo     string `json:"modo"`     // apagada | fija (cada N segundos) | largo (según el largo de cada patrón)
	Segundos int    `json:"segundos"` // modo fija: segundos por patrón
	Minutos  int    `json:"minutos"`  // modo largo: duración total de la obra
}

var (
	mu          sync.Mutex
	interpretes = map[string]*Interprete{}
	conexiones  = map[*Conexion]bool{}
	reloj       = Reloj{Estado: "espera"}
	manual      *int
	paleta      *Paleta
	guia        = Guia{Modo: "apagada", Segundos: 45, Minutos: 45}
	puerto      int
	bitacora    *log.Logger
)

func ahoraMs() int64 { return time.Now().UnixMilli() }

func msReloj() int64 {
	switch reloj.Estado {
	case "corriendo":
		return ahoraMs() - reloj.Inicio
	case "detenido":
		return reloj.Congelado
	}
	return 0
}

func mmss(ms int64) string { s := ms / 1000; return fmt.Sprintf("%d:%02d", s/60, s%60) }

// El reloj, la anulación manual y la paleta se guardan en un archivo temporal:
// si el servidor se reinicia a mitad de obra, todo sigue donde iba.
type guardado struct {
	Guardado int64   `json:"guardado"`
	Reloj    Reloj   `json:"reloj"`
	Manual   *int    `json:"manual"`
	Paleta   *Paleta `json:"paleta"`
	Guia     *Guia   `json:"guia"`
}

func rutaEstado() string { return filepath.Join(os.TempDir(), archEstado) }

func guardar() { // con mu tomado
	g := guia
	b, _ := json.Marshal(guardado{ahoraMs(), reloj, manual, paleta, &g})
	_ = os.WriteFile(rutaEstado(), b, 0o644)
}

func restaurar() {
	b, err := os.ReadFile(rutaEstado())
	if err != nil {
		return
	}
	var g guardado
	if json.Unmarshal(b, &g) != nil || g.Reloj.Estado == "" || ahoraMs()-g.Guardado > vigencia.Milliseconds() {
		return
	}
	reloj, manual, paleta = g.Reloj, g.Manual, g.Paleta
	if g.Guia != nil {
		guia = *g.Guia
	}
	if reloj.Estado != "espera" {
		bitacora.Printf("reloj restaurado: %s, %s", reloj.Estado, mmss(msReloj()))
	}
}

/* ============================================================
   Mensajes
   ============================================================ */

func jsonDe(v any) []byte { b, _ := json.Marshal(v); return b }

func msgReloj() []byte {
	return jsonDe(map[string]any{"t": "reloj", "estado": reloj.Estado, "ms": msReloj()})
}
func msgPaleta() []byte { return jsonDe(map[string]any{"t": "paleta", "paleta": paleta}) }
func msgGuia() []byte   { return jsonDe(map[string]any{"t": "guia", "guia": guia}) }
func msgTabla() []byte {
	lista := make([]*Interprete, 0, len(interpretes))
	for _, it := range interpretes {
		it.Conectado = it.con != nil
		lista = append(lista, it)
	}
	return jsonDe(map[string]any{"t": "tabla", "manual": manual, "interpretes": lista})
}

func aTodos(b []byte) { // con mu tomado
	for c := range conexiones {
		c.texto(b)
	}
}

func limpiarNombre(s string) string {
	s = strings.Map(func(r rune) rune {
		if unicode.IsControl(r) {
			return -1
		}
		return r
	}, s)
	s = strings.TrimSpace(s)
	if r := []rune(s); len(r) > 24 {
		s = string(r[:24])
	}
	return s
}

// número JSON -> entero acotado; ok=false si no es un número
func entero(raw json.RawMessage, a, b int) (int, bool) {
	var f float64
	if len(raw) == 0 || json.Unmarshal(raw, &f) != nil || math.IsNaN(f) || math.IsInf(f, 0) {
		return 0, false
	}
	v := int(math.Round(f))
	if v < a {
		v = a
	}
	if v > b {
		v = b
	}
	return v, true
}

type mensaje struct {
	T       string          `json:"t"`
	ID      string          `json:"id"`
	Nombre  string          `json:"nombre"`
	Patron  json.RawMessage `json:"patron"`
	Sonando *bool           `json:"sonando"`
	Pulso   *bool           `json:"pulso"`
	Accion  string          `json:"accion"`
	Paleta  json.RawMessage `json:"paleta"`
	Guia    *Guia           `json:"guia"`
}

var reColor = regexp.MustCompile(`^#[0-9a-fA-F]{6}$`)

func recibir(c *Conexion, texto []byte) {
	var m mensaje
	if json.Unmarshal(texto, &m) != nil {
		return
	}
	mu.Lock()
	defer mu.Unlock()

	if m.T == "hola" {
		id := m.ID
		if len(id) > 40 {
			id = id[:40]
		}
		if id == "" {
			return
		}
		it := interpretes[id]
		if it != nil && it.con != nil && it.con != c {
			/* misma identidad desde otra conexión: gana la nueva (reconexión tras
			   un corte que el servidor aún no detectó, o una segunda pestaña) */
			vieja := it.con
			it.con = nil
			vieja.interp = nil
			vieja.texto([]byte(`{"t":"reemplazado"}`))
			vieja.cerrarCon(4000)
		}
		nuevo := it == nil
		if nuevo {
			it = &Interprete{ID: id}
			interpretes[id] = it
		}
		it.Nombre = limpiarNombre(m.Nombre)
		if it.Nombre == "" {
			it.Nombre = "sin nombre"
		}
		it.Patron = 1
		if v, ok := entero(m.Patron, 1, 53); ok {
			it.Patron = v
		}
		it.Sonando = m.Sonando != nil && *m.Sonando
		it.Pulso = m.Pulso != nil && *m.Pulso
		it.con, it.desde = c, time.Now()
		c.interp = it
		bienv := map[string]any{"t": "bienvenida", "version": 1, "control": c.control}
		if c.control {
			bienv["direcciones"] = direcciones()
		}
		c.texto(jsonDe(bienv))
		c.texto(msgReloj())
		c.texto(msgPaleta())
		c.texto(msgGuia())
		c.texto(msgTabla())
		verbo := "vuelve"
		if nuevo {
			verbo = "entra "
		}
		ctl := ""
		if c.control {
			ctl = " · control"
		}
		bitacora.Printf("%s %s (%s)%s · patrón %d", verbo, it.Nombre, c.ip, ctl, it.Patron)
		return
	}
	it := c.interp
	if it == nil {
		return // nada antes del hola
	}
	switch m.T {
	case "estado":
		if v, ok := entero(m.Patron, 1, 53); ok {
			it.Patron = v
		}
		if m.Sonando != nil {
			it.Sonando = *m.Sonando
		}
		if m.Pulso != nil {
			it.Pulso = *m.Pulso
		}
	case "nombre":
		if n := limpiarNombre(m.Nombre); n != "" && n != it.Nombre {
			bitacora.Printf("nombre  %s → %s", it.Nombre, n)
			it.Nombre = n
		}

	/* ---- lo que sigue solo lo acepta la laptop servidora ---- */
	case "reloj":
		if !c.control {
			return
		}
		switch {
		case m.Accion == "iniciar" && reloj.Estado != "corriendo":
			var previo int64
			if reloj.Estado == "detenido" {
				previo = reloj.Congelado
			}
			reloj = Reloj{Estado: "corriendo", Inicio: ahoraMs() - previo}
		case m.Accion == "detener" && reloj.Estado == "corriendo":
			reloj = Reloj{Estado: "detenido", Congelado: ahoraMs() - reloj.Inicio}
		case m.Accion == "reiniciar":
			reloj = Reloj{Estado: "espera"}
		default:
			return
		}
		bitacora.Printf("reloj   %s · %s", m.Accion, mmss(msReloj()))
		guardar()
		aTodos(msgReloj())
	case "manual":
		if !c.control {
			return
		}
		if string(m.Patron) == "null" {
			manual = nil
			bitacora.Printf("posición automática (mediana)")
		} else if v, ok := entero(m.Patron, 1, 53); ok {
			manual = &v
			bitacora.Printf("posición MANUAL %d", v)
		} else {
			return
		}
		guardar()
		aTodos(msgTabla())
	case "paleta":
		if !c.control {
			return
		}
		if len(m.Paleta) == 0 || string(m.Paleta) == "null" {
			paleta = nil
		} else {
			var p Paleta
			if json.Unmarshal(m.Paleta, &p) != nil || len(p.Colores) < 2 || len(p.Colores) > 8 {
				return
			}
			for _, x := range p.Colores {
				if !reColor.MatchString(x) {
					return
				}
			}
			p.Nombre = limpiarNombre(p.Nombre)
			if p.Nombre == "" {
				p.Nombre = "personalizada"
			}
			paleta = &p
		}
		if paleta != nil {
			bitacora.Printf("paleta  %s %s", paleta.Nombre, strings.Join(paleta.Colores, " "))
		} else {
			bitacora.Printf("paleta  sin color")
		}
		guardar()
		aTodos(msgPaleta())
	case "guia":
		if !c.control || m.Guia == nil {
			return
		}
		g := *m.Guia
		if g.Modo != "apagada" && g.Modo != "fija" && g.Modo != "largo" {
			return
		}
		g.Segundos = min(300, max(10, g.Segundos))
		g.Minutos = min(180, max(10, g.Minutos))
		guia = g
		bitacora.Printf("guía    %s · %d s por patrón · %d min en total", g.Modo, g.Segundos, g.Minutos)
		guardar()
		aTodos(msgGuia())
	case "olvidar":
		if !c.control {
			return
		}
		for id, x := range interpretes {
			if x.con == nil {
				delete(interpretes, id)
			}
		}
		bitacora.Printf("se olvidaron los desconectados")
		aTodos(msgTabla())
	case "apagar":
		if !c.control {
			return
		}
		bitacora.Printf("apagado desde la página de control")
		go func() { time.Sleep(300 * time.Millisecond); os.Exit(0) }()
	}
}

func alCerrar(c *Conexion) {
	mu.Lock()
	defer mu.Unlock()
	delete(conexiones, c)
	if it := c.interp; it != nil && it.con == c {
		it.con, it.desde = nil, time.Now()
		bitacora.Printf("sale    %s (%s)", it.Nombre, c.ip)
	}
	c.interp = nil
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
				out = append(out, fmt.Sprintf("http://%s:%d", n.IP.String(), puerto))
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
   Solo lo que usa esta capa: marcos de texto, ping/pong, cierre.
   ============================================================ */

type Conexion struct {
	c       net.Conn
	br      *bufio.Reader
	sal     chan []byte
	fin     chan struct{}
	unaVez  sync.Once
	vivo    atomic.Int64
	ip      string
	control bool
	interp  *Interprete // protegido por mu
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

// encola sin bloquear nunca: un navegador lento se desconecta, no frena a los demás
func (c *Conexion) enviar(f []byte) {
	select {
	case <-c.fin:
	case c.sal <- f:
	default:
		go c.cerrar()
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
		c.vivo.Store(ahoraMs())
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
			}
			frag = nil
		}
	}
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
	c := &Conexion{c: nc, br: rw.Reader, sal: make(chan []byte, 256), fin: make(chan struct{}), ip: ip, control: esControl(ip, r)}
	c.vivo.Store(ahoraMs())
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

// Busca hacia arriba desde el ejecutable una carpeta que contenga obras/in-c/index.html.
// Así funciona igual dentro de "Servidor In C.app/Contents/MacOS/" que suelto.
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
		if st, err := os.Stat(filepath.Join(d, "obras", "in-c", "index.html")); err == nil && !st.IsDir() {
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
	if ruta == "/" || ruta == "/in-c" || ruta == "/in-c/" {
		http.Redirect(w, r, "/obras/in-c/", http.StatusFound)
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
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Write(jsonDe(map[string]any{"app": "oluc-in-c", "version": version, "direcciones": direcciones()}))
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

// ¿ya hay un servidor de In C en ese puerto? (segundo doble clic)
func esNuestro(p int) bool {
	cl := http.Client{Timeout: 800 * time.Millisecond}
	res, err := cl.Get(fmt.Sprintf("http://127.0.0.1:%d/conjunto/info", p))
	if err != nil {
		return false
	}
	defer res.Body.Close()
	var info map[string]any
	return json.NewDecoder(res.Body).Decode(&info) == nil && info["app"] == "oluc-in-c"
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
		raiz, raizTxt = os.DirFS(d), d
	} else {
		sub, _ := fs.Sub(incorporado, "incorporado")
		raiz, raizTxt = sub, "(copia incorporada de In C)"
	}

	/* puerto: el pedido, o el primero libre entre 8080 y 8089. Si ya hay un
	   servidor de In C corriendo, solo se abre su página de control. */
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
			bitacora.Printf("ya hay un servidor de In C en el puerto %d; abro su página", p)
			if !sinNavegador {
				abrirNavegador(fmt.Sprintf("http://localhost:%d/obras/in-c/", p))
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

	restaurar()

	mux := http.NewServeMux()
	mux.HandleFunc(rutaWS, manejarWS)
	mux.HandleFunc("/conjunto/info", manejarInfo)
	mux.HandleFunc("/", manejarArchivos)
	srv := &http.Server{Handler: mux, ReadHeaderTimeout: 10 * time.Second}

	/* ciclos */
	go func() {
		for range time.Tick(difusionMs) {
			mu.Lock()
			if len(conexiones) > 0 {
				aTodos(msgTabla())
			}
			mu.Unlock()
		}
	}()
	go func() {
		ping := marco(0x9, nil)
		for range time.Tick(pingCada) {
			mu.Lock()
			ahora := ahoraMs()
			var muertas []*Conexion
			for c := range conexiones {
				if ahora-c.vivo.Load() > muertoTras.Milliseconds() {
					muertas = append(muertas, c)
				} else {
					c.enviar(ping)
				}
			}
			for id, it := range interpretes {
				if it.con == nil && time.Since(it.desde) > olvidoTras {
					delete(interpretes, id)
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
	fmt.Println("  IN C · capa de conjunto · Orquesta de Laptops UC")
	fmt.Println()
	if ds := direcciones(); len(ds) > 0 {
		fmt.Println("  Las demás laptops abren en el navegador:")
		for _, d := range ds {
			fmt.Println("     " + d)
		}
	} else {
		fmt.Println("  (no encontré una red: ¿está conectado el Wi-Fi o el cable?)")
	}
	fmt.Printf("\n  Esta laptop (controles de reloj, posición y paleta):\n     http://localhost:%d/obras/in-c/\n\n", puerto)
	bitacora.Printf("sirviendo %s en el puerto %d", raizTxt, puerto)

	if !sinNavegador {
		go func() {
			time.Sleep(300 * time.Millisecond)
			abrirNavegador(fmt.Sprintf("http://localhost:%d/obras/in-c/", puerto))
		}()
	}
	if err := srv.Serve(ln); err != nil {
		bitacora.Printf("error: %v", err)
		os.Exit(1)
	}
}
