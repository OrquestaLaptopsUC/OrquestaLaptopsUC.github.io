#!/bin/bash
# Reconstruye "Servidor In C.app". Solo hace falta si se modifica main.go,
# index.html, conjunto.js o ensayo.js (la app lleva una copia de respaldo).
# Requiere Go (go.dev) y las herramientas de línea de comandos de Xcode, en un Mac.
set -e
cd "$(dirname "$0")"
mkdir -p incorporado/obras/in-c
cp ../index.html ../conjunto.js ../ensayo.js incorporado/obras/in-c/
GOOS=darwin GOARCH=arm64 CGO_ENABLED=0 go build -trimpath -ldflags "-s -w" -o /tmp/srv-arm64 .
GOOS=darwin GOARCH=amd64 CGO_ENABLED=0 go build -trimpath -ldflags "-s -w" -o /tmp/srv-amd64 .
APP="../Servidor In C.app"
mkdir -p "$APP/Contents/MacOS"
lipo -create -output "$APP/Contents/MacOS/servidor-in-c" /tmp/srv-arm64 /tmp/srv-amd64
codesign --force --deep -s - "$APP"
echo "listo: $APP"
