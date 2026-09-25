# TALEA (título provisorio)

*Obra para Orquesta de Laptops UC · serie diatónica (color) y células rítmicas (talea) · sincronía por pulso audible, red opcional*
IEE2003 Orquesta de Laptops · Pontificia Universidad Católica de Chile · T1 — Lucas Nervi

Duración: **7:00** · funciona desde 7 estaciones, escala hasta 12 · red local opcional, no requerida

---

## 1. Idea

*In C* deja que cada intérprete decida cuándo avanzar de patrón, pero el material — los 53 patrones de Riley — es el mismo para todos. **TALEA** invierte ese reparto: el material de cada estación es individual y fijo (una fila de siete grados, leída de una de cuatro maneras posibles), y lo que varía en tiempo real no es *qué nota viene* sino *cómo se lee la fila* y *en qué célula rítmica se instala*. La obra no es aleatoria ni libre: cada Voz tiene un objeto compositivo cerrado (su fila) y un pequeño conjunto de decisiones legítimas sobre él (P/R/I/RI, colección activa, talea, timbre).

La altura y el ritmo son dos procesos independientes que se combinan por *isorritmia*: una fila de siete alturas (el **color**) cicla contra una célula rítmica de largo distinto (la **talea**). Como 7 y el largo de la talea casi nunca coinciden, la pareja altura-duración de cada evento cambia cada vez que se repite el ciclo — la misma técnica que Messiaen usa en el chelo de *Liturgie de cristal* (color de 5 notas contra talea de 15 duraciones), aquí aplicada a una melodía completa en vez de a un ostinato de acompañamiento (ver Parte 1 del portafolio para el análisis completo de los tres referentes).

El arco formal es un proceso de convergencia rítmica: las células son largas al comienzo (16, 14, 10 corcheas), se acortan al medio (8, 5, 7 corcheas) y en la sección final **todas las voces convergen a la misma célula, 4-3-4 (11 corcheas)** — aunque cada una siga leyendo su propia fila (P, R, I o RI), y por lo tanto sonando alturas distintas. Es la inversión especular de la "Convergencia" de *Nube*: ahí todas las voces llegan a la *misma altura*; aquí todas llegan al *mismo ritmo*, con la altura como lo que permanece individual.

## 2. Sistema de altura — fila y colección

### 2.1 Filas generadoras (el "color")

Cada Voz tiene una fila fija de siete grados diatónicos (1–7), generada por un único intervalo — el equivalente diatónico de una fila dodecafónica generada por un solo intervalo (p. ej. una fila de cuartas):

```
fila(k)[i] = (i·k mod 7) + 1,   i = 0..6
```

| k | fila | carácter |
|---|---|---|
| 1 | 1 2 3 4 5 6 7 | grado conjunto |
| 2 | 1 3 5 7 2 4 6 | por terceras |
| 3 | 1 4 7 3 6 2 5 | por cuartas |
| 4 | 1 5 2 6 3 7 4 | por cuartas, sentido opuesto |
| 5 | 1 6 4 2 7 5 3 | por terceras, sentido opuesto |
| 6 | 1 7 6 5 4 3 2 | grado conjunto descendente |

Estas seis filas no son independientes entre sí: la fila k y la fila (7−k) son inversión una de la otra bajo el eje del primer grado (ver 2.2). Esto es una propiedad, no una coincidencia buscada — un subproducto correcto de generar filas diatónicas por un solo intervalo, igual que en las filas dodecafónicas por intervalo constante.

### 2.2 Operaciones seriales

Cada Voz puede leer su fila fija de cuatro maneras, decisión que toma en vivo:

- **P (prima):** la fila tal cual.
- **R (retrogradación):** la fila al revés.
- **I (inversión):** se fija el primer grado como eje y se refleja el resto: `inv(d) = (2·eje − d) mod 7`.
- **RI (retrogradación de la inversión):** I al revés.

Cambiar de lectura no cambia el material — la fila sigue siendo la misma serie — cambia el orden en que se recorre. Es la misma disciplina compositiva del serialismo dodecafónico, aplicada a un conjunto de siete elementos en vez de doce, y con foco explícitamente melódico (no hay agregados verticales por combinación de filas: cada Voz es una sola línea).

### 2.3 Colección diatónica móvil

El grado 1–7 de una fila no tiene altura fija: se interpreta dentro de una **colección diatónica activa**, gobernada por la estación **Armonía**. La colección se identifica por su posición en el círculo de quintas respecto de Do mayor (k=0):

| colección | notas |
|---|---|
| −2 | Sib mayor / Sol menor |
| −1 | Fa mayor / Re menor |
| 0 | Do mayor / La menor (natural) |
| +1 | Sol mayor / Mi menor |
| +2 | Re mayor / Si menor |

