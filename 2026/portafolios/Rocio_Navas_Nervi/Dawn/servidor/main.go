// DAWN OF COMPUTER MUSIC · servidor
// Orquesta de Laptops UC
//
// Una sola aplicación, sin dependencias ni instalación: doble clic y queda
// funcionando, igual que los servidores de In C y Enjambres. Hace tres cosas:
//  1. Sirve la página de la obra (docm.html, la de esta misma carpeta) por
//     HTTP, para que las demás laptops abran http://<ip-de-esta-laptop>:8080
//     sin internet y sin tener nada bajado. Si no encuentra la página junto a
//     la app (por ejemplo, si macOS la abrió desde una copia aislada), sirve la
//     copia que lleva incorporada.
//  2. Hace partir a todas las laptops a la vez: la directora aprieta «Empezar
//     a todos», el servidor fija un instante unos segundos en el futuro y cada
//     laptop lo convierte a su propio reloj (lo mide contra /hora, como NTP).
//     Los avisos van por Server-Sent Events (/eventos); cada laptop cuenta su
//     estado (estación, sonido, teclado) con POST /hola.
//  3. Abre sola la página de la directora en esta laptop, con la dirección que
//     usan las demás. Solo esta laptop puede dar la partida, detener y apagar.
//
// Compilar: ver construir.sh (solo hace falta para modificarlo).
package main

import (
	"bytes"
	_ "embed"
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
	"sort"
	"strconv"
	"strings"
	"sync"
	"syscall"
	"time"
)

const (
	app          = "oluc-dawn"
	version      = "1.0"
	puertoDef    = 8080
	marca        = `content="dawn-of-computer-music"` // <meta name="oluc-obra" ...> en la página
	cuentaMax    = 10.0                               // segundos
	archBitacora = "oluc-dawn.log"
)

//go:embed incorporado/dom001.html
var incorporada []byte

var (
	carpeta  string // carpeta con la página en disco ("" = la copia incorporada)
	pagina   string // nombre de la página en esa carpeta
	puerto   int
	bitacora *log.Logger
	inicio   = time.Now()
)

// Reloj del servidor en milisegundos. time.Since usa el reloj monótono: no
// salta si alguien cambia la hora del equipo.
func ahoraMs() float64 { return float64(time.Since(inicio).Nanoseconds()) / 1e6 }

/* ============================================================
   Estado: la última orden de la directora y las laptops conectadas
   ============================================================ */

type Laptop struct {
	ID       string `json:"id"`
	Estacion string `json:"estacion"`
	Mov      int    `json:"mov"`
	Sonido   bool   `json:"sonido"`
	Teclado  bool   `json:"teclado"`
	ip       string
	visto    time.Time
	llegada  time.Time
}

var (
	mu      sync.Mutex
	estado  = map[string]any{"tipo": "estado", "corriendo": false, "mov": 1, "at": nil, "desde": 0}
	oyentes = map[chan []byte]struct{}{}
	laptops = map[string]*Laptop{}
)

func difundir(v any) {
	b, _ := json.Marshal(v)
	mu.Lock()
	defer mu.Unlock()
	for c := range oyentes {
		select {
		case c <- b:
		default: // una conexión trabada no frena a las demás
		}
	}
}

func nombre(est string) string {
	if est == "" {
		return "sin estación"
	}
	return est
}

func listaLaptops() []*Laptop { // con mu tomado
	ahora := time.Now()
	out := []*Laptop{}
	for k, l := range laptops {
		if ahora.Sub(l.visto) > 12*time.Second {
			bitacora.Printf("se desconectó: %s (%s)", nombre(l.Estacion), l.ip)
			delete(laptops, k)
			continue
		}
		out = append(out, l)
	}
	sort.Slice(out, func(i, j int) bool { return out[i].llegada.Before(out[j].llegada) })
	return out
}

// Cada 3 s avisa a todos quién sigue conectado (la directora lo ve en su pantalla).
func vigilarLaptops() {
	anterior := ""
	for range time.Tick(3 * time.Second) {
		mu.Lock()
		lista := listaLaptops()
		b, _ := json.Marshal(lista)
		mu.Unlock()
		if string(b) != anterior {
			anterior = string(b)
			difundir(map[string]any{"tipo": "laptops", "lista": lista})
		}
	}
}

/* ============================================================
   ¿La petición viene de esta misma laptop? (la de la directora)
   ============================================================ */

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

