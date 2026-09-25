# TALEA (título provisorio)

*Obra para Orquesta de Laptops UC · serie diatónica (color) + células rítmicas (talea) · el director altera las notas en vivo, red opcional*
IEE2003 Orquesta de Laptops · PUC · T1 — Lucas Nervi

Duración: **7:00** · funciona desde 7 estaciones, escala hasta 12

---

## 1. Idea

Cada Melodía tiene una fila fija de 7 grados diatónicos (el **color**), generada por un procedimiento constante — el mismo principio que usa Slonimsky en su *Thesaurus* (ver Parte 1). En vivo decide dos cosas: cómo lee la fila (P/R/I/RI) y con qué célula rítmica (**talea**) la combina. Altura y ritmo son procesos independientes combinados por isorritmia (técnica de color + talea). Las células empiezan largas, se acortan al medio, y todas las voces convergen a la misma célula final (4-3-4) — unísono de ritmo, no de altura.

No hay tónica ni colección preestablecida: el **director** decide, nota por nota, cuáles de las siete notas naturales (C D E F G A B) están sostenidas o bemoles, con un brazalete visual circular. Cuando cambia una alteración, todas las estaciones Melodía y Armonía conectadas cambian su patrón al instante — el director no dirige con señas solamente, dirige el material mismo. Esto suena contra una guía métrica implícita: como no hay Pulso, cada Melodía sostiene su propio tempo de talea y todas se realinean por oído cada vez que el director anuncia un cambio, en la misma lógica de tensión y resolución rítmica que Meshuggah logra con riffs de agrupaciones impares sobre una batería estable — aquí, sin batería, la "resolución" la marca el propio cambio de nota del director (ver Parte 1).

## 2. Altura

**Filas generadoras**, una por Melodía: `fila(k)[i] = (i·k mod 7) + 1`

| k | fila |
|---|---|
| 1 | 1 2 3 4 5 6 7 |
| 2 | 1 3 5 7 2 4 6 |
| 3 | 1 4 7 3 6 2 5 |
| 4 | 1 5 2 6 3 7 4 |
| 5 | 1 6 4 2 7 5 3 |
| 6 | 1 7 6 5 4 3 2 |

**Lecturas** (decisión en vivo): P (tal cual) · R (al revés) · I (invertida sobre el primer grado: `inv(d)=(2·eje−d) mod 7`) · RI (I al revés).

**Grado → nota:** el grado *i* (1–7) es siempre la nota natural i-ésima (1=C, 2=D, 3=E, 4=F, 5=G, 6=A, 7=B), alterada según lo que el director tenga activo en su brazalete. No hay tónica: cambiar una alteración recolorea directamente esa nota en todas las filas que la contengan, sin tener que elegir toda una escala nueva.

## 3. Ritmo — talea

| nivel | células (corcheas) |
|---|---|
| larga (Sección A) | 3+3+4+2+4=16 · 3+3+4+4=14 · 3+3+2+2=10 |
| corta (Sección B) | 3+3+2=8 · 2+3=5 · 2+2+3=7 |
| convergencia (Sección C) | 4+3+4=11 |

Isorritmia: evento *n* = `fila[n mod 7]` con duración `talea[n mod talea.length]`. Como 7 casi nunca coincide con el largo de la talea, la combinación altura-duración cambia en cada repetición del ciclo.

## 4. Roles (7 → 12 estaciones)

| rol | cuántas | decide en vivo |
|---|---|---|
| Armonía | 1 → 2 | qué grado (1–7) de master chord sostener; cambia con las alteraciones del director |
| Melodía | 6 → 10 | lectura (P/R/I/RI), célula, timbre |
| **Director** | 1 (no toca) | qué notas están sostenidas/bemoles (brazalete), tempo, cues de sección |

Con 7 estaciones tocando: Armonía + Melodía 1–6 (más el director, que no es una estación sonora sino la consola `director.html`). Con más: se suman más Melodías (reutilizando filas k=1..6 en otra octava/timbre) o una segunda Armonía en otro grado.

No hay Pulso. El tiempo se sostiene de oído: cada Melodía corre su propia sucesión de células a su propio tempo compartido (negra=96 bpm de referencia, acordado de antemano o emitido por el director), y el punto de reencuentro real es cuando el director cambia una nota — ahí todas las estaciones reaccionan juntas, sea por sincronización real (ver §7) o por el anuncio del director.

## 5. Notación

