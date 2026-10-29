// Glossaire complet M352 - Définitions simples pour débutants
window.M352_GLOSSARY = [
  {
    term: "Hyperviseur (VMM)",
    acronym: "Virtual Machine Monitor (Moniteur de Machine Virtuelle)",
    category: "Virtualisation",
    definition: "Logiciel ou microcode qui crée, exécute et isole plusieurs machines virtuelles sur un même serveur physique.",
    example: "VirtualBox sur votre PC (Type 2) ou VMware ESXi dans un datacenter (Type 1)."
  },
  {
    term: "Machine Virtuelle (VM)",
    acronym: "Virtual Machine (Machine Virtuelle)",
    category: "Virtualisation",
    definition: "Ordinateur logiciel fonctionnant comme un ordinateur physique, avec son propre système d'exploitation et ses ressources virtuelles (vCPU, vRAM, vDisk).",
    example: "Une VM Ubuntu Server 24.04 qui tourne dans VirtualBox."
  },
  {
    term: "Hyperviseur Type 1 (Bare-metal)",
    acronym: "Bare-metal Hypervisor",
    category: "Virtualisation",
    definition: "Hyperviseur installé directement sur le matériel physique du serveur, sans système d'exploitation intermédiaire.",
    example: "VMware ESXi, Microsoft Hyper-V Server, KVM sur Linux dédié."
  },
  {
    term: "Hyperviseur Type 2 (Hosted)",
    acronym: "Hosted Hypervisor",
    category: "Virtualisation",
    definition: "Hyperviseur exécuté comme une application classique au-dessus d'un système d'exploitation hôte déjà installé.",
    example: "Oracle VirtualBox ou VMware Workstation installé sur Windows ou macOS."
  },
  {
    term: "Multi-tenancy (Mutualisation)",
    acronym: "Multi-tenancy (Multi-location)",
    category: "Cloud",
    definition: "Principe selon lequel plusieurs clients distincts partagent les mêmes ressources physiques sous-jacentes tout en restant logiquement isolés.",
    example: "Deux entreprises concurrentes dont les VM tournent sur la même machine physique chez AWS."
  },
  {
    term: "IaaS",
    acronym: "Infrastructure as a Service (Infrastructure en tant que Service)",
    category: "Cloud",
    definition: "Modèle Cloud où le fournisseur gère le matériel et la virtualisation, laissant au client la gestion de l'OS, des patchs et des applications.",
    example: "Amazon EC2, Azure Virtual Machines, Google Compute Engine."
  },
  {
    term: "PaaS",
    acronym: "Platform as a Service (Plateforme en tant que Service)",
    category: "Cloud",
    definition: "Modèle Cloud où le fournisseur gère le matériel, la virtualisation, l'OS et l'environnement d'exécution (runtime), permettant au client de se concentrer sur son code.",
    example: "AWS Elastic Beanstalk, Google App Engine, Heroku."
  },
  {
    term: "SaaS",
    acronym: "Software as a Service (Logiciel en tant que Service)",
    category: "Cloud",
    definition: "Modèle Cloud où l'utilisateur consomme directement une application complète prête à l'emploi hébergée par le fournisseur.",
    example: "Microsoft 365, Google Workspace, Salesforce, boîte email en ligne."
  },
  {
    term: "VPC / VNet",
    acronym: "Virtual Private Cloud (AWS/GCP) / Virtual Network (Azure)",
    category: "Réseau",
    definition: "Réseau virtuel isolé dédié à un compte client dans le Cloud, permettant de définir des plages d'adresses, des sous-réseaux et des règles de filtrage.",
    example: "Le réseau privé 10.0.0.0/16 déployé pour héberger l'application ENSIA-Tech."
  },
  {
    term: "Sous-réseau (Subnet) public",
    acronym: "Public Subnet",
    category: "Réseau",
    definition: "Zone du réseau virtuel connectée à une passerelle Internet et contenant des ressources directement exposées au public.",
    example: "Le sous-réseau hébergeant le répartiteur de charge (Load Balancer) ou le portail web."
  },
  {
    term: "Sous-réseau (Subnet) privé",
    acronym: "Private Subnet",
    category: "Réseau",
    definition: "Zone du réseau virtuel sans accès direct depuis Internet, réservée aux serveurs d'application et bases de données.",
    example: "Le sous-réseau où se trouvent les VM applicatives d'ENSIA-Tech."
  },
  {
    term: "Internet Gateway (IGW)",
    acronym: "Passerelle Internet",
    category: "Réseau",
    definition: "Composant réseau géré permettant la communication bidirectionnelle entre les ressources d'un sous-réseau public et Internet.",
    example: "La porte d'entrée qui permet aux étudiants d'accéder au Load Balancer du portail ENSIA-Tech."
  },
  {
    term: "NAT Gateway",
    acronym: "Network Address Translation Gateway (Passerelle de traduction d'adresses)",
    category: "Réseau",
    definition: "Passerelle permettant à des serveurs d'un sous-réseau privé d'accéder à Internet (ex. pour télécharger des mises à jour) sans que des connexions entrantes ne puissent les joindre.",
    example: "Permettre au serveur de base de données de télécharger des correctifs sans être exposé à Internet."
  },
  {
    term: "Load Balancer (LB)",
    acronym: "Répartiteur de charge",
    category: "Réseau",
    definition: "Équipement logique qui distribue le trafic réseau entrant sur plusieurs serveurs pour garantir la haute disponibilité et la performance.",
    example: "Répartir les requêtes des étudiants entre deux serveurs web pour éviter toute surcharge."
  },
  {
    term: "Bastion (Jump Host)",
    acronym: "Serveur Bastion ou Passerelle d'administration",
    category: "Sécurité",
    definition: "Serveur sécurisé et surveillé servant de point d'entrée unique obligatoire pour administrer les machines situées dans les zones privées.",
    example: "Se connecter en SSH au bastion pour ensuite accéder aux serveurs de base de données non exposés."
  },
  {
    term: "Management Plane (Plan de gestion)",
    acronym: "Plan de gestion / Plan de contrôle",
    category: "Cloud",
    definition: "Ensemble des outils, consoles web et API utilisés pour configurer, créer, modifier ou supprimer des ressources Cloud.",
    example: "La console web AWS ou la commande Azure CLI utilisée par un administrateur."
  },
  {
    term: "Data Plane (Plan de données)",
    acronym: "Plan de données / Plan utilisateur",
    category: "Cloud",
    definition: "Flux réseau réels et requêtes applicatives transportant les données des utilisateurs finaux.",
    example: "Les requêtes HTTP des étudiants pour consulter leurs notes sur le portail."
  },
  {
    term: "IAM",
    acronym: "Identity and Access Management (Gestion des Identités et des Accès)",
    category: "Sécurité",
    definition: "Système de sécurité permettant de contrôler QUI (utilisateurs, rôles, services) a le droit de faire QUOI sur les ressources Cloud.",
    example: "Donner à un développeur le droit de redémarrer une VM de test mais lui interdire de supprimer la base de production."
  },
  {
    term: "MFA",
    acronym: "Multi-Factor Authentication (Authentification Multifacteur)",
    category: "Sécurité",
    definition: "Mécanisme exigeant au moins deux preuves d'identité différentes (mot de passe + code temporaire sur smartphone) pour se connecter.",
    example: "Obliger les administrateurs d'AtlasTech à valider une notification sur téléphone après leur mot de passe."
  },
  {
    term: "KMS",
    acronym: "Key Management Service (Service de Gestion des Clés)",
    category: "Sécurité",
    definition: "Service managé de chiffrement permettant de générer, stocker, renouveler et utiliser des clés de chiffrement en toute sécurité.",
    example: "Chiffrer automatiquement les sauvegardes de base de données stockées dans le Cloud."
  },
  {
    term: "WAF",
    acronym: "Web Application Firewall (Pare-feu applicatif web)",
    category: "Sécurité",
    definition: "Pare-feu filtrant spécifiquement les requêtes HTTP/HTTPS pour bloquer les attaques web courantes comme les injections SQL ou XSS.",
    example: "Bloquer une tentative d'injection SQL envoyée dans le formulaire de connexion du portail ENSIA-Tech."
  },
  {
    term: "SIEM",
    acronym: "Security Information and Event Management (Gestion des événements et informations de sécurité)",
    category: "Sécurité",
    definition: "Plateforme centralisant et corrélant les journaux d'événements (logs) de toute l'infrastructure pour détecter des incidents de sécurité.",
    example: "Détecter qu'un même compte admin a tenté 20 connexions échouées depuis 3 pays différents en 5 minutes."
  },
  {
    term: "CSPM",
    acronym: "Cloud Security Posture Management (Gestion de la posture de sécurité Cloud)",
    category: "Sécurité",
    definition: "Outil automatisé qui scanne en continu la configuration Cloud pour détecter des vulnérabilités, des buckets publics ou des écarts de conformité.",
    example: "Recevoir une alerte immédiate lorsqu'un administrateur rend un bucket de stockage public par erreur."
  },
  {
    term: "SecaaS",
    acronym: "Security as a Service (Sécurité en tant que Service)",
    category: "Sécurité",
    definition: "Modèle où des fonctions de sécurité (antivirus, pare-feu, gestion d'identités, SIEM) sont consommées sous forme de services Cloud managés.",
    example: "Souscrire à un WAF ou un service d'authentification managé auprès d'un fournisseur."
  },
  {
    term: "Responsabilité partagée",
    acronym: "Shared Responsibility Model",
    category: "Sécurité",
    definition: "Modèle contractuel définissant précisément ce que le fournisseur sécurise (la sécurité DU Cloud) et ce que le client doit sécuriser (la sécurité DANS le Cloud).",
    example: "AWS protège le serveur physique et l'hyperviseur, mais le client doit installer les mises à jour de sécurité sur sa VM Linux."
  },
  {
    term: "Snapshot",
    acronym: "Instantané d'état",
    category: "Virtualisation",
    definition: "Photographie figée de l'état d'un disque virtuel (et parfois de la mémoire vive) d'une VM à un instant précis, permettant un retour arrière rapide.",
    example: "Prendre un snapshot 'CLEAN-TP1' avant de modifier la configuration réseau pour pouvoir revenir en arrière en cas d'erreur."
  },
  {
    term: "Sauvegarde (Backup)",
    acronym: "Copie de sauvegarde indépendante",
    category: "Stockage",
    definition: "Copie complète et autonome des données et configurations, stockée sur un support séparé (souvent hors ligne) pour permettre une restauration après sinistre.",
    example: "Copier chaque nuit la base de données sur un serveur de stockage déconnecté pour se prémunir des ransomwares."
  },
  {
    term: "Clone",
    acronym: "Copie intégrale autonome de VM",
    category: "Virtualisation",
    definition: "Duplication complète d'une machine virtuelle existante créant une nouvelle VM indépendante avec sa propre identité.",
    example: "Créer une VM de recette identique à la production pour tester une mise à jour d'application."
  },
  {
    term: "Mode NAT (VirtualBox)",
    acronym: "Network Address Translation (Traduction d'adresse réseau)",
    category: "Réseau",
    definition: "Mode réseau où la VM utilise l'adresse IP de l'ordinateur hôte pour sortir sur Internet. La VM accède à l'extérieur, mais l'extérieur ne peut pas la joindre directement.",
    example: "Permettre à votre VM Ubuntu d'exécuter `sudo apt update` sans être exposée aux attaques du réseau local de l'école."
  },
  {
    term: "Internal Network (VirtualBox)",
    acronym: "Réseau interne isolé",
    category: "Réseau",
    definition: "Mode réseau virtuel hermétique où les VM reliées au même nom de réseau peuvent communiquer entre elles, sans aucun accès à l'hôte physique ni à Internet.",
    example: "Le réseau M352-INT permettant à VM-CLIENT (10.10.10.11) de pinguer VM-SRV (10.10.10.12) dans une bulle étanche."
  },
  {
    term: "Host-only Network (VirtualBox)",
    acronym: "Réseau privé hôte-machine",
    category: "Réseau",
    definition: "Mode réseau créant une liaison privée exclusive entre l'ordinateur hôte et ses machines virtuelles, sans exposition sur le réseau physique externe.",
    example: "Permettre à votre PC physique de se connecter en SSH à VM-SRV sans que vos voisins de classe puissent la voir."
  },
  {
    term: "Bridged (Accès par pont)",
    acronym: "Pont réseau physique",
    category: "Réseau",
    definition: "Mode réseau où la carte réseau de la VM est directement connectée au switch physique comme si c'était un câble réel. La VM reçoit une IP du réseau local réel.",
    example: "Faire apparaître votre VM comme un ordinateur supplémentaire sur la box de votre maison."
  },
  {
    term: "Hardening (Durcissement)",
    acronym: "Durcissement de sécurité",
    category: "Sécurité",
    definition: "Processus consistant à sécuriser un système en réduisant sa surface d'attaque : arrêt des services inutiles, fermeture des ports, politiques de mots de passe, pare-feu.",
    example: "Configurer UFW sur Ubuntu avec `default deny incoming` et autoriser uniquement le port 22 pour SSH."
  },
  {
    term: "UFW",
    acronym: "Uncomplicated Firewall (Pare-feu simplifié Linux)",
    category: "Sécurité",
    definition: "Interface simplifiée en ligne de commande pour administrer le pare-feu Netfilter/iptables sous Ubuntu Linux.",
    example: "La commande `sudo ufw allow 22/tcp` pour ouvrir le port d'administration SSH."
  },
  {
    term: "Actif (Asset)",
    acronym: "Actif / Bien à protéger",
    category: "Risques",
    definition: "Tout élément ayant une valeur pour l'organisation et nécessitant une protection (serveur, données clients, réputation, console admin).",
    example: "La base de données clients `DB-01` d'AtlasTech contenant des informations confidentielles."
  },
  {
    term: "Menace (Threat)",
    acronym: "Menace",
    category: "Risques",
    definition: "Cause potentielle d'un incident de sécurité qui pourrait nuire à un système ou à l'organisation (attaquant externe, ransomware, administrateur imprudent).",
    example: "Un groupe de cybercriminels diffusant un rançongiciel sur le réseau."
  },
  {
    term: "Vulnérabilité (Vulnerability)",
    acronym: "Vulnérabilité / Faille",
    category: "Risques",
    definition: "Faiblesse ou faille dans un système, une configuration ou une procédure qui peut être exploitée par une menace.",
    example: "Un hyperviseur qui n'a reçu aucune mise à jour de sécurité depuis 6 mois."
  },
  {
    term: "Risque (Risk)",
    acronym: "Risque = Vraisemblance x Impact",
    category: "Risques",
    definition: "Probabilité qu'une menace exploite une vulnérabilité et cause des dommages mesurables à un actif.",
    example: "La possibilité qu'un attaquant exploite la faille de l'hyperviseur pour compromettre toutes les VM de l'entreprise."
  },
  {
    term: "Risque résiduel",
    acronym: "Residual Risk",
    category: "Risques",
    definition: "Niveau de risque subsistant après la mise en œuvre de l'ensemble des mesures de sécurité et de contrôle.",
    example: "Après activation du MFA et de comptes nominatifs, le risque résiduel de vol de session devient modéré et acceptable."
  }
];

