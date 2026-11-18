# Orquesta de Laptops · instrumento unificado

Seis instrumentos en una sola página (`index.html`, 100 % offline: sin CDN, sin fuentes externas) y un servidor de red local en Go (`main.go`, solo biblioteca estándar).

| | Campanas | Motor | ResoDance |
|---|---|---|---|
| **1** (fila de arriba, F1–F3) | sonido de la 1ª versión unificada | sonido de la 1ª versión unificada | sonido de la 1ª versión unificada |
| **2** (fila de abajo, F4–F6) | motor original de *Gracias a la vida* | motor original de MotorSynth V0.0.4 | motor físico original de ResoDance V0.0.1 |

En Mac las teclas F se tocan con **fn** (fn+F1…F6); también sirve **⌥ Opción + 1…6**. **Esc** silencia esta laptop.

## Para quien dirige (laptop maestra)

**Linux**
```bash
cd Orquesta
./iniciar.command            # o directamente: ./servidor-linux
```

**macOS** (la primera vez, en Terminal dentro de la carpeta `Orquesta`):
```bash
chmod +x iniciar.command servidor-mac-arm64 servidor-mac-intel
xattr -cr .                  # quita la cuarentena ("desarrollador no identificado")
./iniciar.command            # elige solo entre Apple Silicon (M1–M4) e Intel
```
Después basta con doble clic en `iniciar.command`. (Si se bloquea: Ajustes del Sistema › Privacidad y seguridad › **Abrir igualmente**.)

El servidor muestra la dirección para las demás laptops (por ejemplo `http://192.168.0.10:8080`) y abre el navegador de la maestra en `http://localhost:8080`. Usa el puerto 8080 o, si está ocupado, el siguiente libre. Se apaga con **Ctrl+C** o cerrando la ventana de la terminal.

## Para los músicos

Nada que instalar: conectarse al mismo Wi‑Fi y abrir en el navegador la dirección que muestra la maestra. En macOS 15+, Chrome pide permiso de **red local** la primera vez: aceptarlo.

Sin servidor (doble clic en `index.html`) funciona en **ensayo local** con los controles de dirección locales. Para conectarse a un servidor desde un archivo local: `index.html?servidor=192.168.0.10:8080`.

## Qué se sincroniza

- **Reloj** (⏸/▶ pausa y reanuda, ⟲ vuelve a 00:00): viaja como milisegundos transcurridos; cada navegador mide el retardo de ida y vuelta y sigue con su propio reloj. Sin NTP ni internet.
- **BPM** y **sección**.
- **¡Atención!**: toda la pantalla de cada laptop parpadea en amarillo durante 4 s.
- **Unísono** (se activa/desactiva): los ataques de todas las laptops esperan al próximo pulso maestro.
- **Corte**: fundido suave de 3 s del volumen general y luego silencio total.

Solo la laptop que corre el servidor ve y puede usar los botones de dirección; el servidor ignora esas órdenes si vienen de otra laptop. Si el servidor se cae, el sonido sigue, el LED se pone rojo y las páginas se reconectan solas.

## Compilar de nuevo (solo si se modifica `main.go`)

Requiere Go (`sudo dnf install golang`, `sudo apt install golang` o `brew install go`):
```bash
./construir.sh
# equivale a:
CGO_ENABLED=0 GOOS=linux  GOARCH=amd64 go build -o servidor-linux .
CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 go build -o servidor-mac-arm64 .
CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -o servidor-mac-intel .
```
Los ejecutables llevan una copia de respaldo de `index.html`, pero siempre sirven primero el `index.html` que está en disco junto a ellos: **editar el HTML no requiere recompilar**.

## Configuración

Al principio del `<script>` de `index.html`, en `CONFIG`: secciones de la obra, frecuencias de las 4 filas de los motores, inercia máxima (3.50 s) y BPM máximo (440) del trackpad, tolerancia y subdivisión del Unísono, duración del Corte y de ¡Atención!, timbre de Campanas 2, acordes de Campanas 1 y patrones/presets de ResoDance 1.

## Protocolo (WebSocket `ws://<servidor>/orquesta`, JSON con campo `t`)

| navegador → servidor | | servidor → navegador | |
|---|---|---|---|
| `hola` `{id, instrumento, sonando}` | al conectar | `bienvenida` `{control, direcciones}` | tras `hola` |
| `estado` `{instrumento, sonando}` | al cambiar | `estado` `{reloj:{estado, ms}, bpm, seccion, unisono}` | al cambiar y cada 2 s |
| `ping` `{c}` | cada 2 s | `pong` `{c, estado, ms}` | sincroniza el reloj |
| `reloj` `{accion: pausar\|reanudar\|reiniciar}` | maestra | `atencion` `{n}` · `corte` `{n}` | eventos |
| `bpm` `{bpm}` · `seccion` `{seccion, bpm}` · `unisono` `{activo}` · `atencion` · `corte` | maestra | `tabla` `{musicos:[…]}` | cada 1 s |

Información: `GET /orquesta/info`.
