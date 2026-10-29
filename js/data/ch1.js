// CH1 - Données complètes du cours, activités, quiz et exercices interactifs
window.M352_CH1 = {
  id: "ch1",
  title: "CH1 – Fondamentaux du Cloud et de la Virtualisation",
  subtitle: "Des limites du datacenter physique aux 5 piliers du Cloud Computing (NIST SP 800-145)",
  summary: "Comprendre pourquoi la virtualisation a émergé, comment elle fonctionne (Type 1 vs Type 2), pourquoi elle est différente du Cloud, et maîtriser les modèles de service (IaaS, PaaS, SaaS) et de déploiement.",
  
  // Sections de cours faciles (découpées selon la structure stricte en 7 volets)
  sections: [
    {
      id: "ch1-sec1-datacenter",
      title: "1. Limites du Datacenter Traditionnel & Cas ENSIA-Tech",
      badge: "Fondations",
      content: {
        idea: "🎯 Dans un datacenter traditionnel, chaque service tourne sur son propre serveur physique dédié, ce qui gaspille la majorité des ressources et coûte très cher.",
        analogy: "🧩 💡 Ajout pédagogique : C'est comme si chaque membre d'une famille achetait un bus de 50 places pour aller au travail tout seul : routes encombrées, 95% des sièges vides et factures d'essence astronomiques.",
        explanation: [
          "**La règle historique :** Pendant longtemps, pour éviter les conflits logiciels, on appliquait la règle stricte : 1 service = 1 serveur physique (Web, ERP, Base de données, Fichiers, Authentification).",
          "**Le surdimensionnement (provisioning pour le pic) :** Chaque serveur devait être acheté pour supporter le pire pic de charge annuel. Le reste de l'année, il tournait presque à vide.",
          "**Le cas concret du cours :** Un serveur physique équipé de 16 vCPU et 64 Go de RAM affiche en pratique une utilisation réelle de seulement **15% de CPU et 20% de RAM**. Cela signifie que **85% de la puissance de calcul payée est gaspillée** !",
          "**Les 5 problèmes majeurs :** Coût d'achat initial très élevé (CapEx), sous-utilisation chronique, déploiement lent (jours ou semaines pour acheter et câbler une machine), maintenance matérielle lourde, reprise après sinistre complexe et sécurité dispersée."
        ],
        example: "🏫 **Cas ENSIA-Tech avant le Cloud :** L'école d'ingénieurs possédait 5 serveurs physiques distincts (Web, ERP, DB, Fichiers, Annuaire Active Directory). Chaque serveur coûtait cher, chauffait la salle serveur, et aucun ne mutualisait sa puissance.",
        security: "🔐 **Impact Sécurité :** La sécurité est éparpillée sur 5 machines physiques hétérogènes. Si l'un des serveurs physiques tombe en panne matérielle, le service s'arrête brutalement sans possibilité de bascule rapide.",
        keyPoints: [
          "1 service = 1 serveur physique entraîne un gaspillage massif (souvent plus de 80% de CPU inexploité).",
          "La réponse technique indispensable : **Mutualiser, Isoler, Déployer vite, Automatiser et Mesurer**."
        ],
        traps: "⚠️ **Attention à l'examen :** Ne confondez pas le dimensionnement pour le pic (provisionner pour Noël ou les résultats d'examens) avec une utilisation moyenne. La sous-utilisation est la raison économique n°1 de l'adoption de la virtualisation."
      }
    },
    {
      id: "ch1-sec2-virtualisation",
      title: "2. La Virtualisation : Consolidation & Isolation Logique",
      badge: "Technologie clé",
      content: {
        idea: "🎯 La virtualisation permet de faire fonctionner plusieurs machines virtuelles (VM) indépendantes sur un seul serveur physique grâce à une couche logicielle appelée hyperviseur.",
        analogy: "🧩 💡 Ajout pédagogique : C'est comme transformer une maison individuelle en un immeuble d'appartements : un seul terrain et un seul toit, mais chaque locataire a sa propre porte blindée, ses clés et son espace privé.",
        explanation: [
          "**Consolidation :** On regroupe les 5 serveurs physiques d'ENSIA-Tech sous forme de machines virtuelles (VM Web, VM DB, VM AD) sur un seul gros serveur physique hôte.",
          "**L'Hyperviseur (ou VMM - Virtual Machine Monitor) :** Couche logicielle intermédiaire qui s'interpose entre le matériel physique et les OS invités pour répartir le CPU, la RAM, le disque et les interfaces réseau.",
          "**Isolation logique :** Chaque VM croit qu'elle est seule au monde sur un vrai ordinateur. Si la VM Web plante ou subit une attaque, la VM Base de données continue de tourner sans être perturbée.",
          "**Composants virtualisés d'une VM :** vCPU (processeur virtuel), vRAM (mémoire vive virtuelle), disque virtuel (fichier image .vdi, .vmdk), carte réseau virtuelle (vNIC), BIOS/UEFI virtuel."
        ],
        example: "🏫 **Cas ENSIA-Tech :** Les 3 serveurs physiques (Web Linux, DB Linux, AD Windows) sont désormais 3 VM qui cohabitent pacifiquement sur une unique machine physique puissante.",
        security: "🔐 **Impact Sécurité :** L'isolation logique est primordiale. Si l'hyperviseur est défaillant ou vulnérable, une attaque de type 'VM Escape' (évasion de machine virtuelle) pourrait permettre à un attaquant de sortir d'une VM pour contrôler l'hôte et espionner les autres VM.",
        keyPoints: [
          "Les 2 bénéfices fondamentaux : **Consolidation** (économies et rentabilisation du matériel) et **Isolation logique** (cloisonnement).",
          "Chaque VM possède son propre OS complet (OS invité / Guest OS) totalement indépendant de celui des voisins."
        ],
        traps: "⚠️ **Piège fréquent :** Une VM n'est pas un simple conteneur logiciel : elle possède un système d'exploitation complet avec son propre noyau (kernel) !"
      }
    },
    {
      id: "ch1-sec3-hyperviseurs",
      title: "3. Hyperviseurs : Type 1 (Bare-metal) vs Type 2 (Hosted)",
      badge: "Architecture technique",
      content: {
        idea: "🎯 L'hyperviseur de Type 1 s'installe directement sur le matériel physique (production), tandis que le Type 2 s'exécute au-dessus d'un système d'exploitation hôte (laboratoire / TP).",
        analogy: "🧩 💡 Ajout pédagogique : Le Type 1 est un chef d'orchestre qui dirige directement les musiciens. Le Type 2 est un chef qui doit d'abord chuchoter ses ordres à un traducteur (l'OS hôte), qui les répète ensuite aux musiciens.",
        explanation: [
          "**Type 1 (Bare-metal ou natif) :**",
          "- Pile : `Matériel Physique -> Hyperviseur -> VM`.",
          "- L'hyperviseur fait office d'OS minimaliste hautement optimisé et sécurisé.",
          "- Avantages : performances maximales, latence quasi nulle, surface d'attaque très réduite.",
          "- Utilisé dans les datacenters de production, les banques et les Clouds publics (ex: VMware ESXi, KVM, Microsoft Hyper-V Server).",
          "**Type 2 (Hosted ou hébergé) :**",
          "- Pile : `Matériel Physique -> OS Hôte (Windows/macOS/Linux) -> Hyperviseur -> VM`.",
          "- L'hyperviseur est une application comme une autre (exécutable .exe ou .app).",
          "- Inconvénients : dépend des bugs et vulnérabilités de l'OS hôte, performances moindres.",
          "- Idéal pour les travaux pratiques, les cours et le développement sur PC portable."
        ],
        example: "🏫 **Cas TP1 M352 :** Oracle VirtualBox installé sur votre ordinateur portable pour manipuler Ubuntu Server est un **hyperviseur de Type 2**.",
        security: "🔐 **Impact Sécurité :** Sur un Type 2, si l'OS de votre PC portable attrape un virus ou un spyware, toutes vos machines virtuelles de TP peuvent être compromises immédiatement, car l'OS hôte a tous les droits sur les processus de l'hyperviseur.",
        keyPoints: [
          "**Type 1 = Bare-metal** (direct sur matériel, haute sécurité, production).",
          "**Type 2 = Hosted** (sur OS hôte, plus simple, idéal pour les TP comme VirtualBox)."
        ],
        traps: "⚠️ **Question incontournable d'examen :** VirtualBox est-il de Type 1 ou de Type 2 ? C'est un Type 2 (Hosted) dans son utilisation courante !"
      }
    },
    {
      id: "ch1-sec4-nist-definition",
      title: "4. Définition NIST SP 800-145 & Les 5 Caractéristiques Essentielles",
      badge: "Standard institutionnel",
      content: {
        idea: "🎯 Selon le NIST SP 800-145, le Cloud Computing est l'accès à la demande, via le réseau, à un pool partagé de ressources configurables, défini obligatoirement par 5 critères.",
        analogy: "🧩 💡 Ajout pédagogique : Comme le réseau électrique de votre maison : vous branchez un appareil (à la demande), vous utilisez les prises standards (accès réseau), l'électricité provient d'un mix de centrales partagées (pooling), vous allumez 10 radiateurs en hiver sans prévenir EDF (élasticité) et le compteur Linky mesure vos kWh consommés (service mesuré).",
        explanation: [
          "**La formule magique du cours :** `Cloud = Virtualisation + Automatisation + Service Mesuré`.",
          "**Les 5 caractéristiques obligatoires :**",
          "1. **On-demand self-service (Libre-service à la demande) :** Le client commande et configure ses ressources (serveur, stockage) via une interface web ou une API, sans aucune intervention humaine d'un commercial ou technicien.",
          "2. **Broad network access (Accès réseau étendu) :** Les services sont accessibles de n'importe où via Internet ou réseau d'entreprise, en utilisant des mécanismes standards (navigateurs, protocoles HTTP/HTTPS, smartphones, API REST).",
          "3. **Resource pooling (Mutualisation des ressources / Multi-tenancy) :** Les ressources matérielles du fournisseur sont regroupées dans des pools et partagées dynamiquement entre plusieurs clients distincts qui s'ignorent mutuellement.",
          "4. **Rapid elasticity (Élasticité rapide) :** Capacité d'ajouter (scale out/up) ou de réduire (scale in/down) des ressources de façon instantanée et souvent automatisée selon l'afflux d'utilisateurs.",
          "5. **Measured service (Service mesuré) :** L'utilisation des ressources (temps CPU, Go de stockage, bande passante, requêtes) est surveillée, mesurée et facturée avec précision à l'usage réel."
        ],
        example: "🏫 **Illustration ENSIA-Tech :** Si le site des inscriptions de l'école reçoit 10 000 connexions le jour des résultats, le Cloud ajoute automatiquement 8 serveurs web en 3 minutes (Élasticité rapide), puis les détruit le lendemain soir pour ne payer que ce qui a été consommé (Service mesuré).",
        security: "🔐 **Impact Sécurité :**",
        securityBullets: [
          "Self-service -> Le droit de cliquer devient le droit de détruire : la gestion des permissions (IAM) devient critique.",
          "Accès réseau large -> Les API et interfaces de gestion sont exposées sur Internet : risque de brute-force et de compromission d'API.",
          "Multi-tenancy -> Les clients partagent le même disque et le même CPU physique : exigence absolue d'une isolation hermétique."
        ],
        keyPoints: [
          "Si une infrastructure manque d'une seule de ces 5 caractéristiques, ce n'est pas du vrai Cloud : c'est de l'hébergement traditionnel ou de la virtualisation locale.",
          "La référence officielle à retenir est le document américain **NIST SP 800-145**."
        ],
        traps: "⚠️ **Confusion fréquente :** Ne confondez pas *Élasticité* (s'adapter dynamiquement aux variations de charge à court terme) et *Évolutivité / Scalabilité* (capacité à croître sur le long terme)."
      }
    },
    {
      id: "ch1-sec5-iaas-paas-saas",
      title: "5. Modèles de Service : IaaS, PaaS, SaaS & Matrice des Responsabilités",
      badge: "Modèle SPI",
      content: {
        idea: "🎯 Plus on monte du IaaS vers le SaaS, plus le fournisseur gère de couches techniques pour vous, mais moins vous avez de contrôle technique direct.",
        analogy: "🧩 💡 Ajout pédagogique (La célèbre analogie Pizza as a Service) :",
        analogyList: [
          "- **On-premise (Fait maison) :** Vous achetez la pâte, le fromage, vous allumez votre four et vous lavez la vaisselle.",
          "- **IaaS (Pâte pré-cuite livrée) :** On vous fournit la pâte et le four, à vous d'ajouter vos ingrédients, de surveiller la cuisson et de dresser la table.",
          "- **PaaS (Pizza livrée à domicile) :** La pizza arrive chaude chez vous, vous n'avez plus qu'à la manger et fournir vos boissons.",
          "- **SaaS (Repas au restaurant) :** Vous vous asseyez, commandez, mangez et payez : le restaurant s'occupe de tout, vous choisissez juste ce que vous mangez !"
        ],
        explanation: [
          "**IaaS (Infrastructure as a Service) :**",
          "- Le fournisseur gère : Datacenter, serveurs physiques, stockage physique, réseau physique, virtualisation.",
          "- Le client gère : Système d'exploitation (Windows/Linux), patchs et correctifs, runtime, middleware, applications, données, configuration réseau et sécurité.",
          "- Exemple : Une VM EC2 chez AWS ou Compute Engine chez GCP.",
          "**PaaS (Platform as a Service) :**",
          "- Le fournisseur gère : L'infrastructure ET le système d'exploitation, les correctifs système et l'environnement d'exécution (Java, Node.js, Python).",
          "- Le client gère : Le code de son application, la configuration applicative, les secrets et les données.",
          "- Exemple : AWS Elastic Beanstalk, Google App Engine.",
          "**SaaS (Software as a Service) :**",
          "- Le fournisseur gère : TOUT, de l'infrastructure jusqu'à l'application complète.",
          "- Le client gère : Ses utilisateurs, ses données, les autorisations d'accès et le paramétrage fonctionnel.",
          "- Exemple : Google Drive, Microsoft 365, boîte email Gmail."
        ],
        example: "🏫 **Cas ENSIA-Tech :** Si l'école veut installer un détecteur d'intrusion (IDS) sur mesure nécessitant de modifier les modules du noyau Linux, elle choisit le **IaaS**. Si elle veut juste déployer son portail web PHP sans gérer Linux, elle choisit le **PaaS**. Pour la messagerie des étudiants, elle utilise Microsoft 365 en **SaaS**.",
        security: "🔐 **Règle d'or de la sécurité :** 'Moins de couches à gérer ne signifie JAMAIS absence de responsabilité !' En SaaS, si un employé utilise un mot de passe faible '123456' sans MFA et partage un fichier confidentiel en mode public, la faute incombe à 100% au client, pas à Microsoft ni à Google.",
        keyPoints: [
          "IaaS = Contrôle maximal du système mais charge d'administration lourde (patcher l'OS).",
          "PaaS = Focus sur le développement applicatif sans gérer l'OS.",
          "SaaS = Consommation directe d'une application finie."
        ],
        traps: "⚠️ **Piège classique d'examen :** 'Une VM Cloud Linux compromise par une faille non patchée est la faute du fournisseur Cloud.' FAUX ! En IaaS, la mise à jour et le durcissement du système d'exploitation incombent exclusivement au client."
      }
    },
    {
      id: "ch1-sec6-qui-gere-quoi",
      title: "6. Tableau de Responsabilité : Qui Gère Quoi ?",
      badge: "Matrice de cours",
      content: {
        idea: "🎯 Ce tableau officiel du cours synthétise le partage strict des tâches techniques selon le modèle retenu.",
        analogy: "🧩 💡 Ajout pédagogique : Dans une location meublée, le propriétaire répare la toiture et les murs (fournisseur), mais si vous laissez la porte ouverte ou si vous renversez du café sur la table, c'est votre responsabilité (client).",
        explanation: [
          "Examinons chaque couche de haut en bas selon les 4 environnements :",
          "| Couche technique | On-Premise (Local) | IaaS | PaaS | SaaS |",
          "|---|---|---|---|---|",
          "| **Application** | Client | Client | Client | **Fournisseur** |",
          "| **Données** | Client | Client | Client | **Partagé selon contexte** (Client pour accès/gouvernance) |",
          "| **Runtime** | Client | Client | **Fournisseur** | **Fournisseur** |",
          "| **OS (Système d'exploitation)** | Client | Client | **Fournisseur** | **Fournisseur** |",
          "| **Virtualisation** | Client | **Fournisseur** | **Fournisseur** | **Fournisseur** |",
          "| **Serveurs / Stockage / Réseau physiques** | Client | **Fournisseur** | **Fournisseur** | **Fournisseur** |"
        ],
        example: "🏫 **Cas ENSIA-Tech :** Sur un serveur On-premise, les ingénieurs de l'école doivent remplacer les disques durs grillés. En IaaS chez OVHcloud ou AWS, ils ne touchent jamais au matériel physique mais doivent exécuter `apt update` chaque semaine sur leurs VM Linux.",
        security: "🔐 **Sécurité :** Comprendre ce tableau permet d'éviter l'illusion de sécurité. Les fausses hypothèses ('le fournisseur s'occupe de tout') sont la première cause d'incidents majeurs dans le Cloud.",
        keyPoints: [
          "En IaaS : la frontière se situe entre la virtualisation (fournisseur) et l'OS (client).",
          "En PaaS : la frontière monte entre le runtime (fournisseur) et l'application (client).",
          "En SaaS : l'application est fournie, mais la sécurité des données et des identités reste gérée par le client."
        ],
        traps: "⚠️ **Attention :** Dans tous les modèles sans exception (même en SaaS), les données et les identités des utilisateurs restent sous le contrôle et la responsabilité du client !"
      }
    },
    {
      id: "ch1-sec7-deploiement",
      title: "7. Modèles de Déploiement : Public, Privé, Hybride & Communautaire",
      badge: "Gouvernance",
      content: {
        idea: "🎯 Le modèle de déploiement définit où sont situées les ressources physiques et qui y a accès (grand public, entreprise unique ou partenaires).",
        analogy: "🧩 💡 Ajout pédagogique : Public = Bus de ville (ouvert à tous ceux qui payent un ticket). Privé = Voiture personnelle de fonction (réservée à votre entreprise). Hybride = Utiliser sa voiture pour aller au parking relais, puis prendre le métro pour entrer en ville. Communautaire = Un car de ramassage scolaire partagé uniquement entre 3 écoles voisines.",
        explanation: [
          "**Cloud Public :**",
          "- Infrastructure mutualisée exploitée par un grand fournisseur (AWS, Azure, Google Cloud).",
          "- Ouvert à tous, haute élasticité, facturation à l'usage, pas de matériel à acheter.",
          "**Cloud Privé :**",
          "- Infrastructure réservée exclusivement à une seule organisation.",
          "- Peut être hébergée en interne dans son propre datacenter ou externalisée chez un tiers.",
          "- Contrôle total, conformité stricte, mais coûts élevés et élasticité limitée au matériel possédé.",
          "**Cloud Hybride :**",
          "- Combinaison d'au moins deux modèles (souvent un Cloud Privé local interconnecté à un Cloud Public via un VPN ou lien dédié chiffré).",
          "- Permet de conserver les données hautement sensibles en local tout en bénéficiant de la puissance et de l'élasticité du Cloud Public pour le portail externe.",
          "**Cloud Communautaire :**",
          "- Infrastructure partagée par plusieurs organisations ayant des missions, exigences de sécurité ou contraintes réglementaires communes (ex. plusieurs universités, hôpitaux régionaux ou banques centrales)."
        ],
        example: "🏫 **Cas ENSIA-Tech (Activité 4 du cours) :** L'école a besoin d'héberger un portail web accessible aux étudiants du monde entier, mais doit conserver les dossiers médicaux et notes confidentielles dans son datacenter interne contrôlé. **Recommandation officielle du cours : Modèle Hybride** relié par un VPN sécurisé.",
        security: "🔐 **Impact Sécurité :** En mode hybride, la liaison de connectivité (tunnel VPN IPsec ou lien direct) et la synchronisation des identités deviennent les deux talons d'Achille de l'architecture.",
        keyPoints: [
          "Le choix du déploiement dépend de la criticité des données, du budget et des obligations légales (souveraineté des données).",
          "Le modèle hybride offre le meilleur compromis entre sécurité locale et souplesse du cloud public."
        ],
        traps: "⚠️ **Attention :** Ne confondez pas Cloud Hybride et Multi-Cloud. Le Cloud Hybride mélange privé et public. Le Multi-Cloud utilise plusieurs fournisseurs publics différents (ex. AWS + Azure)."
      }
    },
    {
      id: "ch1-sec8-virt-vs-cloud-synthese",
      title: "8. Virtualisation ≠ Cloud : La Différence Capitale & Nouveaux Enjeux",
      badge: "Synthèse & Sécurité",
      content: {
        idea: "🎯 La virtualisation est une technologie facilitatrice qui abstrait le matériel ; le Cloud Computing est un modèle de fourniture de service automatisé.",
        analogy: "🧩 💡 Ajout pédagogique : La farine permet de faire du pain, mais la farine toute seule n'est pas une boulangerie prête à servir des clients !",
        explanation: [
          "**Tableau comparatif officiel du cours :**",
          "- **Virtualisation :** Abstraction des ressources matérielles, consolidation de serveurs, création manuelle de VM, isolation logique, peut être 100% locale sans réseau ni automatisation.",
          "- **Cloud Computing :** Modèle complet de fourniture de services, self-service avec portail et API, automatisation et orchestration, élasticité instantanée, mesure et facturation précise.",
          "**Ce qui change en sécurité lors du passage au Cloud :**",
          "- **Nouveaux Actifs :** Hyperviseurs, images et templates de VM, snapshots d'état, console web d'administration, réseaux et commutateurs virtuels (vSwitch).",
          "- **Nouveaux Risques :** Mauvaise isolation (défaut multi-tenancy), erreurs humaines de configuration, exposition accidentelle sur Internet, permissions excessives sans MFA, données éparpillées.",
          "- **Nouveaux Contrôles :** Durcissement (hardening) des systèmes, segmentation réseau stricte (VPC, subnets), gestion des identités (IAM + moindre privilège), chiffrement au repos et en transit, journalisation centralisée."
        ],
        example: "🏫 **Synthèse ENSIA-Tech (Mini-cas slide 28) :**",
        exampleList: [
          "- *Que virtualiser ?* ERP interne, serveur de fichiers, base de données, serveurs Web/App.",
          "- *Quel modèle de service ?* IaaS pour les serveurs demandant le contrôle de l'OS ; PaaS pour le portail Web ; SaaS possible pour le partage de fichiers ou l'ERP.",
          "- *Quel déploiement ?* Hybride : site web public dans le Cloud public, ERP et données sensibles en privé/local.",
          "- *Risques nouveaux ?* Mauvaise configuration, accès excessifs, exposition Internet/API, mauvaise isolation, fuite de données, dépendance fournisseur.",
          "- *Contrôles prioritaires ?* IAM avec MFA, segmentation réseau, chiffrement, hardening/patching, sauvegardes et supervision/logs."
        ],
        security: "🔐 **Conclusion Sécurité CH1 :** Virtualiser et migrer vers le Cloud ne supprime aucun risque de sécurité traditionnel : cela déplace la responsabilité et crée de nouvelles surfaces d'attaque centrées sur les configurations et les identités.",
        keyPoints: [
          "Virtualisation = technologie d'abstraction matérielle.",
          "Cloud = modèle de service à la demande avec automatisation et élasticité.",
          "Le contrôle de l'hyperviseur et de la console d'administration est au cœur de la sécurité."
        ],
        traps: "⚠️ **Question piège de quiz :** 'Une entreprise possédant 50 VM sur VMware vSphere utilise-t-elle obligatoirement du Cloud ?' Réponse officielle : NON ! Si les VM sont provisionnées manuellement par un administrateur sans portail en libre-service ni service mesuré, ce n'est que de la virtualisation."
      }
    }
  ],

  // Activités officielles du cours avec corrections pas-à-pas
  activities: [
    {
      id: "ch1-act1",
      title: "Activité 1 • Virtualisation ou Cloud ?",
      duration: "10 minutes",
      description: "Pour chaque situation donnée dans le cours, déterminez s'il s'agit de virtualisation, de Cloud, ou des deux, et justifiez votre réponse.",
      cases: [
        {
          situation: "A) 10 VM déployées manuellement sur un serveur VirtualBox local.",
          expected: "Virtualisation",
          options: ["Virtualisation", "Cloud", "Les deux"],
          justification: "Il y a bien un hyperviseur et des machines virtuelles, mais il n'y a ni self-service automatisé, ni pooling multi-clients, ni élasticité rapide, ni service mesuré."
        },
        {
          situation: "B) Une VM créée en 2 minutes à la demande via un portail web Cloud avec facturation à la seconde.",
          expected: "Les deux",
          options: ["Virtualisation", "Cloud", "Les deux"],
          justification: "Le service est consommé selon les critères du Cloud (à la demande, via portail/API), et sous le capot, la ressource fournie est une machine virtuelle hébergée sur un hyperviseur."
        },
        {
          situation: "C) Une application de messagerie professionnelle accessible directement en ligne dans un navigateur.",
          expected: "Cloud",
          options: ["Virtualisation", "Cloud", "Les deux"],
          justification: "Il s'agit typiquement de Cloud SaaS : l'utilisateur consomme une application métier finie sans se soucier ni gérer l'infrastructure ou la virtualisation sous-jacente."
        }
      ]
    },
    {
      id: "ch1-act2",
      title: "Activité 2 • Identifier les Caractéristiques NIST SP 800-145",
      duration: "10 minutes",
      description: "Associez chaque situation réelle d'entreprise à la caractéristique essentielle NIST correspondante.",
      pairs: [
        {
          situation: "Un ingénieur crée un serveur de test en 3 clics depuis son navigateur un dimanche soir sans demander l'aide de personne.",
          characteristic: "On-demand self-service (Libre-service à la demande)",
          explanation: "Provisionnement instantané et autonome sans intervention humaine du fournisseur."
        },
        {
          situation: "À l'ouverture des soldes, le site e-commerce passe automatiquement de 2 serveurs à 10 serveurs pour absorber l'afflux de visiteurs.",
          characteristic: "Rapid elasticity (Élasticité rapide)",
          explanation: "Capacité d'augmenter ou réduire rapidement les ressources selon la charge."
        },
        {
          situation: "Des dizaines d'entreprises différentes exécutent leurs VM sur le même châssis matériel de serveurs dans le datacenter d'AWS.",
          characteristic: "Resource pooling (Mutualisation des ressources)",
          explanation: "Mutualisation des processeurs, mémoires et disques avec isolation logique stricte (multi-tenancy)."
        },
        {
          situation: "Les développeurs déploient des applications et les étudiants consultent leurs cours depuis leur PC portable, tablette ou mobile via Internet.",
          characteristic: "Broad network access (Accès réseau étendu)",
          explanation: "Accès universel via des protocoles réseau standards et des clients hétérogènes."
        }
      ]
    },
    {
      id: "ch1-act3",
      title: "Activité 3 • Choisir entre IaaS, PaaS et SaaS",
      duration: "10 minutes",
      description: "Pour chaque besoin métier d'ENSIA-Tech, sélectionnez le modèle de service le plus adapté et étudiez la justification.",
      scenarios: [
        {
          need: "1) Déployer rapidement une nouvelle application web développée en Python sans perdre de temps à installer et mettre à jour le système Linux.",
          choice: "PaaS",
          justification: "Le fournisseur gère l'OS, les correctifs et le runtime Python ; les développeurs se concentrent uniquement sur leur code applicatif et leurs données."
        },
        {
          need: "2) Installer un système de détection d'intrusion (IDS) très spécifique nécessitant des drivers de capture réseau et un contrôle total du noyau Linux.",
          choice: "IaaS",
          justification: "Le client a impérativement besoin d'un accès administrateur racine (root) pour configurer l'OS, les modules noyau et les interfaces réseau virtuelles."
        },
        {
          need: "3) Fournir une suite bureautique et une messagerie électronique prête à l'emploi pour les 200 employés et enseignants.",
          choice: "SaaS",
          justification: "L'application est directement utilisable par les utilisateurs finaux ; l'école ne développe rien et ne gère aucune infrastructure technique."
        }
      ]
    },
    {
      id: "ch1-act4",
      title: "Activité 4 • Modèle de Déploiement ENSIA-Tech",
      duration: "10 minutes",
      description: "Cas d'architecture ENSIA-Tech : quelle solution de déploiement recommandez-vous ?",
      scenario: "Une école d'ingénieurs veut héberger un portail accessible aux étudiants du monde entier, mais désire conserver certaines données hautement sensibles (sujets d'examens, données RH) localement dans son propre bâtiment.",
      recommendation: "Modèle Hybride (Cloud Privé / Datacenter local + Cloud Public reliés par VPN)",
      justification: "Le modèle hybride permet d'isoler les données critiques dans un environnement privé sous contrôle direct de l'école, tout en profitant de la scalabilité et de la haute disponibilité du Cloud public pour le portail web exposé sur Internet."
    }
  ],

  // QCM interactifs complets pour CH1 (Plus de 15 questions progressives avec justifications détaillées)
  quiz: [
    {
      id: "q-ch1-01",
      level: "facile",
      type: "single",
      question: "Une entreprise héberge 20 machines virtuelles sur un serveur physique local dans son sous-sol. Utilise-t-elle nécessairement du Cloud Computing ?",
      options: [
        "Oui, car la présence de machines virtuelles définit le Cloud Computing.",
        "Non, car la virtualisation seule ne suffit pas à constituer un Cloud.",
        "Oui, si le serveur est connecté au réseau local de l'entreprise.",
        "Non, sauf si l'entreprise utilise Linux."
      ],
      answer: 1,
      explanation: "Question officielle du cours ! La virtualisation est une technologie facilitatrice, alors que le Cloud est un modèle de fourniture de service. Sans self-service à la demande, accès réseau large, pooling, élasticité rapide et service mesuré, il s'agit seulement d'une infrastructure virtualisée classique.",
      courseRef: "ch1-sec8-virt-vs-cloud-synthese"
    },
    {
      id: "q-ch1-02",
      level: "facile",
      type: "single",
      question: "Quelle caractéristique essentielle du Cloud selon le NIST SP 800-145 permet d'augmenter ou réduire rapidement les ressources allouées selon la charge ?",
      options: [
        "On-demand self-service",
        "Broad network access",
        "Rapid elasticity (Élasticité rapide)",
        "Resource pooling"
      ],
      answer: 2,
      explanation: "L'élasticité rapide (Rapid elasticity) permet d'allouer dynamiquement des serveurs ou de la mémoire lors d'un pic de trafic, puis de les libérer dès que la charge redevient normale.",
      courseRef: "ch1-sec4-nist-definition"
    },
    {
      id: "q-ch1-03",
      level: "facile",
      type: "single",
      question: "Dans quel modèle de service Cloud le client administre-t-il encore généralement le système d'exploitation (OS) et applique-t-il les correctifs de sécurité ?",
      options: [
        "SaaS (Software as a Service)",
        "PaaS (Platform as a Service)",
        "IaaS (Infrastructure as a Service)",
        "DaaS (Desktop as a Service)"
      ],
      answer: 2,
      explanation: "En IaaS, le fournisseur s'arrête à la virtualisation matérielle. L'installation, la maintenance et les patchs de sécurité de l'OS invité (ex: Ubuntu, Windows Server) incombent entièrement au client.",
      courseRef: "ch1-sec5-iaas-paas-saas"
    },
    {
      id: "q-ch1-04",
      level: "facile",
      type: "single",
      question: "Dans son utilisation classique sur un ordinateur de bureau ou PC portable d'étudiant, Oracle VirtualBox correspond à quel type d'hyperviseur ?",
      options: [
        "Type 1 (Bare-metal)",
        "Type 2 (Hosted / Hébergé)",
        "Type 0 (Hardware pur)",
        "Type 3 (Serverless)"
      ],
      answer: 1,
      explanation: "Question officielle du cours et du TP1 ! VirtualBox s'installe au-dessus d'un système d'exploitation hôte existant (Windows, macOS ou Linux), ce qui en fait un hyperviseur de Type 2 (Hosted).",
      courseRef: "ch1-sec3-hyperviseurs"
    },
    {
      id: "q-ch1-05",
      level: "facile",
      type: "single",
      question: "Quelle notion fondamentale du Cloud Computing crée un enjeu de sécurité majeur lié à l'isolation étanche entre plusieurs clients concurrents ?",
      options: [
        "Le Service mesuré (Measured service)",
        "La Multi-tenancy (Mutualisation des ressources / Resource pooling)",
        "Le protocole HTTP",
        "Le Broad network access"
      ],
      answer: 1,
      explanation: "La mutualisation des ressources physiques (Resource pooling / Multi-tenancy) implique que des clients distincts partagent le même processeur physique et le même disque, imposant une isolation logique parfaite.",
      courseRef: "ch1-sec4-nist-definition"
    },
    {
      id: "q-ch1-06",
      level: "moyen",
      type: "single",
      question: "Dans le cas d'étude ENSIA-Tech traditionnel (avant virtualisation), pourquoi le modèle '1 service = 1 serveur physique' était-il très inefficace ?",
      options: [
        "Parce que les serveurs physiques consomment toujours 100% de CPU.",
        "Parce que les serveurs étaient dimensionnés pour le pic annuel et sous-utilisés le reste du temps (ex: 85% de CPU inexploité).",
        "Parce qu'il est interdit d'installer Linux sur un serveur physique.",
        "Parce que les câbles réseau ne supportaient qu'un seul protocole."
      ],
      answer: 1,
      explanation: "Le dimensionnement pour le pire pic d'activité conduit à une sous-utilisation chronique (souvent seulement 10 à 20% d'utilisation moyenne), ce qui immobilise des capitaux importants pour une puissance inexploitée.",
      courseRef: "ch1-sec1-datacenter"
    },
    {
      id: "q-ch1-07",
      level: "moyen",
      type: "single",
      question: "Quelle est la principale différence architecturale entre un hyperviseur de Type 1 et un hyperviseur de Type 2 ?",
      options: [
        "Le Type 1 ne supporte que Linux, tandis que le Type 2 ne supporte que Windows.",
        "Le Type 1 est installé directement sur le matériel nu (Bare-metal), tandis que le Type 2 tourne sur un OS hôte.",
        "Le Type 1 ne permet de créer qu'une seule VM à la fois.",
        "Le Type 2 offre de meilleures performances que le Type 1."
      ],
      answer: 1,
      explanation: "L'hyperviseur de Type 1 (Bare-metal) est en prise directe avec le matériel, ce qui élimine la couche de l'OS hôte, optimise les performances et réduit drastiquement la surface d'attaque.",
      courseRef: "ch1-sec3-hyperviseurs"
    },
    {
      id: "q-ch1-08",
      level: "moyen",
      type: "boolean",
      question: "Vrai ou Faux : Dans le modèle SaaS (Software as a Service), le client n'a absolument plus aucune responsabilité en matière de sécurité.",
      options: [
        "VRAI : Le fournisseur gère l'application de bout en bout.",
        "FAUX : Le client reste responsable de la sécurité de ses identités, des droits d'accès de ses utilisateurs et de la confidentialité de ses données."
      ],
      answer: 1,
      explanation: "C'est un piège d'examen fondamental ! Même en SaaS, si un utilisateur utilise un mot de passe vulnérable sans double authentification (MFA) ou partage publiquement un dossier confidentiel, c'est la responsabilité pleine et entière du client.",
      courseRef: "ch1-sec5-iaas-paas-saas"
    },
    {
      id: "q-ch1-09",
      level: "moyen",
      type: "single",
      question: "Selon la matrice officielle 'Qui gère quoi ?' du cours, qui a la responsabilité de la couche 'Runtime' (environnement d'exécution comme Java ou Python) dans le modèle PaaS ?",
      options: [
        "Le client uniquement",
        "Le fournisseur de service Cloud",
        "L'auditeur indépendant",
        "C'est une responsabilité 50/50"
      ],
      answer: 1,
      explanation: "En PaaS, le fournisseur prend en charge toute la pile d'exécution jusqu'au Runtime inclus. Le client n'a qu'à déposer son code applicatif sans se soucier des librairies système ou des versions du runtime.",
      courseRef: "ch1-sec6-qui-gere-quoi"
    },
    {
      id: "q-ch1-10",
      level: "moyen",
      type: "single",
      question: "Quel modèle de déploiement Cloud consiste à interconnecter de manière sécurisée un environnement local privé avec les services extensibles d'un Cloud public ?",
      options: [
        "Cloud Communautaire",
        "Cloud Privé exclusif",
        "Cloud Hybride",
        "Multi-datacenter classique"
      ],
      answer: 2,
      explanation: "Le Cloud Hybride associe les avantages du Cloud privé (garde des données très sensibles en interne sous contrôle souverain) avec l'élasticité du Cloud public (hébergement des portails web à fort trafic).",
      courseRef: "ch1-sec7-deploiement"
    },
    {
      id: "q-ch1-11",
      level: "piege",
      type: "single",
      question: "Une machine virtuelle Linux hébergée sur un service Cloud IaaS (ex: AWS EC2) subit un piratage suite à une faille de sécurité connue sur le serveur SSH non mis à jour depuis un an. Qui est juridiquement et techniquement responsable selon le modèle partagé ?",
      options: [
        "Le fournisseur Cloud, car son infrastructure a laissé passer l'attaque.",
        "Le client, car la mise à jour et la configuration de l'OS de la VM lui incombent en IaaS.",
        "Le créateur de la distribution Linux.",
        "La responsabilité est transférée à l'assurance de l'hébergeur."
      ],
      answer: 1,
      explanation: "Exemple textuel du cours CH1 (slide 17) : 'Une VM Cloud Linux non patchée reste généralement un problème côté client.' En IaaS, le fournisseur garantit l'hyperviseur et le matériel physique, mais c'est le client qui doit sécuriser et maintenir son système d'exploitation.",
      courseRef: "ch1-sec5-iaas-paas-saas"
    },
    {
      id: "q-ch1-12",
      level: "piege",
      type: "multiple",
      question: "Quels éléments font partie des nouveaux actifs (assets) introduits par la virtualisation et le Cloud à sécuriser impérativement ? (Sélectionnez TOUTES les réponses valides)",
      options: [
        "Les images modèles (templates) de machines virtuelles",
        "Les instantanés d'état (snapshots) et disques virtuels",
        "L'hyperviseur et sa console d'administration",
        "Le commutateur réseau virtuel (vSwitch)"
      ],
      answer: [0, 1, 2, 3],
      explanation: "Toutes ces réponses sont exactes ! En virtualisation, les images disques, les snapshots, l'hyperviseur et le vSwitch sont de nouveaux composants logiciels critiques qui peuvent être clonés, volés ou altérés s'ils sont mal protégés.",
      courseRef: "ch1-sec8-virt-vs-cloud-synthese"
    },
    {
      id: "q-ch1-13",
      level: "piege",
      type: "single",
      question: "Quelle conséquence directe sur la sécurité découle de la caractéristique NIST 'On-demand self-service' ?",
      options: [
        "Les disques durs physiques ne tombent plus jamais en panne.",
        "Les permissions et droits d'accès des comptes (IAM) deviennent ultra-critiques, car un compte à privilèges excessifs peut créer, exposer ou supprimer des serveurs en quelques secondes.",
        "Le chiffrement des données devient obsolète.",
        "Les pare-feux ne sont plus nécessaires."
      ],
      answer: 1,
      explanation: "Slide 11 de CH1 : 'Conséquence sécurité : les permissions deviennent critiques.' Comme il n'y a plus de chaîne de validation humaine manuelle, une commande d'API envoyée par une clé compromise s'exécute immédiatement.",
      courseRef: "ch1-sec4-nist-definition"
    },
    {
      id: "q-ch1-14",
      level: "piege",
      type: "single",
      question: "Quelle différence technique majeure sépare un snapshot d'une sauvegarde traditionnelle d'une VM ?",
      options: [
        "Un snapshot est stocké sur bande magnétique alors qu'une sauvegarde est sur disque dur.",
        "Un snapshot dépend directement du stockage source de la VM, tandis qu'une sauvegarde est une copie indépendante exportée sur un support séparé.",
        "Un snapshot prend des heures à créer, tandis qu'une sauvegarde est instantanée.",
        "Il n'y a aucune différence, ce sont deux termes synonymes."
      ],
      answer: 1,
      explanation: "Un snapshot fige les blocs modifiés mais reste hébergé sur le même datastore physique que la VM d'origine. Si le disque dur physique de l'hyperviseur crashe, la VM ET son snapshot sont détruits ! Une vraie sauvegarde doit être exportée et autonome.",
      courseRef: "ch1-sec8-virt-vs-cloud-synthese"
    },
    {
      id: "q-ch1-15",
      level: "piege",
      type: "single",
      question: "Dans le cas ENSIA-Tech, pourquoi est-il déconseillé de placer le serveur de base de données dans un réseau accessible directement depuis Internet ?",
      options: [
        "Parce que la base de données consommerait trop de bande passante.",
        "Pour réduire drastiquement la surface d'attaque en isolant les données critiques dans un réseau privé accessible uniquement par le serveur d'application.",
        "Parce que les bases de données SQL ne fonctionnent pas sur le protocole TCP/IP.",
        "Parce que le Cloud interdit d'attribuer une adresse IP à une base de données."
      ],
      answer: 1,
      explanation: "Principe fondamental de défense en profondeur : seuls les points d'entrée indispensables (Load Balancer, Portail web) sont exposés au public. La base de données doit être confinée dans un sous-réseau privé isolé.",
      courseRef: "ch1-sec8-virt-vs-cloud-synthese"
    }
  ]
};

