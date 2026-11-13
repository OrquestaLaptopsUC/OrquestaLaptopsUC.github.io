#!/usr/bin/env python3
"""
Servidor de la Orquesta de Laptops
==================================

Sirve la página de la orquesta en la red local y deja que el director haga partir
a todas las laptops a la vez, con una cuenta atrás de 5 segundos.

Cómo se usa:
  1. La directora pone este archivo en la misma carpeta que la página (dom001.html)
     y, en una terminal dentro de esa carpeta, escribe:   python3 servidor.py
     (en Windows puede ser:  py servidor.py). Aparece una dirección como 192.168.1.15:8000
  2. Cada laptop abre su propio dom001.html, aprieta «Conectar a la red» y escribe esa
     dirección (queda guardada para la próxima vez). La directora escribe  localhost:8000
     O bien: abren directamente en el navegador  http://192.168.1.15:8000
  3. La directora elige la estación «Director» y aprieta «Empezar a todos».
     Ctrl+C en la terminal cierra el servidor.

No necesita internet ni instalar nada: solo Python 3. Todas las laptops tienen que
estar en la misma red (un router propio o el punto de acceso de un teléfono funcionan
bien; algunas redes de universidades no dejan que los equipos se vean entre sí).
Otro puerto:  python3 servidor.py 8080
"""

import json
import os
import queue
import socket
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

PUERTO = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 8000
CARPETA = os.path.dirname(os.path.abspath(__file__))
CUENTA_MAX = 10  # segundos

_T0 = time.monotonic()


def ahora_ms():
    """Reloj del servidor en milisegundos (monótono: no salta si alguien cambia la hora del equipo)."""
    return (time.monotonic() - _T0) * 1000.0


def buscar_pagina():
    for nombre in ('dom001.html', 'orquesta.html'):
        if os.path.isfile(os.path.join(CARPETA, nombre)):
            return nombre
    htmls = sorted(f for f in os.listdir(CARPETA) if f.lower().endswith('.html'))
    return htmls[0] if htmls else None


PAGINA = buscar_pagina()

# Estado compartido: lo último que ordenó el director, para quien se conecta tarde.
lock = threading.Lock()
estado = {'tipo': 'estado', 'corriendo': False, 'mov': 1, 'at': None, 'desde': 0}
oyentes = set()      # colas de las conexiones abiertas a /eventos
laptops = {}         # id -> {'estacion', 'mov', 'sonido', 'teclado', 'ip', 'visto'}


def difundir(msg):
    datos = json.dumps(msg, ensure_ascii=False)
    with lock:
        for q in list(oyentes):
            q.put(datos)


def lista_laptops():
    ahora = time.monotonic()
    with lock:
        for k in [k for k, v in laptops.items() if ahora - v['visto'] > 12]:
            print(f"  Se desconectó: {laptops[k]['estacion'] or 'sin estación'} ({laptops[k]['ip']})")
            del laptops[k]
        return [{'id': k, 'estacion': v['estacion'], 'mov': v['mov'], 'sonido': v['sonido'], 'teclado': v['teclado']}
                for k, v in sorted(laptops.items(), key=lambda kv: kv[1]['llegada'])]


def vigilar_laptops():
    """Cada 3 s, avisa a todos quién sigue conectado (el director lo ve en su pantalla)."""
    anterior = None
    while True:
        time.sleep(3)
        lista = lista_laptops()
        if lista != anterior:
            difundir({'tipo': 'laptops', 'lista': lista})
            anterior = lista


