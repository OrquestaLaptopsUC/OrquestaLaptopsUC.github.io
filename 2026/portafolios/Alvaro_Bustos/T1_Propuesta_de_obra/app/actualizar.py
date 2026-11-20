"""Trae la última versión del código de Keyboard Instruments desde el repositorio personal
(github.com/Ikilly0/ORQUESTRA-DE-LAPTOPS) y reemplaza keyboard-instruments.zip en esta carpeta.
Uso:  python actualizar.py      (solo librería estándar; necesita internet)"""
import io, pathlib, urllib.request, zipfile

URL = "https://github.com/Ikilly0/ORQUESTRA-DE-LAPTOPS/archive/refs/heads/main.zip"
AQUI = pathlib.Path(__file__).resolve().parent
# Se salta la carpeta de la T1 (no es parte de la app). Los .wav del repositorio sí van: son los sonidos
# de la app (notas y gabinete de la guitarra, secciones de batería de The World Looks Red).
SALTAR = ("T1-propuesta-de-obra/",)

data = urllib.request.urlopen(URL, timeout=60).read()
src = zipfile.ZipFile(io.BytesIO(data))
destino = AQUI / "keyboard-instruments.zip"
tmp = destino.with_suffix(".tmp")
n = 0
with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as out:
    for it in src.infolist():
        rel = it.filename.split("/", 1)[1] if "/" in it.filename else ""
        if not rel or it.is_dir() or rel.startswith(SALTAR):
            continue
        out.writestr("keyboard-instruments/" + rel, src.read(it))
        n += 1
tmp.replace(destino)
print(f"Listo: {n} archivos en {destino.name}")
