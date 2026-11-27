// Comun.swift · Enjambres, versión de concierto
// Orquesta de Laptops UC (OLUC) · IEE2003
//
// Lo que comparten las dos apps ("Enjambres", para cada laptop, y "Enjambres
// Director"): las dos son una ventana con las mismas páginas web de la obra
// (WebKit), sin navegador, sin direcciones que escribir y sin que el computador
// se duerma. El sonido, los pads y el dibujo son los de las páginas.

import AppKit
import WebKit

let RUTA_OBRA = "/obras/enjambres-concierto/"
let APP_SERVIDOR = "oluc-enjambres"

/// ¿Responde un Servidor Enjambres en esa dirección (ip:puerto)?
func consultarServidor(_ servidor: String, espera: TimeInterval = 1.5, _ fin: @escaping (Bool) -> Void) {
    guard let url = URL(string: "http://\(servidor)/enjambres/info") else { fin(false); return }
    let pedido = URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: espera)
    URLSession.shared.dataTask(with: pedido) { datos, _, _ in
        let o = datos.flatMap { (try? JSONSerialization.jsonObject(with: $0)) as? [String: Any] }
        let ok = (o?["app"] as? String) == APP_SERVIDOR
        DispatchQueue.main.async { fin(ok) }
    }.resume()
}

/// Un cuadro de diálogo con un campo de texto. nil si se cancela.
func pedirTexto(titulo: String, detalle: String, valor: String) -> String? {
    let a = NSAlert()
    a.messageText = titulo
    a.informativeText = detalle
    let campo = NSTextField(frame: NSRect(x: 0, y: 0, width: 280, height: 24))
    campo.stringValue = valor
    a.accessoryView = campo
    a.addButton(withTitle: "Aceptar")
    a.addButton(withTitle: "Cancelar")
    a.window.initialFirstResponder = campo
    let r = a.runModal()
    return r == .alertFirstButtonReturn ? campo.stringValue.trimmingCharacters(in: .whitespacesAndNewlines) : nil
}

func preguntar(_ titulo: String, _ detalle: String, si: String, no: String) -> Bool {
    let a = NSAlert()
    a.messageText = titulo
    a.informativeText = detalle
    a.addButton(withTitle: si)
    a.addButton(withTitle: no)
    return a.runModal() == .alertFirstButtonReturn
}

/// Una vista web lista para la obra: el sonido parte sin pedir un clic y no hay gestos que saquen de la página.
func nuevaWeb(manejador: WKScriptMessageHandler?) -> WKWebView {
    let c = WKWebViewConfiguration()
    c.mediaTypesRequiringUserActionForPlayback = []
    if let m = manejador { c.userContentController.add(m, name: "enjambres") }
    let w = WKWebView(frame: NSRect(x: 0, y: 0, width: 800, height: 600), configuration: c)
    w.allowsBackForwardNavigationGestures = false
    w.allowsMagnification = false
    w.underPageBackgroundColor = .black
    w.isInspectable = true
    w.autoresizingMask = [.width, .height]
    return w
}

func nuevaVentana(titulo: String, ancho: CGFloat, alto: CGFloat) -> NSWindow {
    let v = NSWindow(contentRect: NSRect(x: 0, y: 0, width: ancho, height: alto),
                     styleMask: [.titled, .closable, .miniaturizable, .resizable],
                     backing: .buffered, defer: false)
    v.title = titulo
    v.backgroundColor = .black
    v.isReleasedWhenClosed = false
    v.collectionBehavior = [.fullScreenPrimary]
    v.center()
    return v
}

/// Un texto grande y centrado sobre la ventana, para cuando todavía no hay página.
func nuevoCartel(en vista: NSView) -> NSTextField {
    let t = NSTextField(wrappingLabelWithString: "")
    t.alignment = .center
    t.textColor = NSColor(white: 0.9, alpha: 1)
    t.font = NSFont.systemFont(ofSize: 24, weight: .medium)
    t.translatesAutoresizingMaskIntoConstraints = false
    vista.addSubview(t)
    NSLayoutConstraint.activate([
        t.centerXAnchor.constraint(equalTo: vista.centerXAnchor),
        t.centerYAnchor.constraint(equalTo: vista.centerYAnchor),
        t.widthAnchor.constraint(lessThanOrEqualTo: vista.widthAnchor, constant: -120),
    ])
    return t
}

