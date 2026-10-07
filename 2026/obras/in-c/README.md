# In C · capa de conjunto

Reloj común, posición del conjunto, mapa de laptops y paleta de color para la app web de *In C* (Riley, 1964) de la Orquesta de Laptops UC.

La capa es **puramente informativa**: el audio corre en cada navegador y no depende del servidor. Si el servidor se cierra, la música no se detiene; las pantallas lo indican y se reconectan solas.

## Ensayar sola o solo

Sin servidor ni red, también abriendo `index.html` con doble clic (hacen falta `index.html`, `conjunto.js` y `ensayo.js` juntos en una carpeta). En la portada: **ensayar sola o solo**, con el número de intérpretes simulados (7 por defecto, hasta 20). Los demás y la maestra quedan simulados en esa laptop; la maestra te cede todo, así que reloj, guía, anulación manual y paleta se manejan desde el panel como en el concierto, y el mapa muestra a los simulados.

- **Iniciar el reloj** empieza la obra: entra el pulso y los demás van entrando de a poco en el patrón 1. **Detener** los calla (conservan su patrón); **continuar** los hace volver; **reiniciar** los devuelve al 1.
- Cada simulado tiene su timbre, su octava y su lugar en el estéreo, y sale por su propio compresor, así no te aplasta. Tocan en la misma grilla, al tempo de tu página; entrar a tiempo con ellos es parte del ensayo.
- Siguen las instrucciones de Riley: en orden y sin saltarse patrones, cada uno repite el suyo un rato (entre 25 y 55 s, o lo que dure el patrón en la guía si está encendida), no se alejan más de 2 patrones de la referencia (la anulación manual, si no la guía, si no la mediana de los demás, tú incluido), a veces descansan unos segundos, y en el 53 esperan al conjunto y salen de a uno; el pulso sale al final.
- En el panel: cuántos simulados (se puede cambiar en plena obra), **los demás tocan**, **uno de ellos toca el pulso** (si tú tomas el pulso con `P`, el simulado se calla), **volumen de los demás** y **salir del ensayo**.
- Para un ensayo corto conviene encender la guía con pocos segundos por patrón (mínimo 10).

## 1. Arrancar

En la laptop que hará de servidora (la maestra): **doble clic en `Servidor In C`**, en esta misma carpeta. No hay nada que instalar.

- Se abre sola la página de la obra en el navegador, con los controles de maestra y la dirección que usan las demás (por ejemplo `192.168.0.10:8080`).
- La app no tiene ventana ni ícono en el Dock: trabaja en segundo plano. Se apaga con el botón **apagar servidor** de esa página (pide un segundo clic).
- Un segundo doble clic mientras está funcionando no abre otra: si se cerró la página, basta abrir `localhost:8080` en el navegador.
- Si macOS la bloquea la primera vez ("no se puede verificar el desarrollador"): Ajustes del Sistema › Privacidad y seguridad › **Abrir igualmente**. Es porque la app no está firmada por Apple; pasa una sola vez.

## 2. Conectar las demás laptops

Todas en la misma red (el router del ensamble, Wi-Fi o cable). En el navegador de cada una se escribe la dirección que muestra la maestra, por ejemplo `192.168.0.10:8080`, y lleva directo a la obra. Cada intérprete escribe su nombre en el panel de la derecha (queda guardado en ese navegador).

- Las demás laptops **no necesitan tener nada bajado**: la página la entrega la servidora.
- En macOS 15 o más nuevo, Chrome pide permiso de **red local** la primera vez: hay que aceptarlo. Si se rechazó, se activa en Ajustes del Sistema › Privacidad y seguridad › Red local. Safari no lo pide.
- Si la página se abre de otra forma (archivo local de respaldo), la dirección se escribe en el campo **servidor** del panel.

En el router conviene: apagar el aislamiento de clientes ("AP isolation", red de invitados), y reservar una IP fija para la laptop servidora, así la dirección es siempre la misma.

## 3. La laptop servidora es la maestra

La página abierta en la laptop servidora muestra controles que las demás no tienen:

- **Reloj**: iniciar, detener, continuar, reiniciar. Queda en 00:00 hasta que se inicia. Reiniciar con el reloj corriendo pide un segundo clic.
- **Guía**: indica en qué patrón deberían estar todos, y avanza sola desde que se inicia el reloj. Dos modos: **cada N segundos** (45 por defecto; con 45 s la obra dura unos 40 minutos) o **según el largo de cada patrón**, donde se fija la duración total y el tiempo se reparte según la raíz cuadrada del largo de cada patrón (con 45 minutos, entre 18 s el más corto y 2:28 el 35). Se apaga con "apagada".
- **Anulación manual** de la posición: fija un número de patrón; todas las pantallas lo marcan como MANUAL hasta que se suelta.
- **Paleta de fondo**: sin color, seis predefinidas o una personalizada (dos colores). Cada laptop pinta la pantalla completa con el color de **su propio patrón**: el 1 es un extremo de la paleta y el 53 el otro, con un fundido de 4 s al cambiar. El texto y el pentagrama pasan solos a tinta clara u oscura. El color lo calcula cada navegador, así que sigue funcionando sin servidor (con la última paleta recibida).
- **Olvidar desconectadas**: limpia las filas de laptops que se fueron (si no, se borran solas a los 10 minutos).