Cuando Armonía cambia de colección, **todas** las filas fijas se recolorean sin que nadie tenga que reescribir nada: el mismo grado 5 de la fila de una Voz suena distinto en colección 0 que en colección +1. Es el único mecanismo armónico de la obra, y es deliberadamente austero: pandiatónico dentro de cada colección (las siete notas son igual de válidas, sin jerarquía tonal fuerte), con el color cambiando por bloques al modular.

## 3. Sistema rítmico — talea

Células rítmicas aditivas, en corcheas, agrupadas en tres niveles según la sección de la obra:

| nivel | células | duración |
|---|---|---|
| **larga** (Sección A) | 3+3+4+2+4 · 3+3+4+4 · 3+3+2+2 | 16 · 14 · 10 |
| **corta** (Sección B) | 3+3+2 · 2+3 · 2+2+3 | 8 · 5 · 7 |
| **convergencia** (Sección C) | 4+3+4 | 11 |

Cada Voz combina su fila (color, largo 7) con una célula (talea, largo variable) por isorritmia: el evento *n* toma el grado `fila[n mod 7]` con duración `talea[n mod talea.length]`. Como 7 no es múltiplo del largo de ninguna talea, la combinación completa (color, duración) solo se repite cada mcm(7, largo de la talea) eventos — 35 eventos para una talea de 5 elementos, 28 para una de 4, y así. El oyente no escucha un ostinato: escucha una melodía que parece variar sin dejar de repetir el mismo material, exactamente el efecto isorrítmico medieval que Messiaen retoma (Parte 1).

## 4. Roles por estación

Ensamble base de **siete** estaciones; hasta doce sumando estaciones adicionales.

| rol | cuántas (7 → 12) | qué decide en tiempo real |
|---|---|---|
| **Pulso** | 1 | mantiene la corchea audible; ajusta tempo si el director lo pide |
| **Armonía** | 1 | qué colección diatónica está activa; cuándo modular; sostiene el acorde pandiatónico 1-3-5-7 de esa colección |
| **Voz** | 5 → 10 | qué lectura (P/R/I/RI) de su fila fija está tocando; qué célula rítmica (de las permitidas por la sección) está usando; timbre |

Con siete estaciones: Pulso, Armonía y Voz 1–5 (filas k=1..5). Con más estaciones se agregan Voz 6 (fila k=6, cierra el ciclo de las seis filas generadoras) y Voz 7–10, que **reutilizan** las filas k=1..4 una octava más abajo y con timbre distinto — mismo tipo de decisión de rol repetido con material propio, como permite el enunciado. Ninguna estación reproduce un archivo fijo: todas leen y deciden sobre su fila en vivo.

## 5. Notación / instrucciones de ejecución

No hay partitura convencional: cada estación recibe (impresa o en pantalla) una tarjeta con su fila fija y el mapa de la forma. Ejemplo para Voz 2 (fila k=2):

```
VOZ 2 — fila fija: 1 3 5 7 2 4 6

Sección A (0:00–2:30)  talea larga: 3+3+4+4 (14)     lectura: P
Sección B (2:30–5:00)  talea corta: 2+3 (5)           lectura: libre, cambia cada ~30s
Sección C (5:00–6:30)  talea: 4+3+4 (11, todas iguales) lectura: la que se esté usando
Coda (6:30–7:00)        ancla el último ciclo y se apaga
```

La aplicación `estacion.html` es la partitura en vivo: muestra la fila, resalta la lectura activa, ofrece los botones de célula agrupados por sección y despliega el "ciclo isorrítmico" (qué índice de color y de talea está sonando), para que cada intérprete vea exactamente dónde está dentro del proceso.

## 6. Estructura formal

| sección | tiempo | qué ocurre |
|---|---|---|
| **A — Apertura** | 0:00–2:30 | Entradas escalonadas (una Voz cada ~30s). Colección 0. Cada Voz en su talea larga asignada, lectura P. Pulso y Armonía sostenidos desde el inicio |
| **B — Nudo** | 2:30–5:00 | Armonía sube a colección +1 (cambio audible, sin aviso de red necesario). Las Voces pasan a talea corta y empiezan a alternar lecturas P/R/I/RI con más frecuencia — más variedad tímbrico-melódica con el mismo material |
| **C — Convergencia** | 5:00–6:30 | Todas las Voces convergen a la célula 4-3-4: coinciden rítmicamente por primera vez, pero cada una sigue leyendo su fila (con su lectura del momento), así que las alturas no coinciden — unísono de ritmo, polifonía de altura |
| **Coda — Evaporación** | 6:30–7:00 | Cada Voz ancla su último ciclo en loop y baja el volumen a cero a su propio ritmo (como los anclajes de *Campo* / la evaporación de *Nube*); Armonía sostiene y se apaga último; Pulso se detiene al final |

