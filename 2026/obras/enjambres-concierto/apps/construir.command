#!/bin/zsh
# Compila "Enjambres.app" (cada laptop) y "Enjambres Director.app" en esta carpeta. Doble clic.
# Necesita las herramientas de línea de comandos de Apple (xcode-select --install).
DIR=${0:A:h}
cd "$DIR" || exit 1
LOG="$DIR/construir.log"

compilar() {   # nombre de la app, ejecutable, Info.plist, fuentes…
  local NOMBRE=$1 EXE=$2 PLIST=$3; shift 3
  local APP="$DIR/$NOMBRE.app" TMP=$(mktemp -d /tmp/enjambres.XXXX) ok=1
  echo "==== $NOMBRE"
  for arq in arm64 x86_64; do
    echo "-- compilando $arq"
    xcrun swiftc -O -swift-version 5 -parse-as-library \
      -target $arq-apple-macos14.0 "$@" -o $TMP/$EXE-$arq || { ok=0; break }
  done
  if (( ok )); then lipo -create $TMP/$EXE-arm64 $TMP/$EXE-x86_64 -output $TMP/$EXE || ok=0; fi
  if (( ok )); then
    rm -rf "$APP"
    mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
    cp $TMP/$EXE "$APP/Contents/MacOS/$EXE"
    cp "fuente/$PLIST" "$APP/Contents/Info.plist"
    ICONO="$DIR/../../enjambres/Servidor Enjambres.app/Contents/Resources/icono.icns"
    [[ -f "$ICONO" ]] && cp "$ICONO" "$APP/Contents/Resources/icono.icns"
    codesign --force --sign - "$APP" && echo "LISTO: $APP"
    lipo -info "$APP/Contents/MacOS/$EXE"
  else
    echo "ERROR: no se compiló $NOMBRE (ver arriba)"
  fi
  rm -rf $TMP
}

{
  echo "== $(date '+%Y-%m-%d %H:%M:%S')  $(scutil --get ComputerName)  macOS $(sw_vers -productVersion)"
  if ! xcrun --find swiftc >/dev/null 2>&1; then
    echo "FALTAN las herramientas de línea de comandos de Apple. Se abre el instalador;"
    echo "cuando termine, vuelve a hacer doble clic en construir.command."
    xcode-select --install
    exit 1
  fi
  xcrun swiftc --version 2>&1 | head -2
  compilar "Enjambres" Enjambres Info-laptop.plist fuente/Comun.swift fuente/Laptop.swift
  compilar "Enjambres Director" EnjambresDirector Info-director.plist fuente/Comun.swift fuente/Director.swift fuente/Gametrak.swift
  echo "== fin"
} 2>&1 | tee "$LOG"

echo
echo "Puedes cerrar esta ventana."
