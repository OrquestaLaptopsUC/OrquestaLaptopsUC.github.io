# Genesis v3 · Orquesta de Laptops UC (Felipe Osorio)

Versión de concierto de Genesis, independiente de las versiones 1 y 2 (que siguen en `../Cover_Genesis`).

- `index.html`: la versión 3 en el navegador (doble clic: funciona sin internet gracias a `embebidos/`).
- `luces.html`: ventana de luces para el proyector (la abre el Ambiente con 🖥️ o la tecla L).
- `descargas/`: la app de escritorio para Mac (Apple Silicon e Intel) y Windows, y su página de descarga.
  Los .zip pesan más de 100 MB, así que no se suben a GitHub (`.gitignore`): quedan en esta carpeta para copiarla
  con pendrive, y en línea se bajan del release v3.0.0 de https://github.com/eepyysspp/Cover_Genesis/releases
- `app/`: el código de la app (Electron). Para rearmarla: `cd app && npm install && node construir.js`.
- `servidor.py`: cronómetro en red desde el navegador (`python servidor.py`), si no se usa la app.
- Código completo y versiones anteriores: https://github.com/eepyysspp/Cover_Genesis
