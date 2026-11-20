// ORQUESTA DE LAPTOPS · instrumento unificado · servidor de red local
//
// Basado en la capa de conjunto de In C (in-c/servidor/main.go): un solo
// programa, solo biblioteca estándar de Go, sin instalación. Hace dos cosas:
//
//  1. Sirve por HTTP la carpeta donde está el ejecutable (index.html) para que
//     las demás laptops abran http://<ip-de-esta-laptop>:8080 sin internet.
//     Si no encuentra index.html en disco, sirve la copia incorporada al compilar.
//  2. Mantiene por WebSocket (/orquesta) el reloj de la obra, el BPM, la sección,
//     el modo Unísono y difunde los avisos ¡Atención! y Corte. Solo la laptop
//     donde corre el servidor (la maestra) puede mandar órdenes de dirección.
//
// El reloj viaja como MILISEGUNDOS TRANSCURRIDOS, nunca como hora de inicio:
// sin internet no hay NTP y los relojes de las laptops no coinciden. Cada
// navegador mide el retardo de ida y vuelta (ping/pong) y continúa la cuenta con
// su propio reloj local.
//
// El audio corre en cada navegador: si el servidor se cae, la música sigue y
// las páginas se reconectan solas.
//
// Compilar (ver construir.sh / LEEME.md):
//
//	CGO_ENABLED=0 GOOS=linux  GOARCH=amd64 go build -o servidor-linux .
//	CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 go build -o servidor-mac-arm64 .
//	CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -o servidor-mac-intel .
package main

import (
	"bufio"
	"crypto/sha1"
	_ "embed"
	"encoding/base64"
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"io"
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
	version      = "2.0"
	app          = "oluc-orquesta"
	puertoDef    = 8080
	rutaWS       = "/orquesta"
	rutaInfo     = "/orquesta/info"
	tablaCada    = 1 * time.Second  // lista de músicos a todos
	estadoCada   = 2 * time.Second  // re-difusión del estado (corrige deriva)
	pingCada     = 4 * time.Second  // latido WebSocket
	muertoTras   = 12 * time.Second // sin datos en este lapso = desconectado
	olvidoTras   = 2 * time.Minute  // un desconectado se borra de la tabla
	vigencia     = 3 * time.Hour    // estado guardado más nuevo que esto se restaura
	maxMensaje   = 16 * 1024
	guidWS       = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
	archEstado   = "oluc-orquesta-estado.json"
	archBitacora = "oluc-orquesta.log"
	bpmMin       = 30
	bpmMax       = 300
)

// Copia de respaldo del instrumento (se usa solo si no hay index.html en disco).
//
//go:embed index.html
var indexIncorporado []byte

/* ============================================================
   Estado
   ============================================================ */

type Musico struct {
	ID          string `json:"id"`
	Nombre      string `json:"nombre"`
	IP          string `json:"ip"`
	Instrumento string `json:"instrumento"`
	Sonando     bool   `json:"sonando"`
	Maestra     bool   `json:"maestra"`
	Conectado   bool   `json:"conectado"`
	con         *Conexion
	desde       time.Time
}

type Reloj struct {
	Estado    string `json:"estado"`    // corriendo | pausado
	Inicio    int64  `json:"inicio"`    // ms de época del servidor, cuando corre
	Congelado int64  `json:"congelado"` // ms transcurridos, cuando está pausado
}

var (
	mu        sync.Mutex
	musicos   = map[string]*Musico{}
	conexs    = map[*Conexion]bool{}
	reloj     = Reloj{Estado: "corriendo", Inicio: ahoraMs()}
	bpm       = 90
	seccion   = 0
	unisono   = false
	nAtencion = 0
	nCorte    = 0
	puerto    int
	bitacora  *log.Logger
)

func ahoraMs() int64 { return time.Now().UnixMilli() }

func msReloj() int64 {
	if reloj.Estado == "corriendo" {
		return ahoraMs() - reloj.Inicio
	}
	return reloj.Congelado
}

func mmss(ms int64) string { s := ms / 1000; return fmt.Sprintf("%d:%02d", s/60, s%60) }

/* ---------- persistencia: si el servidor se reinicia a mitad de obra ---------- */

type guardado struct {
	Guardado int64 `json:"guardado"`
	Reloj    Reloj `json:"reloj"`
	Bpm      int   `json:"bpm"`
	Seccion  int   `json:"seccion"`
	Unisono  bool  `json:"unisono"`
}

func rutaEstado() string { return filepath.Join(os.TempDir(), archEstado) }

