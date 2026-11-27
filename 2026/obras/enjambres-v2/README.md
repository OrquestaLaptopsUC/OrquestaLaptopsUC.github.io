# Enjambres 2

Versión 2 de Enjambres para la Orquesta de Laptops UC. La versión 1 sigue intacta en `../enjambres/`; esta carpeta no comparte ningún archivo con ella.

Con los valores por defecto (forma 0, imán 0, voz seno, afinación libre) la dinámica y el sonido son los de la versión 1. Lo nuevo se agrega encima.

## Arrancar

Usa el mismo **Servidor Enjambres** de la versión 1 (`../enjambres/Servidor Enjambres.app`): sirve toda la carpeta `2026/` y su central WebSocket no depende de la versión.

1. En la laptop maestra: doble clic en `Servidor Enjambres`. Se abre la maestra de la versión 1; cambia la dirección a `http://localhost:8080/obras/enjambres-v2/maestra.html`.
2. En cada laptop: `<dirección>/obras/enjambres-v2/` (por ejemplo `192.168.0.100:8080/obras/enjambres-v2/`), elegir número, **tocar en el concierto**.
3. Proyección: botón **proyección** en la maestra, o `<dirección>/obras/enjambres-v2/proyeccion.html` en otro computador.

Las dos versiones no se mezclan: los cuadros llevan número de versión (3 aquí, 2 en la versión 1) y cada página descarta los de la otra. Si una laptop abre la versión 2 mientras la maestra toca la 1, se lo dice arriba. El respaldo del enjambre tampoco se cruza.

Sin servidor: `maestra.html` con doble clic corre sola con laptops simuladas; `index.html` con doble clic permite **ensayar sola o solo**.

## Qué cambia para quien toca

**El escenario es un control 2D.** Arrastrar dentro del semicírculo mueve el **imán** del propio sub-enjambre: los agentes van hacia ese punto, y por lo tanto suenan en las laptops que quedan cerca. La rueda del mouse (o el deslizador IMÁN) cambia la fuerza; a la izquierda de cero el imán repele. Doble clic lo suelta. Clic sobre un agente propio lo mutea.

**Seis pads**, tres de comportamiento y tres de sonido:

| Pad | Eje x | Eje y |
|---|---|---|
| MOVIMIENTO | ruido η₁ (orden → caos) | velocidad v₀ |
| FORMA | radio R de vecindad | se separan (−) · se juntan (+) |
| SINCRONÍA | β₁ (qué tan rápido convergen las ω) | β₂ (peso de la ω propia de cada agente) |
| REGISTRO | centro del rango de frecuencias | ancho del rango |
| TIMBRE | color (depende de la voz) | nivel |
| PULSO | pulsos por segundo | acoplamiento de fase (cada uno → en fase) |

**Voz** (cómo suena cada agente) y **mapeo** (qué del enjambre controla su frecuencia: los tres del artículo).

En la maestra, cada pad, la voz, el mapeo y el imán se retienen o se ceden por separado, como en la versión 1. Con el imán retenido, arrastrar en el escenario de la maestra mueve el imán de todos; cedido, mueve el de la laptop elegida.

## Métodos de síntesis nuevos

El artículo define tres maneras de sacar una frecuencia ω y una amplitud A de cada agente (directo, osciladores acoplados, fricción). Eso no cambia. Lo que cambia es qué se hace con ω y A:

| Voz | Qué hace | Qué se escucha del enjambre |
|---|---|---|
| seno | un seno por agente | versión 1 |
| ring | portadora × moduladora (ω de otro mapeo); color = profundidad | versión 1, ahora como voz |
| FM | la moduladora modula la frecuencia; índice = color · (0,5 + 10 · tensión) | bandada ordenada: casi senos; turbulencia: espectro ancho |
| resonador | ruido blanco por un pasabanda en ω; Q = 1,5 + 80 · color · (1 − tensión)² | agentes alineados silban afinados; en desorden, soplan |
| pulsos | un grano de seno cada vez que la fase del agente completa un ciclo; color = largo | las fases se acoplan entre vecinos (Kuramoto): de lluvia de granos a pulso común |

"Tensión" es la ω de fricción del artículo (ec. 7.7), usada aquí como medida de desorden local aunque el mapeo elegido sea otro.

**Fase.** Cada agente lleva una fase θ que avanza a `pulso · 2^(2·ω_CO − 1)` Hz (la ω de osciladores acoplados la mueve ± 1 octava) y se acopla a la de sus vecinos dentro de R: θ̇ = f · (1 + k · ⟨sin 2π(θⱼ − θᵢ)⟩). Al completar un ciclo dispara: suena un grano y se ve un destello.

**Afinación** (en avanzado): libre, serie armónica de f mín, cromática, pentatónica sobre f mín. Lleva la frecuencia de la portadora a la nota más cercana; con el pad REGISTRO retenido, la maestra fija la fundamental de todos.

## Dinámica nueva

El rumbo de cada agente es el ángulo de: alineación de Vicsek + ruido de Chaté + **forma** + **imán**. Con forma > 0 se suma un vector hacia el centro de los vecinos dentro de R; con forma < 0, uno que se aleja de ellos, más fuerte de cerca. El imán suma un vector hacia su punto (o en contra). Con ambos en cero queda el modelo de la versión 1.

## Lo que se ve

Cada agente es un punto de luz con estela, más grande cuanto más fuerte suena. Un hilo une a los agentes que están dentro del radio de alineación. Cada pulso deja un anillo. Las laptops del arco se encienden según lo que están haciendo sonar. La proyección usa el mismo dibujo, sin texto (`F` pantalla completa, `L` laptops, `A` escenario, `E` estelas, `M` malla, `I` imanes).

## Partitura

El editor es el de la versión 1. **Guardar** no se usa aquí, porque el servidor escribe siempre la `partitura.js` de la versión 1: usa **exportar** e **importar**. Para que las laptops ensayen con una partitura, reemplaza a mano `partitura.js` de esta carpeta.

## Archivos

`index.html` (laptops), `maestra.html`, `proyeccion.html`, `estilo.css`, `modelo.js` (dinámica), `simulador.js` (Worker, red, intérpretes simulados), `protocolo.js` (cuadro binario, versión 3), `sonido.js` (voces y DBAP), `vista.js` (escenario), `ui.js` (pads), `editor.js` (partitura, sin cambios), `partitura.js`.

El parámetro `ring` de la versión 1 pasa a ser la voz ring, con su profundidad en el color; los demás parámetros conservan nombre y rango.
