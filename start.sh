#!/usr/bin/env bash
# Script de lancement accessible en LOCAL et sur le RÉSEAU LOCAL (Wi-Fi / LAN)
# Module M352 – Sécurité de la virtualisation et du Cloud Computing (ENSIASD)

PORT=8080
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if command -v python3 &>/dev/null; then
    # Lancement via notre script serveur dédié avec détection d'IP et QR Code terminal
    python3 "$SCRIPT_DIR/server.py"
elif command -v python &>/dev/null; then
    echo "=========================================================="
    echo "🛡️  Application de Révision M352 – ENSIASD (Prof. AGALIT)"
    echo "    Accessible sur localhost et sur votre réseau local"
    echo "=========================================================="
    echo "🚀 Démarrage du serveur sur 0.0.0.0:$PORT ..."
    python -m SimpleHTTPServer $PORT
elif command -v npx &>/dev/null; then
    echo "=========================================================="
    echo "🛡️  Application de Révision M352 – ENSIASD (Prof. AGALIT)"
    echo "    Accessible sur localhost et sur votre réseau local"
    echo "=========================================================="
    echo "🚀 Démarrage du serveur npx serve sur 0.0.0.0:$PORT ..."
    npx serve -l $PORT -s .
else
    echo "ℹ️ Aucun runtime serveur détecté. Ouverture directe du fichier index.html..."
    xdg-open index.html 2>/dev/null || open index.html 2>/dev/null || true
fi