func guardar() { // con mu tomado
	b, _ := json.Marshal(guardado{ahoraMs(), reloj, bpm, seccion, unisono})
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
	reloj, seccion, unisono = g.Reloj, g.Seccion, g.Unisono
	if g.Bpm >= bpmMin && g.Bpm <= bpmMax {
		bpm = g.Bpm
	}
	bitacora.Printf("estado restaurado: reloj %s %s · %d bpm · sección %d", reloj.Estado, mmss(msReloj()), bpm, seccion+1)
}

/* ============================================================
   Mensajes (JSON con campo "t")
   ============================================================ */

func jsonDe(v any) []byte { b, _ := json.Marshal(v); return b }

func msgEstado() []byte {
	return jsonDe(map[string]any{
		"t":       "estado",
		"reloj":   map[string]any{"estado": reloj.Estado, "ms": msReloj()},
		"bpm":     bpm,
		"seccion": seccion,
		"unisono": unisono,
	})
}

func msgTabla() []byte {
	lista := make([]*Musico, 0, len(musicos))
	for _, m := range musicos {
		m.Conectado = m.con != nil
		lista = append(lista, m)
	}
	return jsonDe(map[string]any{"t": "tabla", "musicos": lista})
}

func aTodos(b []byte) { // con mu tomado
	for c := range conexs {
		c.texto(b)
	}
}

func limpiar(s string, n int) string {
	s = strings.Map(func(r rune) rune {
		if unicode.IsControl(r) {
			return -1
		}
		return r
	}, s)
	s = strings.TrimSpace(s)
	if r := []rune(s); len(r) > n {
		s = string(r[:n])
	}
	return s
}

// número JSON -> entero acotado (acepta 90, 90.0, "90" no)
func entero(raw json.RawMessage, a, b int) (int, bool) {
	var f float64
	if len(raw) == 0 || json.Unmarshal(raw, &f) != nil || math.IsNaN(f) || math.IsInf(f, 0) {
		return 0, false
	}
	v := int(math.Round(f))
	return min(b, max(a, v)), true
}

type mensaje struct {
	T           string          `json:"t"`
	ID          string          `json:"id"`
	Nombre      string          `json:"nombre"`
	Instrumento string          `json:"instrumento"`
	Sonando     *bool           `json:"sonando"`
	Accion      string          `json:"accion"`
	Bpm         json.RawMessage `json:"bpm"`
	Seccion     json.RawMessage `json:"seccion"`
	Activo      *bool           `json:"activo"`
	C           json.RawMessage `json:"c"`
}

func recibir(c *Conexion, texto []byte) {
	var m mensaje
	if json.Unmarshal(texto, &m) != nil {
		return
	}
	mu.Lock()
	defer mu.Unlock()

	switch m.T {
	case "ping": // reloj: el navegador mide el retardo de ida y vuelta
		c.texto(jsonDe(map[string]any{"t": "pong", "c": m.C, "estado": reloj.Estado, "ms": msReloj()}))
		return
	case "hola":
		id := limpiar(m.ID, 40)
		if id == "" {
			return
		}
		mm := musicos[id]
		if mm != nil && mm.con != nil && mm.con != c {
			vieja := mm.con
			mm.con = nil
			vieja.musico = nil
			vieja.cerrarCon(4000)
		}
		if mm == nil {
			mm = &Musico{ID: id}
			musicos[id] = mm
		}
		mm.Nombre = limpiar(m.Nombre, 24)
		mm.IP, mm.Maestra = c.ip, c.control
		mm.Instrumento = limpiar(m.Instrumento, 24)
		mm.Sonando = m.Sonando != nil && *m.Sonando
		mm.con, mm.desde = c, time.Now()
		c.musico = mm
		b := map[string]any{"t": "bienvenida", "app": app, "version": version, "control": c.control}
		if c.control {
			b["direcciones"] = direcciones()
		}
		c.texto(jsonDe(b))
		c.texto(msgEstado())
		c.texto(msgTabla())
		ctl := ""
		if c.control {
			ctl = " · MAESTRA"
		}
		bitacora.Printf("entra   %s (%s)%s", id, c.ip, ctl)
		return
	}

	mm := c.musico
	if mm == nil {
		return // nada antes del hola
	}
	if m.T == "estado" {
		if m.Instrumento != "" {
			mm.Instrumento = limpiar(m.Instrumento, 24)
		}
		if m.Sonando != nil {
			mm.Sonando = *m.Sonando
		}
		if n := limpiar(m.Nombre, 24); n != "" {
			mm.Nombre = n
		}
		return
	}

	/* ---- desde aquí, solo la laptop maestra (la que corre el servidor) ---- */
	if !c.control {
		return
	}
	switch m.T {
	case "reloj":
		ms := msReloj()
		switch m.Accion {
		case "pausar":
			if reloj.Estado != "corriendo" {
				return
			}
			reloj = Reloj{Estado: "pausado", Congelado: ms}
		case "reanudar":
			if reloj.Estado == "corriendo" {
				return
			}
			reloj = Reloj{Estado: "corriendo", Inicio: ahoraMs() - reloj.Congelado}
		case "reiniciar": // vuelve a 0 y conserva si corre o está en pausa
			if reloj.Estado == "corriendo" {
				reloj = Reloj{Estado: "corriendo", Inicio: ahoraMs()}
			} else {
				reloj = Reloj{Estado: "pausado", Congelado: 0}
			}
		default:
			return
		}
		bitacora.Printf("reloj   %s · %s", m.Accion, mmss(msReloj()))
	case "bpm":
		v, ok := entero(m.Bpm, bpmMin, bpmMax)
		if !ok {
			return
		}
		bpm = v
		bitacora.Printf("bpm     %d", bpm)
	case "seccion":
		v, ok := entero(m.Seccion, 0, 99)
		if !ok {
			return
		}
		seccion = v
		if b, ok := entero(m.Bpm, bpmMin, bpmMax); ok {
			bpm = b
		}
		bitacora.Printf("sección %d · %d bpm", seccion+1, bpm)
	case "unisono":
		if m.Activo == nil {
			return
		}
		unisono = *m.Activo
		bitacora.Printf("unísono %v", unisono)
	case "atencion":
		nAtencion++
		bitacora.Printf("¡ATENCIÓN! (%d)", nAtencion)
		aTodos(jsonDe(map[string]any{"t": "atencion", "n": nAtencion}))
		return
	case "corte":
		nCorte++
		bitacora.Printf("CORTE GENERAL (%d)", nCorte)
		aTodos(jsonDe(map[string]any{"t": "corte", "n": nCorte}))
		return
	default:
		return
	}
	guardar()
	aTodos(msgEstado())
}

