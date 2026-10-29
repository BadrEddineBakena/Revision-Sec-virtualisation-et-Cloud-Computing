// Simulateur de Terminal Linux Interactif pour TP1 M352
window.TerminalSim = (function () {
  let history = [
    { type: "system", text: "Ubuntu 24.04 LTS (GNU/Linux 6.8.0-31-generic x86_64)\nBienvenue dans le simulateur de terminal TP1 M352 (Filière Sécurité IT).\nTapez une commande ci-dessous ou cliquez sur les boutons d'action rapide." }
  ];

  const commandDb = {
    "ip -br addr": {
      output: "lo               UNKNOWN        127.0.0.1/8 ::1/128 \nenp0s3           UP             10.0.2.15/24 fe80::a00:27ff:fe4a:1234/64 \nenp0s8           UP             10.10.10.11/24",
      explanation: "💡 Explication : `ip -br addr` donne l'état bref des interfaces réseau. Ici : `lo` est la boucle locale, `enp0s3` est l'adaptateur NAT (10.0.2.15) qui donne accès à Internet, et `enp0s8` est l'adaptateur de réseau interne M352-INT (10.10.10.11)."
    },
    "ip route": {
      output: "default via 10.0.2.2 dev enp0s3 proto dhcp src 10.0.2.15 metric 100 \n10.0.2.0/24 dev enp0s3 proto kernel scope link src 10.0.2.15 metric 100 \n10.10.10.0/24 dev enp0s8 proto kernel scope link src 10.10.10.11",
      explanation: "💡 Explication : La table de routage montre que la passerelle par défaut (`default via 10.0.2.2`) passe par l'interface NAT `enp0s3`. Les paquets à destination du réseau interne `10.10.10.0/24` sortent directement sur `enp0s8` sans passerelle."
    },
    "hostnamectl": {
      output: "Static hostname: vm-client\nIcon name: computer-vm\nChassis: vm\nVirtualization: oracle\nOperating System: Ubuntu 24.04 LTS\nKernel: Linux 6.8.0-31-generic\nArchitecture: x86-64",
      explanation: "💡 Explication : Confirme que le système reconnaît qu'il tourne dans un environnement virtualisé (`Virtualization: oracle` correspond à VirtualBox) avec le nom d'hôte `vm-client`."
    },
    "ping -c 3 1.1.1.1": {
      output: "PING 1.1.1.1 (1.1.1.1) 56(84) bytes of data.\n64 bytes from 1.1.1.1: icmp_seq=1 ttl=58 time=12.4 ms\n64 bytes from 1.1.1.1: icmp_seq=2 ttl=58 time=11.8 ms\n64 bytes from 1.1.1.1: icmp_seq=3 ttl=58 time=12.1 ms\n\n--- 1.1.1.1 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2003ms",
      explanation: "💡 Explication : 0% de perte de paquets. Valide que la VM accède à Internet via la translation d'adresses NAT de l'Adaptateur 1 (Preuve P2)."
    },
    "ping -c 3 10.10.10.12": {
      output: "PING 10.10.10.12 (10.10.10.12) 56(84) bytes of data.\n64 bytes from 10.10.10.12: icmp_seq=1 ttl=64 time=0.452 ms\n64 bytes from 10.10.10.12: icmp_seq=2 ttl=64 time=0.389 ms\n64 bytes from 10.10.10.12: icmp_seq=3 ttl=64 time=0.410 ms\n\n--- 10.10.10.12 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2045ms",
      explanation: "💡 Explication : Communication réussie sur le réseau interne M352-INT entre VM-CLIENT et VM-SRV, avec un temps de réponse infime (~0.4 ms) car le trafic ne quitte pas la mémoire de la machine hôte (Preuve P3)."
    },
    "sudo ufw default deny incoming": {
      output: "Default incoming policy changed to 'deny'\n(be sure to update your rules accordingly)",
      explanation: "💡 Explication : Règle d'or de durcissement. UFW bloquera désormais silencieusement toute connexion entrante non explicitement autorisée."
    },
    "sudo ufw default allow outgoing": {
      output: "Default outgoing policy changed to 'allow'\n(be sure to update your rules accordingly)",
      explanation: "💡 Explication : Permet au serveur de continuer à initier des requêtes sortantes vers Internet (mises à jour de sécurité)."
    },
    "sudo ufw allow proto tcp from 192.168.56.0/24 to any port 22": {
      output: "Rule added\nRule added (v6)",
      explanation: "💡 Explication : Autorise les connexions SSH (port 22) UNIQUEMENT si elles proviennent du réseau Host-only privé (`192.168.56.0/24`). Aucun attaquant du Wi-Fi physique ne peut joindre SSH !"
    },
    "sudo ufw enable": {
      output: "Command may disrupt existing ssh connections. Proceed with operation (y|n)? y\nFirewall is active and enabled on system startup",
      explanation: "💡 Explication : Le pare-feu est maintenant actif et persistera après redémarrage de la machine."
    },
    "sudo ufw status verbose": {
      output: "Status: active\nLogging: on (low)\nDefault: deny (incoming), allow (outgoing), disabled (routed)\nNew profiles: skip\n\nTo                         Action      From\n--                         ------      ----\n22/tcp                     ALLOW IN    192.168.56.0/24",
      explanation: "💡 Explication (Preuve P5 du livrable) : Statut complet prouvant que la politique 'deny incoming' est active et que seul SSH depuis le réseau d'administration Host-only est accepté."
    }
  };

  function init(containerId) {
    history = [
      { type: "system", text: "Ubuntu 24.04 LTS (GNU/Linux 6.8.0-31-generic x86_64)\nBienvenue dans le simulateur de terminal TP1 M352 (Filière Sécurité IT).\nTapez une commande ci-dessous ou cliquez sur les boutons d'action rapide." }
    ];
    render(containerId);
  }

  function runCommand(cmdText, containerId) {
    cmdText = cmdText.trim();
    if (!cmdText) return;

    history.push({ type: "input", text: `student@vm-client:~$ ${cmdText}` });

    const match = commandDb[cmdText];
    if (match) {
      history.push({ type: "output", text: match.output });
      history.push({ type: "explanation", text: match.explanation });
    } else if (cmdText === "clear") {
      history = [];
    } else {
      history.push({ type: "output", text: `bash: ${cmdText}: commande inconnue dans le simulateur TP1. Utilisez les boutons suggérés ci-dessous.` });
    }

    render(containerId);
    scrollToBottom(containerId);
  }

  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="terminal-card">
        <div class="terminal-bar">
          <div class="terminal-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
          <span class="terminal-title">student@vm-client: ~ (Bash VirtualBox Sim)</span>
        </div>

        <div class="terminal-screen" id="term-screen-${containerId}">
          ${history.map(item => {
            if (item.type === "input") return `<div class="term-line term-input">${item.text}</div>`;
            if (item.type === "output") return `<pre class="term-pre">${item.text}</pre>`;
            if (item.type === "explanation") return `<div class="term-expl">${item.text}</div>`;
            return `<pre class="term-system">${item.text}</pre>`;
          }).join('')}
        </div>

        <div class="terminal-input-bar">
          <span class="term-prompt">student@vm-client:~$</span>
          <input type="text" id="term-input-${containerId}" class="term-text-input" 
                 placeholder="Tapez une commande (ex: ip -br addr, ping, ufw...)" 
                 onkeydown="if(event.key === 'Enter') { TerminalSim.runCommand(this.value, '${containerId}'); this.value = ''; }">
          <button class="btn btn-sm btn-primary" onclick="const inp = document.getElementById('term-input-${containerId}'); TerminalSim.runCommand(inp.value, '${containerId}'); inp.value = '';">Entrée ↵</button>
        </div>

        <div class="terminal-quick-buttons">
          <span class="quick-title">Commandes officielles TP1 à tester :</span>
          <div class="quick-btn-flex">
            <button class="btn-term-chip" onclick="TerminalSim.runCommand('ip -br addr', '${containerId}')">ip -br addr</button>
            <button class="btn-term-chip" onclick="TerminalSim.runCommand('ip route', '${containerId}')">ip route</button>
            <button class="btn-term-chip" onclick="TerminalSim.runCommand('ping -c 3 1.1.1.1', '${containerId}')">ping 1.1.1.1 (NAT)</button>
            <button class="btn-term-chip" onclick="TerminalSim.runCommand('ping -c 3 10.10.10.12', '${containerId}')">ping 10.10.10.12 (Internal)</button>
            <button class="btn-term-chip" onclick="TerminalSim.runCommand('sudo ufw default deny incoming', '${containerId}')">ufw deny incoming</button>
            <button class="btn-term-chip" onclick="TerminalSim.runCommand('sudo ufw allow proto tcp from 192.168.56.0/24 to any port 22', '${containerId}')">ufw allow SSH Host-only</button>
            <button class="btn-term-chip" onclick="TerminalSim.runCommand('sudo ufw enable', '${containerId}')">ufw enable</button>
            <button class="btn-term-chip" onclick="TerminalSim.runCommand('sudo ufw status verbose', '${containerId}')">ufw status verbose (P5)</button>
            <button class="btn-term-chip" onclick="TerminalSim.runCommand('clear', '${containerId}')">clear</button>
          </div>
        </div>
      </div>
    `;
  }

  function scrollToBottom(containerId) {
    setTimeout(() => {
      const screen = document.getElementById(`term-screen-${containerId}`);
      if (screen) screen.scrollTop = screen.scrollHeight;
    }, 50);
  }

  return {
    init,
    runCommand
  };
})();