/// Menú de una app sin .xib: la app, Edición (copiar y pegar en los campos) y Ventana.
func armarMenu(nombre: String, propios: [NSMenuItem], ventana: [NSMenuItem]) -> NSMenu {
    let barra = NSMenu()

    let mApp = NSMenu()
    for it in propios { mApp.addItem(it) }
    if !propios.isEmpty { mApp.addItem(NSMenuItem.separator()) }
    mApp.addItem(withTitle: "Ocultar \(nombre)", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
    mApp.addItem(NSMenuItem.separator())
    mApp.addItem(withTitle: "Salir de \(nombre)", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
    let iApp = NSMenuItem(); iApp.submenu = mApp; barra.addItem(iApp)

    let mEd = NSMenu(title: "Edición")
    mEd.addItem(withTitle: "Cortar", action: #selector(NSText.cut(_:)), keyEquivalent: "x")
    mEd.addItem(withTitle: "Copiar", action: #selector(NSText.copy(_:)), keyEquivalent: "c")
    mEd.addItem(withTitle: "Pegar", action: #selector(NSText.paste(_:)), keyEquivalent: "v")
    mEd.addItem(withTitle: "Seleccionar todo", action: #selector(NSText.selectAll(_:)), keyEquivalent: "a")
    let iEd = NSMenuItem(); iEd.submenu = mEd; barra.addItem(iEd)

    let mVen = NSMenu(title: "Ventana")
    for it in ventana { mVen.addItem(it) }
    let completa = NSMenuItem(title: "Pantalla completa", action: #selector(NSWindow.toggleFullScreen(_:)), keyEquivalent: "f")
    completa.keyEquivalentModifierMask = [.control, .command]
    mVen.addItem(completa)
    mVen.addItem(withTitle: "Minimizar", action: #selector(NSWindow.performMiniaturize(_:)), keyEquivalent: "m")
    let iVen = NSMenuItem(); iVen.submenu = mVen; barra.addItem(iVen)
    return barra
}

func itemMenu(_ titulo: String, _ accion: Selector, _ tecla: String, _ destino: AnyObject) -> NSMenuItem {
    let it = NSMenuItem(title: titulo, action: accion, keyEquivalent: tecla)
    it.target = destino
    return it
}

/// Lo que las páginas le piden al sistema: avisos, preguntas, texto, elegir un archivo, abrir otra ventana.
class DelegadoWeb: NSObject, WKUIDelegate {
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String,
                 initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let a = NSAlert(); a.messageText = message; a.runModal()
        completionHandler()
    }
    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String,
                 initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        completionHandler(preguntar(message, "", si: "Aceptar", no: "Cancelar"))
    }
    func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String, defaultText: String?,
                 initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {
        completionHandler(pedirTexto(titulo: prompt, detalle: "", valor: defaultText ?? ""))
    }
    func webView(_ webView: WKWebView, runOpenPanelWith parameters: WKOpenPanelParameters,
                 initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping ([URL]?) -> Void) {
        let p = NSOpenPanel()
        p.allowsMultipleSelection = parameters.allowsMultipleSelection
        p.canChooseDirectories = false
        completionHandler(p.runModal() == .OK ? p.urls : nil)
    }
    /// Un enlace que pide otra ventana (la partitura para imprimir) se abre en el navegador del sistema.
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration,
                 for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if let u = navigationAction.request.url { NSWorkspace.shared.open(u) }
        return nil
    }
}

/// Mientras la app está abierta, ni la pantalla ni el computador se duermen.
func mantenerDespierto() -> NSObjectProtocol {
    return ProcessInfo.processInfo.beginActivity(
        options: [.userInitiated, .idleDisplaySleepDisabled, .latencyCritical],
        reason: "Enjambres en concierto")
}