class Manejador(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'
    server_version = 'OrquestaDeLaptops/1'

    def log_message(self, *args):  # sin una línea por cada petición
        pass

    def cors(self):
        # Las laptops abren dom001.html como archivo (file://): su página tiene otro origen y necesita permiso.
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
        self.send_header('Access-Control-Max-Age', '600')

    def do_OPTIONS(self):
        self.send_response(204)
        self.cors()
        self.send_header('Content-Length', '0')
        self.end_headers()

    def responder(self, codigo, cuerpo=b'', tipo='application/json; charset=utf-8'):
        self.send_response(codigo)
        self.cors()
        self.send_header('Content-Type', tipo)
        self.send_header('Content-Length', str(len(cuerpo)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        if self.command != 'HEAD':
            self.wfile.write(cuerpo)

    def responder_json(self, obj, codigo=200):
        self.responder(codigo, json.dumps(obj, ensure_ascii=False).encode('utf-8'))

    def leer_json(self):
        n = int(self.headers.get('Content-Length') or 0)
        if n <= 0 or n > 65536:
            return {}
        try:
            return json.loads(self.rfile.read(n).decode('utf-8'))
        except (ValueError, UnicodeDecodeError):
            return {}

    def do_GET(self):
        ruta = urlparse(self.path).path
        if ruta == '/hora':
            self.responder_json({'servidor': 'orquesta', 't': ahora_ms()})
        elif ruta == '/eventos':
            self.eventos()
        elif ruta in ('/', '/index.html') or (PAGINA and ruta == '/' + PAGINA):
            if not PAGINA:
                self.responder(404, 'No encontré la página .html junto a servidor.py'.encode('utf-8'), 'text/plain; charset=utf-8')
                return
            with open(os.path.join(CARPETA, PAGINA), 'rb') as f:
                self.responder(200, f.read(), 'text/html; charset=utf-8')
        elif ruta == '/favicon.ico':
            self.responder(204)
        else:
            self.responder(404, b'No encontrado', 'text/plain; charset=utf-8')

    def do_POST(self):
        ruta = urlparse(self.path).path
        datos = self.leer_json()
        if ruta == '/hola':
            self.hola(datos)
        elif ruta == '/orden':
            self.orden(datos)
        else:
            self.responder(404, b'No encontrado', 'text/plain; charset=utf-8')

    def hola(self, d):
        ident = str(d.get('id', ''))[:40]
        if not ident:
            self.responder_json({'ok': False}, 400)
            return
        info = {'estacion': str(d.get('estacion', ''))[:40], 'mov': d.get('mov', 1),
                'sonido': bool(d.get('sonido')), 'teclado': bool(d.get('teclado'))}
        with lock:
            nueva = ident not in laptops
            previo = laptops.get(ident, {})
            laptops[ident] = dict(info, ip=self.client_address[0], visto=time.monotonic(),
                                  llegada=previo.get('llegada', time.monotonic()))
        if nueva:
            print(f"  Conectada: {info['estacion'] or 'sin estación'} ({self.client_address[0]})")
        self.responder_json({'ok': True, 't': ahora_ms()})

    def orden(self, d):
        global estado
        tipo = d.get('tipo')
        if tipo == 'empezar':
            cuenta = min(CUENTA_MAX, max(0, float(d.get('cuenta', 5))))
            mov = 2 if d.get('mov') == 2 else 1
            desde = max(0.0, float(d.get('desde', 0) or 0))
            at = ahora_ms() + cuenta * 1000
            with lock:
                estado = {'tipo': 'estado', 'corriendo': True, 'mov': mov, 'at': at, 'desde': desde}
            msg = {'tipo': 'empezar', 'mov': mov, 'at': at, 'desde': desde, 'cuenta': cuenta}
            print(f"  El director da la partida: movimiento {'I' if mov == 1 else 'II'}, cuenta de {cuenta:g} s.")
        elif tipo == 'detener':
            at = ahora_ms() + 250  # un instante en el futuro, para que todos se detengan juntos
            with lock:
                estado = {'tipo': 'estado', 'corriendo': False, 'mov': estado.get('mov', 1), 'at': None, 'desde': 0}
            msg = {'tipo': 'detener', 'at': at}
            print('  El director detiene los timers.')
        else:
            self.responder_json({'ok': False, 'error': 'orden desconocida'}, 400)
            return
        difundir(msg)
        self.responder_json({'ok': True, 'mensaje': msg})

    def eventos(self):
        """Flujo de eventos (Server-Sent Events): cada laptop queda escuchando aquí."""
        self.send_response(200)
        self.cors()
        self.send_header('Content-Type', 'text/event-stream; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Transfer-Encoding', 'chunked')
        self.end_headers()
        q = queue.Queue()
        with lock:
            oyentes.add(q)
            inicio = dict(estado)
        q.put(json.dumps(inicio, ensure_ascii=False))
        q.put(json.dumps({'tipo': 'laptops', 'lista': lista_laptops()}, ensure_ascii=False))
        try:
            self.enviar(b'retry: 1500\n\n')
            while True:
                try:
                    datos = q.get(timeout=15)
                    self.enviar(('data: ' + datos + '\n\n').encode('utf-8'))
                except queue.Empty:
                    self.enviar(b': sigo aqui\n\n')  # mantiene viva la conexión
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError, OSError):
            pass
        finally:
            with lock:
                oyentes.discard(q)
            self.close_connection = True

    def enviar(self, datos):
        self.wfile.write(b'%x\r\n%s\r\n' % (len(datos), datos))
        self.wfile.flush()


def direcciones_locales():
    ips = set()
    for destino in ('10.255.255.255', '192.168.255.255', '8.8.8.8'):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect((destino, 1))
            ips.add(s.getsockname()[0])
            s.close()
        except OSError:
            pass
    try:
        for ip in socket.gethostbyname_ex(socket.gethostname())[2]:
            ips.add(ip)
    except OSError:
        pass
    return sorted(ip for ip in ips if not ip.startswith('127.') and not ip.startswith('0.'))


def main():
    # Mensajes al momento (también si la terminal no es interactiva) y sin errores por tildes en consolas antiguas.
    try:
        sys.stdout.reconfigure(line_buffering=True, errors='replace')
    except (AttributeError, ValueError):
        pass
    if not PAGINA:
        print('No encontré ninguna página .html en la carpeta de servidor.py:', CARPETA)
        sys.exit(1)
    try:
        servidor = ThreadingHTTPServer(('0.0.0.0', PUERTO), Manejador)
    except OSError as e:
        print(f'No pude abrir el puerto {PUERTO} ({e}). Prueba con otro:  python3 servidor.py 8080')
        sys.exit(1)
    servidor.daemon_threads = True
    threading.Thread(target=vigilar_laptops, daemon=True).start()
    print('\nOrquesta de Laptops: servidor listo (página: ' + PAGINA + ')\n')
    ips = direcciones_locales()
    if ips:
        print('En cada laptop: abre dom001.html, aprieta «Conectar a la red» y escribe')
        for ip in ips:
            print(f'    {ip}:{PUERTO}')
        print('(o abre en el navegador  http://' + ips[0] + f':{PUERTO} )')
    else:
        print('No encontré la dirección de red de este equipo; búscala en la configuración de red.')
    print(f'La directora, en este equipo, escribe:  localhost:{PUERTO}')
    print('\nCtrl+C para cerrar.\n')
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print('\nServidor cerrado.')


if __name__ == '__main__':
    main()