Si la app se cierra y se vuelve a abrir a mitad de obra, reloj, guía, paleta y anulación se recuperan (válido por 3 horas).

## 4. Qué muestra el panel

- **Reloj de la obra**, igual en todas las laptops. Sin conexión sigue corriendo y lo indica ("reloj local").
- **Guía** (si la maestra la encendió): el patrón en que deberían estar, cuánto falta para el siguiente y a qué distancia estás tú. La calcula cada laptop con el reloj de la obra, así que sigue sin servidor.
- **Posición del conjunto**: la mediana de los patrones de las laptops conectadas. Con un número par de laptops es el promedio de los dos del medio (por ejemplo, 16½). Quien toca el pulso no entra en el cálculo.
- **Dispersión**: patrón máximo menos mínimo. En verde hasta 3 (la indicación de Riley de no alejarse más de 2 o 3 patrones), en rojo sobre eso. Debajo, si el grupo **se aprieta o se estira** comparado con 20 s atrás.
- **Laptops**: un mapa con un punto por laptop en su patrón (con la franja mín–máx, la posición del conjunto en línea punteada y la guía en línea verde) y una lista con nombre, patrón, estado (sonando, en silencio, pulso, sin conexión) y distancia a la posición del conjunto.

El botón con el reloj en la barra superior muestra u oculta el panel.

## 5. Robustez

| Situación | Qué pasa |
|---|---|
| Se cierra o se cae el servidor | Banda roja "SIN CONEXIÓN", datos atenuados con su antigüedad, reintento cada 5 s como máximo. El sonido no cambia. |
| Wi-Fi colgado o servidora dormida | 2,5 s sin datos bastan para darlo por caído. |
| Se recarga una página | Vuelve con la misma identidad; no aparece duplicada. (Recargar devuelve el instrumento al patrón 1: eso es de la app, no de esta capa.) |
| Dos pestañas en la misma laptop | La última toma el lugar; la otra lo avisa y ofrece reconectar. |
| El puerto 8080 está ocupado | La app usa el siguiente libre (8081, 8082…) y lo muestra en la página de la maestra. |

Verificado el 11-sep-2026 en Chromium: matando el servidor en plena ejecución, el nivel de audio, las notas por segundo y el reloj de audio de cada página siguieron idénticos.

## 6. Protocolo

WebSocket en `ws://<servidor>:8080/conjunto`, mensajes de texto JSON con un campo `t`.

Navegador → servidor:

| `t` | campos | cuándo |
|---|---|---|
| `hola` | `id`, `nombre`, `patron`, `sonando`, `pulso` | al conectar o reconectar |
| `estado` | `patron`, `sonando`, `pulso` | solo cuando algo cambia |
| `nombre` | `nombre` | al editar el nombre |
| `reloj` | `accion`: `iniciar` \| `detener` \| `reiniciar` | solo laptop servidora |
| `manual` | `patron`: 1–53 o `null` (soltar) | solo laptop servidora |
| `paleta` | `paleta`: `{nombre, colores:["#rrggbb", …]}` o `null` | solo laptop servidora |
| `guia` | `guia`: `{modo: apagada \| fija \| largo, segundos, minutos}` | solo laptop servidora |
| `olvidar` | | solo laptop servidora |
| `apagar` | | solo laptop servidora |

Servidor → navegador:

| `t` | campos | cuándo |
|---|---|---|
| `bienvenida` | `version`, `control`; en la servidora además `direcciones` | tras `hola` |
| `reloj` | `estado`: `espera` \| `corriendo` \| `detenido`, `ms` transcurridos | tras `hola` y al cambiar |
| `paleta` | `paleta` | tras `hola` y al cambiar |
| `guia` | `guia` | tras `hola` y al cambiar |
| `tabla` | `manual`, `interpretes`: `[{id, nombre, patron, sonando, pulso, conectado}]` | 4 veces por segundo |
| `reemplazado` | | otra conexión tomó la misma identidad |

El reloj viaja como **tiempo transcurrido** y no como hora de inicio, porque los relojes de las laptops no están sincronizados entre sí (sin internet no hay NTP). Cada navegador suma su propio tiempo local desde que recibió el mensaje.

La laptop servidora se reconoce por la dirección de origen de la conexión (la propia máquina); los mensajes de control de cualquier otra se ignoran.

## Archivos

- `Servidor In C.app`: el servidor. Sirve la carpeta `2026/` completa; si la app se saca de esa carpeta, sirve una copia de In C que lleva adentro.
- `conjunto.js`: el panel. Solo **lee** `iPat`, `sonando` y `pulso` del script principal; no toca el audio ni la selección de patrones.
- `ensayo.js`: el ensayo individual (intérpretes y maestra simulados). Toca con el motor de sonido de la página, por una salida aparte; en el concierto no hace nada.
- `index.html`: las únicas modificaciones son las líneas `<script src="conjunto.js">` y `<script src="ensayo.js">` al final. Sin esos archivos o sin servidor, la obra funciona igual que antes.
- `servidor/`: el código fuente de la app (Go, sin dependencias) y `construir.sh` para regenerarla. No hace falta para usarla.
