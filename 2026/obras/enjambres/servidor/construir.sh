#!/bin/bash
# Reconstruye "Servidor Enjambres.app". Solo hace falta si se modifica main.go o
# las páginas (la app lleva una copia de respaldo de la obra, por si se saca de Web/).
# Requiere Go (go.dev) y las herramientas de línea de comandos de Xcode, en un Mac.
set -e
cd "$(dirname "$0")"
mkdir -p incorporado/obras/enjambres
cp ../index.html ../maestra.html ../proyeccion.html ../modelo.js ../protocolo.js ../simulador.js ../sonido.js ../vista.js ../ui.js ../editor.js ../partitura.js incorporado/obras/enjambres/
GOOS=darwin GOARCH=arm64 CGO_ENABLED=0 go build -trimpath -ldflags "-s -w" -o /tmp/srv-enj-arm64 .
GOOS=darwin GOARCH=amd64 CGO_ENABLED=0 go build -trimpath -ldflags "-s -w" -o /tmp/srv-enj-amd64 .
APP="../Servidor Enjambres.app"
mkdir -p "$APP/Contents/MacOS"
lipo -create -output "$APP/Contents/MacOS/servidor-enjambres" /tmp/srv-enj-arm64 /tmp/srv-enj-amd64
codesign --force --deep -s - "$APP"
echo "listo: $APP"
