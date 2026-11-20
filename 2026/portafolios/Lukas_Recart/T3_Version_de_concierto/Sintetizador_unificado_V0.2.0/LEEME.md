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

Todo lo editable está en el bloque `<script>` **al inicio** de `index.html`, en `CONFIG` (no se edita desde la pantalla; basta guardar y recargar):

- **A. La obra**: `SECCIONES` (código, título, indicación y BPM de cada sección de la barra superior) y `bpmInicial`.
- **B. Motores**: `MOTOR1_TECLAS` y `MOTOR2_TECLAS`, una línea `["tecla", "código", Hz]` por tecla. Cada tecla es independiente (aunque dos tengan los mismos Hz) y cada motor tiene su propia tabla. También inercia y BPM máximos del trackpad.
- **C. Campanas**: `CAMPANAS_FILAS` (fila = complejidad, columna = acorde), `CAMPANAS_CONTROLES` (teclas de registro y amplitud), acordes de Campanas 1, timbre y nivel IV de Campanas 2.
- **D. ResoDance 1**: `RESODANCE1_FILAS` (sonidos, loops, tonos y patrones `x o .` en semicorcheas).
- **E. Red**: tolerancia y subdivisión del Unísono, duración del Corte y de ¡Atención!

## Controles de cada instrumento

- **Campanas 1 y 2**: `< Z X … .` tríada · `A S … Ñ` +7ª · `Q W … P` +9ª · `1 2 … 0` +11ª (cada columna es un acorde). **Mantener Espacio** = pedal. `+ / ¿` registro, `- / }` amplitud; el candado (solo con mouse) los bloquea. La barra «complejidad» de la derecha muestra la fila que suena. Campanas 1: un acorde nuevo reemplaza al anterior; Campanas 2: las notas se acumulan, y la fila de números toca el acorde extendido en arpegio con halo coral.
- **Motor 1 y 2**: 4 filas del teclado, Espacio (toque = sostén, mantener = freno) y trackpad (X inercia, Y pulso).
- **ResoDance 1**: matriz de loops de resonancia magnética. Las celdas se eligen con o sin play; **Espacio** arranca en el próximo pulso de la red y, sonando, detiene en el próximo múltiplo de 4 pulsos; **Esc** detiene al instante. Pad **Remix FX** a la derecha (filtro, repetidor, bitcrusher, delay, gate): pasar el puntero lo aplica, clic lo fija.
- **ResoDance 2**: sin cambios.

## Protocolo (WebSocket `ws://<servidor>/orquesta`, JSON con campo `t`)

| navegador → servidor | | servidor → navegador | |
|---|---|---|---|
| `hola` `{id, instrumento, sonando}` | al conectar | `bienvenida` `{control, direcciones}` | tras `hola` |
| `estado` `{instrumento, sonando}` | al cambiar | `estado` `{reloj:{estado, ms}, bpm, seccion, unisono}` | al cambiar y cada 2 s |
| `ping` `{c}` | cada 2 s | `pong` `{c, estado, ms}` | sincroniza el reloj |
| `reloj` `{accion: pausar\|reanudar\|reiniciar}` | maestra | `atencion` `{n}` · `corte` `{n}` | eventos |
| `bpm` `{bpm}` · `seccion` `{seccion, bpm}` · `unisono` `{activo}` · `atencion` · `corte` | maestra | `tabla` `{musicos:[…]}` | cada 1 s |

Información: `GET /orquesta/info`.
