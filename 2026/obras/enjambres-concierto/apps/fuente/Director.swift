// Director.swift · app "Enjambres Director"
// Orquesta de Laptops UC (OLUC) · IEE2003
//
// Una sola app para la laptop del director:
//  1. levanta el Servidor Enjambres (el mismo de la versión 1, que sirve el
//     repositorio y hace de central WebSocket) en el puerto 8080;
//  2. abre la maestra de la versión de concierto en su ventana;
//  3. lee el Gametrak y le pasa los ejes a la maestra, 60 veces por segundo;
//  4. guarda la partitura (partitura.js) cuando la maestra lo pide;
//  5. Ventana → Proyección (⌘P): el enjambre solo, sin texto, en otra ventana;
//     si hay una segunda pantalla, ahí y a pantalla completa.

import AppKit
import WebKit

let PUERTO = 8080

@main
struct Principal {
    @MainActor static func main() {
        let app = NSApplication.shared
        let d = DelegadoDirector()
        app.delegate = d
        app.setActivationPolicy(.regular)
        app.run()
    }
}

final class DelegadoDirector: DelegadoWeb, NSApplicationDelegate, NSWindowDelegate, WKNavigationDelegate, WKScriptMessageHandler, WKDownloadDelegate {
    var ventana: NSWindow!
    var web: WKWebView!
    var cartel: NSTextField!
    var proceso: Process?
    var carpetaAnio: URL?
    var proyeccion: NSWindow?
    var webProy: WKWebView?
    var actividad: NSObjectProtocol?
    var relojHID: Timer?
    var ultimoEnvio = Date.distantPast
    var cargada = false
    let gametrak = LectorGametrak()

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.mainMenu = armarMenu(nombre: "Enjambres Director", propios: [], ventana: [
            itemMenu("Proyección", #selector(alternarProyeccion(_:)), "p", self),
            itemMenu("Recargar la maestra", #selector(recargar(_:)), "r", self),
        ])
        ventana = nuevaVentana(titulo: "Enjambres · director", ancho: 1500, alto: 950)
        ventana.delegate = self
        if let p = NSScreen.main { ventana.setFrame(p.visibleFrame, display: false) }
        let cont = ventana.contentView!
        web = nuevaWeb(manejador: self)
        web.frame = cont.bounds
        web.navigationDelegate = self
        web.uiDelegate = self
        web.isHidden = true
        cont.addSubview(web)
        cartel = nuevoCartel(en: cont)
        cartel.stringValue = "ENJAMBRES · DIRECTOR\n\nAbriendo el servidor…"
        ventana.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
        actividad = mantenerDespierto()

        gametrak.iniciar()
        let t = Timer(timeInterval: 1.0 / 60.0, repeats: true) { [weak self] _ in MainActor.assumeIsolated { if let yo = self { yo.pasarGametrak() } } }
        RunLoop.main.add(t, forMode: .common)
        relojHID = t

        arrancar()
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { return false }
    func applicationShouldTerminate(_ sender: NSApplication) -> NSApplication.TerminateReply {
        if !cargada { return .terminateNow }
        return preguntar("¿Salir de Enjambres Director?", "Se apaga el servidor y todas las laptops quedan en silencio.",
                         si: "Salir", no: "Seguir") ? .terminateNow : .terminateCancel
    }
    func applicationWillTerminate(_ notification: Notification) {
        if let p = proceso, p.isRunning { p.terminate() }
    }
    func windowShouldClose(_ sender: NSWindow) -> Bool {
        if sender === ventana { NSApp.terminate(nil); return false }      // cerrar la maestra = salir (pregunta antes)
        return true
    }
    func windowWillClose(_ notification: Notification) {
        if let v = notification.object as? NSWindow, v === proyeccion { proyeccion = nil; webProy = nil }
    }

    func avisar(_ texto: String) {
        cartel.stringValue = "ENJAMBRES · DIRECTOR\n\n" + texto
        cartel.isHidden = false
        web.isHidden = true
    }

    // MARK: el repositorio y el servidor

    func tieneObra(_ d: URL) -> Bool {
        return FileManager.default.fileExists(atPath: d.appendingPathComponent("obras/enjambres-concierto/maestra.html").path)
    }
    /// La carpeta del año (2026/) que contiene obras/enjambres-concierto/: hacia arriba desde la app
    /// y, si la app está fuera del repositorio, en la carpeta personal.
    func buscarAnio() -> URL? {
        var d = Bundle.main.bundleURL.resolvingSymlinksInPath().deletingLastPathComponent()
        for _ in 0..<10 {
            if tieneObra(d) { return d }
            let p = d.deletingLastPathComponent()
            if p.path == d.path { break }
            d = p
        }
        let casa = FileManager.default.homeDirectoryForCurrentUser
        let repositorios = [casa.appendingPathComponent("Development/OrquestaLaptopsUC.github.io"),
                            casa.appendingPathComponent("OrquestaLaptopsUC.github.io")]
        for rep in repositorios {
            let hijas = (try? FileManager.default.contentsOfDirectory(at: rep, includingPropertiesForKeys: nil)) ?? []
            let ordenadas = hijas.sorted { $0.lastPathComponent > $1.lastPathComponent }      // el año más reciente primero
            for h in ordenadas where tieneObra(h) { return h }
        }
        return nil
    }

    func arrancar() {
        guard let anio = buscarAnio() else {
            avisar("No encuentro la obra (obras/enjambres-concierto) ni junto a esta app ni en ~/Development/OrquestaLaptopsUC.github.io.")
            return
        }
        carpetaAnio = anio
        consultarServidor("127.0.0.1:\(PUERTO)", espera: 0.8) { [weak self] ya in
            guard let yo = self else { return }
            if ya { yo.abrirMaestra() } else { yo.lanzarServidor(anio) }
        }
    }

    func lanzarServidor(_ anio: URL) {
        let bin = anio.appendingPathComponent("obras/enjambres/Servidor Enjambres.app/Contents/MacOS/servidor-enjambres")
        guard FileManager.default.isExecutableFile(atPath: bin.path) else {
            avisar("Falta el servidor: \(bin.path)")
            return
        }
        let p = Process()
        p.executableURL = bin
        p.arguments = ["-sin-navegador", String(PUERTO)]
        p.standardOutput = FileHandle.nullDevice
        p.standardError = FileHandle.nullDevice
        do { try p.run() } catch {
            avisar("No pude abrir el servidor: \(error.localizedDescription)")
            return
        }
        proceso = p
        esperarServidor(25)
    }

    func esperarServidor(_ quedan: Int) {
        consultarServidor("127.0.0.1:\(PUERTO)", espera: 0.5) { [weak self] ok in
            guard let yo = self else { return }
            if ok { yo.abrirMaestra(); return }
            let vivo = yo.proceso?.isRunning ?? false
            if quedan <= 0 || !vivo {
                yo.avisar("El servidor no partió. Lo más probable: el puerto \(PUERTO) está ocupado por otra app (¿Servidor In C abierto?). Ciérrala y vuelve a abrir Enjambres Director.")
                return
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) { MainActor.assumeIsolated { yo.esperarServidor(quedan - 1) } }
        }
    }

    func abrirMaestra() {
        guard let url = URL(string: "http://localhost:\(PUERTO)\(RUTA_OBRA)maestra.html") else { return }
        web.load(URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 10))
    }
    @objc func recargar(_ s: Any?) {
        if cargada { web.reload() } else { arrancar() }
    }

    // MARK: la página de la maestra

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        guard webView === web else { return }
        cargada = true
        web.isHidden = false
        cartel.isHidden = true
        ventana.makeFirstResponder(web)
    }
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        guard webView === web else { return }
        avisar("No se pudo abrir la maestra: \(error.localizedDescription)\n\n⌘R para reintentar.")
    }
    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        webView.reload()
    }
    /// "exportar" de la partitura: la página pide descargar un archivo; va a Descargas.
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        decisionHandler(navigationAction.shouldPerformDownload ? .download : .allow)
    }
    func webView(_ webView: WKWebView, navigationAction: WKNavigationAction, didBecome download: WKDownload) {
        download.delegate = self
    }
    func download(_ download: WKDownload, decideDestinationUsing response: URLResponse, suggestedFilename: String,
                  completionHandler: @escaping (URL?) -> Void) {
        let carpeta = FileManager.default.urls(for: .downloadsDirectory, in: .userDomainMask).first ?? FileManager.default.temporaryDirectory
        var destino = carpeta.appendingPathComponent(suggestedFilename)
        var n = 1
        while FileManager.default.fileExists(atPath: destino.path) {
            n += 1
            destino = carpeta.appendingPathComponent("\(n)-\(suggestedFilename)")
        }
        completionHandler(destino)
    }

    // MARK: lo que pide la maestra: guardar la partitura, abrir la proyección

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let o = message.body as? [String: Any], let cmd = o["cmd"] as? String else { return }
        if cmd == "proyeccion" {
            alternarProyeccion(nil)
        } else if cmd == "guardarPartitura", let texto = o["texto"] as? String {
            guardarPartitura(texto)
        }
    }

    func guardarPartitura(_ json: String) {
        guard let anio = carpetaAnio, (try? JSONSerialization.jsonObject(with: Data(json.utf8))) != nil else {
            responder(false, "partitura inválida")
            return
        }
        let carpeta = anio.appendingPathComponent("obras/enjambres-concierto")
        let ruta = carpeta.appendingPathComponent("partitura.js")
        let anterior = carpeta.appendingPathComponent("partitura.anterior.js")
        let texto = "/* Partitura de Enjambres, versión de concierto: mensajes y ETAPAS (ver simulador.js).\n" +
            "   La escribe la app Enjambres Director al apretar \"guardar\" en la maestra; se puede editar a mano con cuidado. */\n" +
            "window.ENJAMBRES_PARTITURA = " + json + ";\n"
        do {
            if FileManager.default.fileExists(atPath: ruta.path) {        // la que había queda como partitura.anterior.js
                try? FileManager.default.removeItem(at: anterior)
                try? FileManager.default.copyItem(at: ruta, to: anterior)
            }
            try texto.write(to: ruta, atomically: true, encoding: .utf8)
            responder(true, "obras/enjambres-concierto/partitura.js")
        } catch {
            responder(false, error.localizedDescription)
        }
    }
    func responder(_ ok: Bool, _ detalle: String) {
        var comillas = "\"\""
        if let d = try? JSONSerialization.data(withJSONObject: [detalle]), let s = String(data: d, encoding: .utf8) { comillas = s + "[0]" }
        web.evaluateJavaScript("window.EnjambresNativo&&EnjambresNativo.guardada(\(ok ? "true" : "false"),\(comillas))", completionHandler: nil)
    }

    // MARK: proyección

    @objc func alternarProyeccion(_ s: Any?) {
        if let v = proyeccion {
            v.close()
            return
        }
        guard cargada, let url = URL(string: "http://localhost:\(PUERTO)\(RUTA_OBRA)proyeccion.html?limpia=1") else { return }
        let propia = ventana.screen
        let otra = NSScreen.screens.first { $0 != propia }
        let v = nuevaVentana(titulo: "Enjambres · proyección", ancho: 1280, alto: 720)
        v.delegate = self
        let w = nuevaWeb(manejador: nil)
        w.frame = v.contentView!.bounds
        v.contentView!.addSubview(w)
        w.load(URLRequest(url: url))
        if let o = otra { v.setFrame(o.frame, display: true) }
        v.makeKeyAndOrderFront(nil)
        proyeccion = v
        webProy = w
        if otra != nil {
            v.toggleFullScreen(nil)
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { [weak self] in MainActor.assumeIsolated { if let yo = self { yo.ventana.makeKeyAndOrderFront(nil) } } }
        }
    }

    // MARK: Gametrak → maestra

    func pasarGametrak() {
        if !cargada || gametrak.conectados <= 0 { return }
        let ahora = Date()
        // con cada cambio y, aunque nada se mueva, cuatro veces por segundo: así la página sabe que sigue conectado
        if !gametrak.cambio && ahora.timeIntervalSince(ultimoEnvio) < 0.25 { return }
        gametrak.cambio = false
        ultimoEnvio = ahora
        web.evaluateJavaScript(gametrak.comoJS(), completionHandler: nil)
    }
}
