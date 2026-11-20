#!/bin/bash
# Arranca el servidor de la orquesta eligiendo el ejecutable correcto.
# macOS: doble clic en este archivo.   Linux: ./iniciar.command en una terminal.
cd "$(dirname "$0")"
case "$(uname -s)-$(uname -m)" in
  Darwin-arm64)  BIN=./servidor-mac-arm64 ;;
  Darwin-*)      BIN=./servidor-mac-intel ;;
  Linux-x86_64)  BIN=./servidor-linux ;;
  *) echo "Sistema no previsto: $(uname -s) $(uname -m). Compila con ./construir.sh"; exit 1 ;;
esac
if [ "$(uname -s)" = "Darwin" ]; then xattr -cr . 2>/dev/null; fi   # quita la cuarentena de macOS
chmod +x "$BIN" 2>/dev/null
exec "$BIN" "$@"
