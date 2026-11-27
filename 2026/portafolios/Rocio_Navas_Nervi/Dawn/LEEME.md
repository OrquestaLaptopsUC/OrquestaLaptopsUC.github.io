# Dawn of Computer Music

*Dawn of Computer Music* (2023, Terry Feng, Soohyun Kim y Yikai Li) para la Orquesta de Laptops UC. Movimiento I: la fanfarria del amanecer de Strauss con instrumentos invisibles. Movimiento II: collage de música concreta. Todo está en `docm.html`: funciona sin internet y sin instalar nada.

## Arrancar el concierto en red

1. En la laptop de la directora: **doble clic en `Servidor Dawn`** (esta carpeta). Se abre sola la página en la estación «Director», y en el timer aparece la dirección para las demás, por ejemplo `192.168.0.10:8080`.
2. En cada laptop: escribir esa dirección en Chrome y elegir la estación. La página llega desde la laptop de la directora (no hace falta tener nada bajado) y ya está conectada: arriba dice **En red**.
3. La directora deja su timer en el punto de partida y aprieta **Empezar a todos**: cuenta de 5 segundos en todas las pantallas y todos los timers parten juntos. **Detener a todos** los pausa a la vez.

La app no tiene ventana ni ícono en el Dock. Se apaga con **Apagar servidor** en la página de la directora (pide un segundo clic). Un segundo doble clic mientras funciona solo vuelve a abrir la página. Solo la laptop que tiene el servidor da la partida, detiene o apaga.

Quien prefiera abrir su propio `docm.html` puede apretar **Conectar a la red** (arriba) y escribir la misma dirección; queda guardada para la próxima vez.

## La primera vez

- **macOS no la deja abrir** ("no se puede verificar el desarrollador"): Ajustes del Sistema › Privacidad y seguridad › **Abrir igualmente**. Pasa una sola vez; es porque la app no está firmada por Apple.
- **macOS dice que está dañada**: pasa cuando la carpeta se bajó comprimida desde el navegador. Una sola vez, en Terminal: `xattr -dr com.apple.quarantine ` y arrastrar la app a la ventana, Enter. Bajada con git (GitHub Desktop) no pasa.
- **Chrome pide permiso de Red local** (macOS 15 o más nuevo): aceptarlo. Si se rechazó, se activa en Ajustes del Sistema › Privacidad y seguridad › Red local.
- **macOS pregunta si la app acepta conexiones entrantes** (pasa si el firewall está activado): **Permitir**. Si se rechazó: Ajustes del Sistema › Red › Firewall › Opciones, y dejar `Servidor Dawn` en «Permitir conexiones entrantes».
- **Windows**: doble clic en `Servidor Dawn (Windows).exe`; si aparece "Windows protegió su PC": Más información › Ejecutar de todas formas. Cuando el Firewall de Windows pregunte, marcar **Redes privadas** y **Permitir acceso** (y en Configuración › Red, que la red del concierto esté como «Privada»). Se apaga cerrando su ventana.

Todas las laptops en el mismo router, sin aislamiento de clientes ("AP isolation", red de invitados). Una red privada propia (un router de la orquesta, aunque no tenga internet) es lo ideal; las redes wifi de la universidad suelen aislar a los equipos entre sí y ahí no se ven. No hace falta internet: la página no carga nada de afuera. Para comprobarlo antes del concierto, basta abrir la dirección en una laptop: si arriba dice **En red**, esa laptop llega a la directora. Conviene reservar en el router una IP fija para la laptop de la directora, así la dirección es siempre la misma. Si In C o Enjambres están usando el 8080, Dawn usa el siguiente puerto libre (8081…).

## Sin red

`docm.html` con doble clic funciona sola: cada intérprete aprieta **Enter** al gesto de la directora. En la estación «Director», **Escuchar todo el movimiento I** toca todas las partes para ensayar.

## Movimiento I

Diez estaciones: Trompeta I y II, **Percusión** (timbal en Q W E y el redoble en R, platillo en T), Órgano, Violín I y II, Viola, Violoncello, Contrabajo, y Director (sin sonido, con la partitura completa). ♩ = 55 hasta el segundo llamado; desde **F** (el tercer llamado, compás 13) un poco más lento, ♩ = 50, y cada vez más ancho desde el compás 17 hasta el clímax: cerca de 1:42. Una partitura editada y guardada antes de este cambio se pasa sola al tempo nuevo, y una que traía timbal y platillo separados se junta en Percusión.

## Movimiento II

Todas las laptops tienen todos los sonidos y la directora indica con gestos quién toca qué; «Ahora» y «Siguiente» dicen qué viene en cada momento (cinco intervalos y el final, 2:21). En pantalla se destaca lo que toca en cada momento y el resto se atenúa (sigue sonando si se toca): los sonidos de Windows quedan libres desde el intervalo 2, y desde el intervalo 3 ya no se atenúa nada que estuviera destacado: se suman los sonidos nuevos.

