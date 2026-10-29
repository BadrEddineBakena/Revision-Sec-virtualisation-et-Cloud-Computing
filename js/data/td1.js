// TD1 - Analyse des Risques d'un Environnement Virtualisé (AtlasTech)
window.M352_TD1 = {
  id: "td1",
  title: "TD1 – Analyse des Risques : Cas AtlasTech",
  subtitle: "Méthode formelle d'analyse des risques (Actifs, Menaces, Vulnérabilités, Matrice V × I, Traitement et Risque Résiduel)",
  summary: "Étude de cas guidée et interactive sur la PME AtlasTech : identification des actifs critiques, cotation rigoureuse des risques R1 à R6, stratégies de remédiation et questions de synthèse corrigées.",

  // Présentation du cas AtlasTech
  caseStudy: {
    company: "AtlasTech (PME de services numériques)",
    team: "3 administrateurs système et réseau",
    architecture: {
      host: "HYP-01 (Serveur physique hébergeant l'hyperviseur et l'intégralité des VM)",
      components: [
        { name: "HYP-01", role: "Hyperviseur physique et exécution des VM", zone: "VLAN administration", criticality: "Très élevée", desc: "Racine technique de confiance hébergeant toutes les machines virtuelles." },
        { name: "WEB-01", role: "Portail Web public de services", zone: "DMZ (accessible depuis Internet)", criticality: "Élevée", desc: "Point d'entrée principal des clients et internautes extérieurs." },
        { name: "APP-01", role: "Serveur d'application métier", zone: "Réseau serveurs", criticality: "Très élevée", desc: "Traite la logique applicative et communique avec la base de données." },
        { name: "DB-01", role: "Base de données clients et contrats", zone: "Réseau serveurs", criticality: "Très élevée", desc: "Contient les données les plus sensibles et confidentielles de l'entreprise." },
        { name: "AD-01", role: "Contrôleur de domaine Active Directory", zone: "Réseau interne", criticality: "Très élevée", desc: "Gère l'authentification centrale de tous les utilisateurs et serveurs." },
        { name: "BACKUP-01", role: "Serveur de stockage des sauvegardes de VM", zone: "Réseau sauvegarde", criticality: "Très élevée", desc: "Stocke les copies de sauvegarde pour la reprise d'activité." }
      ],
      flux: "Internet -> Pare-feu -> WEB-01 (DMZ) -> APP-01 -> DB-01. Les utilisateurs internes accèdent à APP-01. AD-01 assure l'authentification. HYP-01 héberge WEB-01, APP-01, DB-01 et AD-01."
    },
    auditFindings: [
      "1. L'hyperviseur physique HYP-01 n'a reçu AUCUN correctif de sécurité depuis 6 mois.",
      "2. Un compte administrateur partagé unique ('admin') est encore utilisé par les 3 administrateurs.",
      "3. L'authentification multifacteur (MFA) est totalement absente sur la console d'administration.",
      "4. Le réseau virtuel des VM est peu segmenté (réseau plat facilitant les rebonds).",
      "5. De vieux snapshots datant de plusieurs mois sont conservés sans surveillance sur le stockage.",
      "6. Les volumes de sauvegardes sont montés en permanence sur le réseau avec accès en écriture direct.",
      "7. Les modèles (templates) de VM contiennent des comptes utilisateurs avec mots de passe par défaut.",
      "8. Les journaux d'événements (logs) sont conservés uniquement localement sur chaque machine.",
      "9. Les outils d'intégration invités (Guest Additions / Tools) de certaines VM sont obsolètes."
    ]
  },

  // Matrice de cotation officielle
  matrix: {
    formula: "Risque = Vraisemblance (V) × Impact (I)",
    scales: {
      likelihood: [
        { score: 1, label: "Rare", desc: "Événement exceptionnel ou quasi impossible" },
        { score: 2, label: "Peu probable", desc: "Faible fréquence de survenue" },
        { score: 3, label: "Possible", desc: "Pourrait se produire dans des conditions courantes" },
        { score: 4, label: "Probable", desc: "Forte probabilité de survenue à court ou moyen terme" },
        { score: 5, label: "Très probable", desc: "Presque certain ou déjà observé fréquemment" }
      ],
      impact: [
        { score: 1, label: "Négligeable", desc: "Aucun préjudice notable sur l'activité" },
        { score: 2, label: "Faible", desc: "Perturbation mineure sans perte financière grave" },
        { score: 3, label: "Modéré", desc: "Indisponibilité temporaire ou perte partielle réparable" },
        { score: 4, label: "Élevé", desc: "Interruption sévère d'activité ou fuite de données importante" },
        { score: 5, label: "Critique", desc: "Cessation d'activité, destruction totale ou faillite" }
      ]
    },
    levels: [
      { range: "1–4", level: "Faible", color: "green", desc: "Risque tolérable, surveillance périodique" },
      { range: "5–9", level: "Modéré", color: "yellow", desc: "Risque acceptable sous conditions, mesures prévues" },
      { range: "10–16", level: "Élevé", color: "orange", desc: "Risque inacceptable, plan d'action obligatoire à court terme" },
      { range: "17–25", level: "Critique", color: "red", desc: "Risque intolérable, remédiation d'urgence absolue" }
    ]
  },

  // Exercices du TD avec mode entraînement + proposition de corrigé
  exercises: [
    {
      id: "td1-ex1",
      number: 1,
      title: "Exercice 1 — Identifier et Classer les Actifs d'AtlasTech",
      prompt: "Identifiez au moins 8 actifs majeurs à protéger dans l'environnement AtlasTech et classez-les dans les catégories : Matériel, Logiciel, Données, Identité, Réseau, Sauvegarde, Administration.",
      proposedSolution: [
        { actif: "Serveur physique HYP-01", categorie: "Matériel", responsable: "Responsable Infrastructure", importance: "Héberge l'intégralité du système d'information ; sa panne matérielle arrête toutes les VM." },
        { actif: "Hyperviseur (VMM)", categorie: "Logiciel", responsable: "Administrateur Système", importance: "Racine technique qui gère l'allocation des ressources et l'isolation logique de toutes les VM." },
        { actif: "Base de données clients (DB-01)", categorie: "Données", responsable: "Responsable Métier / DPO", importance: "Contient les contrats et données personnelles critiques de l'entreprise (valeur patrimoniale)." },
        { actif: "Portail Web public (WEB-01)", categorie: "Logiciel", responsable: "Équipe Web / Dev", importance: "Vitrine commerciale et point de contact direct avec les clients externes." },
        { actif: "Annuaire d'authentification AD-01", categorie: "Identité", responsable: "Administrateur Sécurité", importance: "Contrôle les accès, mots de passe et privilèges de tous les collaborateurs et services." },
        { actif: "Commutateur virtuel (vSwitch) & VLANs", categorie: "Réseau", responsable: "Administrateur Réseau", importance: "Achemine et cloisonne les flux réseau entre la DMZ publique et les bases de données." },
        { actif: "Fichiers de sauvegarde (BACKUP-01)", categorie: "Sauvegarde", responsable: "Responsable Exploitation", importance: "Ultime rempart permettant de restaurer l'activité en cas de sinistre ou de ransomware." },
        { actif: "Console d'administration de l'hyperviseur", categorie: "Administration", responsable: "Équipe IT (3 admins)", importance: "Interface de contrôle suprême permettant de créer, modifier ou effacer les VM." }
      ]
    },
    {
      id: "td1-ex2",
      number: 2,
      title: "Exercice 2 — Menaces, Vulnérabilités et Scénarios de Risque",
      prompt: "À partir des constats du pré-audit, complétez au moins 6 scénarios de risque en distinguant rigoureusement : Menace ≠ Vulnérabilité exploitée ≠ Scénario ≠ Actif impacté.",
      proposedSolution: [
        {
          id: "S1",
          menace: "Attaquant externe opportuniste ou cybercriminel",
          vulnerabilite: "Compte admin partagé avec mot de passe faible et absence totale de MFA",
          scenario: "Un pirate devine ou intercepte les identifiants d'administration, accède à la console d'HYP-01 et prend le contrôle total de toutes les VM.",
          actif: "Console d'administration & Hyperviseur HYP-01"
        },
        {
          id: "S2",
          menace: "Groupe pirate ciblant les vulnérabilités publiques",
          vulnerabilite: "Hyperviseur non mis à jour depuis 6 mois (correctifs absents)",
          scenario: "Un attaquant ayant compromis WEB-01 exploite une faille connue d'évasion de VM (VM Escape) dans l'hyperviseur pour exécuter du code sur l'hôte physique.",
          actif: "Hyperviseur HYP-01 et toutes les VM"
        },
        {
          id: "S3",
          menace: "Attaquant ayant réussi une intrusion sur le serveur web",
          vulnerabilite: "Réseau virtuel plat et peu segmenté entre la DMZ et le réseau interne",
          scenario: "Après avoir pris pied sur WEB-01, l'attaquant rebondit facilement sur APP-01 puis DB-01 sans être bloqué par un pare-feu interne.",
          actif: "Application APP-01 et Base de données DB-01"
        },
        {
          id: "S4",
          menace: "Rançongiciel (Ransomware) automatisé",
          vulnerabilite: "Partages de sauvegarde montés en permanence sur le réseau avec droits d'écriture",
          scenario: "Un rançongiciel infecte une machine, découvre le partage BACKUP-01 accessible en continu et chiffre simultanément les VM de production et leurs sauvegardes.",
          actif: "Serveur BACKUP-01 et Données de l'entreprise"
        },
        {
          id: "S5",
          menace: "Utilisateur interne curieux ou attaquant avec accès local",
          vulnerabilite: "Vieux snapshots oubliés non nettoyés et non chiffrés",
          scenario: "Une personne accède aux anciens fichiers de snapshots conservés sur le disque et y extrait des données clients ou des secrets de configuration non révoqués.",
          actif: "Données clients & Snapshots de VM"
        },
        {
          id: "S6",
          menace: "Stagiaire imprudent ou attaquant automatisé",
          vulnerabilite: "Modèles (templates) de VM configurés avec des mots de passe par défaut",
          scenario: "Une nouvelle VM est créée à partir du modèle ; l'attaquant utilise les identifiants par défaut connus pour s'y connecter immédiatement sans effort.",
          actif: "Nouvelles VM créées"
        }
      ]
    },
    {
      id: "td1-ex3",
      number: 3,
      title: "Exercice 3 — Évaluer et Prioriser les Risques (R1 à R6)",
      prompt: "Évaluez les 6 scénarios officiels avec la matrice Vraisemblance (1-5) × Impact (1-5) et justifiez chaque score en une phrase simple.",
      scenariosCotation: [
        {
          id: "R1",
          title: "Compromission de la console d'administration via identifiants partagés sans MFA",
          V: 4,
          I: 5,
          score: 20,
          niveau: "Critique",
          color: "red",
          justification: "💡 Proposition de corrigé : La vraisemblance est probable (4) car 3 administrateurs partagent un mot de passe sans MFA, et l'impact est critique (5) car la console donne un contrôle destructeur immédiat sur toutes les VM de l'entreprise."
        },
        {
          id: "R2",
          title: "Exploitation d'une vulnérabilité non corrigée de l'hyperviseur (VM Escape)",
          V: 3,
          I: 5,
          score: 15,
          niveau: "Élevé",
          color: "orange",
          justification: "💡 Proposition de corrigé : La vraisemblance est possible (3) car aucune mise à jour n'a été faite depuis 6 mois, et l'impact est critique (5) car une compromission de l'hyperviseur brise l'isolation et met en péril l'intégralité du système."
        },
        {
          id: "R3",
          title: "Propagation latérale depuis WEB-01 vers APP-01 / DB-01 (réseau plat)",
          V: 4,
          I: 4,
          score: 16,
          niveau: "Élevé",
          color: "orange",
          justification: "💡 Proposition de corrigé : La vraisemblance est probable (4) car WEB-01 est directement exposé sur Internet et communique librement avec le réseau interne, et l'impact est élevé (4) car la base de données clients est directement menacée."
        },
        {
          id: "R4",
          title: "Ransomware chiffrant les VM de production et les sauvegardes montées",
          V: 4,
          I: 5,
          score: 20,
          niveau: "Critique",
          color: "red",
          justification: "💡 Proposition de corrigé : La vraisemblance est probable (4) car les sauvegardes sont montées en permanence en écriture, et l'impact est critique (5) car la destruction simultanée de la production et des sauvegardes met l'entreprise en faillite."
        },
        {
          id: "R5",
          title: "Exposition de données sensibles contenues dans un snapshot ancien oublié",
          V: 3,
          I: 3,
          score: 9,
          niveau: "Modéré",
          color: "yellow",
          justification: "💡 Proposition de corrigé : La vraisemblance est possible (3) en raison de l'absence de politique de cycle de vie des snapshots, et l'impact est modéré (3) car il concerne une fuite partielle de données sans arrêt de service."
        },
        {
          id: "R6",
          title: "Utilisation d'un compte par défaut présent dans un modèle de VM",
          V: 3,
          I: 3,
          score: 9,
          niveau: "Modéré",
          color: "yellow",
          justification: "💡 Proposition de corrigé : La vraisemblance est possible (3) car chaque déploiement crée une machine pré-configurée avec un compte connu, et l'impact est modéré (3) car il compromet une VM individuelle sans toucher d'office l'hyperviseur."
        }
      ],
      ranking: "Classement par gravité : R1 (20 - Critique) et R4 (20 - Critique) en priorité absolue, suivis de R3 (16 - Élevé), R2 (15 - Élevé), puis R5 (9 - Modéré) et R6 (9 - Modéré)."
    },
    {
      id: "td1-ex4",
      number: 4,
      title: "Exercice 4 — Traitement des Risques Majeurs (R1, R4, R3, R2)",
      prompt: "Pour les 4 risques les plus importants (R1, R4, R3, R2), proposez des mesures concrètes et indiquez le type de traitement : Réduire, Éviter, Transférer ou Accepter.",
      proposedSolution: [
        {
          risque: "R1 — Compromission console admin",
          type: "Réduire",
          priorite: "P1 (Urgence absolue)",
          mesures: "Créer 3 comptes nominatifs distincts pour les admins, supprimer le compte partagé générique, activer obligatoirement le MFA sur la console et restreindre l'accès à un VLAN d'administration isolé."
        },
        {
          risque: "R4 — Ransomware chiffrant VM et sauvegardes",
          type: "Réduire",
          priorite: "P1 (Urgence absolue)",
          mesures: "Démonter immédiatement les partages de sauvegarde en continu, isoler BACKUP-01 sur un réseau dédié, configurer un stockage immuable (WORM / Write Once Read Many) ou déconnecté (Air-gap), et tester la restauration mensuelle."
        },
        {
          risque: "R3 — Propagation latérale depuis WEB-01",
          type: "Réduire",
          priorite: "P2 (Court terme)",
          mesures: "Segmenter le réseau avec un pare-feu filtrant entre la DMZ et le réseau privé des serveurs ; n'autoriser depuis WEB-01 que le port applicatif strict vers APP-01 (interdire tout accès direct à DB-01)."
        },
        {
          risque: "R2 — Faille hyperviseur non patché",
          type: "Réduire",
          priorite: "P2 (Court terme)",
          mesures: "Mettre en place une procédure régulière de patch management : tester et appliquer les correctifs de l'hyperviseur HYP-01 lors d'une fenêtre de maintenance planifiée après sauvegarde de précaution."
        }
      ]
    },
    {
      id: "td1-ex5",
      number: 5,
      title: "Exercice 5 — Risque Résiduel et Décision d'Acceptation",
      prompt: "Choisissez deux risques élevés/critiques (ex: R1 et R4). Après application de vos mesures de sécurité, estimez le nouveau risque résiduel et argumentez la décision pour AtlasTech.",
      proposedSolution: [
        {
          risque: "R1 — Console d'administration",
          initialScore: "V:4 × I:5 = 20 (Critique)",
          mesuresAppliquees: "Comptes individuels, MFA matériel obligatoire, console accessible uniquement depuis les postes d'admins autorisés sur VLAN dédié.",
          residualScore: "V:1 × I:4 = 4 (Faible)",
          decision: "💡 Décision argumentée : Le risque résiduel tombe à 4 (Faible). L'entreprise AtlasTech peut l'ACCEPTER car le vol accidentel d'identifiants ne suffit plus pour se connecter (MFA requis) et le canal d'accès est drastiquement restreint."
        },
        {
          risque: "R4 — Attaque par Ransomware",
          initialScore: "V:4 × I:5 = 20 (Critique)",
          mesuresAppliquees: "Sauvegardes déconnectées hors ligne (Air-gapped), politique de stockage immuable et tests de restauration documentés.",
          residualScore: "V:2 × I:3 = 6 (Modéré)",
          decision: "💡 Décision argumentée : Le risque résiduel tombe à 6 (Modéré). L'entreprise peut l'ACCEPTER sous réserve de maintenir une vérification trimestrielle des sauvegardes hors-ligne, car même en cas d'infection d'une VM, l'entreprise est désormais garantie de pouvoir reconstruire ses données sans payer de rançon."
        }
      ]
    }
  ],

  // Questions de synthèse officielles de TD1 (1 à 5)
  synthesisQuestions: [
    {
      id: "td1-synth-1",
      number: 1,
      q: "1. Pourquoi l'hyperviseur est-il un actif particulièrement critique ?",
      answer: "💡 Proposition de corrigé : L'hyperviseur est la racine technique commune qui contrôle directement le matériel et orchestre toutes les VM ; sa compromission brise l'isolation logique et donne immédiatement le contrôle sur l'ensemble des données et serveurs de l'entreprise."
    },
    {
      id: "td1-synth-2",
      number: 2,
      q: "2. Pourquoi un snapshot n'est-il pas une sauvegarde ?",
      answer: "💡 Proposition de corrigé : Un snapshot dépend techniquement du disque physique d'origine et fige un état différentiel sur le même stockage ; si le serveur ou son disque est détruit ou chiffré par un ransomware, le snapshot disparaît avec lui, alors qu'une sauvegarde est une copie indépendante et résiliente."
    },
    {
      id: "td1-synth-3",
      number: 3,
      q: "3. Quel est le danger d'un réseau virtuel plat dans un environnement multi-VM ?",
      answer: "💡 Proposition de corrigé : Dans un réseau plat sans segmentation par pare-feu ou VLAN, la compromission d'une seule machine exposée sur Internet (comme WEB-01) permet à l'attaquant de rebondir librement (mouvement latéral) vers tous les autres serveurs critiques sans obstacle."
    },
    {
      id: "td1-synth-4",
      number: 4,
      q: "4. Pourquoi un compte administrateur partagé dégrade-t-il la traçabilité ?",
      answer: "💡 Proposition de corrigé : Lorsqu'un mot de passe est partagé entre plusieurs personnes, les journaux d'audit (logs) indiquent seulement le nom générique 'admin' : il devient impossible d'imputer juridiquement et techniquement une erreur ou une action malveillante à un individu précis (perte de non-répudiation)."
    },
    {
      id: "td1-synth-5",
      number: 5,
      q: "5. Quel contrôle mettriez-vous en œuvre en premier si vous aviez seulement 30 minutes ? Justifiez.",
      answer: "💡 Proposition de corrigé : Activer en urgence l'authentification multifacteur (MFA) sur la console de management et changer le mot de passe partagé par des mots de passe robustes individuels, car cela neutralise immédiatement la menace la plus probable et la plus dévastatrice (R1) sans impacter la disponibilité de la production."
    }
  ],

  // Questions complémentaires officielles de TD1 (6 à 9)
  complementaryQuestions: [
    {
      id: "td1-comp-6",
      number: 6,
      q: "6. Comment le risque évoluerait-il si DB-01 était placée sur un datastore chiffré mais que les clés de chiffrement étaient stockées sur HYP-01 ?",
      answer: "💡 Proposition de corrigé : Le risque resterait très élevé face à un attaquant ciblant l'hyperviseur : si HYP-01 est compromis, l'attaquant s'empare simultanément du fichier disque virtuel de DB-01 ET de la clé de déchiffrement stockée localement, rendant le chiffrement totalement inutile (défaut d'architecture de gestion des clés qui exige un KMS externe)."
    },
    {
      id: "td1-comp-7",
      number: 7,
      q: "7. Que change l'utilisation d'un cluster de deux hyperviseurs en matière de disponibilité et de surface d'attaque ?",
      answer: "💡 Proposition de corrigé : En matière de disponibilité, elle est grandement améliorée (bascule automatique en haute disponibilité HA en cas de panne matérielle d'un hôte) ; en revanche, la surface d'attaque augmente car il y a désormais deux hyperviseurs à patcher, un réseau de synchronisation cluster à sécuriser et un plan de gestion centralisé (ex: vCenter) qui devient une cible prioritaire."
    },
    {
      id: "td1-comp-8",
      number: 8,
      q: "8. Proposez trois événements critiques à centraliser impérativement dans un SIEM pour détecter une compromission de l'environnement virtuel.",
      answer: "💡 Proposition de corrigé : 1) Toute tentative de connexion administrative échouée ou réussie sur la console de management hors des horaires habituels ; 2) Toute création, suppression ou export massif de snapshot/VM non planifié ; 3) Toute modification des règles de filtrage du pare-feu virtuel ou des interfaces réseau."
    },
    {
      id: "td1-comp-9",
      number: 9,
      q: "9. Construisez une règle simple et opérationnelle d'acceptation du risque pour AtlasTech.",
      answer: "💡 Proposition de corrigé : 'Tout risque dont le score est supérieur ou égal à 10 (niveau Élevé ou Critique) ne peut JAMAIS être accepté et doit faire l'objet d'un plan de réduction immédiat ; un risque peut être accepté uniquement si son score résiduel est inférieur à 10 (niveau Modéré ou Faible), qu'il dispose de contrôles compensatoires surveillés et que son acceptation formelle est signée par la direction générale.'"
    }
  ]
};