func ipDe(r *http.Request) string {
	h, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		h = r.RemoteAddr
	}
	return strings.TrimPrefix(h, "::ffff:")
}

func esLocal(r *http.Request) bool { return ipsPropias()[ipDe(r)] }

// Direcciones IPv4 de la red local por las que las demás laptops llegan aquí.
// Deja fuera VPN y redes virtuales (Tailscale, WireGuard, máquinas virtuales, Docker).
var (
	_, cgnat, _       = net.ParseCIDR("100.64.0.0/10")
	prefijosVirtuales = []string{"utun", "tun", "tap", "tailscale", "wg", "zt", "ppp", "ipsec", "gif", "stf",
		"bridge", "vmnet", "vboxnet", "docker", "veth", "virbr", "awdl", "llw", "anpi"}
)

func direcciones() []string {
	var out []string
	ifs, _ := net.Interfaces()
	for _, i := range ifs {
		if i.Flags&net.FlagUp == 0 || i.Flags&net.FlagLoopback != 0 {
			continue
		}
		virtual := false
		for _, p := range prefijosVirtuales {
			if strings.HasPrefix(strings.ToLower(i.Name), p) {
				virtual = true
			}
		}
		if virtual {
			continue
		}
		addrs, _ := i.Addrs()
		for _, a := range addrs {
			n, ok := a.(*net.IPNet)
			if !ok {
				continue
			}
			ip4 := n.IP.To4()
			if ip4 == nil || ip4.IsLinkLocalUnicast() || ip4.IsLoopback() || cgnat.Contains(ip4) {
				continue
			}
			out = append(out, fmt.Sprintf("%s:%d", ip4.String(), puerto))
		}
	}
	sort.Strings(out)
	return out
}

/* ============================================================
   HTTP
   ============================================================ */

// Las laptops que abren docm.html como archivo (file://) tienen otro origen: necesitan permiso.
func cors(w http.ResponseWriter) {
	h := w.Header()
	h.Set("Access-Control-Allow-Origin", "*")
	h.Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	h.Set("Access-Control-Allow-Headers", "Content-Type")
	h.Set("Access-Control-Allow-Private-Network", "true")
	h.Set("Access-Control-Max-Age", "600")
}

func responderJSON(w http.ResponseWriter, v any, codigo int) {
	cors(w)
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(codigo)
	_ = json.NewEncoder(w).Encode(v)
}

func leerJSON(r *http.Request, v any) bool {
	b, err := io.ReadAll(io.LimitReader(r.Body, 64<<10))
	return err == nil && json.Unmarshal(b, v) == nil
}

func manejar(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		cors(w)
		w.WriteHeader(http.StatusNoContent)
		return
	}
	switch r.URL.Path {
	case "/hora":
		responderJSON(w, map[string]any{"servidor": "orquesta", "t": ahoraMs()}, http.StatusOK)
	case "/info":
		fuente := "carpeta"
		if carpeta == "" {
			fuente = "incorporada"
		}
		responderJSON(w, map[string]any{"servidor": "orquesta", "app": app, "version": version, "direcciones": direcciones(),
			"puerto": puerto, "local": esLocal(r), "pagina": fuente}, http.StatusOK)
	case "/eventos":
		manejarEventos(w, r)
	case "/hola":
		if r.Method != http.MethodPost {
			responderJSON(w, map[string]any{"ok": false}, http.StatusMethodNotAllowed)
			return
		}
		manejarHola(w, r)
	case "/orden":
		if r.Method != http.MethodPost {
			responderJSON(w, map[string]any{"ok": false}, http.StatusMethodNotAllowed)
			return
		}
		manejarOrden(w, r)
	default:
		manejarArchivos(w, r)
	}
}