func alCerrar(c *Conexion) {
	mu.Lock()
	defer mu.Unlock()
	delete(conexs, c)
	if m := c.musico; m != nil && m.con == c {
		m.con, m.desde = nil, time.Now()
		bitacora.Printf("sale    %s (%s)", m.ID, c.ip)
	}
	c.musico = nil
}

/* ---------- ¿la conexión viene de esta misma laptop? (= maestra) ---------- */

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

// variable (no función) para que una prueba pueda simular laptops remotas
var esControl = func(ip string, r *http.Request) bool {
	if os.Getenv("ORQUESTA_PRUEBA") == "1" { // prueba: "localhost" = maestra, "127.0.0.1" = músico
		return strings.HasPrefix(r.Host, "localhost")
	}
	return ipsPropias()[ip]
}

// direcciones IPv4 de la red local por las que llegan las demás laptops
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

var (
	_, cgnat, _       = net.ParseCIDR("100.64.0.0/10")
	prefijosVirtuales = []string{"utun", "tun", "tap", "tailscale", "wg", "zt", "ppp", "ipsec", "gif", "stf",
		"bridge", "vmnet", "vboxnet", "docker", "veth", "virbr", "awdl", "llw", "anpi", "br-"}
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
   WebSocket mínimo (RFC 6455), escrito a mano — copiado de In C.
   Solo marcos de texto, ping/pong y cierre. Sin dependencias.
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
	musico  *Musico // protegido por mu
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

// encola sin bloquear: un navegador lento se desconecta, no frena a los demás
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
	cab := make([]byte, 8)
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
		case 0xA:
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
	conexs[c] = true
	mu.Unlock()
	go c.escritor()
	go c.lector()
}

/* ============================================================
   HTTP: la carpeta del ejecutable (o la copia incorporada)
   ============================================================ */

var carpeta string // carpeta servida; "" = solo la copia incorporada

func tieneIndex(d string) bool {
	st, err := os.Stat(filepath.Join(d, "index.html"))
	return err == nil && !st.IsDir()
}

// Busca index.html junto al ejecutable (funciona aunque macOS lo abra con
// doble clic desde otra carpeta de trabajo) y luego en la carpeta actual.
func buscarCarpeta() string {
	if exe, err := os.Executable(); err == nil {
		if r, err := filepath.EvalSymlinks(exe); err == nil {
			exe = r
		}
		if d := filepath.Dir(exe); tieneIndex(d) {
			return d
		}
	}
	if d, err := os.Getwd(); err == nil && tieneIndex(d) {
		return d
	}
	return ""
}

func init() {
	mime.AddExtensionType(".js", "text/javascript; charset=utf-8")
	mime.AddExtensionType(".md", "text/plain; charset=utf-8")
	mime.AddExtensionType(".json", "application/json")
	mime.AddExtensionType(".wav", "audio/wav")
}

