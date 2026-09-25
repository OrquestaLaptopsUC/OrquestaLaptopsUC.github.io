# TALEA (título provisorio)

*Obra para Orquesta de Laptops UC · serie diatónica (color) + células rítmicas (talea) · pulso audible, red opcional*
IEE2003 Orquesta de Laptops · PUC · T1 — Lucas Nervi

Duración: **7:00** · funciona desde 7 estaciones, escala hasta 12

---

## 1. Idea

Cada Voz tiene una fila fija de 7 grados diatónicos (el **color**), generada por un procedimiento constante — el mismo principio que usa Slonimsky en su *Thesaurus* (ver Parte 1). En vivo decide dos cosas: cómo lee la fila (P/R/I/RI) y con qué célula rítmica (**talea**) la combina. Altura y ritmo son procesos independientes combinados por isorritmia (técnica de color + talea). Las células empiezan largas, se acortan al medio, y todas las voces convergen a la misma célula final (4-3-4) — unísono de ritmo, no de altura.

## 2. Altura

**Filas generadoras**, una por Voz: `fila(k)[i] = (i·k mod 7) + 1`

| k | fila |
|---|---|
| 1 | 1 2 3 4 5 6 7 |
| 2 | 1 3 5 7 2 4 6 |
| 3 | 1 4 7 3 6 2 5 |
| 4 | 1 5 2 6 3 7 4 |
| 5 | 1 6 4 2 7 5 3 |
| 6 | 1 7 6 5 4 3 2 |

**Lecturas** (decisión en vivo): P (tal cual) · R (al revés) · I (invertida sobre el primer grado: `inv(d)=(2·eje−d) mod 7`) · RI (I al revés).

**Colección diatónica** (la gobierna la estación Armonía, círculo de quintas desde Do): −2 Sib · −1 Fa · 0 Do (natural) · +1 Sol · +2 Re. Al cambiar de colección se recolorean todas las filas a la vez, sin red.

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
| Pulso | 1 | mantiene la corchea audible |
| Armonía | 1 | qué colección está activa, cuándo modular |
| Voz | 5 → 10 | lectura (P/R/I/RI), célula, timbre |

Con 7: Pulso + Armonía + Voz 1–5. Con más: se suman Voz 6–10 (filas k=6, y repetición de k=1–4 en otra octava/timbre).

## 5. Notación

`estacion.html` dibuja un pentagrama real (clave de sol, SVG) con las 7 notas de la fila de la Voz activa, deletreadas según la colección en curso (letra + alteración correcta, no solo números de grado), y resalta con color la que está sonando en ese instante. Debajo, una tira rítmica muestra la célula activa con el grupo en curso resaltado, y arriba un indicador grande muestra la nota, la lectura (P/R/I/RI) y la colección. No hay que leer texto ni memorizar índices: se lee igual que una partitura, actualizada en vivo. Para Armonía, el mismo pentagrama muestra el acorde 1-3-5-7 completo; para Pulso, un círculo grande pulsa en cada corchea.

## 6. Forma

| sección | tiempo | qué ocurre |
|---|---|---|
| A — Apertura | 0:00–2:30 | entradas escalonadas, talea larga, colección 0 |
| B — Nudo | 2:30–5:00 | colección sube a +1, talea corta, lecturas alternan más |
| C — Convergencia | 5:00–6:30 | todas las voces convergen a 4-3-4 (ritmo unísono, altura libre) |
| Coda | 6:30–7:00 | cada voz ancla su ciclo y se apaga a su ritmo |

`director.html`: reloj, sección activa, comandos de teclado (A/B/C/E) para cuar cambios.

## 7. Coordinación

**Sin red (caso por defecto):** Pulso da el tempo compartido (como en *In C*); el director cua los cambios de sección; los cambios de colección se reconocen de oído. Nadie cambia de célula a mitad de ciclo.

**Con red (opcional, no implementada):** extensión especificativa del protocolo `/oluc` — `/oluc/coleccion <k>` (lo envía Armonía) y `/oluc/seccion <nombre>` (lo envía el director), ambos por broadcast UDP puerto 9000, puramente informativos. Si se pierden, no pasa nada: la referencia sigue siendo el oído.

## 8. Sonido en sala

Estaciones en semicírculo con parlante propio (en fabricación); Pulso y Armonía al centro; Voces dispersas según su fila generadora. Especulativo, depende del modelo hemisférico final.

## 9. Riesgos

- Perder la colección de oído → Armonía modula solo en límites de sección, sostenida varios segundos.
- Desalinear el ciclo isorrítmico → índice siempre visible en pantalla.
- Convergencia (C) no cae junta → versión reducida: se extiende B y se salta a la Coda.

## 10. Notas técnicas

`motor.js` (filas, P/R/I/RI, colecciones, isorritmia, y `letraYAlteracion`/`posDiatonica` para deletrear notas y ubicarlas en el pentagrama) lo comparten `estacion.html` (Web Audio + partitura SVG en vivo) y `render.js` (Node, sintetiza el mismo motor a un WAV sin dependencias). Tempo de referencia: negra = 96 bpm.
