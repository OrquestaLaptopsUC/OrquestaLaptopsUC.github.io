# Enjambres · versión de concierto

Versión de concierto de Enjambres para la Orquesta de Laptops UC. Parte de la versión 2 (`../enjambres-v2/`), que sigue intacta, igual que la versión 1 (`../enjambres/`). Los motores de síntesis, los pads y el dibujo son los de la versión 2. Lo nuevo:

1. **Partitura con etapas** que el sistema hace cumplir: en cada etapa se cede a las laptops solo lo que corresponde, dentro de límites, con un tope de agentes, y se fijan mapeo y voz.
2. **El director con Gametrak**: imán general, orden o caos, κ y nivel general con las manos; el pedal pasa de etapa.
3. **Apps de Mac** para no abrir un navegador ni escribir direcciones: `Enjambres` (cada laptop) y `Enjambres Director` (ver `apps/`).

## Arrancar

**Con las apps** (concierto):

1. En la laptop del director (192.168.0.100): abrir **Enjambres Director**. Levanta el servidor, abre la maestra y lee el Gametrak. Menú *Ventana → Proyección* (⌘P) abre el enjambre solo, sin ningún texto, a pantalla completa en la segunda pantalla.
2. En cada laptop: abrir **Enjambres**. Se conecta sola a 192.168.0.100:8080, toma su número del nombre del computador (OLUC07 → 7) y queda a pantalla completa. Si el director todavía no abre su app, espera y reintenta.

**Con navegador** (como antes): `Servidor Enjambres` de la versión 1, y en la maestra cambiar la dirección a `http://localhost:8080/2026/obras/enjambres-concierto/maestra.html`; cada laptop abre `192.168.0.100:8080/2026/obras/enjambres-concierto/`. En Chrome la maestra puede leer el Gametrak (Gamepad API). Con doble clic (`file://`) `maestra.html` corre sola con laptops simuladas, e `index.html` permite ensayar sola o solo, también con las etapas.

Los cuadros llevan versión 4: las páginas de las versiones 1 y 2 los descartan, y al revés.

## La partitura

`partitura.js` tiene mensajes (como antes) y **etapas**. `partitura.html` la muestra para imprimir: completa, solo director o solo intérpretes.

El reloj de la partitura manda: al llegar a la hora de una etapa, se aplica. Cada cambio toma los segundos de su *rampa*, para que nada salte. Se empieza con ▶, la tecla **N** o el pedal; **N** y **B** (o el pedal) saltan a la etapa siguiente y a la anterior; clic en la lista de etapas (pestaña *director*) salta a cualquiera. Con el reloj en 0:00 no hay nada impuesto.

Cada etapa:

| Campo | Qué hace |
|---|---|
| `t`, `nombre` | cuándo empieza (segundos) y cómo se llama; dura hasta la siguiente |
| `texto` | lo que leen los intérpretes en su pantalla mientras dura |
| `director` | lo que lee el director: qué hacer con cada mano |
| `rampa` | segundos para llegar a los valores de la etapa |
| `cede` | lo que maneja cada laptop: `movimiento`, `forma`, `sincronia`, `registro`, `timbre`, `pulso`, `iman`, `todo`, o parámetros sueltos (`voz`, `mapeo`, `color`, `vNoise`…). El resto lo rige la maestra |
| `vals` | valores: para lo retenido, el que rige; para lo cedido, el punto de partida |
| `limites` | `{parámetro: [mín, máx]}`: rango permitido de lo cedido (se ve como la zona clara del pad) |
| `maxAgentes` | tope por laptop; si alguien tiene más, se le quita uno por segundo |
| `conj` | parámetros del conjunto (`kappa`); el Gametrak, si está activo, manda sobre esto |
| `grupos` | las laptops se reparten en grupos (bloques del arco o `"reparto": "alternado"`) y cada grupo recibe valores fijos |
| `espera` | al terminar, el reloj se detiene hasta que el director avance |

Se editan en la maestra, pestaña *partitura*: carril **etapas** (arrastrar cambia cuándo empieza; clic abre nombre, textos y reglas). **Guardar** escribe `partitura.js` (solo dentro de la app Enjambres Director; en el navegador, *exportar* e *importar*).

Lo que pasa al cambiar de etapa: lo que pasa de la maestra a las laptops parte del valor que estaba sonando; lo que vuelve a la maestra converge desde el valor de cada laptop durante la rampa; lo que queda fuera de los límites nuevos entra en 3 segundos.

## El director

Pestaña **director** en la maestra y **vista del director** (botón o tecla **D**): etapa, reloj, lo que hay que hacer y los dos gráficos de las manos, en grande.

| | |
|---|---|
| Mano izquierda, posición | imán general: llama a todos los agentes hacia ese punto del escenario |
| Mano izquierda, altura | fuerza del imán (abajo: suelto) |
| Mano derecha, a los lados | orden (−) o caos (+): se suma al ruido η₁ de todos |
| Mano derecha, adelante y atrás | κ, acoplamiento entre enjambres |
| Mano derecha, altura | nivel general de la obra (abajo: silencio) |
| Pedal | etapa siguiente (el primer toque empieza la obra) |

Cada destino se puede apagar. **Calibrar**: partir con los cordeles recogidos y mover las dos manos por todo el espacio durante 8 segundos. Si un eje va al revés, *invertir*; si las manos están cruzadas, *intercambiar manos*. **Probar con el mouse** permite ensayar sin el Gametrak: arrastrar en los gráficos (sobre la barra, la altura).

Sin Gametrak conectado (o apagado) el nivel general queda en 0 dB y no hay imán general ni caos: la obra funciona igual, solo con la partitura.

## Archivos

Los de la versión 2, más `gametrak.js`, `partitura.html` y `apps/` (fuente y `construir.command` de las dos apps). Cambiaron `modelo.js` (límites, tope, imán general, caos, nivel general), `simulador.js` (etapas), `protocolo.js` (versión 4: imán general en la cabecera), `ui.js` (zona permitida en los pads), `editor.js` (carril de etapas), `vista.js` (dibujo del imán general) y las tres páginas.
