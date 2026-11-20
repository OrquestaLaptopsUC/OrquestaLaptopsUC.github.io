#!/bin/bash
# Compila el servidor de la orquesta para Linux y macOS desde cualquier computador
# que tenga Go instalado (go.dev). No necesita internet ni dependencias externas.
#   Linux (Fedora):  sudo dnf install golang     Ubuntu/Debian: sudo apt install golang
#   macOS:           brew install go   (o el instalador de go.dev)
# Uso:  ./construir.sh
set -e
cd "$(dirname "$0")"
export CGO_ENABLED=0
GOOS=linux  GOARCH=amd64 go build -trimpath -ldflags "-s -w" -o servidor-linux      .
GOOS=darwin GOARCH=arm64 go build -trimpath -ldflags "-s -w" -o servidor-mac-arm64  .
GOOS=darwin GOARCH=amd64 go build -trimpath -ldflags "-s -w" -o servidor-mac-intel  .
chmod +x servidor-linux servidor-mac-arm64 servidor-mac-intel iniciar.command
echo "listo: servidor-linux · servidor-mac-arm64 (M1–M4) · servidor-mac-intel"
