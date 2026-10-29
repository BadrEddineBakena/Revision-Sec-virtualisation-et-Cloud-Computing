# Application de Révision Interactive – M352
## Sécurité de la Virtualisation et du Cloud Computing
**Filière :** Sécurité IT et Confiance Numérique (ENSIASD)  
**Enseignant :** Prof. AGALIT Mohamed Amine  

---

## 🎯 Présentation du Projet
Cette application web interactive a été spécialement conçue pour préparer et réussir les contrôles continus et examens du module **M352**.  
Elle respecte strictement le cours officiel et traduit chaque notion technique dans un langage **simple, précis et accessible aux débutants**, avec des analogies du quotidien, des explications courtes, des schémas interactifs et des mises en situation réalistes (cas **ENSIA-Tech** et **AtlasTech**).

---

## 🚀 Comment Lancer l'Application ?

L'application est **100% autonome, sans dépendance lourde, sans backend et fonctionne parfaitement hors-ligne**.

### Option 1 : Lancement avec Accès Réseau Local & Mobile (Recommandé)
Exécutez simplement le script de démarrage dans votre terminal :
```bash
./start.sh
```
Ce script détecte automatiquement votre **adresse IP locale** et affiche :
- L'URL locale : `http://localhost:8080`
- L'URL pour votre **smartphone / tablette / PC distant** (ex : `http://192.168.1.45:8080`)
- Un **QR Code ASCII direct dans votre terminal** : scannez-le avec votre téléphone pour ouvrir immédiatement l'application de révision !

> 🛡️ **Rappel Cybersécurité (TP1 / UFW) :**  
> Si votre téléphone ne peut pas joindre la page, assurez-vous que le pare-feu de votre PC autorise le port 8080 en entrée :
> ```bash
> sudo ufw allow 8080/tcp
> ```

### Option 2 : Via Python direct
```bash
python3 server.py
# ou
python3 -m http.server 8080 --bind 0.0.0.0
```

### Option 3 : Via npm
```bash
npm run dev
# ou
npm start
```

### Option 4 : Double-clic direct (Zéro serveur, PC uniquement)
Vous pouvez ouvrir directement le fichier `index.html` dans n'importe quel navigateur web (Chrome, Firefox, Safari, Edge) en double-cliquant dessus.

---

## 📋 Checklist de Couverture Exhaustive (100% des PDF)

