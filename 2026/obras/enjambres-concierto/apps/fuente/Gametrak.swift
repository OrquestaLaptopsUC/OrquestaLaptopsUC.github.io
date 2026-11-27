// Gametrak.swift · app "Enjambres Director"
// Orquesta de Laptops UC (OLUC) · IEE2003
//
// Lee el Gametrak directamente como dispositivo HID (joystick de 6 ejes más el
// pedal), sin pasar por el navegador. Cada eje se entrega entre 0 y 1 según el
// mínimo y el máximo que declara el dispositivo, en este orden:
//   X, Y, Z, Rx, Ry, Rz  →  ejes 0 a 5
// (en el Gametrak: 0, 1 = hacia dónde apunta un cordel; 2 = cuánto está
// estirado; 3, 4, 5 = lo mismo para el otro). La página de la maestra los
// calibra y decide qué hace cada uno (gametrak.js).

import Foundation
import IOKit
import IOKit.hid

final class LectorGametrak {
    private var gestor: IOHIDManager?
    var ejes = [Double](repeating: 0.5, count: 6)
    var botones = [Bool](repeating: false, count: 4)
    var nombre = ""
    var conectados = 0
    var cambio = false

    func iniciar() {
        let g = IOHIDManagerCreate(kCFAllocatorDefault, IOOptionBits(kIOHIDOptionsTypeNone))
        let usos: [Int] = [kHIDUsage_GD_Joystick, kHIDUsage_GD_GamePad, kHIDUsage_GD_MultiAxisController]
        var criterios: [[String: Any]] = []
        for u in usos {
            criterios.append([kIOHIDDeviceUsagePageKey as String: kHIDPage_GenericDesktop, kIOHIDDeviceUsageKey as String: u])
        }
        IOHIDManagerSetDeviceMatchingMultiple(g, criterios as CFArray)
        let yo = Unmanaged.passUnretained(self).toOpaque()

        IOHIDManagerRegisterDeviceMatchingCallback(g, { ctx, _, _, dispositivo in
            guard let ctx = ctx else { return }
            let s = Unmanaged<LectorGametrak>.fromOpaque(ctx).takeUnretainedValue()
            s.conectados += 1
            if let n = IOHIDDeviceGetProperty(dispositivo, kIOHIDProductKey as CFString) as? String { s.nombre = n } else { s.nombre = "control" }
            s.cambio = true
        }, yo)

        IOHIDManagerRegisterDeviceRemovalCallback(g, { ctx, _, _, _ in
            guard let ctx = ctx else { return }
            let s = Unmanaged<LectorGametrak>.fromOpaque(ctx).takeUnretainedValue()
            s.conectados = max(0, s.conectados - 1)
            s.cambio = true
        }, yo)

        IOHIDManagerRegisterInputValueCallback(g, { ctx, _, _, valor in
            guard let ctx = ctx else { return }
            let s = Unmanaged<LectorGametrak>.fromOpaque(ctx).takeUnretainedValue()
            let el = IOHIDValueGetElement(valor)
            let pagina = Int(IOHIDElementGetUsagePage(el))
            let uso = Int(IOHIDElementGetUsage(el))
            let v = IOHIDValueGetIntegerValue(valor)
            if pagina == kHIDPage_GenericDesktop && uso >= kHIDUsage_GD_X && uso <= kHIDUsage_GD_Rz {
                let lo = IOHIDElementGetLogicalMin(el)
                let hi = IOHIDElementGetLogicalMax(el)
                if hi > lo {
                    s.ejes[uso - kHIDUsage_GD_X] = min(1.0, max(0.0, Double(v - lo) / Double(hi - lo)))
                    s.cambio = true
                }
            } else if pagina == kHIDPage_Button && uso >= 1 && uso <= 4 {
                s.botones[uso - 1] = (v != 0)
                s.cambio = true
            }
        }, yo)

        IOHIDManagerScheduleWithRunLoop(g, CFRunLoopGetMain(), CFRunLoopMode.commonModes.rawValue)
        _ = IOHIDManagerOpen(g, IOOptionBits(kIOHIDOptionsTypeNone))
        gestor = g
    }

    /// La llamada de JavaScript que le entrega los ejes a la página.
    func comoJS() -> String {
        let e = ejes.map { String(format: "%.4f", $0) }.joined(separator: ",")
        let b = botones.map { $0 ? "true" : "false" }.joined(separator: ",")
        let limpio = String(nombre.unicodeScalars.filter { CharacterSet.alphanumerics.contains($0) || $0 == " " })
        return "window.EnjambresHID&&EnjambresHID([\(e)],[\(b)],\"\(limpio)\")"
    }
}
