#!/bin/bash
# Reconstruye "Servidor Dawn.app" (y el .exe de Windows). Solo hace falta si se modifica
# main.go o docm.html (la app lleva una copia de respaldo de la página, por si se saca
# de su carpeta). Requiere Go (go.dev); en un Mac, además, las herramientas de línea de
# comandos de Xcode para unir las dos versiones (lipo) y firmarla (codesign).
set -e
cd "$(dirname "$0")"
mkdir -p incorporado
cp ../docm.html incorporado/dom001.html
export CGO_ENABLED=0
GOOS=darwin GOARCH=arm64 go build -trimpath -ldflags "-s -w" -o /tmp/srv-dawn-arm64 .
GOOS=darwin GOARCH=amd64 go build -trimpath -ldflags "-s -w" -o /tmp/srv-dawn-amd64 .
GOOS=windows GOARCH=amd64 go build -trimpath -ldflags "-s -w" -o "../Servidor Dawn (Windows).exe" .
APP="../Servidor Dawn.app"
mkdir -p "$APP/Contents/MacOS"
if command -v lipo >/dev/null; then
  lipo -create -output "$APP/Contents/MacOS/servidor-dawn" /tmp/srv-dawn-arm64 /tmp/srv-dawn-amd64
  codesign --force --deep -s - "$APP"
else
  echo "(sin lipo: queda solo la versión para Apple Silicon)"
  cp /tmp/srv-dawn-arm64 "$APP/Contents/MacOS/servidor-dawn"
fi
chmod 755 "$APP/Contents/MacOS/servidor-dawn"
echo "listo: $APP"
