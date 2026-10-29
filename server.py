#!/usr/bin/env python3
"""
Serveur HTTP local et réseau pour l'application de révision M352
Accessible depuis localhost et depuis tous les appareils du réseau local (Wi-Fi / LAN).
"""

import sys
import socket
import os
import subprocess
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

DEFAULT_PORT = 8080

def get_local_ip_addresses():
    """Détecte les adresses IPv4 locales de la machine."""
    ips = set()
    
    # Méthode 1: socket UDP
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.5)
        # Ne transmet aucun paquet réel
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
        if ip and not ip.startswith('127.'):
            ips.add(ip)
        s.close()
    except Exception:
        pass

    # Méthode 2: hostname -I sous Linux
    try:
        out = subprocess.check_output(['hostname', '-I'], stderr=subprocess.DEVNULL).decode().strip()
        for ip in out.split():
            if ip and not ip.startswith('127.') and ':' not in ip:
                ips.add(ip)
    except Exception:
        pass

    # Méthode 3: socket gethostbyname
    try:
        host_name = socket.gethostname()
        for ip in socket.gethostbyname_ex(host_name)[2]:
            if ip and not ip.startswith('127.'):
                ips.add(ip)
    except Exception:
        pass

    return sorted(list(ips))

def find_available_port(start_port=DEFAULT_PORT):
    """Trouve un port libre à partir de start_port."""
    port = start_port
    while port < start_port + 50:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('0.0.0.0', port)) != 0:
                return port
        port += 1
    return start_port

def print_banner(port, ips):
    primary_ip = ips[0] if ips else "VOTRE_IP_LOCALE"
    network_url = f"http://{primary_ip}:{port}"
    local_url = f"http://localhost:{port}"

    print("\n" + "=" * 65)
    print("🛡️  APPLICATION DE RÉVISION M352 — ENSIASD (Prof. AGALIT)")
    print("    Sécurité de la Virtualisation et du Cloud Computing")
    print("=" * 65)
    print(f"\n✅ Serveur HTTP actif et accessible sur le RÉSEAU LOCAL :\n")
    print(f"  💻 Sur ce PC (Local) :")
    print(f"     👉  {local_url}\n")
    
    if ips:
        print(f"  📱 Depuis un Smartphone, Tablette ou autre PC (même Wi-Fi) :")
        for ip in ips:
            print(f"     👉  http://{ip}:{port}")
    else:
        print(f"  📱 Depuis un Smartphone / Tablette sur le même Wi-Fi :")
        print(f"     👉  {network_url}")
        print("     (Astuce : tapez 'ip a' ou 'hostname -I' pour voir votre IP locale)")

    # Affichage du QR code dans le terminal si qrcode est disponible
    try:
        import qrcode
        print("\n📷 Scannez ce QR Code avec votre téléphone pour ouvrir l'application :")
        qr = qrcode.QRCode(box_size=1, border=2)
        qr.add_data(network_url)
        qr.print_ascii(invert=True)
    except Exception:
        pass

    print("-" * 65)
    print("💡 RAPPEL CYBERSÉCURITÉ (TP1 / UFW) :")
    print(f"   Si votre téléphone ne peut pas charger la page, vérifiez que")
    print(f"   le pare-feu de votre PC autorise le port {port} :")
    print(f"   sudo ufw allow {port}/tcp")
    print("-" * 65)
    print("Appuyez sur [Ctrl + C] pour arrêter le serveur à tout moment.\n")

class CustomHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # En-têtes pour autoriser les requêtes cross-origin locales et le cache propre
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    port = find_available_port(DEFAULT_PORT)
    ips = get_local_ip_addresses()

    print_banner(port, ips)

    # Écoute sur 0.0.0.0 pour être joignable par tout le réseau local
    server_address = ('0.0.0.0', port)
    
    try:
        httpd = ThreadingHTTPServer(server_address, CustomHandler)
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Arrêt du serveur de révision M352. Bon courage pour vos examens !")
        sys.exit(0)

if __name__ == '__main__':
    main()

