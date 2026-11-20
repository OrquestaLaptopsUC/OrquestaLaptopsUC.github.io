#!/usr/bin/env python3
"""Reloj compartido por WiFi para "Yo tenía 10 laptops" (Lucas Nervi, OLUC).

Capa puramente informativa, igual que la de "In C" (2026/obras/in-c/ en el
repositorio del ramo): este servidor solo difunde CUÁNDO empezó la obra.
El sonido sigue corriendo en cada navegador; si el servidor se cierra o la
red se cae, la música no se detiene, solo se pierde la hora común.

Uso (en la laptop que hace de laptop 1, la "servidora"):
    python3 servidor.py

Las demás laptops, en la misma red WiFi, abren en Chrome o Safari la
dirección que este programa imprime (por ejemplo http://192.168.0.10:8080/)
y ahí mismo abren yo_tenia_10_laptops.html o handpan.html servidos por esta
misma laptop. No necesitan tener nada instalado ni descargado.

Sin servidor, cada archivo sigue funcionando exactamente igual que antes
(abriéndolo con doble clic), solo que sin reloj común entre laptops.
"""
import http.server
import json
import socket
import socketserver
import threading
import time
import os

PUERTO_DESDE = 8080
PUERTO_HASTA = 8089
CARPETA = os.path.dirname(os.path.abspath(__file__))

reloj_lock = threading.Lock()
reloj = {"estado": "espera", "inicio": 0.0}  # estado: espera | corriendo


def ahora():
    return time.time()


def ms_reloj():
    with reloj_lock:
        if reloj["estado"] == "corriendo":
            return int((ahora() - reloj["inicio"]) * 1000)
        return 0


def ips_propias():
    """Direcciones por las que esta laptop se reconoce a sí misma (para que
    solo ella pueda iniciar o detener el reloj, nunca una laptop invitada)."""
    ips = {"127.0.0.1", "::1"}
    try:
        for info in socket.getaddrinfo(socket.gethostname(), None):
            ips.add(info[4][0])
    except Exception:
        pass
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ips.add(s.getsockname()[0])
        s.close()
    except Exception:
        pass
    return ips


IPS_PROPIAS = ips_propias()


class Manejador(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=CARPETA, **kwargs)

    def log_message(self, fmt, *args):
        pass  # silencioso: no ensucia la terminal durante el concierto

    def _json(self, obj, codigo=200):
        cuerpo = json.dumps(obj).encode("utf-8")
        self.send_response(codigo)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(cuerpo)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        self.wfile.write(cuerpo)

    def do_GET(self):
        if self.path.split("?")[0] == "/reloj":
            with reloj_lock:
                estado = reloj["estado"]
            self._json({"estado": estado, "ms": ms_reloj()})
            return
        super().do_GET()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        if self.path.split("?")[0] != "/reloj":
            self.send_response(404)
            self.end_headers()
            return
        ip = self.client_address[0]
        if ip not in IPS_PROPIAS:
            self._json({"error": "solo la laptop servidora controla el reloj"}, 403)
            return
        largo = int(self.headers.get("Content-Length", 0) or 0)
        cuerpo = self.rfile.read(largo) if largo else b"{}"
        try:
            datos = json.loads(cuerpo or b"{}")
        except Exception:
            datos = {}
        accion = datos.get("accion")
        with reloj_lock:
            if accion == "iniciar" and reloj["estado"] != "corriendo":
                reloj["estado"] = "corriendo"
                reloj["inicio"] = ahora()
            elif accion == "detener":
                reloj["estado"] = "espera"
            estado = reloj["estado"]
        self._json({"estado": estado, "ms": ms_reloj()})


class Servidor(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


def direcciones_red():
    """Direcciones IPv4 de red local por las que las demás laptops llegan aquí."""
    ips = []
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ips.append(s.getsockname()[0])
        s.close()
    except Exception:
        pass
    return ips


def main():
    srv = None
    puerto = None
    for p in range(PUERTO_DESDE, PUERTO_HASTA + 1):
        try:
            srv = Servidor(("0.0.0.0", p), Manejador)
            puerto = p
            break
        except OSError:
            continue
    if srv is None:
        print(f"No encontré un puerto libre entre {PUERTO_DESDE} y {PUERTO_HASTA}.")
        return

    print()
    print("  Reloj compartido por WiFi · Yo tenía 10 laptops (Lucas Nervi, OLUC)")
    print()
    ips = direcciones_red()
    if ips:
        print("  Las demás laptops abren en el navegador (todas en el mismo WiFi):")
        for ip in ips:
            print(f"     http://{ip}:{puerto}/")
    else:
        print("  No encontré una red local: ¿está conectado el WiFi?")
    print()
    print(f"  Esta laptop (laptop 1, la servidora): http://localhost:{puerto}/")
    print()
    print("  Ctrl+C para apagar el servidor. La música no depende de él: si se")
    print("  cierra a mitad de la obra, el sonido sigue en cada laptop.")
    print()
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\n  Servidor detenido.")


if __name__ == "__main__":
    main()
