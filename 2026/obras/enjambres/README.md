# Enjambres

Obra en red para la Orquesta de Laptops UC, a partir de Huepe, Colasso y Cádiz (2014), "Generating Music from Flocking Dynamics", y del método `updateVicsekChate` de `Swarms.java`.

## Arrancar

1. En la laptop maestra: **doble clic en `Servidor Enjambres`** (esta carpeta). Se abre sola la página de la maestra; arriba dice la dirección que usan las demás, por ejemplo `192.168.0.10:8080`.
2. En cada laptop: abrir esa dirección en Chrome, elegir su número y apretar **tocar en el concierto**.
3. Cada laptop agrega y quita sus agentes con **+ / −** (botones grandes o teclas `+` y `−`). La obra parte sin agentes.

La app no tiene ventana ni ícono en el Dock. Se apaga con **apagar servidor** en la maestra (pide un segundo clic). Si macOS la bloquea la primera vez: Ajustes del Sistema › Privacidad y seguridad › Abrir igualmente.

Todas las laptops en el mismo router, sin aislamiento de clientes. En macOS 15 o más nuevo, Chrome pide permiso de **Red local** la primera vez: hay que aceptarlo. Si In C está corriendo en el 8080, Enjambres usa el 8081.

`maestra.html` abierta con doble clic (sin servidor) funciona sola con laptops simuladas, para probar; con "las simuladas tocan solas" agregan, quitan y mutean agentes por su cuenta.

## Ensayar

En la página de laptop (`index.html`, también con doble clic, sin red): elegir el número y apretar **ensayar sola o solo**. La simulación corre en esa laptop, la maestra está simulada y cede todo, y los demás intérpretes (7 por defecto) tocan solos. Se puede escuchar toda la sala o solo lo que sonaría en la propia laptop, y correr la partitura con ▶.

## Controles

Cada pad mueve dos parámetros: **MOVIMIENTO** (ruido × velocidad), **COHESIÓN** (radio × β₁), **REGISTRO** (centro × ancho, es decir f mín y f máx), **TIMBRE** (ring × nivel). En la maestra, el botón de cada pad lo retiene o lo cede; cedido, los valores de cada laptop aparecen como puntos de su color. Lo demás, parámetro por parámetro, está en **avanzado**.

## Proyección

Botón **proyección** en la maestra: abre el enjambre en una ventana aparte (clic o `F`: pantalla completa; `L` laptops, `A` arco, `E` largo de las estelas). En otro computador conectado a la red: `<dirección>/obras/enjambres/proyeccion.html`.

## Partitura

Abajo en la maestra. Solo mensajes: un carril **todos** y uno por laptop. Arrastra **+ mensaje** a un carril (o doble clic en un hueco), arrastra un mensaje para moverlo, su borde derecho para alargarlo; Supr lo borra. ▶ corre el reloj de la partitura; clic en la regla lo mueve. Cada laptop ve en grande los mensajes para ella y para todos, con cuenta regresiva del siguiente. **guardar** la escribe como `partitura.js` en esta carpeta (la usan las laptops para ensayar); **exportar** e **importar** la pasan como archivo `.json`.

## Qué pasa si algo se cae

| Situación | Qué pasa |
|---|---|
| Se cae una laptop | Queda en el arco como desconectada (círculo punteado); sus agentes siguen volando y suenan en las demás. Al volver con el mismo número recupera todo. |
| Se recarga la página de la maestra | El servidor le devuelve el enjambre (respaldo cada 2 s, válido 3 horas). Las laptops callan mientras tanto. |
| Se cierra el servidor | Las laptops muestran SIN CONEXIÓN, callan y reintentan solas. |
| Dos laptops piden el mismo número | La segunda recibe "ese número ya lo tiene otra laptop". |

## Archivos

- `maestra.html`, `index.html` (laptops), `proyeccion.html`: las páginas.
- `partitura.js`: la partitura guardada (la escribe el servidor).
- `ui.js`: pads 2D y lectura de la partitura · `editor.js`: el editor de la partitura.
- `modelo.js`: la simulación (Vicsek y Chaté, osciladores acoplados, fricción), recinto semicircular.
- `simulador.js`: corre el modelo en un Worker (no se frena en segundo plano), los intérpretes simulados, la partitura y su reloj; en la maestra además habla con el servidor.
- `protocolo.js`: el cuadro binario que se difunde 30 veces por segundo (formato al comienzo del archivo).
- `sonido.js`: un seno por agente, ring, DBAP sobre los canales de salida de cada laptop.
- `vista.js`: el dibujo del semicírculo y el espectrograma.
- `Servidor Enjambres.app` y `servidor/` (fuente Go, sin dependencias; `construir.sh` la regenera en un Mac).

## Protocolo (WebSocket `ws://<servidor>/enjambres`)

| De → a | Mensaje |
|---|---|
| maestra → servidor | `{t:"hola", rol:"maestra"}` · cuadros binarios · `{t:"config", …}` · `{t:"partitura", partitura}` · `{t:"reloj", estado, ms}` · `{t:"respaldo", estado}` · `{t:"guardarPartitura", partitura}` · `{t:"apagar"}` |
| servidor → maestra | `{t:"bienvenida", direcciones, respaldo, laptops}` · `{t:"entra", num, id, salidas}` · `{t:"sale", num}` · `{t:"cmd", num, accion, …}` · `{t:"guardada", ok, ruta}` · `{t:"rechazado"}` |
| laptop → servidor | `{t:"hola", rol:"laptop", id, num, salidas}` · `{t:"cmd", accion: crear \| quitar \| mutear(id) \| mutearTodos(si) \| param(k, v) \| salidas(n)}` |
| servidor → laptop | `{t:"bienvenida", num, maestra}` · cuadros binarios · `{t:"config", …}` · `{t:"partitura", …}` · `{t:"reloj", …}` · `{t:"maestra", si}` · `{t:"ocupado", num}` · `{t:"reemplazado"}` |
| proyección ⇄ servidor | `{t:"hola", rol:"vista"}` → recibe lo mismo que una laptop, no manda nada |

El servidor pone el número en cada `cmd`: una laptop solo puede tocar sus agentes y sus parámetros. Solo la laptop que corre el servidor puede ser la maestra. `GET /enjambres/info` devuelve las direcciones y los números ocupados. El reloj de la partitura viaja como milisegundos transcurridos (sin internet no hay NTP); a quien llega tarde, el servidor le suma lo que pasó.