`estacion.html` dibuja un pentagrama real (clave de sol, SVG) con las 7 notas de la fila de la Melodía activa, deletreadas según las alteraciones en curso (letra + sostenido/bemol/doble — no solo números de grado), y resalta con color la que está sonando en ese instante. Debajo, una tira rítmica muestra la célula activa con el grupo en curso resaltado. Para Armonía, el mismo pentagrama muestra el master chord completo (fundamental, 3a mayor, 7a menor) del grado elegido, y el grado se elige con siete botones (uno por cada nota C–B) que muestran de entrada las tres notas del acorde resultante — nada de leer "grado 4" y adivinar qué suena: se ve.

`director.html` tiene el **brazalete**: un anillo de 7 letras (C D E F G A B), cada una con dos cuentas — ♯ y ♭, mutuamente excluyentes — que el director enciende o apaga con un clic. No hay que leer texto ni memorizar índices en ninguna de las tres pantallas: todo se lee visualmente y se actualiza en vivo.

## 6. Forma

| sección | tiempo | qué ocurre |
|---|---|---|
| A — Apertura | 0:00–2:30 | entradas escalonadas, talea larga, todas las notas naturales |
| B — Nudo | 2:30–5:00 | el director activa 1–2 alteraciones en el brazalete, talea corta |
| C — Convergencia | 5:00–6:30 | todas las voces convergen a 4-3-4 (ritmo unísono, altura libre) |
| Coda | 6:30–7:00 | cada voz ancla su ciclo y se apaga a su ritmo |

`director.html`: reloj, sección activa, comandos de teclado (A/B/C/E) para cuar cambios, además del brazalete.

## 7. Estrategia de coordinación

**Sin Pulso ni red entre laptops físicas distintas (caso por defecto):** cada Melodía sostiene su propio tempo (negra≈96 bpm, acordado antes de tocar); el director cua los cambios de sección de palabra o proyectando `director.html`; los cambios de nota se anuncian de palabra o se leen del brazalete proyectado. Nadie cambia de célula a mitad de ciclo.

**Sincronización real implementada, pero solo dentro del mismo dispositivo:** `director.html` y `estacion.html` se sincronizan en vivo por `BroadcastChannel` del navegador — cuando el director enciende o apaga una alteración, todas las pestañas de estación abiertas en **ese mismo navegador** cambian de patrón al instante, sin intervención manual. Esto es real y queda demostrado en la entrega (ver Parte 3), pero `BroadcastChannel` solo comunica pestañas del mismo origen en el mismo dispositivo: **no viaja entre las doce laptops físicas del ensamble**. Para el concierto real, la misma información (qué nota se acaba de alterar) se comunicaría igual que el resto de la obra: por voz, gesto o proyección del brazalete — o, si hubiera red local, extendiendo el protocolo `/oluc` del curso con un mensaje `/oluc/alteracion <letra> <-1|0|1>` por broadcast UDP puerto 9000, que cada estación aplicaría al vuelo. Si el mensaje se pierde, no pasa nada: la referencia sigue siendo el brazalete proyectado o anunciado.

## 8. Sonido en sala

Estaciones en semicírculo con parlante propio (en fabricación); Armonía al centro; Melodías dispersas según su fila generadora. El director no necesita parlante propio: su pantalla se proyecta. Especulativo, depende del modelo hemisférico final.

## 9. Riesgos

- Sin Pulso, perder el tempo compartido es el riesgo más probable con siete intérpretes nuevos en la técnica → mitigado acordando el tempo de referencia antes de tocar y con el reloj de `director.html` como respaldo visual.
- Que `BroadcastChannel` no esté disponible para el ensamble real (laptops físicas distintas) → documentado como limitación conocida (§7): la coordinación cae a viva voz/gesto, igual que el resto de la obra.
- Desalinear el ciclo isorrítmico → índice siempre visible en pantalla.
- Convergencia (C) no cae junta → versión reducida: se extiende B y se salta a la Coda.

## 10. Notas técnicas

`motor.js` (filas, P/R/I/RI, alteraciones nota-a-nota, isorritmia, `masterChordSobreGrado`) lo comparten `estacion.html` (Web Audio + partitura SVG en vivo), `director.html` (el brazalete) y `render.js` (Node, sintetiza el mismo motor a un WAV sin dependencias). `director.html` y `estacion.html` se sincronizan por `BroadcastChannel('oluc-talea')`, emitiendo `{alteraciones, tempo}` cada vez que el director cambia algo (y cada 4s por si una estación se conecta tarde). Tempo de referencia: negra = 96 bpm.
