// Tableau de bord des 6 notions clés à ne JAMAIS confondre (M352)
window.M352_CONFUSIONS = [
  {
    id: "virt-vs-cloud",
    title: "Virtualisation vs Cloud Computing",
    summaryDiff: "La virtualisation est une technologie de découpage matériel ; le Cloud est un modèle de service automatisé en libre-service.",
    conceptA: {
      name: "Virtualisation",
      tag: "Technologie facilitatrice",
      points: [
        "Découpe un serveur physique en plusieurs VM isolées.",
        "Peut être 100% manuelle, locale et sans facturation.",
        "Nécessite souvent l'intervention humaine d'un administrateur pour créer une VM.",
        "Pas obligatoirement d'API, d'élasticité ou de portail self-service."
      ]
    },
    conceptB: {
      name: "Cloud Computing",
      tag: "Modèle de fourniture de services",
      points: [
        "Fournit des ressources à la demande via un portail ou une API automatisée.",
        "Respecte obligatoirement les 5 critères NIST (self-service, élasticité, pooling, etc.).",
        "Facturation ou mesure précise de l'usage consommé (CPU, stockage, requêtes).",
        "S'appuie souvent sur la virtualisation, mais la virtualisation seule ne suffit pas !"
      ]
    },
    analogy: "💡 La virtualisation, c'est le moteur thermique inventé pour faire rouler un véhicule. Le Cloud, c'est l'application Uber qui permet de commander une course en 2 clics avec facturation au kilomètre.",
    trapExam: "⚠️ Piège classique : 'Une entreprise possède 20 VM dans son sous-sol sur un serveur Proxmox, elle utilise donc le Cloud Computing.' Faux ! C'est seulement de la virtualisation locale s'il n'y a pas d'automatisation, de self-service, d'élasticité rapide et de service mesuré."
  },
  {
    id: "snapshot-vs-backup",
    title: "Snapshot vs Sauvegarde (Backup) vs Clone",
    summaryDiff: "Un snapshot est un retour arrière rapide dépendant du disque d'origine ; une sauvegarde est une copie complète, autonome et résiliente.",
    conceptA: {
      name: "Snapshot (Instantané)",
      tag: "Point de restauration immédiat",
      points: [
        "Fige l'état des disques et de la mémoire à un instant T (déviation des écritures).",
        "Restauration ultra-rapide avant une manipulation risquée (mise à jour, test).",
        "DÉPEND du stockage source : si le disque dur physique de l'hôte crash, le snapshot est perdu !",
        "Doit être temporaire (ralentit les performances si conservé trop longtemps)."
      ]
    },
    conceptB: {
      name: "Sauvegarde (Backup)",
      tag: "Protection résiliente après sinistre",
      points: [
        "Copie indépendante intégrale de toutes les données sur un support ou site distinct.",
        "Permet de reconstruire le système après un incendie de datacenter ou un ransomware.",
        "Doit être testée en restauration régulière pour être considérée comme valide.",
        "Souvent isolée du réseau (stockage immuable ou hors ligne)."
      ]
    },
    conceptC: {
      name: "Clone",
      tag: "Duplication opérationnelle",
      points: [
        "Copie intégrale autonome créant une nouvelle VM avec une nouvelle identité.",
        "Utile pour dupliquer un environnement de test ou de développement.",
        "Risque : machines fantômes oubliées qui ne reçoivent plus de correctifs de sécurité."
      ]
    },
    analogy: "💡 Le snapshot, c'est un marque-page dans un livre (si le livre brûle, le marque-page brûle avec). La sauvegarde, c'est imprimer un deuxième exemplaire du livre et le ranger dans un coffre-fort dans une autre ville.",
    trapExam: "⚠️ Piège d'examen : 'Pour se protéger d'une panne de matériel ou d'un ransomware, il suffit de prendre des snapshots quotidiens.' Absolument faux ! Les snapshots ne remplacent JAMAIS une vraie politique de sauvegarde testée."
  },
  {
    id: "internal-vs-hostonly",
    title: "Internal Network vs Host-only Network (VirtualBox)",
    summaryDiff: "Internal Network isole strictement les VM entre elles ; Host-only crée un canal d'administration privé entre votre machine hôte et la VM.",
    conceptA: {
      name: "Internal Network (ex: M352-INT)",
      tag: "Bulle étanche entre VM",
      points: [
        "Les VM configurées sur le même nom de réseau interne peuvent communiquer entre elles.",
        "Aucune communication possible avec le système hôte physique.",
        "Aucun accès à Internet ni au réseau local de la classe/entreprise.",
        "Idéal pour relier un serveur applicatif à une base de données de manière hermétique."
      ]
    },
    conceptB: {
      name: "Host-only Network",
      tag: "Réseau privé Hôte <-> VM",
      points: [
        "Crée une carte réseau virtuelle dédiée sur le PC hôte et relie les VM à cette carte.",
        "L'hôte physique peut pinguer et administrer la VM (ex. en SSH).",
        "Aucun trafic ne sort vers le réseau physique de la classe : la VM reste invisible de vos voisins.",
        "Parfait pour tester des services et administrer sans exposer la VM au LAN physique."
      ]
    },
    analogy: "💡 Internal Network, c'est un talkie-walkie privé entre deux agents dans une pièce insonorisée (personne dehors n'entend). Host-only, c'est un câble direct entre votre ordinateur portable et la machine d'un collègue sur la table.",
    trapExam: "⚠️ Piège en TP : Si vous voulez administrer votre VM en SSH depuis votre propre PC physique, le mode Internal Network échouera toujours car l'hôte n'a aucune interface connectée dessus ! Il faut utiliser Host-only."
  },
  {
    id: "threat-vs-vuln-vs-risk",
    title: "Menace vs Vulnérabilité vs Risque (Méthode TD1)",
    summaryDiff: "La vulnérabilité est une faille interne, la menace est le danger externe, et le risque est la probabilité d'un dommage concret.",
    conceptA: {
      name: "Vulnérabilité (Faiblesse interne)",
      tag: "Ce qui nous rend vulnérable",
      points: [
        "Faiblesse dans un logiciel, une configuration ou une organisation.",
        "Existe indépendamment du fait qu'elle soit attaquée ou non.",
        "Exemples TD1 : hyperviseur non patché depuis 6 mois, compte partagé sans MFA, réseau plat."
      ]
    },
    conceptB: {
      name: "Menace (Agent agresseur potentiel)",
      tag: "Ce qui peut attaquer",
      points: [
        "Cause potentielle d'un incident de sécurité.",
        "Peut être humaine (cybercriminel, employé malveillant) ou accidentelle (panne, erreur humaine).",
        "Exemples TD1 : groupe pirate déployant un ransomware, stagiaire faisant une faute de frappe."
      ]
    },
    conceptC: {
      name: "Risque (Scénario de dommage concret)",
      tag: "Vraisemblance x Impact",
      points: [
        "Effet produit quand la menace exploite la vulnérabilité sur un actif critique.",
        "Formule : Risque = Vraisemblance (1-5) x Impact (1-5).",
        "Exemple TD1 : Un attaquant exploite les identifiants partagés pour se connecter à la console d'administration et supprimer toutes les VM critiques de l'entreprise."
      ]
    },
    analogy: "💡 La vulnérabilité, c'est laisser la fenêtre de votre maison ouverte la nuit. La menace, c'est un voleur qui se promène dans la rue. Le risque, c'est que le voleur passe par la fenêtre ouverte et vole vos bijoux (Impact élevé x Vraisemblance forte = Risque critique)."
  },
  {
    id: "mgmt-plane-vs-data-plane",
    title: "Management Plane vs Data Plane",
    summaryDiff: "Le Management Plane gère l'infrastructure (la plomberie) ; le Data Plane transporte les données des utilisateurs (l'eau dans les tuyaux).",
    conceptA: {
      name: "Management Plane (Plan de gestion)",
      tag: "Console, API, Politiques, IAM",
      points: [
        "Sert à créer, modifier, reconfigurer, arrêter ou détruire des ressources.",
        "Outils : console web Cloud, CLI (lignes de commande), Terraform, API REST de gestion.",
        "Si compromis : l'attaquant prend le contrôle de TOUTE votre infrastructure en 1 clic.",
        "Contrôles clés : MFA strict, politique de moindre privilège (IAM), logs d'audit CloudTrail/Activity Logs."
      ]
    },
    conceptB: {
      name: "Data Plane (Plan de données)",
      tag: "Trafic applicatif, Données, Ports réseau",
      points: [
        "Transporte les requêtes des utilisateurs finaux vers les applications et bases de données.",
        "Flux : requêtes HTTP/HTTPS, requêtes SQL vers la base, transfert de fichiers.",
        "Si compromis : vol ou altération des données hébergées sur le service ciblé.",
        "Contrôles clés : Pare-feu (Security Groups/NSG), WAF, chiffrement TLS, segmentation réseau."
      ]
    },
    analogy: "💡 Dans un aéroport, le Data Plane, ce sont les passagers qui montent dans les avions et leurs valises. Le Management Plane, c'est la tour de contrôle et le panneau d'aiguillage des pistes : si un pirate prend la tour de contrôle, il déroute tous les avions d'un coup.",
    trapExam: "⚠️ Question clé du cours : Pourquoi une identité trop puissante est-elle plus dangereuse qu'un port ouvert ? Parce qu'un compte admin du Management Plane compromis permet d'ouvrir tous les ports, d'effacer les sauvegardes et de rendre un stockage public sans aucune alerte réseau !"
  },
  {
    id: "type1-vs-type2",
    title: "Hyperviseur Type 1 (Bare-metal) vs Type 2 (Hosted)",
    summaryDiff: "Le Type 1 s'installe directement sur le serveur physique pour un maximum de performance et de sécurité ; le Type 2 tourne au-dessus d'un système hôte pour le poste de travail.",
    conceptA: {
      name: "Type 1 - Bare-metal (Natif)",
      tag: "Environnement de production / Datacenter",
      points: [
        "Installé directement sur le matériel physique (pas d'OS intermédiaire).",
        "Surface d'attaque minimale : pas d'OS hôte vulnérable en dessous.",
        "Performances maximales et accès direct aux instructions matérielles de virtualisation.",
        "Exemples : VMware ESXi, Microsoft Hyper-V Server, KVM."
      ]
    },
    conceptB: {
      name: "Type 2 - Hosted (Hébergé)",
      tag: "Environnement d'apprentissage / Laboratoire",
      points: [
        "Installé comme un logiciel normal sur un système d'exploitation hôte (Windows, macOS, Linux).",
        "Dépend de la stabilité et de la sécurité de l'OS hôte.",
        "Surface d'attaque plus large (une faille sur l'OS hôte compromet toutes les VM).",
        "Exemples : Oracle VirtualBox, VMware Workstation, UTM."
      ]
    },
    analogy: "💡 Le Type 1, c'est un immeuble construit directement sur des fondations solides en béton armé. Le Type 2, c'est une tente montée sur la terrasse d'une maison en bois : si la maison prend feu, la tente s'effondre avec.",
    trapExam: "⚠️ Question TP1 : 'Quel est le type d'hyperviseur utilisé par Oracle VirtualBox en usage classique ?' Réponse obligatoire : Type 2 (Hosted) car il s'exécute au-dessus de votre OS Windows, Linux ou macOS."
  }
];

