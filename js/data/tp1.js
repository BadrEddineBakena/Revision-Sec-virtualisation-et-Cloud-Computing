// TP1 - Création et Isolation d'un Environnement Virtualisé (VirtualBox & Linux)
window.M352_TP1 = {
  id: "tp1",
  title: "TP1 – VirtualBox & Isolation Réseau Linux",
  subtitle: "Mise en œuvre pratique des modes NAT, Internal Network, Host-only, durcissement UFW et snapshots",
  summary: "Guide pas-à-pas interactif du TP1 : réalisation des 5 étapes obligatoires, simulateur de commandes terminal (ip, ping, ufw), tableau comparatif des 4 modes réseau et réponses aux 6 questions de synthèse.",

  // Prérequis et Topologie officielle
  overview: {
    objectives: "Créer un petit environnement virtualisé, observer les modes réseau NAT, Internal Network et Host-only, vérifier concrètement les propriétés d'isolation et appliquer une première configuration de sécurité minimale.",
    prerequisites: {
      hypervisor: "Oracle VirtualBox 7.x récent (gratuit)",
      vms: "2 × Ubuntu Server 24.04 LTS (sans interface graphique GUI)",
      specsPerVm: "1 vCPU, 1 à 1.5 Go RAM, 8–12 Go disque virtuel alloué dynamiquement",
      hostPc: "Processeur 4 cœurs conseillé, 8 Go RAM minimum, ~25 Go d'espace libre",
      tools: "Terminal Linux et commandes standard (ip, ping, ufw, ssh)"
    },
    topology: {
      name: "Réseau interne M352-INT",
      clientVm: "VM-CLIENT : IP 10.10.10.11/24 (Adaptateur 2, sans passerelle)",
      serverVm: "VM-SRV : IP 10.10.10.12/24 (Adaptateur 2, sans passerelle)",
      rule: "Ne configurer AUCUNE passerelle par défaut (gateway) sur cette interface interne afin d'éviter tout conflit de routage."
    }
  },

  // Les 5 Étapes du TP avec commandes et preuves exigées (P1 à P5)
  steps: [
    {
      stepNumber: 1,
      title: "Étape 1 — Vérification de l'Environnement et Ressources",
      goal: "Contrôler que les deux machines virtuelles démarrent et identifier leurs ressources physiques et interfaces réseau.",
      commands: [
        { cmd: "ip -br addr", desc: "Affiche un résumé clair et compact de toutes les interfaces réseau et leurs adresses IP associées." },
        { cmd: "ip route", desc: "Affiche la table de routage du noyau Linux pour identifier la passerelle par défaut." },
        { cmd: "hostnamectl", desc: "Vérifie le nom d'hôte de la machine (ex: vm-client ou vm-srv) et la version de l'OS." }
      ],
      terminalSimulation: {
        command: "ip -br addr",
        output: "lo               UNKNOWN        127.0.0.1/8 ::1/128 \nenp0s3           UP             10.0.2.15/24 fe80::a00:27ff:fe4a:1234/64"
      },
      proof: {
        id: "P1",
        label: "Preuve P1 : Capture montrant les deux VM démarrées et, pour chacune, la sortie de ip -br addr."
      }
    },
    {
      stepNumber: 2,
      title: "Étape 2 — Comprendre et Valider le Mode NAT",
      goal: "Vérifier que la VM peut naviguer sur Internet tout en restant invisible depuis le réseau local physique.",
      commands: [
        { cmd: "ip route", desc: "Vérifie la présence d'une route par défaut (default via 10.0.2.2 dev enp0s3)." },
        { cmd: "ping -c 3 1.1.1.1", desc: "Teste la connectivité Internet directe vers le serveur DNS Cloudflare." },
        { cmd: "getent hosts ubuntu.com", desc: "Valide la résolution de noms de domaine (DNS) à travers la couche NAT." }
      ],
      questions: [
        {
          q: "4. La VM possède-t-elle une route par défaut ?",
          a: "Oui, la passerelle virtuelle attribuée par le service NAT de VirtualBox est généralement 10.0.2.2."
        },
        {
          q: "5. Peut-elle accéder à Internet ?",
          a: "Oui, les paquets sortants sont translatés avec l'adresse IP publique de votre ordinateur hôte."
        },
        {
          q: "6. Un autre poste du LAN physique de l'école peut-il initier directement une connexion vers cette VM sans redirection de port ? Pourquoi ?",
          a: "NON. La table NAT n'autorise que les connexions sortantes et les réponses associées. Depuis l'extérieur, la VM ne possède aucune adresse IP routable sur le LAN physique."
        }
      ],
      proof: {
        id: "P2",
        label: "Preuve P2 : Capture montrant la route par défaut et un test de connectivité réussi en mode NAT."
      }
    },
    {
      stepNumber: 3,
      title: "Étape 3 — Créer un Réseau Interne Isolé (M352-INT)",
      goal: "Configurer une liaison hermétique VM-à-VM sans passerelle et tester l'isolation complète vis-à-vis d'Internet.",
      instructions: [
        "1. Éteindre proprement les deux VM (`sudo poweroff`).",
        "2. Dans VirtualBox : Paramètres -> Réseau -> Adaptateur 2 -> Activer -> Mode : 'Réseau interne' -> Nom : 'M352-INT'.",
        "3. Redémarrer les deux VM et identifier le nom de la nouvelle interface (souvent `enp0s8`).",
        "4. Configurer temporairement les adresses IP statiques :"
      ],
      commands: [
        { cmd: "sudo ip addr add 10.10.10.11/24 dev enp0s8 && sudo ip link set enp0s8 up", desc: "Configuration sur VM-CLIENT" },
        { cmd: "sudo ip addr add 10.10.10.12/24 dev enp0s8 && sudo ip link set enp0s8 up", desc: "Configuration sur VM-SRV" },
        { cmd: "ping -c 3 10.10.10.12", desc: "Test de connectivité VM-CLIENT vers VM-SRV (succès)" }
      ],
      isolationTest: "Pour prouver l'isolation hermétique : déconnectez temporairement la case 'Câble branché' de l'Adaptateur 1 (NAT) dans VirtualBox. Le `ping 10.10.10.12` continue de fonctionner parfaitement, tandis que `ping 1.1.1.1` échoue à 100% !",
      proof: {
        id: "P3",
        label: "Preuve P3 : Capture de VM-CLIENT pingant VM-SRV sur 10.10.10.12 alors que l'accès Internet est coupé."
      }
    },
    {
      stepNumber: 4,
      title: "Étape 4 — Tester le Réseau Privé Hôte (Host-only)",
      goal: "Créer un lien de communication privé direct entre votre ordinateur physique (l'hôte) et la machine virtuelle.",
      instructions: [
        "1. Éteindre VM-SRV.",
        "2. Passer l'Adaptateur 2 de 'Réseau interne' à 'Réseau privé hôte' (Host-only Network / Host-only Adapter).",
        "3. Redémarrer VM-SRV et vérifier l'adresse IP attribuée par VirtualBox (généralement dans la plage 192.168.56.x/24).",
        "4. Depuis le terminal de votre PC hôte, tester le ping et une connexion SSH :"
      ],
      commands: [
        { cmd: "ip -br addr", desc: "Exécuté dans VM-SRV pour relever son IP Host-only (ex: 192.168.56.10)" },
        { cmd: "ping 192.168.56.10", desc: "Exécuté depuis le terminal de votre machine physique (succès direct)" },
        { cmd: "ssh utilisateur@192.168.56.10", desc: "Ouverture d'une session SSH sécurisée hôte vers VM" }
      ],
      proof: {
        id: "P4",
        label: "Preuve P4 : Capture d'un échange réussi (ping ou SSH) entre le PC hôte et VM-SRV sur le réseau host-only."
      }
    },
    {
      stepNumber: 5,
      title: "Étape 5 — Première Sécurisation Minimale & Snapshot",
      goal: "Appliquer les bonnes pratiques d'hygiène de virtualisation, configurer le pare-feu UFW et figer l'état propre.",
      instructions: [
        "1. Désactiver dans VirtualBox le presse-papiers partagé et le glisser-déposer (Général -> Avancé -> Désactivé).",
        "2. Éviter d'attacher des dossiers partagés permanents sur une VM sensible.",
        "3. Sur VM-SRV, appliquer la politique UFW stricte :",
        "4. Prendre immédiatement un instantané nommé CLEAN-TP1."
      ],
      commands: [
        { cmd: "sudo ufw default deny incoming", desc: "Bloque par défaut toute tentative de connexion entrante." },
        { cmd: "sudo ufw default allow outgoing", desc: "Autorise les flux sortants légitimes de la VM." },
        { cmd: "sudo ufw allow proto tcp from 192.168.56.0/24 to any port 22", desc: "N'autorise SSH que depuis le sous-réseau Host-only privé de votre hôte." },
        { cmd: "sudo ufw enable", desc: "Active le filtrage du pare-feu avec confirmation." },
        { cmd: "sudo ufw status verbose", desc: "Affiche le statut détaillé des règles actives." }
      ],
      proof: {
        id: "P5",
        label: "Preuve P5 : Capture du statut UFW (`ufw status verbose`) et du snapshot 'CLEAN-TP1' dans l'interface VirtualBox."
      }
    }
  ],

  // Tableau comparatif officiel à inclure dans le compte-rendu
  comparisonTable: [
    {
      mode: "NAT (Network Address Translation)",
      vmToInternet: "✅ OUI (accès sortant via IP de l'hôte)",
      vmToVm: "❌ NON (sauf si sous-réseau NAT dédié)",
      hostToVm: "❌ NON (nécessite redirection de port)",
      lanToVm: "❌ NON (isolée derrière le NAT)",
      securityLevel: "Élevé par défaut (idéal pour laboratoire individuel)"
    },
    {
      mode: "Internal Network (ex: M352-INT)",
      vmToInternet: "❌ NON (aucun accès)",
      vmToVm: "✅ OUI (entre VM du même réseau interne)",
      hostToVm: "❌ NON (l'hôte ne participe pas au réseau)",
      lanToVm: "❌ NON (totalement hermétique)",
      securityLevel: "Maximum (bulle étanche parfaite pour lier App et DB)"
    },
    {
      mode: "Host-only Network",
      vmToInternet: "❌ NON (sauf routage spécifique sur l'hôte)",
      vmToVm: "✅ OUI (entre VM connectées à la même interface hôte)",
      hostToVm: "✅ OUI (communication bidirectionnelle directe)",
      lanToVm: "❌ NON (invisible pour les machines physiques externes)",
      securityLevel: "Très bon (parfait pour l'administration privée SSH)"
    },
    {
      mode: "Bridged (Accès par pont)",
      vmToInternet: "✅ OUI (comme une machine réelle)",
      vmToVm: "✅ OUI (via le switch physique)",
      hostToVm: "✅ OUI (sur le réseau local)",
      lanToVm: "⚠️ OUI (la VM est directement joignable par tous sur le LAN)",
      securityLevel: "Faible / Dangereux (exposition directe, risque d'attaque sur le LAN)"
    }
  ],

  // Les 6 Questions de Synthèse officielles (Questions 22 à 27) avec corrigés proposés
  synthesisQuestions: [
    {
      number: 22,
      id: "tp1-q22",
      q: "22. Pourquoi le mode NAT est-il plus sûr par défaut que le mode Bridged pour une VM de laboratoire ?",
      answer: "💡 Proposition de corrigé : Le mode NAT n'autorise que les flux sortants initiés par la VM ; il empêche tout appareil du réseau physique local (ex: les PC d'autres étudiants sur le Wi-Fi de l'école) d'envoyer directement des paquets vers la VM ou de scanner ses ports ouverts, alors qu'en mode Bridged, la VM reçoit une adresse IP du réseau réel et devient une cible directement exposée à tout le monde."
    },
    {
      number: 23,
      id: "tp1-q23",
      q: "23. Quelle différence essentielle existe entre le mode Internal Network et le mode Host-only ?",
      answer: "💡 Proposition de corrigé : La différence fondamentale réside dans l'accès de l'ordinateur hôte : en mode Internal Network, l'ordinateur physique hôte n'a AUCUNE interface connectée au commutateur virtuel et ne peut donc pas communiquer avec les VM (bulle hermétique VM-à-VM seule) ; en mode Host-only, une interface virtuelle est expressément créée sur l'hôte pour lui permettre de communiquer directement avec la VM (ex: session d'administration SSH)."
    },
    {
      number: 24,
      id: "tp1-q24",
      q: "24. Dans quel cas utiliseriez-vous le mode Bridged ? Pourquoi faut-il être particulièrement prudent ?",
      answer: "💡 Proposition de corrigé : On utilise le mode Bridged lorsqu'une VM doit fournir un service réel à d'autres équipements physiques du réseau local (ex: héberger un serveur d'impression ou un serveur DHCP de test d'entreprise). Il faut être très prudent car la VM devient directement exposée aux attaques du LAN physique, consomme une adresse IP sur le serveur DHCP de l'établissement et peut introduire des conflits d'adresses ou des vulnérabilités sur le réseau physique."
    },
    {
      number: 25,
      id: "tp1-q25",
      q: "25. Pourquoi une VM « isolée » du réseau n'est-elle pas automatiquement sécurisée ?",
      answer: "💡 Proposition de corrigé : Une VM sans réseau reste vulnérable aux canaux de communication locaux fournis par l'hyperviseur : si le presse-papiers partagé, le glisser-déposer ou des dossiers partagés permanents sont activés, des données malveillantes ou des fuites peuvent transiter ; de plus, si la machine contient des comptes utilisateurs avec mots de passe faibles, un utilisateur local ou un processus compromis peut s'en emparer sans réseau."
    },
    {
      number: 26,
      id: "tp1-q26",
      q: "26. Pourquoi est-il fortement recommandé de désactiver le presse-papiers partagé, le glisser-déposer et les dossiers partagés permanents sur une VM sensible ?",
      answer: "💡 Proposition de corrigé : Ces fonctionnalités créent des ponts logiciels directs entre la mémoire du système d'exploitation hôte et le système invité : un malware présent dans la VM pourrait tenter de lire le presse-papiers pour dérober des mots de passe copiés sur l'hôte, ou déposer des fichiers exécutables malveillants via le dossier partagé permanent."
    },
    {
      number: 27,
      id: "tp1-q27",
      q: "27. Pourquoi la création d'un snapshot nommé CLEAN-TP1 est-elle particulièrement utile avant d'aborder le TP2 ?",
      answer: "💡 Proposition de corrigé : Le snapshot CLEAN-TP1 constitue un point de référence intègre et sain (état 'Golden') avec un système patché, le pare-feu UFW opérationnel et les interfaces configurées ; lors du TP2 (qui abordera des scénarios d'attaque ou de configuration réseau avancée), si une manipulation casse le système ou bloque l'accès, l'étudiant peut revenir instantanément à un état fonctionnel propre en un clic sans avoir à réinstaller Ubuntu depuis le début."
    }
  ],

  // Modèle de conclusion de livrable (5 lignes exigées)
  sampleConclusion: "En conclusion, ce TP a permis de démontrer expérimentalement que la virtualisation réseau offre des niveaux d'isolation complémentaires : le mode NAT sécurise la sortie Internet, le mode Internal Network garantit une étanchéité absolue entre machines virtuelles, et le mode Host-only fournit un canal d'administration privé dédié sans risque d'exposition au réseau local physique. Combinée à un filtrage strict par pare-feu local (UFW) et à des instantanés de référence (CLEAN-TP1), cette architecture constitue le socle défensif indispensable avant tout déploiement en production."
};