`director.html` lleva el reloj de la obra, muestra la sección activa y ofrece comandos de teclado (`A`/`B`/`C`/`E`) para cuar los cambios de sección y anunciar la colección, con o sin proyección.

## 7. Estrategia de coordinación

**Sin red (caso por defecto).** El Pulso es la referencia de tempo compartida, igual que en *In C*. Los cambios de sección los marca el director (de palabra, con señas, o proyectando `director.html`); los cambios de colección se reconocen **de oído**, escuchando a Armonía. Nadie cambia de célula a mitad de un ciclo: se espera a terminar la célula en curso antes de adoptar la nueva (misma lógica de "nadie se adelanta" de *In C*, aplicada a la talea en vez de al patrón).

**Con red (opcional).** Si hay red local, se puede extender el protocolo `/oluc` del curso (ver `Ejemplos/Red-OSC`) con dos mensajes adicionales, ambos de solo información — ninguno es necesario para tocar:

- `/oluc/coleccion <int k>` — lo envía Armonía por broadcast UDP puerto 9000 cada vez que cambia de colección; las estaciones Voz, si están conectadas, pueden usarlo para autocompletar el selector de colección en pantalla en vez de ajustarlo a mano.
- `/oluc/seccion <string>` — lo envía la estación del director al cambiar de sección (`"A"`, `"B"`, `"C"`, `"coda"`); las estaciones Voz pueden usarlo para resaltar automáticamente qué grupo de talea corresponde.

Si un mensaje se pierde, no pasa nada: la fuente de verdad sigue siendo el oído y el director, la red es puramente una comodidad visual redundante con lo audible. Estos dos mensajes no están implementados en la entrega (ver 9); están especificados aquí porque el enunciado pide indicar qué viajaría, quién lo envía y qué pasa si se pierde.

## 8. Sonido en la sala

Ocho a doce estaciones con su propio sistema de parlantes (en fabricación durante el semestre), dispuestas en semicírculo, como en *Nube*/*Campo*. Pulso y Armonía deberían proyectarse desde una posición central o pareja, por ser las referencias comunes; las Voces se dispersan por el semicírculo siguiendo el orden de sus filas (k=1 a un extremo, k=6 al otro) para que un oyente que camine por la sala recorra también el ciclo de generadores, de grado conjunto a grado conjunto descendente. Esta disposición es especulativa y depende del modelo hemisférico final de los parlantes.

## 9. Riesgos

- **Perder la colección activa de oído** es el riesgo más probable con siete intérpretes nuevos en la técnica. Mitigación: Armonía cambia de colección solo en los límites de sección (nunca a mitad de A o B), y sostiene el acorde varios segundos antes y después del cambio.
- **Desalinear el ciclo isorrítmico** (perder la cuenta de en qué grado/talea se está) es posible si alguien mira la pantalla en vez de escuchar. La app muestra el índice en todo momento como red de seguridad.
- **La Convergencia (Sección C) no cae exactamente junta** la primera vez que se ensaye — es lo único de la obra que exige coordinación rítmica estricta. Versión reducida: si no converge en el ensayo, la Sección C se reemplaza por una extensión de la Sección B (todos en talea corta, sin exigir 4-3-4 compartido) y se pasa directo a la Coda; la obra se sostiene igual, solo pierde el momento de unísono rítmico.
- **Con siete estaciones el tejido puede sonar delgado.** Mitigación incluida en el diseño: con cinco Voces activas (k=1..5) ya hay variedad de generadores (conjunto, terceras, cuartas en ambos sentidos) antes de sumar las adicionales.

## 10. Notas técnicas

- `motor.js`: módulo puro (sin audio) con las filas generadoras, las operaciones P/R/I/RI, el cálculo de colección→frecuencia y la generación de eventos isorrítmicos. Lo usan por igual `estacion.html` (ejecución en vivo) y `render.js` (render offline).
- `estacion.html`: aplicación de una sola estación, sin dependencias, estilo de las obras del curso. Selector de rol (Pulso / Armonía / Voz), controles en vivo, Web Audio API con osciladores simples (fundamental + 2° y 3er armónico, cantidad controlada por el parámetro de timbre). Probada en Chrome; abre por `file://` o por HTTP.
- `render.js`: no usa Web Audio (Node no lo tiene) — sintetiza el mismo motor directamente a un buffer de muestras (seno + armónicos, con la misma fórmula que `estacion.html`) y escribe un WAV de 16 bits sin dependencias externas. Es la única diferencia real entre "tocar la obra" y "producir el render": la capa de síntesis está duplicada a propósito (una en Web Audio, otra en aritmética pura), pero la lógica musical — filas, lecturas, colecciones, talea, isorritmia — es exactamente la misma en ambos archivos porque ambos importan `motor.js`.
- Tempo de referencia: negra = 96 bpm (corchea ≈ 0.3125s), ajustable en vivo desde `estacion.html`.
