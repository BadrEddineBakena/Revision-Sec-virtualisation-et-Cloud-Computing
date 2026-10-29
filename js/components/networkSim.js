// Simulateur Interactif des Modes Réseau VirtualBox (TP1 & CH3)
window.NetworkSimulator = (function () {
  let currentMode = 'NAT'; // 'NAT', 'INTERNAL', 'HOSTONLY', 'BRIDGED'
  let testResults = {};

  const modesData = {
    NAT: {
      name: "Mode NAT (Network Address Translation)",
      desc: "La VM utilise le moteur de traduction d'adresses de l'hôte pour sortir sur Internet. Elle est protégée des connexions entrantes.",
      vmToInternet: true,
      vmToVm: false,
      hostToVm: false,
      lanToVm: false,
      ipExample: "10.0.2.15/24 (Passerelle 10.0.2.2)",
      securityVerdict: "🟢 SÉCURISÉ POUR LABO : La VM accède à Internet pour ses mises à jour sans être exposée aux scanners de ports du réseau physique.",
      examTip: "En mode NAT classique, deux VM sur le même hôte ne peuvent pas se pinguer directement sans créer un réseau NAT dédié."
    },
    INTERNAL: {
      name: "Mode Réseau Interne (ex: M352-INT)",
      desc: "Commutateur virtuel hermétique reliant exclusivement les VM raccordées au même identifiant de réseau.",
      vmToInternet: false,
      vmToVm: true,
      hostToVm: false,
      lanToVm: false,
      ipExample: "10.10.10.11/24 & 10.10.10.12/24",
      securityVerdict: "🛡 ISOLATION ABSOLUE : Zéro fuite vers l'extérieur. Idéal pour confiner une base de données ou un serveur d'authentification.",
      examTip: "L'ordinateur physique hôte n'a aucune interface connectée : vous ne pouvez pas administrer la VM en SSH depuis l'hôte dans ce mode !"
    },
    HOSTONLY: {
      name: "Mode Réseau Privé Hôte (Host-only)",
      desc: "Crée une carte réseau virtuelle sur l'hôte physique (vboxnet0) pour communiquer en direct avec la VM.",
      vmToInternet: false,
      vmToVm: true,
      hostToVm: true,
      lanToVm: false,
      ipExample: "192.168.56.1 (Hôte) <-> 192.168.56.10 (VM)",
      securityVerdict: "🔒 EXCELLENT COMPROMIS : Permet l'administration SSH depuis votre PC hôte sans exposer la VM au Wi-Fi public de l'école.",
      examTip: "Ce mode est la solution officielle du cours pour administrer les VM en toute sécurité lors des travaux pratiques."
    },
    BRIDGED: {
      name: "Mode Accès par Pont (Bridged)",
      desc: "La VM s'injecte directement sur la carte réseau physique de l'hôte et devient un membre à part entière du LAN physique.",
      vmToInternet: true,
      vmToVm: true,
      hostToVm: true,
      lanToVm: true,
      ipExample: "192.168.1.45/24 (Fournie par la box ou le routeur de l'école)",
      securityVerdict: "⚠️ HAUT RISQUE D'EXPOSITION : La VM est directement vulnérable à toutes les attaques et scans du réseau local réel !",
      examTip: "Ne jamais utiliser en laboratoire sans pare-feu rigoureusement configuré au préalable."
    }
  };

  function init(containerId) {
    currentMode = 'NAT';
    render(containerId);
  }

  function setMode(mode, containerId) {
    currentMode = mode;
    render(containerId);
  }

  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const m = modesData[currentMode];

    container.innerHTML = `
      <div class="net-sim-card">
        <div class="net-sim-toolbar">
          <label><strong>Sélectionnez le mode réseau VirtualBox :</strong></label>
          <div class="btn-group">
            <button class="btn ${currentMode === 'NAT' ? 'btn-primary' : 'btn-outline'}" onclick="NetworkSimulator.setMode('NAT', '${containerId}')">🌐 Mode NAT</button>
            <button class="btn ${currentMode === 'INTERNAL' ? 'btn-primary' : 'btn-outline'}" onclick="NetworkSimulator.setMode('INTERNAL', '${containerId}')">🔒 Réseau Interne (M352-INT)</button>
            <button class="btn ${currentMode === 'HOSTONLY' ? 'btn-primary' : 'btn-outline'}" onclick="NetworkSimulator.setMode('HOSTONLY', '${containerId}')">💻 Réseau Privé Hôte (Host-only)</button>
            <button class="btn ${currentMode === 'BRIDGED' ? 'btn-primary' : 'btn-outline'}" onclick="NetworkSimulator.setMode('BRIDGED', '${containerId}')">⚠️ Accès par Pont (Bridged)</button>
          </div>
        </div>

        <div class="net-sim-display">
          <div class="net-sim-diagram-svg">
            ${generateSVG(currentMode)}
          </div>

          <div class="net-sim-info-panel">
            <h3>${m.name}</h3>
            <p class="net-desc">${m.desc}</p>
            <div class="net-ip-badge">📍 <strong>Exemple d'adressage :</strong> <code>${m.ipExample}</code></div>

            <div class="net-matrix-results">
              <h4>Flux de communication autorisés :</h4>
              <ul class="net-flux-list">
                <li class="${m.vmToInternet ? 'flux-allowed' : 'flux-blocked'}">
                  ${m.vmToInternet ? '✅' : '❌'} <strong>VM ➔ Internet :</strong> ${m.vmToInternet ? 'Autorisé (sortie sortante)' : 'Bloqué (aucun accès web)'}
                </li>
                <li class="${m.vmToVm ? 'flux-allowed' : 'flux-blocked'}">
                  ${m.vmToVm ? '✅' : '❌'} <strong>VM ➔ Autre VM :</strong> ${m.vmToVm ? 'Autorisé (dialogue direct)' : 'Bloqué (isolées entre elles)'}
                </li>
                <li class="${m.hostToVm ? 'flux-allowed' : 'flux-blocked'}">
                  ${m.hostToVm ? '✅' : '❌'} <strong>PC Hôte ➔ VM (SSH) :</strong> ${m.hostToVm ? 'Autorisé (canal d\'admin direct)' : 'Bloqué (hôte non connecté)'}
                </li>
                <li class="${m.lanToVm ? 'flux-danger' : 'flux-blocked'}">
                  ${m.lanToVm ? '⚠️' : '🛡'} <strong>LAN Physique ➔ VM :</strong> ${m.lanToVm ? 'EXPOSÉ (voisins peuvent scanner la VM)' : 'Protégé (VM invisible du LAN)'}
                </li>
              </ul>
            </div>

            <div class="net-verdict-box">
              <p>${m.securityVerdict}</p>
              <small><strong>💡 Piège d'examen :</strong> ${m.examTip}</small>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function generateSVG(mode) {
    const isNat = mode === 'NAT';
    const isInt = mode === 'INTERNAL';
    const isHost = mode === 'HOSTONLY';
    const isBridge = mode === 'BRIDGED';

    return `
      <svg viewBox="0 0 540 340" class="net-svg-canvas" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hostGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e293b"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </linearGradient>
          <linearGradient id="vmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3b82f6"/>
            <stop offset="100%" stop-color="#1d4ed8"/>
          </linearGradient>
          <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#10b981"/>
            <stop offset="100%" stop-color="#047857"/>
          </linearGradient>
        </defs>

        <!-- Machine Hôte Physique -->
        <rect x="20" y="20" width="340" height="300" rx="14" fill="url(#hostGrad)" stroke="#475569" stroke-width="2"/>
        <text x="35" y="48" fill="#94a3b8" font-size="12" font-family="sans-serif" font-weight="bold">ORDINATEUR HÔTE PHYSIQUE (PC de l'étudiant)</text>

        <!-- Hyperviseur VirtualBox -->
        <rect x="35" y="65" width="310" height="235" rx="10" fill="#334155" opacity="0.4" stroke="#64748b" stroke-dasharray="4"/>
        <text x="45" y="85" fill="#cbd5e1" font-size="11" font-family="sans-serif">Oracle VirtualBox 7.x (Hyperviseur Type 2)</text>

        <!-- VM-CLIENT -->
        <rect x="50" y="105" width="125" height="110" rx="8" fill="url(#vmGrad)"/>
        <text x="65" y="130" fill="#ffffff" font-size="13" font-weight="bold">VM-CLIENT</text>
        <text x="65" y="150" fill="#bfdbfe" font-size="10">Ubuntu 24.04</text>
        <rect x="60" y="165" width="105" height="22" rx="4" fill="#1e3a8a"/>
        <text x="65" y="180" fill="#93c5fd" font-size="9">${isInt ? '10.10.10.11' : isNat ? '10.0.2.15' : isHost ? '192.168.56.11' : '192.168.1.110'}</text>

        <!-- VM-SRV -->
        <rect x="205" y="105" width="125" height="110" rx="8" fill="url(#vmGrad)"/>
        <text x="220" y="130" fill="#ffffff" font-size="13" font-weight="bold">VM-SRV</text>
        <text x="220" y="150" fill="#bfdbfe" font-size="10">UFW Actif + SSH</text>
        <rect x="215" y="165" width="105" height="22" rx="4" fill="#1e3a8a"/>
        <text x="220" y="180" fill="#93c5fd" font-size="9">${isInt ? '10.10.10.12' : isNat ? '10.0.2.16' : isHost ? '192.168.56.12' : '192.168.1.111'}</text>

        <!-- Switch Virtuel ou Moteur NAT -->
        <rect x="50" y="235" width="280" height="45" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="65" y="262" fill="#38bdf8" font-size="12" font-weight="bold">
          ${isNat ? 'Moteur VirtualBox NAT Engine' : isInt ? 'vSwitch hermétique M352-INT' : isHost ? 'Adaptateur Virtuel vboxnet0' : 'Pont Réseau Matériel (Bridge)'}
        </text>

        <!-- Nuage Internet -->
        <circle cx="450" cy="80" r="50" fill="url(#cloudGrad)"/>
        <text x="420" y="85" fill="#ffffff" font-size="14" font-weight="bold">INTERNET</text>

        <!-- Réseau LAN Physique -->
        <rect x="390" y="190" width="130" height="110" rx="8" fill="#475569" stroke="#cbd5e1" stroke-width="1.5"/>
        <text x="405" y="220" fill="#ffffff" font-size="12" font-weight="bold">LAN PHYSIQUE</text>
        <text x="405" y="240" fill="#e2e8f0" font-size="10">Wi-Fi / Switch école</text>
        <text x="405" y="265" fill="#f87171" font-size="10">${isBridge ? '⚠️ Scan permis !' : '🛡 Bloqué étanche'}</text>

        <!-- Lignes de liaison selon mode -->
        ${isNat ? `
          <line x1="175" y1="160" x2="205" y2="160" stroke="#ef4444" stroke-width="3" stroke-dasharray="4"/>
          <line x1="112" y1="215" x2="112" y2="235" stroke="#10b981" stroke-width="3"/>
          <line x1="267" y1="215" x2="267" y2="235" stroke="#10b981" stroke-width="3"/>
          <line x1="330" y1="255" x2="430" y2="120" stroke="#10b981" stroke-width="3" stroke-dasharray="3"/>
        ` : isInt ? `
          <line x1="175" y1="160" x2="205" y2="160" stroke="#10b981" stroke-width="4"/>
          <circle cx="190" cy="160" r="4" fill="#10b981"/>
          <line x1="330" y1="255" x2="410" y2="90" stroke="#ef4444" stroke-width="2" stroke-dasharray="4"/>
          <text x="350" y="160" fill="#ef4444" font-size="14" font-weight="bold">ISOLÉ</text>
        ` : isHost ? `
          <line x1="175" y1="160" x2="205" y2="160" stroke="#10b981" stroke-width="3"/>
          <line x1="267" y1="235" x2="267" y2="50" stroke="#38bdf8" stroke-width="3" stroke-dasharray="2"/>
          <text x="210" y="45" fill="#38bdf8" font-size="11">SSH direct Hôte-VM</text>
        ` : `
          <line x1="330" y1="255" x2="390" y2="255" stroke="#f59e0b" stroke-width="4"/>
          <line x1="450" y1="190" x2="450" y2="130" stroke="#10b981" stroke-width="3"/>
        `}
      </svg>
    `;
  }

  return {
    init,
    setMode
  };
})();

