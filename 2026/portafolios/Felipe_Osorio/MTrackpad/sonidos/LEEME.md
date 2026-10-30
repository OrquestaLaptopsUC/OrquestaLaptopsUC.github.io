# sonidos/

Muestras que MTrackpad carga solo al abrirse (cuando la página se sirve desde un sitio web o un servidor local).

1. Copia aquí tus archivos de audio (wav, mp3, ogg).
2. Copia `muestras.ejemplo.json` como `muestras.json` y escribe en él qué archivo va en cada ranura (`"1"` a `"4"`), su modo (`loop`, `granular` o `disparo`) y su nota base (MIDI: 48 = Do3, 60 = Do4).

Los archivos de audio de esta carpeta están en `.gitignore`, así que no se suben al repositorio. Si quieres publicar una muestra propia, quita su extensión del `.gitignore`.
Al abrir `index.html` con doble clic (sin servidor) el navegador no deja leer esta carpeta: carga las muestras desde la pestaña *Muestras*.
