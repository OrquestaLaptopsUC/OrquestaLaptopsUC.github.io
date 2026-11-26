# Cream Lab - decisiones de desarrollo

**Borrador en primera persona, preparado con apoyo de IA a partir de mis indicaciones en esta conversación.** Debo revisarlo, corregirlo y asumirlo como autor antes de la entrega. No sustituye el registro personal de escucha de un ensayo que pide la pauta.

## De PULSO 128 a Cream Lab

En T1 propuse PULSO 128, una obra de house a 128 BPM para siete computadores que repartían batería, bajo, acordes y efectos. Con el avance del proyecto me di cuenta de que lo que realmente quería tocar era otra cosa: elegir y combinar sonidos preparados desde una interfaz tipo Launchpad, y transformar el resultado con una mezcladora que pudiera controlar con las manos. Los sonidos que habíamos generado antes no me gustaban; quería trabajar con loops de guitarra, saxofón, bajo, melodías, batería y sonidos de reloj. Por eso pasé a Cream Lab, que usa una biblioteca incluida y funciona a 124 BPM.

También cambié el formato de presentación. El profesor autorizó, según lo conversado, una versión solista. Quiero tocarla como una improvisación: no deseo fijar una secuencia de pads ni un límite de tiempo. El primer pad abre la interpretación y yo decido cuándo quitar capas o pulsar «Detener todo». Sé que esta duración abierta difiere de la forma cerrada exigida en la pauta general; conviene confirmar que la autorización solista cubre también este punto.

## Decisiones sobre la interacción y el sonido

El prototipo inicial limitaba qué pads podían sonar al mismo tiempo. Esa regla me impedía explorar combinaciones, así que decidí permitir cualquier superposición. Todos los pads se repiten al compás hasta que los desactivo. Como tocar varias melodías o bajos juntos puede saturar la mezcla, la solución interpretativa es escuchar, retirar capas y bajar la salida o los efectos cuando sea necesario; no imponer un bloqueo automático.

Probé un joystick, un encoder y un sensor de distancia, pero sus efectos no eran claros para mí o no encontraba cómo integrarlos musicalmente. Preferí una interfaz física de perillas, faders y dos encoders pulsables: las perillas modifican parámetros, los faders dosifican los efectos y los encoders eligen o hacen bypass. El panel físico todavía no está construido ni su firmware verificado. En la página dejé exactamente esos controles accesibles con mouse para poder tocar incluso sin hardware.

Me interesan transformaciones más evidentes que un simple ajuste de volumen o filtro. La web reúne diez tipos de procesamiento, entre ellos rectificación, suboctava, PLL, modulación en anillo, bitcrusher, reducción de muestreo, wavefolder, desplazamiento aproximado de frecuencias, filtro resonante saturado y saturación de cinta simulada. Dos cadenas A y B permiten escogerlos y mezclar la señal procesada. El osciloscopio muestra la onda antes y después del procesamiento local. Esta configuración es experimental: no afirmo que el controlador físico ni todos los efectos hayan sido probados en concierto.

## Riesgos que permanecen

Cream Lab se puede copiar como carpeta y ejecutar localmente, sin cargar fuentes o bibliotecas desde internet. Sin embargo, aún no he documentado una prueba completa en una laptop OLUC con el sistema de parlantes real ni un balance de referencia medido. Tampoco he confirmado por escrito el permiso de redistribución pública de todos los samples originales. Si la ESP32 no está disponible, puedo usar los controles en pantalla; si el navegador falla, debo reiniciar desde silencio. La grabación de una interpretación y las observaciones con marcas de tiempo **no están incluidas** en esta versión.

## Registro de una ejecución real - pendiente

Cuando toque y grabe una versión, aquí debo anotar fecha, duración real, equipo utilizado y momentos concretos de la grabación. Para cada momento describiré qué escuché, qué decisión tomé y por qué. No corresponde inventar observaciones ni marcas de tiempo antes de esa ejecución.