// Flujo de eventos: cada laptop queda escuchando aquí.
func manejarEventos(w http.ResponseWriter, r *http.Request) {
	fl, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "sin flujo", http.StatusInternalServerError)
		return
	}
	cors(w)
	h := w.Header()
	h.Set("Content-Type", "text/event-stream; charset=utf-8")
	h.Set("Cache-Control", "no-store")
	w.WriteHeader(http.StatusOK)
	c := make(chan []byte, 64)
	mu.Lock()
	oyentes[c] = struct{}{}
	ini, _ := json.Marshal(estado)
	lista, _ := json.Marshal(map[string]any{"tipo": "laptops", "lista": listaLaptops()})
	mu.Unlock()
	defer func() {
		mu.Lock()
		delete(oyentes, c)
		mu.Unlock()
	}()
	fmt.Fprintf(w, "retry: 1500\n\ndata: %s\n\ndata: %s\n\n", ini, lista)
	fl.Flush()
	latido := time.NewTicker(15 * time.Second)
	defer latido.Stop()
	for {
		select {
		case <-r.Context().Done():
			return
		case b := <-c:
			if _, err := fmt.Fprintf(w, "data: %s\n\n", b); err != nil {
				return
			}
			fl.Flush()
		case <-latido.C:
			if _, err := io.WriteString(w, ": sigo aqui\n\n"); err != nil {
				return
			}
			fl.Flush()
		}
	}
}

func manejarHola(w http.ResponseWriter, r *http.Request) {
	var d struct {
		ID       string `json:"id"`
		Estacion string `json:"estacion"`
		Mov      int    `json:"mov"`
		Sonido   bool   `json:"sonido"`
		Teclado  bool   `json:"teclado"`
	}
	if !leerJSON(r, &d) || d.ID == "" {
		responderJSON(w, map[string]any{"ok": false}, http.StatusBadRequest)
		return
	}
	corta := func(s string, n int) string {
		if r := []rune(s); len(r) > n {
			return string(r[:n])
		}
		return s
	}
	id, ip := corta(d.ID, 40), ipDe(r)
	mu.Lock()
	l, existe := laptops[id]
	if !existe {
		l = &Laptop{ID: id, llegada: time.Now()}
		laptops[id] = l
	}
	l.Estacion, l.Mov, l.Sonido, l.Teclado, l.ip, l.visto = corta(d.Estacion, 40), d.Mov, d.Sonido, d.Teclado, ip, time.Now()
	mu.Unlock()
	if !existe {
		bitacora.Printf("conectada: %s (%s)", nombre(l.Estacion), ip)
	}
	responderJSON(w, map[string]any{"ok": true, "t": ahoraMs()}, http.StatusOK)
}

func manejarOrden(w http.ResponseWriter, r *http.Request) {
	var d struct {
		Tipo   string   `json:"tipo"`
		Mov    int      `json:"mov"`
		Desde  float64  `json:"desde"`
		Cuenta *float64 `json:"cuenta"`
	}
	if !leerJSON(r, &d) {
		responderJSON(w, map[string]any{"ok": false, "error": "orden ilegible"}, http.StatusBadRequest)
		return
	}
	if !esLocal(r) {
		responderJSON(w, map[string]any{"ok": false, "error": "solo la laptop que corre el servidor da las órdenes"}, http.StatusForbidden)
		return
	}
	var msg map[string]any
	switch d.Tipo {
	case "empezar":
		cuenta := 5.0
		if d.Cuenta != nil && !math.IsNaN(*d.Cuenta) {
			cuenta = math.Min(cuentaMax, math.Max(0, *d.Cuenta))
		}
		mov := 1
		if d.Mov == 2 {
			mov = 2
		}
		desde := math.Max(0, d.Desde)
		if math.IsNaN(desde) || math.IsInf(desde, 0) {
			desde = 0
		}
		at := ahoraMs() + cuenta*1000
		mu.Lock()
		estado = map[string]any{"tipo": "estado", "corriendo": true, "mov": mov, "at": at, "desde": desde}
		mu.Unlock()
		msg = map[string]any{"tipo": "empezar", "mov": mov, "at": at, "desde": desde, "cuenta": cuenta}
		bitacora.Printf("la directora da la partida: movimiento %d, cuenta de %g s", mov, cuenta)
	case "detener":
		at := ahoraMs() + 250 // un instante en el futuro, para que todas se detengan juntas
		mu.Lock()
		estado = map[string]any{"tipo": "estado", "corriendo": false, "mov": estado["mov"], "at": nil, "desde": 0}
		mu.Unlock()
		msg = map[string]any{"tipo": "detener", "at": at}
		bitacora.Printf("la directora detiene los timers")
	case "apagar":
		responderJSON(w, map[string]any{"ok": true}, http.StatusOK)
		difundir(map[string]any{"tipo": "apagado"})
		bitacora.Printf("apagado desde la página de la directora")
		go func() { time.Sleep(400 * time.Millisecond); os.Exit(0) }()
		return
	default:
		responderJSON(w, map[string]any{"ok": false, "error": "orden desconocida"}, http.StatusBadRequest)
		return
	}
	difundir(msg)
	responderJSON(w, map[string]any{"ok": true, "mensaje": msg}, http.StatusOK)
}

