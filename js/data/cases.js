// Études de cas guidées avec mode entraînement interactif
window.M352_CASES = [
  {
    id: "case-ensiatech",
    title: "Étude de Cas 1 • ENSIA-Tech : De la Virtualisation à l'Architecture Cloud Hybride",
    badge: "Fil Rouge CH1 + CH2",
    context: "L'école d'ingénieurs ENSIA-Tech possède 200 utilisateurs et 5 serveurs physiques vieillissants et sous-utilisés (Web, ERP, DB, Fichiers, Annuaire AD). Elle doit moderniser ses services pour lancer un portail d'examens accessible aux étudiants du monde entier tout en protégeant les notes confidentielles.",
    steps: [
      {
        stepNumber: 1,
        title: "Étape 1 : Diagnostic initial et choix de virtualisation",
        question: "Pourquoi est-il irrationnel de conserver 1 serveur physique pour chaque service ? Quels composants techniques recommandez-vous de déployer en premier lieu ?",
        promptHint: "Pensez au dimensionnement pour le pic, aux 85% de CPU gaspillés et à la consolidation.",
        officialSolution: "💡 Solution officielle du cours (CH1) : Dans le modèle traditionnel, chaque serveur est dimensionné pour le pic annuel (ex: 16 vCPU / 64 Go RAM) mais affiche une utilisation moyenne réelle de seulement 15% CPU et 20% RAM, gaspillant 85% de la puissance. On consolide ces services sous forme de machines virtuelles (VM Web Linux, VM DB Linux, VM AD Windows) exécutées sur un hyperviseur pour mutualiser le matériel physique tout en conservant une isolation logique stricte."
      },
      {
        stepNumber: 2,
        title: "Étape 2 : Choix des modèles de service (IaaS, PaaS, SaaS)",
        question: "Pour chaque besoin (Portail web à forte affluence, ERP interne avec personnalisations du noyau, Suite bureautique des enseignants), quel modèle de service (IaaS / PaaS / SaaS) choisissez-vous et pourquoi ?",
        promptHint: "Qui gère l'OS ? Qui gère l'application ?",
        officialSolution: "💡 Solution officielle du cours (CH1 & CH2) :\n- Portail web : PaaS pour un déploiement rapide et élastique sans s'occuper de patcher l'OS.\n- ERP et outils de détection d'intrusion spécifiques : IaaS car le client a besoin du contrôle complet du système d'exploitation Linux et de ses configurations.\n- Suite bureautique et messagerie : SaaS car l'application prête à l'emploi est directement consommée sans maintenance d'infrastructure."
      },
      {
        stepNumber: 3,
        title: "Étape 3 : Choix du modèle de déploiement et découpage réseau",
        question: "Quel modèle de déploiement (Public, Privé, Hybride) recommandez-vous pour ENSIA-Tech ? Comment découper le réseau virtuel en zones étanches ?",
        promptHint: "Pensez à la sensibilité des notes et à l'accès mondial des étudiants.",
        officialSolution: "💡 Solution officielle du cours (CH2) : Modèle Hybride recommandé. Le portail web public est hébergé dans le Cloud public pour bénéficier de l'élasticité rapide lors des pics de connexion, tandis que la base de données des notes et l'annuaire sont hébergés dans un environnement privé ou local contrôlé, reliés par un tunnel VPN IPsec sécurisé. Côté réseau Cloud : découpage en Subnet public (Load Balancer / WAF), Subnet privé (Serveurs applicatifs) et Zone Données sans IP publique."
      },
      {
        stepNumber: 4,
        title: "Étape 4 : Sécurisation de l'accès d'administration et journalisation",
        question: "Comment les administrateurs d'ENSIA-Tech doivent-ils administrer les serveurs privés à distance ? Quels contrôles indispensables et quelles preuves d'audit mettre en place ?",
        promptHint: "Pensez au bastion, au MFA et au principe du moindre privilège.",
        officialSolution: "💡 Solution officielle du cours (CH2) : L'administration à distance doit impérativement transiter par un serveur Bastion (Jump Host) ou une passerelle VPN avec authentification multifacteur (MFA) obligatoire et comptes individuels nominatifs. Aucun accès SSH direct ne doit être ouvert sur Internet (interdire 0.0.0.0/0 port 22). Toutes les actions administratives et appels API doivent être centralisés dans les logs (ex: CloudTrail/Activity Logs) et envoyés vers un SIEM."
      }
    ]
  },
  {
    id: "case-atlastech",
    title: "Étude de Cas 2 • AtlasTech : Analyse Structurée des Risques d'un Hyperviseur",
    badge: "Méthode TD1 Complète",
    context: "AtlasTech est une PME de services numériques gérée par 3 administrateurs. Un unique serveur physique HYP-01 héberge 4 VM critiques (WEB-01, APP-01, DB-01, AD-01) et un serveur de sauvegarde BACKUP-01. Un pré-audit révèle des vulnérabilités critiques.",
    steps: [
      {
        stepNumber: 1,
        title: "Étape 1 : Cartographie des vulnérabilités de pré-audit",
        question: "Citez 5 vulnérabilités majeures constatées lors du pré-audit d'AtlasTech et expliquez pourquoi la combinaison 'Compte admin partagé + Absence de MFA + Réseau plat' est critique.",
        promptHint: "Rappelez-vous les 9 constats du TD1.",
        officialSolution: "💡 Proposition de corrigé (TD1) : Les 5 vulnérabilités clés sont : 1) Hyperviseur non patché depuis 6 mois ; 2) Compte administrateur partagé sans traçabilité ; 3) Absence de MFA sur la console de management ; 4) Réseau plat peu segmenté ; 5) Sauvegardes montées en continu en écriture. Cette combinaison est dévastatrice car un attaquant devinant le mot de passe partagé prend le contrôle total de la console sans être bloqué par un second facteur et peut rebondir instantanément sur toutes les VM sans obstacle réseau."
      },
      {
        stepNumber: 2,
        title: "Étape 2 : Cotation rigoureuse des risques R1 (Console) et R4 (Ransomware)",
        question: "Appliquez la formule Risque = Vraisemblance (1-5) × Impact (1-5) aux scénarios R1 (Compromission console admin) et R4 (Ransomware chiffrant VM et sauvegardes montées). Quel est leur score et leur niveau de priorité ?",
        promptHint: "Utilisez la matrice 1-4 (Faible), 5-9 (Modéré), 10-16 (Élevé), 17-25 (Critique).",
        officialSolution: "💡 Proposition de corrigé (TD1) :\n- R1 (Console admin) : Vraisemblance = 4 (Probable, compte partagé sans MFA) × Impact = 5 (Critique, destruction possible de toutes les VM) = Score 20 -> Niveau CRITIQUE.\n- R4 (Ransomware) : Vraisemblance = 4 (Probable, sauvegardes montées en continu) × Impact = 5 (Critique, perte irréversible de la production et des backups) = Score 20 -> Niveau CRITIQUE.\nCes deux risques représentent la priorité absolue d'intervention (P1)."
      },
      {
        stepNumber: 3,
        title: "Étape 3 : Plan de remédiation prioritaire (Traitement des risques)",
        question: "Proposez des mesures concrètes pour traiter R1 et R4 en précisant le type de traitement (Réduire, Éviter, Transférer, Accepter).",
        promptHint: "Mots-clés : Comptes nominatifs, MFA, Sauvegardes hors ligne, Immuabilité.",
        officialSolution: "💡 Proposition de corrigé (TD1) : Traitement de type 'RÉDUIRE' pour les deux risques :\n- Pour R1 : Créer 3 comptes nominatifs distincts, supprimer le compte générique 'admin', activer le MFA matériel obligatoire, et restreindre l'accès à la console à un VLAN d'administration isolé.\n- Pour R4 : Démonter les partages de sauvegarde en continu, isoler BACKUP-01 sur un réseau dédié étanche, configurer un stockage immuable (WORM) ou déconnecté (Air-gap), et exécuter un test mensuel de restauration."
      },
      {
        stepNumber: 4,
        title: "Étape 4 : Évaluation du risque résiduel et décision",
        question: "Après mise en œuvre de ces contrôles pour R1, recalculez la vraisemblance, l'impact et le score résiduel. L'entreprise peut-elle accepter ce risque résiduel ?",
        promptHint: "Le MFA fait chuter la vraisemblance.",
        officialSolution: "💡 Proposition de corrigé (TD1) : Avec des comptes individuels, le MFA obligatoire et une console non exposée, la Vraisemblance chute à 1 (Rare). L'Impact intrinsèque reste fort en théorie si un admin se fait extorquer ses facteurs (4 - Élevé). Nouveau score résiduel : 1 × 4 = 4 -> Niveau FAIBLE. Décision : AtlasTech peut valider et ACCEPTER ce risque résiduel car il est désormais sous surveillance et en dessous du seuil critique d'acceptation."
      }
    ]
  },
  {
    id: "case-bonus-s3",
    title: "Étude de Cas 3 (Bonus) • La Fuite du Bucket de Sauvegardes Publiques",
    badge: "💡 Ajout pédagogique",
    context: "Une clinique médicale héberge ses archives radiologiques et ses sauvegardes de bases de données dans un bucket de stockage Cloud (compatible S3). Lors d'une mise à jour de son script de sauvegarde automatique, un technicien active l'option d'accès en lecture publique pour simplifier les téléchargements de test. Deux semaines plus tard, un cabinet de cybersécurité découvre que 50 000 dossiers médicaux sont indexés par les moteurs de recherche.",
    steps: [
      {
        stepNumber: 1,
        title: "Étape 1 : Analyse de la responsabilité",
        question: "Qui est juridiquement et techniquement responsable de cette fuite selon le modèle de responsabilité partagée du Cloud : le fournisseur Cloud ou la clinique ?",
        promptHint: "Rappelez-vous le cours CH2 sur les buckets publics.",
        officialSolution: "💡 Correction pédagogique : La responsabilité incombe à 100% à la clinique (le client). Le fournisseur Cloud fournit des mécanismes de sécurité robustes (option de blocage global 'Block Public Access', chiffrement par défaut), mais la décision de modifier la politique d'accès (Bucket Policy / ACL) relève de la configuration gérée par le client."
      },
      {
        stepNumber: 2,
        title: "Étape 2 : Pourquoi le chiffrement par défaut n'a pas empêché la fuite ?",
        question: "Les fichiers étaient pourtant chiffrés au repos avec des clés SSE. Pourquoi les internautes ont-ils quand même pu télécharger les radios en clair ?",
        promptHint: "Revoir la nuance entre chiffrement au repos et droits d'accès au niveau applicatif.",
        officialSolution: "💡 Correction pédagogique (Piège classique !) : Le chiffrement au repos (Server-Side Encryption) protège contre le vol physique des disques dans le datacenter. Mais lorsqu'un internaute envoie une requête HTTP GET vers un bucket public, le service de stockage vérifie la politique d'accès : constatant que l'accès public est autorisé, il déchiffre automatiquement le fichier à la volée avant de l'envoyer au navigateur !"
      },
      {
        stepNumber: 3,
        title: "Étape 3 : Contrôles préventifs et outils SecaaS",
        question: "Quels contrôles préventifs et quel service SecaaS auraient permis d'éviter ou de détecter immédiatement cette mauvaise configuration ?",
        promptHint: "Pensez au CSPM et aux options d'accès public.",
        officialSolution: "💡 Correction pédagogique :\n1. Activer au niveau du compte Cloud la fonction 'Block Public Access' (interdiction absolue de créer des buckets publics sans validation hiérarchique).\n2. Déployer un outil SecaaS de type CSPM (Cloud Security Posture Management) qui scanne l'environnement en temps réel et aurait levé une alerte d'urgence dans les 30 secondes suivant la modification du bucket.\n3. Activer la journalisation d'audit des accès (S3 Access Logs / CloudTrail) pour détecter les pics de téléchargements anormaux."
      }
    ]
  },
  {
    id: "case-bonus-iam",
    title: "Étude de Cas 4 (Bonus) • Clé d'API GitHub et Prise de Contrôle du Management Plane",
    badge: "💡 Ajout pédagogique",
    context: "Un développeur d'une startup fintech travaille sur un script d'automatisation. Pour gagner du temps, il utilise les identifiants 'root' du compte Cloud et stocke la clé d'API (Access Key & Secret Key) en dur dans le code source de son script Python. Par réflexe, il pousse son commit sur un dépôt public GitHub à 23h00.",
    steps: [
      {
        stepNumber: 1,
        title: "Étape 1 : Le mécanisme de l'attaque sur le Management Plane",
        question: "Pourquoi cette fuite est-elle beaucoup plus dévastatrice qu'une faille web classique sur un serveur ? Par où l'attaquant passe-t-il ?",
        promptHint: "Distinguer Data Plane et Management Plane.",
        officialSolution: "💡 Correction pédagogique : L'attaquant n'attaque pas le site web ni les ports réseau (Data Plane) : il attaque directement le Management Plane (l'API de contrôle du Cloud). Des robots surveillent en continu les commits publics de GitHub. En quelques minutes, un bot récupère la clé 'root' et utilise l'API de gestion du fournisseur pour prendre le contrôle absolu de toute l'infrastructure (création de VM pirates, effacement des bases de production, modification des pare-feux)."
      },
      {
        stepNumber: 2,
        title: "Étape 2 : Mesures de remédiation immédiates",
        question: "Si vous découvrez cet incident 2 heures après le push, quelles sont les 3 actions d'extrême urgence à entreprendre ?",
        promptHint: "Pensez à la clé, aux sessions et aux ressources créées.",
        officialSolution: "💡 Correction pédagogique :\n1. Révoquer et supprimer immédiatement la clé d'API compromise dans la console IAM du fournisseur.\n2. Invalider toutes les sessions actives et changer le mot de passe du compte root avec activation immédiate du MFA matériel.\n3. Auditer les journaux d'audit (CloudTrail/Activity Logs) pour lister toutes les actions exécutées par l'attaquant (détecter et détruire les instances EC2 créées pour miner des cryptomonnaies, vérifier si des snapshots ont été partagés avec des comptes externes)."
      },
      {
        stepNumber: 3,
        title: "Étape 3 : Bonnes pratiques d'hygiène IAM",
        question: "Quelles règles de sécurité fondamentales auraient empêché ce scénario catastrophe ?",
        promptHint: "Rôles temporaires, moindre privilège, secrets managers.",
        officialSolution: "💡 Correction pédagogique :\n- Règle d'or : Ne JAMAIS générer de clé d'API pour le compte root (ce compte doit être verrouillé avec MFA et réservé aux urgences).\n- Utiliser le principe du moindre privilège (RBAC) avec des permissions ultra-restreintes.\n- Utiliser des rôles temporaires (IAM Roles / Instance Profiles) qui fournissent des tokens éphémères renouvelés automatiquement au lieu de clés statiques permanentes.\n- Utiliser un gestionnaire de secrets (KMS / AWS Secrets Manager) et configurer des outils de détection de secrets dans les pipelines Git (GitGuardian, TruffleHog)."
      }
    ]
  },
  {
    id: "case-bonus-vm",
    title: "Étude de Cas 5 (Bonus) • La VM de Test Isolée mais Porte Dérobée Interne",
    badge: "💡 Ajout pédagogique",
    context: "Pour tester un nouveau serveur web Apache, un technicien crée une VM de test sur l'hyperviseur interne de l'entreprise. Pensant qu'il ne s'agit que d'un test temporaire, il laisse le mot de passe utilisateur par défaut 'ubuntu', ne configure aucun pare-feu UFW, et active l'Adaptateur réseau en mode 'Accès par pont' (Bridged) pour tester depuis son téléphone portable. Le test terminé le vendredi à 18h, la machine est laissée allumée tout le week-end.",
    steps: [
      {
        stepNumber: 1,
        title: "Étape 1 : Erreur sur le choix du mode réseau",
        question: "Pourquoi le choix du mode 'Bridged' était-il très dangereux comparé aux modes 'NAT' ou 'Host-only' du cours ?",
        promptHint: "Revoir la visibilité sur le réseau physique local.",
        officialSolution: "💡 Correction pédagogique : En mode Bridged, la VM se connecte directement au commutateur réseau physique réel de l'entreprise et obtient une adresse IP sur le réseau local interne. Elle devient visible et accessible par toutes les autres machines du bâtiment. En mode NAT, la VM n'aurait été joignable depuis l'extérieur par personne ; en mode Host-only, seul le PC de l'étudiant aurait pu y accéder."
      },
      {
        stepNumber: 2,
        title: "Étape 2 : Le concept de 'Machine Fantôme'",
        question: "Pourquoi laisser une VM de test allumée sans inventaire strict représente-t-il un risque d'attaque majeur (concept de machine fantôme) ?",
        promptHint: "Pensez au durcissement, aux mises à jour et au pré-audit AtlasTech.",
        officialSolution: "💡 Correction pédagogique (Point clé de CH3 !) : Une VM de test oubliée devient une 'machine fantôme' (Shadow IT). Comme personne ne s'en occupe, elle ne reçoit aucun correctif de sécurité et conserve des mots de passe triviaux. Si un poste du réseau local interne est infecté, l'attaquant découvre cette machine non protégée, s'en empare en 10 secondes et s'en sert comme point d'ancrage permanent (bastion pirate) pour attaquer les serveurs critiques de production."
      },
      {
        stepNumber: 3,
        title: "Étape 3 : Procédure de durcissement et cycle de vie",
        question: "Donnez les 3 règles de gestion du cycle de vie des VM à imposer dans la politique de l'entreprise pour éradiquer ce problème.",
        promptHint: "Checklist ingénieur CH3.",
        officialSolution: "💡 Correction pédagogique :\n1. Inventaire obligatoire et systématique de toutes les VM actives avec date d'expiration planifiée pour les environnements de test.\n2. Politiques de sécurité dès l'installation : interdiction des mots de passe par défaut, activation systématique d'UFW avec refus par défaut en entrée (`default deny incoming`).\n3. Extinction et décommissionnement automatique des VM temporaires en fin de journée."
      }
    ]
  }
];

