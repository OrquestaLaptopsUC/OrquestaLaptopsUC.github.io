// Laptop.swift · app "Enjambres" (cada laptop de la orquesta)
// Orquesta de Laptops UC (OLUC) · IEE2003
//
// Doble clic y nada más: busca al director en una dirección fija
// (192.168.0.100:8080, la laptop del director en la red OLUC), toma su número
// del nombre del computador (OLUC07 → 7), entra sola al concierto y queda a
// pantalla completa. Si el director todavía no abre su app, espera y reintenta.
// La dirección y el número se pueden cambiar en el menú; quedan guardados.

import AppKit
import WebKit

let SERVIDOR_FIJO = "192.168.0.100:8080"

@main
struct Principal {
    @MainActor static func main() {
        let app = NSApplication.shared
        let d = DelegadoLaptop()
        app.delegate = d
        app.setActivationPolicy(.regular)
        app.run()
    }
}

final class DelegadoLaptop: DelegadoWeb, NSApplicationDelegate, NSWindowDelegate, WKNavigationDelegate {
    var ventana: NSWindow!
    var web: WKWebView!
    var cartel: NSTextField!
    var reloj: Timer?
    var actividad: NSObjectProtocol?
    var enObra = false
    var consultando = false
    var intentos = 0
    var aviso = ""
    let prefs = UserDefaults.standard

    var servidor: String {
        let s = prefs.string(forKey: "servidor") ?? ""
        return s.isEmpty ? SERVIDOR_FIJO : s
    }
    var numero: Int {
        let n = prefs.integer(forKey: "numero")
        return n > 0 ? n : numeroDelEquipo()
    }
    /// OLUC07 → 7. Cualquier otro nombre: 0 (se pregunta).
    func numeroDelEquipo() -> Int {
        let nombre = (Host.current().localizedName ?? "").uppercased()
        guard nombre.hasPrefix("OLUC") else { return 0 }
        let digitos = String(nombre.reversed().prefix(while: { $0.isNumber }).reversed())
        let n = Int(digitos) ?? 0
        return (n >= 1 && n <= 99) ? n : 0
    }

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.mainMenu = armarMenu(nombre: "Enjambres", propios: [
            itemMenu("Número de esta laptop…", #selector(cambiarNumero(_:)), "n", self),
            itemMenu("Dirección del director…", #selector(cambiarServidor(_:)), "d", self),
        ], ventana: [
            itemMenu("Volver a conectar", #selector(reconectar(_:)), "r", self),
        ])
        ventana = nuevaVentana(titulo: "Enjambres", ancho: 1280, alto: 800)
        ventana.delegate = self
        let cont = ventana.contentView!
        web = nuevaWeb(manejador: nil)
        web.frame = cont.bounds
        web.navigationDelegate = self
        web.uiDelegate = self
        web.isHidden = true
        cont.addSubview(web)
        cartel = nuevoCartel(en: cont)
        ventana.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
        if !prefs.bool(forKey: "enVentana") { ventana.toggleFullScreen(nil) }
        actividad = mantenerDespierto()
        if numero == 0 { preguntarNumero() }
        buscar()
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { return true }
    func applicationShouldTerminate(_ sender: NSApplication) -> NSApplication.TerminateReply {
        if !enObra { return .terminateNow }
        return preguntar("¿Salir de Enjambres?", "Esta laptop dejará de sonar.", si: "Salir", no: "Seguir tocando") ? .terminateNow : .terminateCancel
    }

    // MARK: buscar al director

    func buscar() {
        enObra = false
        intentos = 0
        web.isHidden = true
        cartel.isHidden = false
        pintarCartel()
        reloj?.invalidate()
        reloj = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in MainActor.assumeIsolated { if let yo = self { yo.intentar() } } }
        intentar()
    }

    func pintarCartel() {
        let n = numero
        let puntos = String(repeating: ".", count: intentos % 4)
        var t = "ENJAMBRES · LAPTOP \(n > 0 ? String(n) : "?")\n\nBuscando al director en \(servidor)\(puntos)"
        if intentos > 4 {
            t += "\n\nEl director tiene que abrir «Enjambres Director», y esta laptop estar en la red OLUC.\nSi macOS pregunta por la red local, responde Permitir."
        }
        if n == 0 { t += "\n\nFalta el número de esta laptop: menú Enjambres → Número de esta laptop (⌘N)." }
        if !aviso.isEmpty { t += "\n\n\(aviso)" }
        cartel.stringValue = t
    }

    func intentar() {
        if enObra || consultando || numero == 0 { return }
        consultando = true
        consultarServidor(servidor) { [weak self] ok in
            guard let yo = self else { return }
            yo.consultando = false
            if yo.enObra { return }
            yo.intentos += 1
            if ok { yo.entrar() } else { yo.pintarCartel() }
        }
    }

    func entrar() {
        guard let url = URL(string: "http://\(servidor)\(RUTA_OBRA)?num=\(numero)&auto=1") else {
            aviso = "La dirección «\(servidor)» no es válida: cámbiala en el menú Enjambres."
            pintarCartel()
            return
        }
        enObra = true
        aviso = ""
        reloj?.invalidate()
        web.load(URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 10))
    }

    // MARK: la página

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        web.isHidden = false
        cartel.isHidden = true
        ventana.makeFirstResponder(web)
    }
    func webView(_ webView: WKWebView, decidePolicyFor navigationResponse: WKNavigationResponse,
                 decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void) {
        if navigationResponse.isForMainFrame, let r = navigationResponse.response as? HTTPURLResponse, r.statusCode >= 400 {
            aviso = "El servidor del director respondió \(r.statusCode): no tiene la versión de concierto de Enjambres."
            decisionHandler(.cancel)
            return
        }
        decisionHandler(.allow)
    }
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) { caida() }
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) { caida() }
    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) { caida() }
    func caida() {
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) { [weak self] in MainActor.assumeIsolated { if let yo = self { yo.buscar() } } }
    }

    // MARK: menú

    func preguntarNumero() {
        let actual = numero
        guard let t = pedirTexto(titulo: "Número de esta laptop",
                                 detalle: "El que te asignaron en el ensamble (1 a 99). En las laptops de la orquesta sale del nombre del computador: OLUC07 es la 7.",
                                 valor: actual > 0 ? String(actual) : "") else { return }
        if let n = Int(t), n >= 1, n <= 99 { prefs.set(n, forKey: "numero") }
    }
    @objc func cambiarNumero(_ s: Any?) { preguntarNumero(); buscar() }
    @objc func cambiarServidor(_ s: Any?) {
        guard let t = pedirTexto(titulo: "Dirección del director",
                                 detalle: "IP y puerto de la laptop del director. Vacío: \(SERVIDOR_FIJO).",
                                 valor: servidor) else { return }
        var limpio = t.replacingOccurrences(of: "http://", with: "")
        if let i = limpio.firstIndex(of: "/") { limpio = String(limpio[..<i]) }
        if !limpio.isEmpty && !limpio.contains(":") { limpio += ":8080" }
        prefs.set(limpio, forKey: "servidor")
        buscar()
    }
    @objc func reconectar(_ s: Any?) { buscar() }
}