func manejarArchivos(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		http.Error(w, "método no permitido", http.StatusMethodNotAllowed)
		return
	}
	limpia := path.Clean("/" + r.URL.Path)
	for _, seg := range strings.Split(limpia, "/") {
		if strings.HasPrefix(seg, ".") { // nada de archivos ocultos ni ..
			http.NotFound(w, r)
			return
		}
	}
	nombre := strings.TrimPrefix(limpia, "/")
	if nombre == "" {
		nombre = "index.html"
	}
	w.Header().Set("Cache-Control", "no-cache")
	if ext := strings.ToLower(path.Ext(nombre)); ext == ".go" || ext == ".log" || ext == ".sh" || ext == "" {
		if nombre != "index.html" {
			http.NotFound(w, r) // no se reparten fuentes ni ejecutables
			return
		}
	}
	if carpeta != "" {
		ruta := filepath.Join(carpeta, filepath.FromSlash(nombre))
		if st, err := os.Stat(ruta); err == nil && !st.IsDir() {
			http.ServeFile(w, r, ruta)
			return
		}
	}
	if nombre == "index.html" {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write(indexIncorporado)
		return
	}
	http.NotFound(w, r)
}

func manejarInfo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-cache")
	w.Write(jsonDe(map[string]any{"app": app, "version": version, "direcciones": direcciones()}))
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

// ¿ya hay un servidor de la orquesta en ese puerto? (segundo doble clic)
func esNuestro(p int) bool {
	cl := http.Client{Timeout: 800 * time.Millisecond}
	res, err := cl.Get(fmt.Sprintf("http://127.0.0.1:%d%s", p, rutaInfo))
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

	salidas := []io.Writer{os.Stdout}
	if f, err := os.OpenFile(filepath.Join(os.TempDir(), archBitacora), os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o644); err == nil {
		salidas = append(salidas, f)
	}
	bitacora = log.New(io.MultiWriter(salidas...), "", log.Ltime)

	carpeta = buscarCarpeta()

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
			bitacora.Printf("ya hay un servidor de la orquesta en el puerto %d; abro su página", p)
			if !sinNavegador {
				abrirNavegador(fmt.Sprintf("http://localhost:%d/", p))
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
	mux.HandleFunc(rutaInfo, manejarInfo)
	mux.HandleFunc("/", manejarArchivos)
	srv := &http.Server{Handler: mux, ReadHeaderTimeout: 10 * time.Second}

	go func() { // tabla de músicos
		for range time.Tick(tablaCada) {
			mu.Lock()
			if len(conexs) > 0 {
				aTodos(msgTabla())
			}
			mu.Unlock()
		}
	}()
	go func() { // re-difusión del estado: corrige deriva y pérdidas
		for range time.Tick(estadoCada) {
			mu.Lock()
			if len(conexs) > 0 {
				aTodos(msgEstado())
			}
			mu.Unlock()
		}
	}()
	go func() { // latido y limpieza
		ping := marco(0x9, nil)
		for range time.Tick(pingCada) {
			mu.Lock()
			ahora := ahoraMs()
			var muertas []*Conexion
			for c := range conexs {
				if ahora-c.vivo.Load() > muertoTras.Milliseconds() {
					muertas = append(muertas, c)
				} else {
					c.enviar(ping)
				}
			}
			for id, m := range musicos {
				if m.con == nil && time.Since(m.desde) > olvidoTras {
					delete(musicos, id)
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
	fmt.Println("  ORQUESTA DE LAPTOPS · instrumento unificado · servidor de red local")
	fmt.Println()
	if ds := direcciones(); len(ds) > 0 {
		fmt.Println("  Las demás laptops abren en el navegador:")
		for _, d := range ds {
			fmt.Println("     " + d)
		}
	} else {
		fmt.Println("  (no encontré una red: ¿está conectado el Wi-Fi o el cable?)")
	}
	fmt.Printf("\n  Esta laptop es la MAESTRA (controles de dirección):\n     http://localhost:%d/\n\n", puerto)
	if carpeta != "" {
		bitacora.Printf("sirviendo %s en el puerto %d", carpeta, puerto)
	} else {
		bitacora.Printf("sirviendo la copia incorporada de index.html en el puerto %d", puerto)
	}
	bitacora.Printf("Ctrl+C (o cerrar esta ventana) apaga el servidor")

	if !sinNavegador {
		go func() {
			time.Sleep(300 * time.Millisecond)
			abrirNavegador(fmt.Sprintf("http://localhost:%d/", puerto))
		}()
	}
	if err := srv.Serve(ln); err != nil {
		bitacora.Printf("error: %v", err)
		os.Exit(1)
	}
}