/* ---------- La página y los archivos de su carpeta ---------- */

var webPermitidos = map[string]bool{
	".html": true, ".css": true, ".js": true, ".json": true, ".txt": true, ".md": true, ".pdf": true,
	".png": true, ".jpg": true, ".jpeg": true, ".gif": true, ".svg": true, ".webp": true, ".ico": true,
	".mp3": true, ".wav": true, ".ogg": true, ".m4a": true, ".aac": true, ".flac": true, ".aif": true, ".aiff": true,
	".mp4": true, ".webm": true, ".woff": true, ".woff2": true, ".ttf": true, ".otf": true,
}

func init() {
	mime.AddExtensionType(".js", "text/javascript; charset=utf-8")
	mime.AddExtensionType(".md", "text/plain; charset=utf-8")
	mime.AddExtensionType(".json", "application/json; charset=utf-8")
}

func servirPagina(w http.ResponseWriter, r *http.Request) {
	datos, fecha := incorporada, inicio
	if carpeta != "" {
		f := filepath.Join(carpeta, pagina)
		if b, err := os.ReadFile(f); err == nil { // se lee cada vez: si cambia la página, basta recargar
			datos = b
			if st, err := os.Stat(f); err == nil {
				fecha = st.ModTime()
			}
		}
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Cache-Control", "no-cache")
	http.ServeContent(w, r, "index.html", fecha, bytes.NewReader(datos))
}

func manejarArchivos(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		http.Error(w, "método no permitido", http.StatusMethodNotAllowed)
		return
	}
	ruta := path.Clean("/" + r.URL.Path)
	if ruta == "/" || ruta == "/index.html" || ruta == "/docm.html" || ruta == "/dom001.html" || (pagina != "" && ruta == "/"+pagina) {
		servirPagina(w, r)
		return
	}
	if ruta == "/favicon.ico" {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	// Otros archivos de la carpeta de la obra (sonidos, imágenes), por si la página los usa.
	if carpeta == "" {
		http.NotFound(w, r)
		return
	}
	for _, seg := range strings.Split(ruta, "/") {
		if strings.HasPrefix(seg, ".") || strings.HasSuffix(strings.ToLower(seg), ".app") || seg == "servidor" {
			http.NotFound(w, r)
			return
		}
	}
	if !webPermitidos[strings.ToLower(path.Ext(ruta))] { // nada de ejecutables ni archivos sin extensión
		http.NotFound(w, r)
		return
	}
	f, err := os.Open(filepath.Join(carpeta, filepath.FromSlash(strings.TrimPrefix(ruta, "/"))))
	if err != nil {
		http.NotFound(w, r)
		return
	}
	defer f.Close()
	st, err := f.Stat()
	if err != nil || st.IsDir() {
		http.NotFound(w, r)
		return
	}
	w.Header().Set("Cache-Control", "no-cache")
	if ct := mime.TypeByExtension(path.Ext(ruta)); ct != "" {
		w.Header().Set("Content-Type", ct)
	}
	http.ServeContent(w, r, st.Name(), st.ModTime(), f)
}

/* ============================================================
   Buscar la página
   ============================================================ */

// ¿Es la página de Dawn? Lleva <meta name="oluc-obra" content="dawn-of-computer-music"> al comienzo.
func esLaPagina(f string) bool {
	h, err := os.Open(f)
	if err != nil {
		return false
	}
	defer h.Close()
	b := make([]byte, 8192)
	n, _ := io.ReadFull(h, b)
	return bytes.Contains(b[:n], []byte(marca))
}

func paginaEn(d string) string {
	for _, n := range []string{"docm.html", "dom001.html", "index.html", "orquesta.html"} {
		if esLaPagina(filepath.Join(d, n)) {
			return n
		}
	}
	hijas, _ := os.ReadDir(d)
	for _, h := range hijas {
		if !h.IsDir() && strings.HasSuffix(strings.ToLower(h.Name()), ".html") && esLaPagina(filepath.Join(d, h.Name())) {
			return h.Name()
		}
	}
	return ""
}

// Busca hacia arriba desde el ejecutable: así funciona igual dentro de
// "Servidor Dawn.app/Contents/MacOS/" que suelto junto a la página. Si la app
// se sacó de su carpeta, busca la obra en el repositorio de la orquesta.
func buscarPagina() (string, string) {
	if exe, err := os.Executable(); err == nil {
		if r, err := filepath.EvalSymlinks(exe); err == nil {
			exe = r
		}
		d := filepath.Dir(exe)
		for i := 0; i < 8; i++ {
			if p := paginaEn(d); p != "" {
				return d, p
			}
			padre := filepath.Dir(d)
			if padre == d {
				break
			}
			d = padre
		}
	}
	if home, err := os.UserHomeDir(); err == nil {
		for _, rep := range []string{
			filepath.Join(home, "Development", "OrquestaLaptopsUC.github.io"),
			filepath.Join(home, "OrquestaLaptopsUC.github.io"),
		} {
			anios, _ := os.ReadDir(rep)
			for i := len(anios) - 1; i >= 0; i-- { // el año más reciente primero
				obras, _ := os.ReadDir(filepath.Join(rep, anios[i].Name(), "obras"))
				for _, o := range obras {
					d := filepath.Join(rep, anios[i].Name(), "obras", o.Name())
					if o.IsDir() {
						if p := paginaEn(d); p != "" {
							return d, p
						}
					}
				}
			}
		}
	}
	return "", ""
}

/* ============================================================
   Arranque
   ============================================================ */

func abrirNavegador(url string) {
	switch runtime.GOOS {
	case "darwin":
		// La orquesta usa Chrome; si no está, el navegador que tenga la laptop.
		if exec.Command("open", "-a", "Google Chrome", url).Run() != nil {
			_ = exec.Command("open", url).Start()
		}
	case "windows":
		_ = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	default:
		_ = exec.Command("xdg-open", url).Start()
	}
}

// ¿Ya hay un servidor de Dawn en ese puerto? (segundo doble clic)
func esNuestro(p int) bool {
	cl := http.Client{Timeout: 800 * time.Millisecond}
	res, err := cl.Get(fmt.Sprintf("http://127.0.0.1:%d/info", p))
	if err != nil {
		return false
	}
	defer res.Body.Close()
	var info map[string]any
	return json.NewDecoder(res.Body).Decode(&info) == nil && info["app"] == app
}

func main() {
	sinNavegador, pedido := false, 0
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

	carpeta, pagina = buscarPagina()
	donde := "(copia incorporada de la página)"
	if carpeta != "" {
		donde = filepath.Join(carpeta, pagina)
	}

	// Puerto: el pedido, o el primero libre entre 8080 y 8089 (In C o Enjambres pueden estar en el 8080).
	// Si ya hay un servidor de Dawn corriendo, solo se abre su página.
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
			bitacora.Printf("ya hay un servidor de Dawn en el puerto %d; abro su página", p)
			if !sinNavegador {
				abrirNavegador(fmt.Sprintf("http://localhost:%d/?directora", p))
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

	go vigilarLaptops()
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt, syscall.SIGTERM)
	go func() { <-sig; bitacora.Printf("detenido"); os.Exit(0) }()

	fmt.Println()
	fmt.Println("  DAWN OF COMPUTER MUSIC · servidor · Orquesta de Laptops UC")
	fmt.Println()
	if ds := direcciones(); len(ds) > 0 {
		fmt.Println("  Las demás laptops abren en Chrome:")
		for _, d := range ds {
			fmt.Println("     " + d)
		}
	} else {
		fmt.Println("  (no encontré una red: ¿está conectado el Wi-Fi o el cable?)")
	}
	fmt.Printf("\n  Esta laptop (la directora):\n     http://localhost:%d\n\n", puerto)
	bitacora.Printf("sirviendo %s en el puerto %d", donde, puerto)

	if !sinNavegador {
		go func() {
			time.Sleep(300 * time.Millisecond)
			abrirNavegador(fmt.Sprintf("http://localhost:%d/?directora", puerto))
		}()
	}
	srv := &http.Server{Handler: http.HandlerFunc(manejar), ReadHeaderTimeout: 10 * time.Second}
	if err := srv.Serve(ln); err != nil {
		bitacora.Printf("error: %v", err)
		os.Exit(1)
	}
}
