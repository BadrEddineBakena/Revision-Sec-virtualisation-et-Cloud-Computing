// CH2 - Données complètes du cours, activités, quiz et exercices interactifs
window.M352_CH2 = {
  id: "ch2",
  title: "CH2 – Architecture Cloud, SecaaS, Responsabilité Partagée & Risques",
  subtitle: "Composants techniques, acteurs NIST SP 500-292, management plane vs data plane et surfaces d'attaque",
  summary: "Maîtriser la construction d'une architecture Cloud sécurisée : des 6 couches techniques aux services de sécurité SecaaS, en passant par le modèle de responsabilité partagée et l'identité comme nouveau périmètre.",

  // Sections de cours faciles (7 volets stricts)
  sections: [
    {
      id: "ch2-sec1-acteurs-nist",
      title: "1. Acteurs du Cloud selon le NIST SP 500-292",
      badge: "Gouvernance",
      content: {
        idea: "🎯 Une architecture Cloud est un écosystème d'acteurs dont la sécurité dépend de leurs responsabilités et de leurs interactions contractuelles.",
        analogy: "🧩 💡 Ajout pédagogique : Pensez à un aéroport international : les passagers (Consumers) voyagent avec une compagnie aérienne (Provider), réservent via une agence de voyage (Broker), empruntent les couloirs de télécom/radars (Carrier) et sont contrôlés par les inspecteurs de sécurité aérienne (Auditor).",
        explanation: [
          "Le standard NIST SP 500-292 définit 5 acteurs clés :",
          "1. **Cloud Consumer (Consommateur) :** Personne ou organisation qui utilise et pilote les services Cloud (ex: ENSIA-Tech louant des VM chez AWS).",
          "2. **Cloud Provider (Fournisseur) :** Entité qui met les services à disposition (IaaS, PaaS, SaaS) et gère l'infrastructure sous-jacente (ex: AWS, Azure, OVHcloud).",
          "3. **Cloud Broker (Intermédiaire / Courtier) :** Entité qui gère l'utilisation, la performance et la livraison des services Cloud en négociant les relations entre fournisseurs et consommateurs (agrégation, intégration ou personnalisation).",
          "4. **Cloud Auditor (Auditeur) :** Tiers indépendant chargé d'évaluer la sécurité, la conformité réglementaire (RGPD, ISO 27001), la confidentialité et la performance des services Cloud.",
          "5. **Cloud Carrier (Transporteur / Opérateur réseau) :** Intermédiaire fournissant la connectivité réseau et les liens de transport entre les consommateurs et les fournisseurs Cloud (ex: opérateurs télécoms, transitaires IP)."
        ],
        example: "🏫 **Cas ENSIA-Tech :** ENSIA-Tech est le **Cloud Consumer**. Elle commande des serveurs chez un **Cloud Provider** (ex: AWS). Pour auditer la sécurité de son portail avant le lancement, elle mandate un **Cloud Auditor** indépendant. La connexion physique passe par Maroc Telecom, qui joue le rôle de **Cloud Carrier**.",
        security: "🔐 **Impact Sécurité :** Le Cloud Auditor joue un rôle vital : comme un client ne peut pas visiter physiquement les datacenters secrets d'AWS ou de Google pour vérifier les serveurs, il doit s'appuyer sur les rapports d'audit tiers (certifications SOC 2, ISO 27001).",
        keyPoints: [
          "5 acteurs NIST : Consumer, Provider, Broker, Auditor, Carrier.",
          "La confiance dans le Cloud repose sur des audits indépendants (Cloud Auditor) et des contrats de service (SLA)."
        ],
        traps: "⚠️ **Attention :** Le Cloud Carrier ne gère pas la sécurité de vos données : il assure uniquement le transport physique des paquets. Le chiffrement en transit (TLS/VPN) reste sous la responsabilité du client !"
      }
    },
    {
      id: "ch2-sec2-six-couches",
      title: "2. Les 6 Couches d'une Architecture Cloud & Emplacements Physiques",
      badge: "Architecture technique",
      content: {
        idea: "🎯 Pour sécuriser le Cloud, on examine l'architecture de bas en haut à travers 6 couches techniques, réparties géographiquement entre Régions, Zones de Disponibilité et Edge.",
        analogy: "🧩 💡 Ajout pédagogique : C'est comme construire un gratte-ciel : on part des fondations en béton (infrastructure), on pose les ascenseurs et les portes coupe-feu (réseau/gestion), puis on installe les bureaux et les coffres-forts (applications et données).",
        explanation: [
          "**Les 6 couches à examiner de bas en haut :**",
          "1. **Infrastructure fournisseur :** Datacenters, serveurs physiques, hyperviseurs, réseau physique (backbone).",
          "2. **Identité & Management Plane :** Console web, API, IAM, rôles, politiques d'accès, journaux d'audit.",
          "3. **Réseau virtuel :** VPC/VNet, sous-réseaux, tables de routage, passerelles, règles de pare-feu.",
          "4. **Calcul virtualisé :** Machines virtuelles (VM), images modèles, groupes d'auto-scaling, équilibreurs de charge.",
          "5. **Services managés :** Bases de données managées (DBaaS), stockage objet/bloc/fichier, serverless.",
          "6. **Applications & Données :** Portails web, API métier, bases relationnelles, fichiers sensibles.",
          "**La Sécurité Transversale :** L'identité (IAM), le chiffrement, les journaux (logs) et la supervision traversent TOUTES les couches.",
          "**Topologie géographique :**",
          "- **Région :** Zone géographique distincte (ex: Paris, Francfort) composée de plusieurs datacenters isolés.",
          "- **Zone de Disponibilité (AZ - Availability Zone) :** Emplacement technique isolé au sein d'une région, disposant de sa propre alimentation électrique et climatisation (permet la haute disponibilité).",
          "- **Edge / CDN :** Points de présence au plus proche des utilisateurs pour mettre en cache les contenus, réduire la latence et filtrer les attaques DDoS en périphérie."
        ],
        example: "🏫 **Cas ENSIA-Tech :** Pour garantir que les étudiants puissent toujours passer leurs examens en ligne même si un datacenter brûle, l'école déploie son portail sur **deux Zones de Disponibilité (AZ) différentes** dans la même région.",
        security: "🔐 **Question sécurité essentielle du cours :** 'Où sont stockées les données ? Que se passe-t-il si une zone tombe ? Qui administre les composants régionaux ?'",
        keyPoints: [
          "Une région contient plusieurs Zones de Disponibilité (AZ).",
          "Déployer multi-AZ protège contre les pannes physiques d'un datacenter complet.",
          "Les Edge locations bloquent les attaques web avant qu'elles n'atteignent vos serveurs."
        ],
        traps: "⚠️ **Confusion fréquente :** Une Zone de Disponibilité n'est pas un simple rack de serveurs : c'est un ou plusieurs datacenters physiquement distants de plusieurs kilomètres pour éviter un sinistre commun (inondation, panne électrique)."
      }
    },
    {
      id: "ch2-sec3-reseau-virtuel",
      title: "3. Réseau Virtuel Sécurisé : VPC, Subnets, Gateways, LB & Bastion",
      badge: "Réseau Cloud",
      content: {
        idea: "🎯 Un réseau Cloud bien conçu réduit au maximum l'exposition Internet : tout ne doit pas être accessible publiquement, même si tout peut être créé en un clic.",
        analogy: "🧩 💡 Ajout pédagogique : Un château fort avec 3 enceintes : les douves et le pont-levis pour accueillir le public (Subnet public), la cour intérieure pour les artisans (Subnet privé), et le donjon fortifié tout au fond pour le trésor royal (Zone données).",
        explanation: [
          "**VPC (Virtual Private Cloud) / VNet :** Périmètre réseau logique étanche et privé dédié à l'entreprise.",
          "**Les 3 zones réseau indispensables :**",
          "- **Subnet Public :** Connecté directement à Internet via l'Internet Gateway. Y placer UNIQUEMENT le Load Balancer (LB), le pare-feu applicatif (WAF) et éventuellement un Bastion.",
          "- **Subnet Privé :** Sans adresse IP publique directe. Héberge les serveurs d'application et les API qui traitent la logique métier.",
          "- **Zone Données (Data Subnet) :** Sous-réseau privé ultra-isolé réservé aux bases de données et au stockage sensible. Aucun flux Internet direct n'y entre ni n'en sort.",
          "**Les 4 composants de routage et distribution :**",
          "- **Internet Gateway (IGW) :** Passerelle bidirectionnelle entre le VPC et Internet. Un mauvais routage vers l'IGW expose involontairement vos serveurs privés !",
          "- **NAT Gateway :** Permet aux VM privées de sortir vers Internet (ex: pour télécharger des mises à jour Linux `apt upgrade`), tout en bloquant formellement toute connexion entrante depuis Internet.",
          "- **Load Balancer (Répartiteur de charge) :** Distribue les requêtes entrantes vers les VM applicatives saines, assure la terminaison TLS (HTTPS) et évite d'exposer directement les adresses IP des VM.",
          "- **Bastion (ou passerelle VPN) :** Point d'entrée unique, hautement surveillé et journalisé, permettant aux administrateurs de se connecter en SSH/RDP aux serveurs privés."
        ],
        example: "🏫 **Architecture ENSIA-Tech recommandée (Activité 1 du cours) :**",
        exampleList: [
          "- *Zone publique :* Load Balancer (LB) + WAF.",
          "- *Zone privée :* Serveurs d'application du portail web.",
          "- *Zone données :* Serveur de base de données PostgreSQL/MySQL contenant les notes.",
          "- *Accès administrateur :* Via tunnel VPN ou serveur Bastion dédié avec MFA."
        ],
        security: "🔐 **Impact Sécurité :** Une base de données ne doit JAMAIS recevoir d'adresse IP publique ni être placée dans un sous-réseau public. Tout accès doit obligatoirement transiter par la couche applicative.",
        keyPoints: [
          "Internet Gateway = entrée et sortie publiques.",
          "NAT Gateway = sortie sortante seule pour les serveurs privés.",
          "Le Bastion est la seule porte d'entrée d'administration vers les réseaux privés."
        ],
        traps: "⚠️ **Erreur mortelle d'architecture :** Attribuer une IP publique à la machine de base de données 'parce que c'était plus simple pour que le développeur s'y connecte depuis chez lui'. Cela l'expose aux scanners automatisés de botnets !"
      }
    },
    {
      id: "ch2-sec4-stockage-cloud",
      title: "4. Stockage dans le Cloud : Objets, Blocs, Fichiers & Risques",
      badge: "Données & Stockage",
      content: {
        idea: "🎯 Le Cloud propose 4 types de stockage distincts : un stockage ne doit jamais être rendu public par accident, car c'est la source n°1 de fuite de données.",
        analogy: "🧩 💡 Ajout pédagogique : Stockage Bloc = un disque dur vierge que vous branchez dans votre PC. Stockage Fichier = une clé USB partagée sur la box internet du salon. Stockage Objet = une consigne automatique où chaque valise a un numéro de ticket unique pour la récupérer.",
        explanation: [
          "**1. Stockage Objet (Object Storage - AWS S3, Azure Blob, GCP Cloud Storage) :**",
          "- Stockage illimité de fichiers plats (documents, photos, sauvegardes, logs exportés).",
          "- Accessible directement via des API HTTP/HTTPS.",
          "- Risque majeur : les permissions d'accès (ACL/Bucket Policy) mal configurées qui rendent le bucket accessible à n'importe qui sur Internet !",
          "**2. Stockage Bloc (Block Storage - AWS EBS, Azure Disk, GCP Persistent Disk) :**",
          "- Volumes de disques virtuels bruts attachés directement à une VM (comme un SSD interne).",
          "- Très rapide, utilisé pour installer le système d'exploitation et les bases de données.",
          "**3. Stockage Fichier (File Storage - AWS EFS, Azure Files) :**",
          "- Partages de fichiers réseau (protocoles NFS ou SMB) accessibles simultanément par plusieurs VM.",
          "**4. Bases de Données Managées (DBaaS - AWS RDS, Cloud SQL) :**",
          "- Bases de données configurées, sauvegardées et patchées automatiquement par le fournisseur Cloud.",
          "**Règle de prudence absolue du cours :** 'Un stockage Cloud ne doit jamais être public par accident : accès, chiffrement, logs et cycle de vie doivent être vérifiés.'"
        ],
        example: "🏫 **Cas ENSIA-Tech :** Les copies d'examens et relevés de notes PDF des étudiants sont stockés dans un **bucket de stockage objet**. Une mauvaise case cochée dans la console rend ce bucket public : n'importe quel internaute tapant l'URL peut télécharger les notes confidentielles !",
        security: "🔐 **Contrôles obligatoires :** Chiffrement au repos (via KMS), blocage global de l'accès public (Block Public Access), activation du versioning et journalisation des accès de lecture/écriture.",
        keyPoints: [
          "Stockage objet = documents, fichiers de logs et sauvegardes (attention aux accès publics).",
          "Stockage bloc = disques système des VM.",
          "Toutes les données sensibles doivent être chiffrées au repos."
        ],
        traps: "⚠️ **Piège classique :** Penser que chiffrer un bucket de stockage empêche un attaquant de lire les données si le bucket est public. Si les permissions autorisent 'Tout le monde', le service Cloud déchiffre automatiquement le fichier à la volée avant de le servir à l'attaquant !"
      }
    },
    {
      id: "ch2-sec5-management-vs-data-plane",
      title: "5. Management Plane vs Data Plane : Les Deux Plans d'Accès",
      badge: "Concept clé de sécurité",
      content: {
        idea: "🎯 Dans le Cloud, le Management Plane (qui configure tout) est au moins aussi important à protéger que le Data Plane (qui transporte le trafic applicatif).",
        analogy: "🧩 💡 Ajout pédagogique : Le Data Plane, ce sont les portes et couloirs d'une banque où circulent les clients. Le Management Plane, c'est le bouton rouge de l'architecte qui peut faire disparaître les murs, changer les serrures ou couper l'alarme en 1 seconde.",
        explanation: [
          "**Management Plane (Plan de gestion / Contrôle) :**",
          "- Outils : Console web de gestion, API d'administration, commandes CLI (AWS CLI, az, gcloud), Terraform, gestion des identités (IAM).",
          "- Actions : Créer des VM, ouvrir des ports de pare-feu, supprimer des disques, changer les routes, exporter des sauvegardes.",
          "- Question sécurité fondamentale : *« Qui peut modifier l'architecture ? »*",
          "**Data Plane (Plan de données / Trafic) :**",
          "- Flux : Trafic réseau applicatif, requêtes HTTP des internautes, requêtes SQL vers la base, consultation de fichiers.",
          "- Question sécurité fondamentale : *« Qui peut accéder aux données et aux services en production ? »*",
          "**Point clé officiel du cours :** 'Dans le Cloud, contrôler le management plane est aussi important que filtrer les ports réseau.'"
        ],
        example: "🏫 **Illustration ENSIA-Tech :** Un pare-feu réseau bloque les connexions pirates vers la base de données (Data Plane sécurisé). Mais un stagiaire a créé une clé API admin sans MFA sur son PC (Management Plane exposé). Un pirate volant cette clé API utilise l'API Cloud pour supprimer directement la base de données sans même passer par le réseau !",
        security: "🔐 **Mesures de protection du Management Plane :** Comptes nominatifs stricts, MFA matériel obligatoire, principe du moindre privilège (RBAC), journalisation exhaustive des appels API (CloudTrail/Activity Logs).",
        keyPoints: [
          "Management Plane = administration et contrôle de l'infrastructure.",
          "Data Plane = trafic des données et des utilisateurs.",
          "Une clé API du Management plane volée donne les pleins pouvoirs à l'attaquant."
        ],
        traps: "⚠️ **Confusion d'examen :** Ne croyez pas que le pare-feu réseau vous protège contre une attaque sur le Management Plane. Les requêtes d'API de gestion passent par les serveurs sécurisés du fournisseur Cloud, pas par votre réseau privé !"
      }
    },
    {
      id: "ch2-sec6-fournisseurs-equivalences",
      title: "6. Fournisseurs Cloud & Tableau Officiel d'Équivalences",
      badge: "Comparatif Hyperscalers",
      content: {
        idea: "🎯 Chaque grand fournisseur donne des noms commerciaux différents aux mêmes composants : il ne faut pas apprendre les noms par cœur, mais maîtriser la fonction de sécurité derrière chaque service.",
        analogy: "🧩 💡 Ajout pédagogique : Une voiture reste une voiture avec 4 roues et un volant, qu'on l'appelle Clio chez Renault, Golf chez Volkswagen ou 208 chez Peugeot.",
        explanation: [
          "**Les 4 familles de fournisseurs (Slide 12) :**",
          "- **Hyperscalers mondiaux (AWS, Azure, Google Cloud) :** Catalogue immense, automatisation maximale, présence mondiale.",
          "- **Clouds régionaux / souverains (OVHcloud, Scaleway, fournisseurs locaux) :** Proximité, conformité réglementaire stricte, maîtrise des coûts et souveraineté des données.",
          "- **Cloud Privé (VMware, OpenStack, Nutanix, Proxmox) :** Contrôle interne absolu, mais gestion matérielle lourde.",
          "- **SaaS Spécialisés :** Messagerie, CRM, sauvegardes clé en main.",
          "**Le Tableau Officiel d'Équivalences du Cours (Slide 13) :**",
          "| Fonction Technique | AWS | Microsoft Azure | Google Cloud (GCP) | Question de sécurité clé |",
          "|---|---|---|---|---|",
          "| **VM / Calcul** | **EC2** | **Virtual Machines** | **Compute Engine** | OS invité, correctifs/patchs, restriction des accès admin |",
          "| **Réseau virtuel** | **VPC** | **VNet** | **VPC** | Segmentation logique, tables de routage, exposition Internet |",
          "| **Pare-feu logique** | **Security Groups / NACL** | **NSG (Network Security Group)** | **Firewall Rules** | Filtrage des flux autorisés/interdits (moindre privilège) |",
          "| **Stockage objet** | **S3** | **Blob Storage** | **Cloud Storage** | Accès public/privé, chiffrement KMS, journalisation des accès |",
          "| **Identité (IAM)** | **IAM** | **Entra ID / RBAC** (ex-Azure AD) | **IAM** | Politiques de moindre privilège, obligation du MFA |",
          "| **Logs & Audit** | **CloudTrail / CloudWatch** | **Monitor / Activity Logs** | **Cloud Logging / Audit Logs** | Détection d'anomalies, preuves médico-légales, traçabilité |"
        ],
        example: "🏫 **Méthode ingénieur du cours : Composant -> Décision -> Contrôle -> Preuve :**",
        exampleList: [
          "- *Composant VM :* Décision = Exposer ou non ? -> Contrôle = Firewall/NSG -> Preuve = Rapport d'audit des ports ouverts.",
          "- *Composant Storage :* Décision = Chiffrer ? -> Contrôle = Clés KMS -> Preuve = Rapport de chiffrement actif.",
          "- *Composant API :* Décision = Journaliser ? -> Contrôle = Logs d'audit (CloudTrail/Monitor) -> Preuve = Alertes temps réel envoyées au SOC."
        ],
        security: "🔐 **Réflexe ingénieur :** 'Chaque service Cloud déployé doit être accompagné d'une décision de sécurité explicite, sinon il devient une surface d'attaque non maîtrisée.'",
        keyPoints: [
          "Apprendre les fonctions de sécurité, pas les acronymes marketing.",
          "Méthode réflexe : Composant -> Décision -> Contrôle -> Preuve."
        ],
        traps: "⚠️ **Attention :** Ne confondez pas Security Group (pare-feu d'état au niveau de la carte réseau virtuelle) et NACL (pare-feu sans état au niveau du sous-réseau entier chez AWS)."
      }
    },
    {
      id: "ch2-sec7-secaas",
      title: "7. SecaaS (Security as a Service) & Les 6 Familles de Services",
      badge: "Services managés",
      content: {
        idea: "🎯 Le SecaaS consiste à consommer des outils de sécurité sous forme de services Cloud managés : le fournisseur donne l'outil, mais c'est au client de le configurer et de surveiller ses alertes.",
        analogy: "🧩 💡 Ajout pédagogique : Acheter un système d'alarme antivol ultra-perfectionné ne protège rien du tout si vous ne tapez jamais le code pour l'armer en sortant et si personne n'écoute quand la sirène retentit !",
        explanation: [
          "**Les 6 familles de SecaaS (Slide 15) :**",
          "1. **IAM / MFA (Identity & Access Management) :** Gestion centralisée des identités, des rôles et de l'authentification multifacteur pour interdire les accès non autorisés.",
          "2. **KMS & Gestion des secrets (Key Management Service) :** Génération, stockage sécurisé dans des modules matériels (HSM) et rotation automatique des clés de chiffrement et mots de passe.",
          "3. **WAF & API Security (Web Application Firewall) :** Filtrage et inspection des requêtes HTTP/HTTPS pour neutraliser les injections SQL, XSS et requêtes malveillantes visant les applications web et API.",
          "4. **SIEM & Logs (Security Information and Event Management) :** Centralisation, normalisation et corrélation automatique des journaux d'événements pour détecter les attaques en temps réel.",
          "5. **CSPM (Cloud Security Posture Management) :** Audit automatisé et permanent de la conformité de l'infrastructure Cloud pour détecter instantanément les erreurs de configuration (ex: un bucket S3 laissé public).",
          "6. **Backup & DR (Disaster Recovery / Plan de Reprise d'Activité) :** Sauvegarde automatisée, immuable et géo-distribuée pour restaurer l'activité après un crash ou un ransomware.",
          "**Le cycle d'intégration en 4 étapes (Slide 16) :**",
          "- `Activer` (créer le service WAF, KMS...) -> `Connecter` (brancher les flux, rôles et logs) -> `Configurer` (écrire les règles, seuils et exclusions) -> `Exploiter` (analyser les alertes et réagir)."
        ],
        example: "🏫 **Rappel du cours (Slide 16) :** *« Un SIEM sans logs envoyés, sans règles de détection et sans analyste pour lire les alertes n'est qu'une plateforme vide et inutile. »*",
        security: "🔐 **Limite importante du cours :** 'Souscrire à un service de sécurité ne remplace JAMAIS la conception, la configuration, la supervision et la responsabilité humaine de l'équipe sécurité du client.'",
        keyPoints: [
          "6 familles SecaaS : IAM/MFA, KMS, WAF, SIEM, CSPM, Backup/DR.",
          "Activer un outil de sécurité ne suffit pas : il faut obligatoirement l'exploiter."
        ],
        traps: "⚠️ **Question piège :** 'Si j'active un WAF devant mon site, mon application est-elle 100% protégée contre les pirates ?' Non ! Le WAF filtre les attaques web connues, mais ne corrige pas les failles dans votre code métier ni les erreurs de logique d'authentification."
      }
    },
    {
      id: "ch2-sec8-responsabilite-partagee-details",
      title: "8. Modèle de Responsabilité Partagée Détaillé (IaaS vs PaaS vs SaaS)",
      badge: "Cœur de la sécurité Cloud",
      content: {
        idea: "🎯 Le fournisseur protège l'infrastructure DU Cloud ; le client protège ses usages, ses données et ses configurations DANS le Cloud.",
        analogy: "🧩 💡 Ajout pédagogique : Le propriétaire de l'appartement garantit que la porte a une serrure solide et que le toit ne fuit pas (sécurité DU bâtiment). Mais si vous perdez votre clé ou invitez un voleur chez vous, c'est votre entière responsabilité (sécurité DANS le logement).",
        explanation: [
          "**Le Tableau Officiel Détaillé de CH2 (Slide 17) :**",
          "| Couche / Responsabilité | IaaS | PaaS | SaaS |",
          "|---|---|---|---|",
          "| **Datacenter, matériel physique, réseau physique** | **Fournisseur** | **Fournisseur** | **Fournisseur** |",
          "| **Virtualisation / Plateforme de base** | **Fournisseur** | **Fournisseur** | **Fournisseur** |",
          "| **Système d'exploitation (OS) et correctifs** | **Client** | Souvent **Fournisseur** | **Fournisseur** |",
          "| **Application logicielle** | **Client** | **Client** | **Fournisseur** |",
          "| **Données hébergées** | **Client** | **Client** | **Client** (ou partagé) |",
          "| **Identités et droits d'accès** | **Client** | **Client** | **Client** |",
          "| **Configuration de sécurité** | **Client** | **Partagée** | **Partagée** |",
          "**Exercice d'imputation de responsabilité du cours (Activité 3) :**",
          "1. *Panne électrique générale dans le datacenter :* Responsabilité **Fournisseur** (infrastructure physique).",
          "2. *Compte administrateur piraté car sans MFA :* Responsabilité **Client** (gestion des accès).",
          "3. *Bucket de stockage rendu public par erreur :* Responsabilité **Client** (mauvaise configuration).",
          "4. *Vulnérabilité d'injection SQL dans le code du portail :* Responsabilité **Client** (code applicatif).",
          "5. *Faille de sécurité dans le code de l'hyperviseur physique :* Responsabilité **Fournisseur** (couche de virtualisation)."
        ],
        example: "🏫 **Cas concret ENSIA-Tech :** Si le datacenter d'AWS prend feu à Francfort, AWS doit indemniser selon le contrat SLA. Mais si un enseignant configure son bucket S3 avec un accès ouvert à 'All Users', provoquant la fuite des examens, AWS n'est responsable d'absolument rien : c'est 100% la faute d'ENSIA-Tech.",
        security: "🔐 **À retenir par cœur :** Plus le service monte vers le SaaS, plus la part d'infrastructure gérée par le fournisseur grandit, mais **les données et les identités restent TOUJOURS sous la responsabilité du client** !",
        keyPoints: [
          "Sécurité DU Cloud = Fournisseur (hardware, datacenters, hyperviseur).",
          "Sécurité DANS le Cloud = Client (OS en IaaS, code en PaaS, données et comptes partout).",
          "La mauvaise configuration par le client est la cause de plus de 90% des failles Cloud."
        ],
        traps: "⚠️ **Attention aux nuances d'examen :** Ne dites jamais qu'en SaaS le client n'a plus rien à faire : il doit encore gérer l'authentification (MFA), les droits d'accès de ses salariés et la classification de ses données !"
      }
    },
    {
      id: "ch2-sec9-surface-attaque-identite",
      title: "9. Surface d'Attaque, Mauvaise Configuration & L'Identité comme Périmètre",
      badge: "Menaces & Cyberdéfense",
      content: {
        idea: "🎯 Dans le Cloud, le réseau physique n'existe plus pour vous : l'identité (IAM) devient le nouveau périmètre de sécurité, et une identité surprivilégiée est plus dangereuse qu'un port ouvert.",
        analogy: "🧩 💡 Ajout pédagogique : Autrefois, pour voler un château, il fallait escalader les remparts en pierre (le réseau). Aujourd'hui, il suffit de voler le badge électronique du directeur général pour que toutes les portes s'ouvrent automatiquement.",
        explanation: [
          "**Les 5 zones de risque à cartographier (Slide 18) :**",
          "1. **Identités :** Comptes admin orphelins, absence de MFA, rôles trop permissifs (`AdministratorAccess` attribué à tout le monde), clés d'API permanentes non renouvelées.",
          "2. **API & Console :** Interfaces d'administration accessibles depuis toute la terre, tokens d'accès codés en dur dans des scripts Git publics, absence de traçabilité.",
          "3. **Réseau :** Règles de pare-feu trop permissives ouvrant `0.0.0.0/0` sur le port SSH (22) ou RDP (3389), VM privées dotées d'IP publiques par mégarde.",
          "4. **Stockage & Données :** Buckets publics non surveillés, snapshots non chiffrés, absence de politique de rétention.",
          "5. **Logs & Supervision :** Journaux d'audit non activés (ex: CloudTrail désactivé), alertes de sécurité ignorées par manque d'analyste.",
          "**Le risque n°1 : La mauvaise configuration (Slide 20) :**",
          "- Le Cloud permet de déployer 50 serveurs en 2 minutes : il accélère ainsi dramatiquement les erreurs humaines et organisationnelles.",
          "- Exemples : laisser un port de base de données ouvert à toute la planète, oublier de cocher le chiffrement, créer des clés de compte de service valables à vie.",
          "**L'identité comme principal périmètre (Slide 21) :**",
          "- Dans le modèle Zero Trust, une identité avec une clé API compromise peut exécuter des actions destructrices : Créer, Exposer, Copier ou Supprimer des ressources à volonté."
        ],
        example: "🏫 **Scénario ENSIA-Tech (Slide 19) :** Un étudiant stagiaire pousse par erreur son code sur GitHub avec la clé API AWS 'root' de l'école. En 10 minutes, un bot pirate détecte la clé sur GitHub, se connecte au Management Plane et crée 200 serveurs virtuels de minage de cryptomonnaie en Asie : facture de 50 000 € en 24 heures !",
        security: "🔐 **Contrôles prioritaires :** Moindre privilège absolu (attribuer uniquement les droits minimaux nécessaires), MFA obligatoire pour tout le monde, rotation trimestrielle des clés API, et utilisation d'un CSPM pour bloquer les erreurs de configuration.",
        keyPoints: [
          "5 surfaces d'attaque : Identités, API/Console, Réseau, Stockage, Logs.",
          "L'erreur de configuration est la faiblesse n°1 du Cloud.",
          "Une identité trop puissante sans MFA est plus dangereuse qu'un port réseau ouvert."
        ],
        traps: "⚠️ **Question réflexe du cours :** 'Qu'est-ce qui peut être modifié, exposé, consulté ou supprimé ?' Face à une architecture Cloud, posez-vous toujours cette question pour déceler les failles."
      }
    }
  ],

  // Activités officielles de CH2
  activities: [
    {
      id: "ch2-act1",
      title: "Activité 1 • Construire l'Architecture Logique ENSIA-Tech",
      duration: "10 minutes",
      description: "À partir des besoins de l'école ENSIA-Tech, répondez aux 5 questions officielles d'architecture du cours :",
      questions: [
        {
          q: "1. Quels services doivent être accessibles aux étudiants depuis Internet ?",
          answer: "Le portail web étudiant ou le point d'entrée applicatif (placé dans la zone publique via Load Balancer / WAF)."
        },
        {
          q: "2. Quels composants doivent rester impérativement inaccessibles directement depuis Internet ?",
          answer: "Les serveurs d'application internes, les serveurs d'authentification et les bases de données (placés en zone privée ou données)."
        },
        {
          q: "3. Où faut-il placer la base de données ?",
          answer: "Dans une zone données isolée (Data Subnet) sans aucune adresse IP publique, accessible uniquement depuis les serveurs applicatifs."
        },
        {
          q: "4. Comment l'administrateur système doit-il accéder à l'environnement pour effectuer la maintenance ?",
          answer: "Par un tunnel VPN chiffré ou via un serveur Bastion (Jump Host) hautement protégé avec MFA et journalisation stricte."
        },
        {
          q: "5. Quelles informations doivent être journalisées et sauvegardées en priorité ?",
          answer: "Centralisation des journaux d'audit (accès admin, appels API, logs pare-feu) et sauvegardes immuables et protégées des bases de données."
        }
      ]
    },
    {
      id: "ch2-act2",
      title: "Activité 2 • Associer Composant, Risque, Contrôle et Preuve",
      duration: "10 minutes",
      description: "Associez chaque élément du cours à son risque principal, son contrôle prioritaire et sa justification :",
      associations: [
        {
          element: "VM publique",
          risk: "Exposition réseau directe",
          control: "Firewall + Durcissement (Hardening) + Logs",
          justification: "Limiter strictement les ports ouverts (ex: 443 uniquement) et tracer toutes les tentatives d'accès."
        },
        {
          element: "Base de données",
          risk: "Exfiltration de données confidentielles",
          control: "Réseau privé isolé + Chiffrement + IAM strict",
          justification: "Les données ne doivent jamais être exposées directement sur Internet et doivent être chiffrées au repos."
        },
        {
          element: "Bucket de documents",
          risk: "Accès public accidentel par mauvaise configuration",
          control: "Politique d'accès restreinte + Chiffrement KMS + Logs d'accès",
          justification: "Le stockage Cloud est une source très fréquente de fuite de données massives suite à une case mal cochée."
        },
        {
          element: "Console d'administration",
          risk: "Prise de contrôle totale de l'infrastructure",
          control: "MFA obligatoire + Moindre privilège (RBAC) + Audit CloudTrail",
          justification: "Le Management Plane permet de modifier, créer ou détruire l'ensemble des ressources en un clic."
        },
        {
          element: "API exposée",
          risk: "Abus applicatif, attaques automatisées et DoS",
          control: "API Gateway / WAF + Authentification par token + Rate Limiting",
          justification: "Les API sont des cibles idéales pour les robots et les scripts malveillants d'attaque automatisée."
        },
        {
          element: "Journaux d'événements (Logs)",
          risk: "Absence de preuve après une intrusion (impunité de l'attaquant)",
          control: "Centralisation sur stockage immuable + Alertes temps réel",
          justification: "Les logs sont indispensables pour détecter l'intrusion, reconstituer l'attaque et fournir des preuves médico-légales."
        }
      ]
    },
    {
      id: "ch2-act3",
      title: "Activité 3 • Qui est Responsable ? (Exercice officiel du cours)",
      duration: "7 minutes",
      description: "Pour chaque incident survenu, déterminez si la responsabilité incombe au Fournisseur, au Client ou si elle est partagée, avec la justification exacte :",
      scenarios: [
        {
          incident: "1. Coupure d'alimentation électrique générale dans le datacenter du fournisseur Cloud.",
          resp: "Fournisseur",
          justification: "Le fournisseur garantit la disponibilité de l'infrastructure physique et de la plateforme matérielle."
        },
        {
          incident: "2. Piratage d'un compte administrateur dont le mot de passe était 'Admin123' sans double facteur (MFA).",
          resp: "Client",
          justification: "La gestion des identités, le durcissement des mots de passe et l'activation du MFA sont de la responsabilité du client."
        },
        {
          incident: "3. Fuite de données suite à un bucket de stockage d'archives rendu public par inadvertance.",
          resp: "Client",
          justification: "La mauvaise configuration des politiques d'accès aux données relève du paramétrage client."
        },
        {
          incident: "4. Exploitation d'une faille d'injection SQL présente dans le code PHP du portail web développé par l'entreprise.",
          resp: "Client",
          justification: "La sécurité du code applicatif et des développements métier incombe exclusivement au client."
        },
        {
          incident: "5. Un pirate découvre une faille 'Zero-Day' dans le logiciel d'hyperviseur sous-jacent et s'évade d'une VM.",
          resp: "Fournisseur",
          justification: "La couche de virtualisation et l'hyperviseur sous-jacent sont développés, gérés et sécurisés par le fournisseur Cloud."
        }
      ]
    },
    {
      id: "ch2-act4",
      title: "Activité 4 • Cartographier les Surfaces d'Attaque (Mini-cas ENSIA-Tech)",
      duration: "8 minutes",
      description: "Sur l'architecture ENSIA-Tech, cartographiez les points d'exposition, les erreurs possibles et les contrôles indispensables :",
      items: [
        {
          category: "1) Trois points d'exposition possibles",
          details: "Le Load Balancer / WAF public, les points de terminaison d'API, le serveur Bastion / passerelle VPN, la console web Cloud et tout stockage mal configuré."
        },
        {
          category: "2) Deux erreurs de configuration fréquentes",
          details: "Placer un serveur de base de données dans un sous-réseau public avec une règle firewall ouverte à 0.0.0.0/0 ; désactiver le MFA sur les comptes administrateurs ; oublier d'activer la journalisation des accès."
        },
        {
          category: "3) Deux contrôles prioritaires",
          details: "Segmentation réseau stricte avec sous-réseaux privés hermétiques ; application rigoureuse du principe du moindre privilège avec MFA obligatoire."
        },
        {
          category: "4) Informations vitales à journaliser",
          details: "Toutes les connexions des administrateurs, les appels API de modification d'infrastructure, les refus de connexion pare-feu et les accès aux données confidentielles."
        }
      ]
    }
  ],

  // QCM interactifs complets pour CH2 (15+ questions avec explications pédagogiques)
  quiz: [
    {
      id: "q-ch2-01",
      level: "facile",
      type: "single",
      question: "Quel composant réseau logique est utilisé dans le Cloud pour isoler et segmenter l'infrastructure réseau d'une organisation ?",
      options: [
        "Un câble Ethernet Cat 6",
        "Un VPC (Virtual Private Cloud) ou VNet",
        "Un serveur DNS public",
        "Un compte de stockage objet S3"
      ],
      answer: 1,
      explanation: "Question officielle du cours ! Le VPC (chez AWS/GCP) ou VNet (chez Azure) constitue le périmètre réseau virtuel privé et isolé dans lequel le client déploie ses sous-réseaux et ses VM.",
      courseRef: "ch2-sec3-reseau-virtuel"
    },
    {
      id: "q-ch2-02",
      level: "facile",
      type: "single",
      question: "Pourquoi une base de données de production ne doit-elle JAMAIS être hébergée dans un sous-réseau public ?",
      options: [
        "Parce que les serveurs SQL refusent de démarrer s'ils ont une adresse IP.",
        "Pour réduire l'exposition aux attaques directes depuis Internet et limiter les risques d'exfiltration de données.",
        "Parce que les sous-réseaux publics sont réservés aux fichiers HTML statiques.",
        "Pour économiser le coût d'une adresse IP publique."
      ],
      answer: 1,
      explanation: "Question officielle du cours ! En plaçant la base de données dans un sous-réseau privé isolé, aucun attaquant sur Internet ne peut lui envoyer directement de paquets malveillants ni scanner ses ports.",
      courseRef: "ch2-sec3-reseau-virtuel"
    },
    {
      id: "q-ch2-03",
      level: "facile",
      type: "single",
      question: "Quelle est la différence fondamentale entre le Management Plane et le Data Plane dans une architecture Cloud ?",
      options: [
        "Le Management Plane gère l'administration et les politiques de l'infrastructure, tandis que le Data Plane transporte les données et requêtes des utilisateurs.",
        "Le Management Plane concerne le matériel physique et le Data Plane les câbles de fibre optique.",
        "Le Data Plane est réservé aux administrateurs et le Management Plane aux clients.",
        "Il n'y a aucune différence, ce sont deux termes interchangeables."
      ],
      answer: 0,
      explanation: "Question officielle du cours ! Le Management Plane correspond à la console et aux API de gestion qui créent ou suppriment des serveurs. Le Data Plane correspond au trafic applicatif et aux requêtes vers les données.",
      courseRef: "ch2-sec5-management-vs-data-plane"
    },
    {
      id: "q-ch2-04",
      level: "facile",
      type: "single",
      question: "Parmi les propositions suivantes, laquelle regroupe DEUX exemples valides de services SecaaS (Security as a Service) ?",
      options: [
        "WAF (Web Application Firewall) et KMS (Key Management Service)",
        "Disque SSD et câble HDMI",
        "Linux Ubuntu et Windows 11",
        "Apache et Nginx"
      ],
      answer: 0,
      explanation: "Question officielle du cours ! Le WAF (filtrage applicatif web) et le KMS (gestion des clés de chiffrement) font partie des 6 familles majeures de SecaaS définies dans le cours (avec IAM, SIEM, CSPM et Backup).",
      courseRef: "ch2-sec7-secaas"
    },
    {
      id: "q-ch2-05",
      level: "facile",
      type: "single",
      question: "Qui est le principal responsable en cas de fuite de données causée par un bucket de stockage Cloud configuré en accès public par inadvertance ?",
      options: [
        "Le fournisseur Cloud, qui aurait dû interdire l'existence de buckets publics.",
        "Le client, car la configuration des politiques d'accès et des permissions de ses données lui incombe.",
        "L'opérateur télécom qui a acheminé la connexion.",
        "Le fabricant du disque dur du serveur."
      ],
      answer: 1,
      explanation: "Question officielle du cours et piège classique ! Bien que les fournisseurs fournissent des options de sécurité, le choix de rendre un stockage public relève de la décision et de la configuration du client.",
      courseRef: "ch2-sec8-responsabilite-partagee-details"
    },
    {
      id: "q-ch2-06",
      level: "moyen",
      type: "single",
      question: "Selon le standard NIST SP 500-292, quel acteur est chargé d'effectuer une évaluation indépendante de la sécurité, de la conformité et des performances d'un service Cloud ?",
      options: [
        "Le Cloud Carrier",
        "Le Cloud Auditor",
        "Le Cloud Consumer",
        "Le Cloud Broker"
      ],
      answer: 1,
      explanation: "Le Cloud Auditor (Auditeur Cloud) est un tiers indépendant mandaté pour vérifier et certifier que le fournisseur Cloud respecte bien les normes de sécurité (ISO 27001, SOC 2, RGPD).",
      courseRef: "ch2-sec1-acteurs-nist"
    },
    {
      id: "q-ch2-07",
      level: "moyen",
      type: "single",
      question: "Dans le réseau virtuel Cloud, quelle est la fonction exacte d'une passerelle NAT (NAT Gateway) ?",
      options: [
        "Permettre à n'importe quel internaute d'accéder directement aux serveurs internes.",
        "Permettre aux serveurs situés dans un sous-réseau privé d'accéder à Internet en sortie (mises à jour) sans autoriser de connexions entrantes depuis Internet.",
        "Remplacer le serveur de base de données.",
        "Accélérer la vitesse du processeur des machines virtuelles."
      ],
      answer: 1,
      explanation: "La NAT Gateway effectue une translation d'adresse unidirectionnelle : elle laisse les requêtes sortantes de vos VM privées traverser vers Internet, mais bloque catégoriquement les connexions initiées depuis l'extérieur.",
      courseRef: "ch2-sec3-reseau-virtuel"
    },
    {
      id: "q-ch2-08",
      level: "moyen",
      type: "single",
      question: "Quel service d'Azure correspond fonctionnellement au service Amazon S3 d'AWS pour le stockage d'objets ?",
      options: [
        "Azure Virtual Machines",
        "Azure Blob Storage",
        "Azure Network Security Group (NSG)",
        "Azure Key Vault"
      ],
      answer: 1,
      explanation: "Tableau officiel d'équivalences du cours (Slide 13) : Pour le stockage objet, AWS propose S3, Azure propose Blob Storage, et GCP propose Cloud Storage.",
      courseRef: "ch2-sec6-fournisseurs-equivalences"
    },
    {
      id: "q-ch2-09",
      level: "moyen",
      type: "single",
      question: "Pourquoi dit-on dans le cours qu'activer un outil SecaaS comme un SIEM ne suffit absolument pas à sécuriser une entreprise ?",
      options: [
        "Parce que les SIEM ne fonctionnent que la nuit.",
        "Parce qu'un SIEM sans flux de logs configurés, sans règles de détection affinées et sans analystes humains n'est qu'une plateforme vide.",
        "Parce que le Cloud interdit l'analyse des journaux.",
        "Parce qu'un SIEM remplace le pare-feu physique."
      ],
      answer: 1,
      explanation: "Slide 16 du cours : 'Un SIEM sans logs envoyés, sans règles et sans analyste n'est qu'une plateforme vide.' La sécurité nécessite d'Activer, Connecter, Configurer et surtout Exploiter continuellement l'outil.",
      courseRef: "ch2-sec7-secaas"
    },
    {
      id: "q-ch2-10",
      level: "moyen",
      type: "single",
      question: "Quel type de stockage Cloud est utilisé pour faire office de disque dur principal d'une machine virtuelle (contenant l'OS et le système de fichiers) ?",
      options: [
        "Stockage Objet (ex: S3 / Blob)",
        "Stockage Bloc (ex: EBS / Azure Disk / Persistent Disk)",
        "Stockage Fichier partagé (NFS)",
        "Stockage Bande magnétique"
      ],
      answer: 1,
      explanation: "Le stockage bloc fournit des volumes disques bruts de haute performance attachés directement à l'instance de calcul pour héberger les partitions et le système d'exploitation.",
      courseRef: "ch2-sec4-stockage-cloud"
    },
    {
      id: "q-ch2-11",
      level: "piege",
      type: "single",
      question: "Pourquoi affirme-t-on dans le cours que 'Dans le Cloud, une identité trop puissante peut être plus dangereuse qu'un port réseau ouvert' ?",
      options: [
        "Parce que les identités consomment plus de mémoire vive que les ports TCP.",
        "Parce qu'un attaquant volant des identifiants avec des droits administratifs sur le Management Plane peut détruire des serveurs, ouvrir des firewalls ou voler des données en un seul appel d'API sans être bloqué par le réseau.",
        "Parce que les pirates n'utilisent plus jamais le réseau pour attaquer.",
        "Parce que les ports réseau sont systématiquement fermés par le gouvernement."
      ],
      answer: 1,
      explanation: "Slide 21 de CH2 : Avec une clé d'API d'administration volée, l'attaquant contrôle la console Cloud. Il peut contourner tous les pare-feux en les reconfigurant lui-même à distance !",
      courseRef: "ch2-sec9-surface-attaque-identite"
    },
    {
      id: "q-ch2-12",
      level: "piege",
      type: "single",
      question: "Quelle est la mission spécifique d'une solution de type CSPM (Cloud Security Posture Management) ?",
      options: [
        "Remplacer les disques durs défaillants dans le datacenter.",
        "Scanner en continu la configuration de l'infrastructure Cloud pour identifier automatiquement les écarts de conformité et les failles de paramétrage (ex: buckets publics, absence de MFA).",
        "Bloquer les virus sur les ordinateurs des étudiants.",
        "Augmenter la vitesse de téléchargement des fichiers."
      ],
      answer: 1,
      explanation: "Le CSPM surveille la 'posture' de sécurité dans le Cloud en vérifiant que chaque ressource respecte les règles de sécurité définies et en alertant immédiatement en cas de mauvaise configuration humaine.",
      courseRef: "ch2-sec7-secaas"
    },
    {
      id: "q-ch2-13",
      level: "piege",
      type: "multiple",
      question: "Quelles sont les composantes de la méthode d'ingénierie réflexe préconisée dans le cours CH2 pour chaque service Cloud déployé ? (Sélectionnez les 4 étapes)",
      options: [
        "Composant",
        "Décision",
        "Contrôle",
        "Preuve"
      ],
      answer: [0, 1, 2, 3],
      explanation: "Slide 14 du cours : La méthode officielle 'Composant -> Décision -> Contrôle -> Preuve'. Exemple : Composant VM -> Décision Exposer ? -> Contrôle Firewall -> Preuve Rapport d'audit.",
      courseRef: "ch2-sec6-fournisseurs-equivalences"
    },
    {
      id: "q-ch2-14",
      level: "piege",
      type: "single",
      question: "Dans une architecture à haute disponibilité, pourquoi déploie-t-on des serveurs sur au moins deux Zones de Disponibilité (AZ) différentes au sein d'une même région ?",
      options: [
        "Pour payer deux fois moins cher le service.",
        "Pour que le service continue de fonctionner même en cas de sinistre physique majeur (panne électrique, incendie) affectant un datacenter complet.",
        "Parce qu'une seule AZ ne peut accueillir que 5 utilisateurs à la fois.",
        "Pour que les données soient automatiquement traduites en plusieurs langues."
      ],
      answer: 1,
      explanation: "Chaque Zone de Disponibilité (AZ) est un datacenter physiquement séparé et indépendant. Déployer en multi-AZ garantit la résilience face aux pannes matérielles massives d'un site entier.",
      courseRef: "ch2-sec2-six-couches"
    },
    {
      id: "q-ch2-15",
      level: "piege",
      type: "single",
      question: "Une entreprise stocke des données sensibles dans AWS S3. Elle active le chiffrement par défaut avec des clés gérées par le fournisseur (SSE-S3), mais laisse le bucket accessible publiquement à tous les utilisateurs d'Internet. Que se passe-t-il si un internaute télécharge un fichier confidentiel ?",
      options: [
        "L'internaute télécharge des octets illisibles et ne peut pas déchiffrer le fichier sans la clé secrète.",
        "Le service S3 déchiffre automatiquement le fichier à la volée car la requête de lecture est autorisée par la politique publique du bucket : la donnée confidentielle est donc divulguée en clair !",
        "Le serveur AWS explose pour protéger le secret des données.",
        "La connexion est automatiquement redirigée vers la police."
      ],
      answer: 1,
      explanation: "Piège redoutable de sécurité Cloud ! Le chiffrement au repos protège contre le vol physique d'un disque dur dans le datacenter. Mais si la politique d'accès du bucket autorise la lecture à n'importe qui, le service Cloud déchiffre le fichier en clair avant de l'envoyer au client !",
      courseRef: "ch2-sec4-stockage-cloud"
    }
  ]
};

