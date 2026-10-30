# MTrackpad

**MTrackpad** (*musical trackpad*) es un instrumento que se toca con el trackpad, el mouse o una pantalla táctil.
Un recuadro XY, un eje Z y los gestos que haces sobre él controlan un sintetizador, cuatro ranuras de muestras, una cadena de efectos y luces para proyectar.
Todo lo que controla cada eje se puede reasignar.

Es una sola página web (`index.html`), sin instalación ni dependencias: funciona en Chrome, Edge o Firefox de escritorio.

**Página:** <https://eepyysspp.github.io/MTrackpad/> (después de activar GitHub Pages).

## Tocar

1. Presiona **Encender** (o `Espacio`) y arrastra en el recuadro.
2. Elige un preset arriba a la derecha para empezar.
3. **Grabar** (`G`) graba lo que suena y lo deja para escuchar y descargar.

| Tecla | Acción |
|---|---|
| `Espacio` | encender / apagar (en modo «al tocar», mantener para que suene) |
| `←` `→` / `↑` `↓` | mover X / Y (`Shift` = pasos finos) |
| `Q` `E` o rueda del mouse sobre el recuadro | eje Z |
| `1`–`4` | disparar las muestras en modo disparo |
| `F` | destello (sonido y luz) |
| `V` | luces a pantalla completa, para proyectar |
| `G` | grabar / detener |

## Fuentes de control

| Fuente | Qué mide |
|---|---|
| **X**, **Y** | posición en el recuadro |
| **Z** | deslizador auxiliar (rueda del mouse, `Q`/`E`) |
| **R** | distancia al centro (0 en el centro, 1 en las esquinas) |
| **A** | ángulo alrededor del centro (0 arriba, en sentido horario) |
| **V** | velocidad del gesto: sube al moverte rápido y vuelve sola a 0 |
| **P** | presión del lápiz o del toque (con mouse vale 0,5 mientras aprietas) |

Cada **asignación** conecta una fuente con un parámetro, con su mínimo, máximo, curva (lineal, x², x³, √x, S, exponencial, 5 escalones) e inversión.
Varias fuentes sobre un mismo parámetro se promedian; lo no asignado queda en su valor fijo (pestaña *Parámetros*).

## Sonido

- **Osciladores:** cuatro, cada uno con su forma de onda (sierra, cuadrada, triángulo, seno) y su intervalo en semitonos, más **ruido**. Desafinación en abanico, ancho estéreo y glide.
- **Altura:** nota base y un parámetro *Altura* (±24 semitonos) que puede ajustarse a una escala (cromática, mayor, menor, pentatónicas, blues, dórica): asígnalo a un eje para tocar melodías.
- **Puerta:** suena encendido/apagado, o solo mientras tocas el recuadro, con ataque y suelta.
- **Muestras (M1–M4):** carga tus archivos o genera un ejemplo (acorde de pad, campana, viento, bombo, vocal). Cada ranura suena como:
  - **loop**, transpuesto con la altura;
  - **nube granular**: granos de la grabación con posición, tamaño, densidad y dispersión asignables;
  - **disparo**: suena entera con `1`–`4`, su botón o al tocar el recuadro.
- **Efectos, en este orden:** filtro (pasa-bajos, pasa-banda, pasa-altos, rechaza-banda o realce, con barrido automático) → distorsión paralela `tanh` con dureza y tono → trémolo → chorus estéreo → eco sincronizado al tempo y reverb (pieza, sala o catedral) → compresor.

## Luces

Cuatro dibujos (manchas, anillos que pulsan con los golpes, espectro del sonido y cortina de color plano). El color, la saturación, la intensidad, la velocidad, el tamaño y la reacción al sonido son parámetros asignables como cualquier otro.

## Presets

Incluidos: *Drone filtrado*, *Theremin*, *Filtro resonante*, *Respiración*, *Muro de distorsión*, *Nube granular*, *Coro y eco*, *Oleaje* y *Gesto*.
Puedes guardar los tuyos. La configuración completa se guarda sola en el navegador y se puede pasar a otro computador como texto o archivo `.json` (pestaña *Guardar*).
Para cargar muestras propias automáticamente, ver [`sonidos/LEEME.md`](sonidos/LEEME.md).

## Publicar en GitHub Pages

1. Crea en GitHub el repositorio vacío **MTrackpad** (sin README).
2. En esta carpeta: `git add .`, `git commit -m "MTrackpad"` y `git push -u origin main`.
3. En el repositorio: *Settings → Pages → Deploy from a branch → main / (root)*.