### ✅ CH1 – Fondamentaux du Cloud et de la Virtualisation
- [x] Limites du datacenter traditionnel (règle 1 service = 1 serveur, surdimensionnement pour le pic, gaspillage de 85% de CPU, maintenance lourde).
- [x] Cas d'étude initial ENSIA-Tech (5 serveurs physiques hétérogènes).
- [x] Définition de la virtualisation : abstraction matérielle, consolidation, isolation logique.
- [x] Définition institutionnelle NIST SP 800-145 ($\text{Cloud} = \text{Virtualisation} + \text{Automatisation} + \text{Service mesuré}$).
- [x] Les 5 caractéristiques essentielles NIST : On-demand self-service, Broad network access, Resource pooling (Multi-tenancy), Rapid elasticity, Measured service.
- [x] Les 3 modèles de service : IaaS (infrastructure), PaaS (plateforme), SaaS (logiciel prêt à l'emploi).
- [x] Tableau comparatif complet « Qui gère quoi ? » (Application, Données, Runtime, OS, Virtualisation, Matériel physique).
- [x] Modèles de déploiement : Public, Privé, Hybride (cas ENSIA-Tech), Communautaire.
- [x] Composants de virtualisation : vCPU, vRAM, disque virtuel, vNIC, BIOS virtuel, Hyperviseur / VMM.
- [x] Hyperviseurs : Type 1 (Bare-metal / production) vs Type 2 (Hosted / VirtualBox en TP).
- [x] Distinction fondamentale : Virtualisation $\neq$ Cloud Computing.
- [x] Premiers enjeux de sécurité : nouveaux actifs, nouveaux risques, nouveaux contrôles.
- [x] Toutes les activités intégrées (Activité 1 : Virt ou Cloud ; Activité 2 : Caractéristiques NIST ; Activité 3 : Choix IaaS/PaaS/SaaS ; Activité 4 : Déploiement ENSIA-Tech ; Mini-cas ENSIA-Tech ; Quiz final officiel).

### ✅ CH2 – Fournisseurs, Composants, SecaaS, Responsabilité Partagée & Risques
- [x] Acteurs NIST SP 500-292 : Cloud Consumer, Cloud Provider, Cloud Broker, Cloud Auditor, Cloud Carrier.
- [x] Les 6 couches d'une architecture Cloud (de l'infrastructure physique aux applications).
- [x] Topologie physique : Régions, Zones de Disponibilité (AZ multi-datacenters), Edge / CDN.
- [x] Réseau virtuel : VPC/VNet, Subnet public, Subnet privé, Zone Données isolée.
- [x] Équipements de flux : Internet Gateway (IGW), NAT Gateway (sortant seul), Load Balancer (LB/WAF), Bastion d'administration / VPN.
- [x] Données et stockage : Stockage objet (S3, Blob, Cloud Storage), Stockage bloc (EBS, Disques VM), Stockage fichier (NFS), Bases managées.
- [x] Management Plane (Plan de gestion / API / console / IAM) vs Data Plane (Plan de données / trafic applicatif).
- [x] Règle d'or : *« Contrôler le management plane est aussi important que filtrer les ports réseau »*.
- [x] Fournisseurs Cloud : Hyperscalers (AWS, Azure, GCP), Cloud régionaux (OVHcloud, Scaleway), Cloud privés (VMware, Proxmox), SaaS.
- [x] Tableau officiel des équivalences AWS vs Azure vs Google Cloud.
- [x] Méthode d'ingénierie réflexe : Composant $\rightarrow$ Décision $\rightarrow$ Contrôle $\rightarrow$ Preuve.
- [x] SecaaS (Security as a Service) et ses 6 familles : IAM/MFA, KMS/secrets, WAF/API, SIEM/logs, CSPM/posture, Backup/DR.
- [x] Le cycle de vie SecaaS : Activer $\rightarrow$ Connecter $\rightarrow$ Configurer $\rightarrow$ Exploiter.
- [x] Modèle de Responsabilité Partagée détaillé en IaaS, PaaS et SaaS.
- [x] Surface d'attaque Cloud : 5 zones de risque (Identités, API/Console, Réseau, Stockage, Logs).
- [x] La mauvaise configuration : risque central n°1 du Cloud.
- [x] L'identité comme principal périmètre de sécurité (modèle Zero Trust).
- [x] Mini-cas d'architecture ENSIA-Tech zone par zone.
- [x] Toutes les activités intégrées (Activité 1 : Architecture logique ; Activité 2 : Service & Contrôle ; Activité 3 : Qui est responsable ? ; Activité 4 : Surfaces d'attaque ; Quiz final officiel).

### ✅ CH3 – Sécurité des Environnements Virtualisés
- [x] Les 5 objectifs de sécurité : Isoler, Contrôler, Durcir, Observer, Restaurer.
- [x] Architecture à 3 plans d'une plateforme virtualisée (Plan de gestion, Hyperviseur, Plan de données).
- [x] L'hyperviseur comme racine de confiance technique (vulnérabilités, patchs, accès admin).
- [x] Cycle de vie sécurisé d'une VM (Image modèle $\rightarrow$ Création $\rightarrow$ Exploitation $\rightarrow$ Snapshot $\rightarrow$ Clonage $\rightarrow$ Suppression).
- [x] Isolation des ressources physiques : CPU (quotas, déni de service), RAM (ballooning, swap), Stockage (datastores, IOPS).
- [x] Stockage virtuel et Snapshots : bénéfices, risques, dérives et bonnes pratiques.
- [x] Distinction majeure : Snapshot $\neq$ Sauvegarde (Backup) $\neq$ Clone.
- [x] Démonstrations pratiques du cours (Démonstration 1 : Snapshot & Rollback ; Démonstration 2 : Réseau NAT + Host-only ; Démonstration 3 : UFW & SSH).
- [x] Réseau virtuel : vSwitch, cartes virtuelles (vNIC), segments VLAN, modes NAT / Host-only / Internal Network / Bridged.
- [x] Sécurisation de l'accès d'administration : comptes nominatifs, MFA, VLAN dédié, journalisation NTP.
- [x] Hardening de l'hyperviseur : checklist officielle de réduction de la surface d'attaque.
- [x] Hardening d'une VM : checklist Système, Configuration et Exploitation.
- [x] Filtrage UFW : `default deny incoming`, `default allow outgoing`, SSH restreint au réseau d'administration Host-only.
- [x] Mises à jour et maintenance : Avant (inventaire, snapshot), Pendant (patchs, vérification), Après (suppression du snapshot temporaire, mise à jour CMDB).
- [x] Journalisation et supervision : logs plateforme vs logs VM vs alertes critiques.
- [x] 7 mauvaises configurations fréquentes identifiées en audit.
- [x] VM vs Conteneur : noyau propre vs noyau partagé, conteneurs privilégiés (`--privileged`).
- [x] Mini-cas ENSIA-Tech 6 VM et Checklist de l'ingénieur virtualisation.
- [x] Activités officielles résolues (Activité 1 : Localiser contrôles ; Activité 2 : Durcir une VM ; Activité 3 : VM vs Conteneur ; Activité 4 : Quiz final).

### ✅ TD1 – Analyse des Risques d'un Environnement Virtualisé (AtlasTech)
- [x] Contexte d'AtlasTech : 1 serveur physique `HYP-01`, 3 administrateurs, 4 VM critiques (`WEB-01`, `APP-01`, `DB-01`, `AD-01`) + `BACKUP-01`.
- [x] Constats du pré-audit : les 9 vulnérabilités majeures constatées.
- [x] Matrice formelle Vraisemblance (1-5) $\times$ Impact (1-5) = Risque (1-25) et les 4 tranches (Faible, Modéré, Élevé, Critique).
- [x] Exercice 1 : Identification et classification complète des 8 actifs avec propriétaires et importance.
- [x] Exercice 2 : Scénarios formels Menace $\neq$ Vulnérabilité exploitée $\neq$ Scénario $\neq$ Actif.
- [x] Exercice 3 : Cotation détaillée et hiérarchisation des risques $R1$ à $R6$ avec justification officielle en 1 phrase :
  - $R1$ : Console admin via identifiants partagés sans MFA ($4 \times 5 = 20 \rightarrow$ **Critique**).
  - $R2$ : Faille non corrigée hyperviseur ($3 \times 5 = 15 \rightarrow$ **Élevé**).
  - $R3$ : Propagation latérale réseau plat WEB vers DB ($4 \times 4 = 16 \rightarrow$ **Élevé**).
  - $R4$ : Ransomware chiffrant VM et sauvegardes montées ($4 \times 5 = 20 \rightarrow$ **Critique**).
  - $R5$ : Données sensibles dans vieux snapshot ($3 \times 3 = 9 \rightarrow$ **Modéré**).
  - $R6$ : Compte par défaut dans template de VM ($3 \times 3 = 9 \rightarrow$ **Modéré**).
- [x] Exercice 4 : Traitement des 4 risques majeurs (Réduire, Éviter, Transférer, Accepter) avec mesures concrètes.
- [x] Exercice 5 : Calcul du risque résiduel et décision argumentée d'acceptation.
- [x] Questions de synthèse officielles 1 à 5 corrigées.
- [x] Questions complémentaires officielles 6 à 9 corrigées (chiffrement datastore avec clés locales, cluster 2 hôtes, événements SIEM, règle formelle d'acceptation).

### ✅ TP1 – Création et Isolation d'un Environnement Virtualisé (VirtualBox)
- [x] Prérequis matériels et logiciels (VirtualBox 7.x, 2 Ubuntu Server 24.04 LTS sans GUI).
- [x] Topologie réseau : réseau interne `M352-INT`, `VM-CLIENT` (10.10.10.11/24) et `VM-SRV` (10.10.10.12/24) sans passerelle.
- [x] Étape 1 : Vérification de l'environnement (`ip -br addr`, `ip route`, `hostnamectl`, Preuve P1).
- [x] Étape 2 : Mode NAT (`ip route`, `ping 1.1.1.1`, résolution DNS, Preuve P2, questions 4 à 6).
- [x] Étape 3 : Réseau interne `M352-INT` (configuration statique, ping VM-à-VM, coupure câble virtuel NAT, test d'étanchéité, Preuve P3).
- [x] Étape 4 : Mode Host-only (communication PC hôte $\leftrightarrow$ VM, test SSH privé, Preuve P4).
- [x] Étape 5 : Première sécurisation minimale (désactivation presse-papier partagé et drag-and-drop, règles UFW, snapshot `CLEAN-TP1`, Preuve P5).
- [x] Tableau comparatif complet des 4 modes réseau (NAT, Internal, Host-only, Bridged).
- [x] Questions de synthèse officielles 22 à 27 intégralement résolues.
- [x] Modèle de conclusion de livrable en 5 lignes.

---

## 🛠️ Fonctionnalités Interactives Implémentées

1. **Cours Facile Découpé selon la Structure en 7 Volets :**
   - 🎯 L'idée en une phrase
   - 🧩 Analogie du quotidien
   - 📖 Explication détaillée en petits blocs
   - 🏫 Exemple concret (ENSIA-Tech & AtlasTech)
   - 🔐 Lien avec la sécurité (menace / contrôle)
   - ✅ « À retenir » en 2-3 puces
   - ⚠️ « Pièges d'examen / confusions fréquentes »
2. **Auto-positionnement Pédagogique :**
   - Boutons *« ✅ J'ai compris »* et *« ⚠️ Je dois revoir »* sur chaque concept avec impact direct sur la jauge de progression globale.
3. **Moteur de QCM Avancé :**
   - Plus de 45 questions réparties en 3 niveaux (🟢 Facile, 🟡 Moyen, 🔴 Piégeux).
   - Choix unique, choix multiple, vrai/faux argumenté.
   - Correction immédiate avec justification du bon choix, explication des mauvais choix et lien direct vers le paragraphe du cours.
4. **Ateliers & Simulateurs Dédiés :**
   - **Simulateur Réseau VirtualBox :** Visualisation animée SVG des paquets entre VM, Hôte, Internet et LAN physique.
   - **Simulateur de Matrice de Risques :** Calcul dynamique $V \times I$ avec curseurs et presets R1 à R6 d'AtlasTech.
   - **Constructeur d'Architecture ENSIA-Tech :** Placement interactif des briques dans les 4 zones avec audit d'exposition en direct.
   - **Matrice de Responsabilité Partagée :** Répartition interactive Client / Fournisseur couche par couche.
   - **Simulateur de Terminal Linux (TP1) :** Exécution et analyse commentée des commandes réseau et de filtrage UFW.
5. **Études de Cas Guidées :**
   - Cas ENSIA-Tech, AtlasTech et 3 cas bonus signalés `💡 Ajout pédagogique`.
   - Mode « Je m'entraîne » avec champ de saisie avant déblocage de la proposition de corrigé.
6. **Flashcards à Répétition Espacée :**
   - Cartes recto/verso avec animation 3D et réinjection prioritaire des cartes difficiles.
7. **Examen Blanc Chronométré :**
   - Tirage aléatoire de 20 questions, compte à rebours, note sur 20 et analyse des faiblesses.
8. **Outils Transversaux :**
   - Recherche globale instantanée dans le cours et le glossaire.
   - Glossaire interactif avec toutes les définitions et acronymes.
   - Tableau de bord des 6 notions à ne pas confondre.
   - Carnet d'erreurs personnel persistant.
   - Mode « Révision rapide 10 minutes ».
   - Fiches de synthèse imprimables (optimisées CSS `@media print`).
   - Export et import de progression au format JSON.
   - Mode Sombre / Mode Clair.

---

## 📁 Architecture des Fichiers du Projet

```
Security_virtualisation_cloud/
├── index.html                  # Interface utilisateur SPA complète
├── css/
│   └── styles.css              # Feuille de styles responsive & impression PDF
├── js/
│   ├── app.js                  # Routeur, gestion d'état et LocalStorage
│   ├── components/             # Moteurs des fonctionnalités interactives
│   │   ├── quizEngine.js       # Moteur de QCM multi-niveaux avec corrections
│   │   ├── flashcards.js       # Répétition espacée des cartes mémoires
│   │   ├── networkSim.js       # Simulateur interactif des réseaux VirtualBox
│   │   ├── riskMatrixSim.js    # Simulateur de cotation des risques (TD1)
│   │   ├── archBuilder.js      # Constructeur d'architecture ENSIA-Tech
│   │   ├── sharedRespMatrix.js # Matrice de responsabilité partagée
│   │   └── terminalSim.js      # Terminal Linux émulé pour le TP1
│   └── data/                   # Données pédagogiques exhaustives
│       ├── ch1.js              # Données complètes du Chapitre 1
│       ├── ch2.js              # Données complètes du Chapitre 2
│       ├── ch3.js              # Données complètes du Chapitre 3
│       ├── td1.js              # Données complètes du TD1 (AtlasTech)
│       ├── tp1.js              # Données complètes du TP1 (VirtualBox)
│       ├── cases.js            # Études de cas guidées (officielles & bonus)
│       ├── glossary.js         # Glossaire et définitions des acronymes
│       └── confusions.js       # Les 6 couples de notions à ne pas confondre
├── NOTES.md                    # Relevé des ambiguïtés et coquilles des PDF
├── README.md                   # Documentation complète et guide de lancement
├── package.json                # Fichier de configuration pour npm
└── start.sh                    # Script bash de démarrage rapide
```

---

## 🔒 Confidentialité & Stockage Local
L'application ne communique avec aucun serveur distant et ne nécessite aucune clé d'API. Toutes vos données de révision (sections lues, scores, carnet d'erreurs, flashcards) sont conservées en toute sécurité dans le `localStorage` de votre navigateur. Vous pouvez à tout moment exporter ou importer vos données sous forme de fichier JSON via le tableau de bord.