| Teclas | Sonido | Cómo responde |
|---|---|---|
| **Q W E R T** | Silbidos en Do5, Sol5, Do6, Sol6 y Do7 (el motivo Do · Sol · Do es Q, W, E) | Mientras se mantiene |
| **Y U I O P** | Cinco gotas | Un toque, una gota; mantenida, gotea |
| **A** | Base en Do | Un toque enciende, otro apaga |
| **S** | Trueno | Un toque, un trueno entero (estallido y estampido); mantenido, sigue retumbando; al soltar se difumina |
| **Tab** | Tormenta (el estruendo de antes), destacada desde el intervalo 3 | Mientras se mantiene; al soltar se difumina |
| **D** · **F** | Notas futuristas · campanas | Cada toque, una nota distinta |
| **G** | Agua corriendo | Un toque enciende, otro apaga |
| **H** · **J** | Salpicadura · cascabeles | Un toque, un golpe; mantenida, se repite |
| **K** | Walkie-talkie (el «shhh» de la radio) | Un toque lo deja sonar entero; mantenido, sigue |
| **L** | Walkie-talkie 2 (grabación) | Cada toque, el audio entero |
| **,** (coma) | Gibón (grabación, con los bordes suavizados) | Un toque, un llamado; mantenida, se repite |
| **1 … 0 -** y **Z … M** | Windows: inicio 1 a 11 en los números; apagado 1 a 7 en la fila de abajo | Cada toque, el sonido entero |
| **Flechas** | Variación: ↑ dos tonos arriba, → uno arriba, ↓ dos abajo, ← uno abajo | Mientras se mantiene, transpone todo lo que suena |
| **.** (punto) | El corte | Todo lo que suena se difumina (1,5 s; la base, el agua, el trueno y la tormenta, más lento); otro punto corta de golpe. También hay un botón «Corte» en pantalla |
| **Esc** | Detener todo | Corta todo de golpe, sin difuminar |

De dónde sale cada sonido: los silbidos son el Do5 de la grabación de la obra, limpio y copiado a cada nota; la base y la tormenta (el estruendo de antes) están recreadas a partir de lo extraído; el trueno, las notas futuristas, las campanas, el agua corriendo y el «shhh» se sintetizan al abrir la página, en segundo plano. Las gotas, la salpicadura y el sonajero de los cascabeles (grabaciones de Pixabay: freesound_community y Universfield), los 18 sonidos de Windows (de la compilación «Every Windows Startup & Shutdown Sound», en su orden, sin los repetidos ni los cuatro descartados), el segundo walkie-talkie y el gibón van dentro de la página como MP3, nivelados entre sí. Mientras se consiguen los sonidos de la obra oficial, cada uno de la fila del medio se puede cambiar por un audio propio con «Cambiar».

## Tus notas

Debajo de Ahora y Siguiente, cada vez que se aprieta (una nota o un acorde) es una ficha del mismo ancho, en orden, con su tecla, su nota y su dinámica; la raya de abajo es lo que dura y las muy cortas dicen CORTA. La actual va en negro y la siguiente con borde punteado, igual que las teclas. **Toda tu parte** la muestra entera, frase por frase; un clic en una frase lleva el timer (en pausa) a ella, para ensayarla.

## Qué pasa si algo se cae

| Situación | Qué pasa |
|---|---|
| Se cae una laptop o se recarga su página | Vuelve a conectarse sola y se suma en el punto donde va el ensamble. |
| Se cierra el servidor | Cada laptop sigue tocando con su propio timer; arriba dice «Servidor apagado» (o «Buscando a la directora…» si se cayó) y se reconecta sola si se vuelve a abrir, en el mismo punto que las demás. |
| La app no encuentra `docm.html` a su lado | Sirve la copia que lleva adentro y la página de la directora lo avisa. |

## Archivos

- `docm.html`: la obra completa (los dos movimientos, las instrucciones y el editor de tiempos).
- `Servidor Dawn.app` (macOS, Intel y Apple Silicon) y `Servidor Dawn (Windows).exe`: el servidor.
- `servidor/`: su código en Go, sin dependencias. `construir.sh` los regenera (solo hace falta si se modifica `main.go` o la página; en un Mac, además, la firma).

## Protocolo

HTTP en el puerto 8080: `GET /` la página · `GET /hora` reloj del servidor (cada laptop mide su diferencia, como NTP) · `GET /eventos` avisos (Server-Sent Events: `estado`, `empezar`, `detener`, `laptops`, `apagado`) · `POST /hola` estado de cada laptop · `POST /orden` `empezar` / `detener` / `apagar` (solo desde la laptop del servidor) · `GET /info` direcciones y si quien pregunta es la laptop del servidor. La partida es un instante del reloj del servidor unos segundos en el futuro; cada laptop lo convierte a su propio reloj, así todas parten juntas aunque el aviso llegue con retraso.
