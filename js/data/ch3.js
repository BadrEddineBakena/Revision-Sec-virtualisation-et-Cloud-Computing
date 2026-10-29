// CH3 - Données complètes du cours, activités, démonstrations et quiz
window.M352_CH3 = {
  id: "ch3",
  title: "CH3 – Sécurité des Environnements Virtualisés",
  subtitle: "Hyperviseurs, VM, isolation, réseau virtuel, snapshots et durcissement (Hardening)",
  summary: "Sécuriser concrètement la couche de virtualisation : l'hyperviseur comme racine de confiance, les modes réseau virtuels (NAT, Internal, Host-only), la gestion des snapshots vs sauvegardes, le durcissement UFW et la comparaison avec les conteneurs.",

  // Sections de cours faciles (7 volets stricts)
  sections: [
    {
      id: "ch3-sec1-objectifs-pile",
      title: "1. La Pile de Virtualisation & Les 5 Objectifs de Sécurité",
      badge: "Fondations C3",
      content: {
        idea: "🎯 Dans un système virtualisé, on protège 5 niveaux superposés en poursuivant 5 objectifs de sécurité indissociables.",
        analogy: "🧩 💡 Ajout pédagogique : C'est comme la sécurité d'une résidence sécurisée : on surveille le terrain (matériel), le syndic d'immeuble (hyperviseur), chaque appartement loué (VM), les serrures intérieures (OS) et les locataires (applications).",
        explanation: [
          "**La pile technique de bas en haut (Slide 4) :**",
          "- `Matériel physique` -> `Hyperviseur (VMM)` -> `Machine Virtuelle (VM)` -> `OS invité` -> `Application métier`.",
          "- En IaaS, l'ingénieur de sécurité doit savoir raisonner simultanément sur chacun de ces étages.",
          "**Les 5 objectifs de sécurité fondamentaux (Slide 5) :**",
          "1. 🔒 **ISOLER :** Éviter à tout prix qu'une machine virtuelle ne puisse influencer, espionner ou saturer une autre VM voisine.",
          "2. 👤 **CONTRÔLER :** Restreindre strictement les privilèges d'administration et les accès à la console d'administration.",
          "3. 🛡 **DURCIR (Hardening) :** Réduire la surface d'attaque en fermant les ports inutiles, en arrêtant les services superflus et en appliquant les patchs.",
          "4. 📊 **OBSERVER :** Journaliser les événements (logs) de l'hyperviseur et des VM pour détecter toute anomalie en temps réel.",
          "5. ↺ **RESTAURER :** Organiser une politique rigoureuse de snapshots, de sauvegardes externalisées et tester la reprise après sinistre."
        ],
        example: "🏫 **Cas ENSIA-Tech :** Si la VM du portail web des étudiants est piratée à la suite d'une faille web, l'objectif **ISOLER** garantit que le pirate reste enfermé dans la VM web et ne peut pas toucher à la VM de la base de données qui tourne sur le même serveur physique.",
        security: "🔐 **Préparation à C4 (Slide 2) :** Maîtriser cette pile est indispensable pour comprendre les attaques avancées comme le *VM Escape* (l'attaquant casse l'isolation de la VM pour infecter l'hyperviseur) et l'*Hyperjacking* (l'attaquant prend le contrôle direct de l'hyperviseur sous-jacent).",
        keyPoints: [
          "Les 5 objectifs : Isoler, Contrôler, Durcir, Observer, Restaurer.",
          "L'isolation est la raison d'être première de la virtualisation."
        ],
        traps: "⚠️ **Attention :** Sécuriser la VM sans sécuriser l'hyperviseur ne sert à rien : si l'étage inférieur s'effondre, tout le reste est compromis !"
      }
    },
    {
      id: "ch3-sec2-architecture-hyperviseur",
      title: "2. L'Hyperviseur : Racine de Confiance Technique",
      badge: "Composant critique n°1",
      content: {
        idea: "🎯 L'hyperviseur est le cœur de confiance : s'il est compromis par un attaquant, l'ensemble des machines virtuelles hébergées est immédiatement en danger mortel.",
        analogy: "🧩 💡 Ajout pédagogique : L'hyperviseur est comme le maître d'hôtel qui possède le passe-partout général de toutes les chambres d'un palace. Si un voleur lui dérobe ce trousseau, toutes les chambres sont violées d'un coup.",
        explanation: [
          "**L'architecture type en 3 plans (Slide 6) :**",
          "- **Plan de gestion :** Console d'administration web, API d'orchestration, rôles et comptes privilégiés.",
          "- **Hyperviseur (Cœur technique) :** Ordonnancement et allocation CPU/RAM, gestionnaire d'isolation mémoire, pilotes de périphériques virtuels, vSwitch.",
          "- **Plan de données :** Flux réseau réels des VM, disques virtuels (.vmdk, .vdi), instantanés (snapshots), images modèles.",
          "**Rôle de l'hyperviseur :** Créer et exécuter les VM, allouer dynamiquement le CPU et la mémoire vive, gérer les accès disques et présenter les cartes réseau virtuelles.",
          "**Menaces & Risques majeurs (Slide 7) :**",
          "- Mauvaise configuration de l'hyperviseur ou présence de services d'administration inutiles.",
          "- Retard dans l'application des correctifs de sécurité (patch management défaillant).",
          "- Interface d'administration accessible depuis un réseau trop large sans MFA.",
          "**Mesures de protection obligatoires :**",
          "- Mise à jour prioritaire de l'hyperviseur, accès admin restreint à un réseau d'administration dédié, désactivation de tous les modules et extensions superflus, journalisation centralisée."
        ],
        example: "🏫 **Cas AtlasTech (TD1) :** L'hyperviseur physique `HYP-01` n'a pas été mis à jour depuis 6 mois et utilise un compte administrateur partagé sans MFA : c'est la vulnérabilité la plus critique de toute l'entreprise !",
        security: "🔐 **Nuance Cloud public importante du cours (Slide 20) :** En Cloud public (IaaS AWS/Azure), le client ne patche pas l'hyperviseur lui-même (c'est le rôle du fournisseur). Mais en Cloud privé ou en laboratoire local (ESXi, Proxmox, VirtualBox), cette tâche incombe à 100% à l'équipe interne.",
        keyPoints: [
          "L'hyperviseur est la racine de confiance technique de la virtualisation.",
          "Un accès admin non protégé à l'hyperviseur donne les pleins pouvoirs sur toutes les VM."
        ],
        traps: "⚠️ **Question réflexe d'examen :** Pourquoi l'hyperviseur est-il un actif plus critique qu'une VM individuelle ? Parce qu'un incident sur une VM ne touche qu'elle-même, alors qu'un incident sur l'hyperviseur compromet TOUTES les VM simultanément."
      }
    },
    {
      id: "ch3-sec3-cycle-vie-isolation",
      title: "3. Cycle de Vie d'une VM & Isolation des Ressources (CPU, RAM, Stockage)",
      badge: "Exploitation sécurisée",
      content: {
        idea: "🎯 La sécurité d'une machine virtuelle commence avant son démarrage et continue après son extinction ; l'isolation des ressources protège la stabilité et la disponibilité.",
        analogy: "🧩 💡 Ajout pédagogique : L'isolation des ressources, c'est comme fixer des compteurs d'eau et d'électricité individuels dans un immeuble : si un voisin prend un bain de 5 heures, cela ne doit pas couper l'eau sous votre douche.",
        explanation: [
          "**Le cycle de vie complet d'une VM (Slide 9) :**",
          "- `Image modèle (Template)` -> `Création` -> `Configuration` -> `Exploitation` -> `Snapshot` -> `Clonage` -> `Suppression`.",
          "- **Points de vigilance du cours :**",
          "  * Une image modèle compromise ou obsolète propage automatiquement ses vulnérabilités à TOUTES les futures VM créées !",
          "  * Un snapshot fige la mémoire vive et peut contenir des mots de passe, tokens et clés de session en clair.",
          "  * Un clone oublié devient une machine fantôme qui ne reçoit plus de correctifs et sert de porte dérobée aux pirates.",
          "**L'isolation des 3 ressources matérielles (Slide 10) :**",
          "- **CPU :** Éviter qu'une VM folle (ou un script pirate) ne sature 100% des cœurs du serveur hôte. On configure des **quotas**, des réservations et des limites de priorité de calcul.",
          "- **RAM :** Contrôler la consommation mémoire de chaque VM. Surveiller le mécanisme de *memory ballooning* (récupération de mémoire par l'hyperviseur) et le swap excessif qui dégrade les performances.",
          "- **Stockage :** Isoler les datastores virtuels, contrôler les permissions d'accès aux fichiers disques (.vdi/.vmdk) et surveiller les quotas d'IOPS (entrées/sorties par seconde)."
        ],
        example: "🏫 **Cas ENSIA-Tech :** Un étudiant lance un calcul infini sur la VM de test. Si aucun quota de vCPU n'a été fixé par l'hyperviseur, la VM de test accapare 100% du CPU de l'hôte physique, provoquant le blocage complet du portail d'examen !",
        security: "🔐 **Règle pratique :** Une mauvaise isolation des ressources physiques n'est pas seulement un souci de confort : c'est une faille de disponibilité majeure (déni de service interne DoS).",
        keyPoints: [
          "La sécurité commence dès la création de l'image modèle de référence (Golden Image).",
          "Les quotas CPU et RAM empêchent une VM d'étouffer ses voisines."
        ],
        traps: "⚠️ **Confusion fréquente :** Le memory ballooning n'est pas une attaque : c'est une technique normale de l'hyperviseur pour récupérer de la RAM inutilisée auprès des VM invitées, mais qui peut ralentir le système si la RAM physique est surallouée."
      }
    },
    {
      id: "ch3-sec4-stockage-snapshots",
      title: "4. Stockage Virtuel, Snapshots & Sauvegardes : Bénéfices et Dangers",
      badge: "Résilience & Données",
      content: {
        idea: "🎯 Un snapshot permet un retour arrière rapide avant un changement risqué, mais ce n'est PAS une sauvegarde car il dépend entièrement du disque source.",
        analogy: "🧩 💡 Ajout pédagogique : Le snapshot est un marque-page dans votre livre : pratique pour revenir à la page 50, mais si le livre tombe dans l'eau, le marque-page est détruit avec le livre. La sauvegarde, c'est avoir acheté un deuxième livre chez soi.",
        explanation: [
          "**Bénéfices majeurs des snapshots (Slide 11) :**",
          "- Restauration quasi instantanée en cas d'erreur de configuration.",
          "- Permet d'effectuer des tests de mise à jour système sans risque immédiat.",
          "- Démonstration 1 du cours : état stable -> prise de snapshot -> modification système -> restauration -> l'état propre initial réapparaît !",
          "**Les 5 risques et dérives des snapshots :**",
          "1. *Dépendance au stockage source :* Si le datastore de la VM est corrompu ou détruit, tous les snapshots attachés sont perdus.",
          "2. *Fuite de données sensibles :* Un snapshot contient des copies de fichiers, mots de passe et sessions mémoire figés à l'instant T.",
          "3. *Snapshots oubliés :* Ralentissent considérablement les performances de lecture/écriture (chaîne de fichiers différentiels volumineuse).",
          "4. *Saturation d'espace disque :* Les disques différentiels grossissent sans arrêt jusqu'à saturer le serveur physique.",
          "5. *Le piège du rollback de sécurité :* Revenir à un vieux snapshot antérieur annule tous les correctifs de sécurité appliqués entre-temps !",
          "**Les 6 Bonnes Pratiques indispensables (Slide 11) :**",
          "- Chiffrer les disques et snapshots si possible.",
          "- Restreindre strictement les droits de création et d'accès aux snapshots.",
          "- Toujours nommer et dater explicitement les snapshots (ex: `PRE-PATCH-2026-10-29`).",
          "- Fixer une durée de rétention maximale (supprimer le snapshot après 48h une fois la mise à jour validée).",
          "- Tester régulièrement la restauration de vraies sauvegardes.",
          "- Supprimer impérativement les snapshots temporaires devenus inutiles."
        ],
        example: "🏫 **Règle pratique officielle du cours (Slide 28) :** *« Ce qui n'a jamais été testé en restauration n'est pas encore une vraie stratégie de reprise. »*",
        security: "🔐 **Tableau de différenciation officiel du cours (Slide 28) :**",
        securityTable: [
          { objet: "Snapshot", but: "Retour rapide à un état précédent", limite: "Dépend du même stockage, ne remplace pas une sauvegarde." },
          { objet: "Backup (Sauvegarde)", but: "Restaurer après perte, sinistre ou ransomware", limite: "Doit être testé, protégé et conservé hors-ligne." },
          { objet: "Clone", but: "Créer une copie exploitable autonome", limite: "Risque de machines fantômes non patchées." }
        ],
        keyPoints: [
          "Un snapshot n'est JAMAIS une sauvegarde.",
          "Les snapshots doivent être éphémères et supprimés rapidement.",
          "Une sauvegarde doit être externalisée et testée."
        ],
        traps: "⚠️ **Question piège n°1 aux examens de cybersécurité :** 'Pour protéger mes VM contre un ransomware ou un incendie, il suffit de prendre un snapshot toutes les heures.' FAUX ! Le ransomware chiffrera le disque et ses snapshots, ou l'incendie détruira le serveur physique et les deux disparaîtront ensemble."
      }
    },
    {
      id: "ch3-sec5-reseaux-virtuels",
      title: "5. Réseaux Virtuels : vSwitch, NAT, Internal Network, Host-only & Bridged",
      badge: "Réseaux TP1",
      content: {
        idea: "🎯 Le réseau virtuel doit être conçu avec la même rigueur qu'un réseau physique : chaque mode réseau de l'hyperviseur répond à un besoin d'isolation très précis.",
        analogy: "🧩 💡 Ajout pédagogique : NAT = un interphone sortant (vous pouvez appeler dehors, personne ne peut vous appeler). Internal = des talkies-walkies isolés dans une pièce sans fenêtre. Host-only = un câble USB direct entre votre ordinateur et celui de votre voisin. Bridged = brancher directement votre machine sur la prise murale de l'école.",
        explanation: [
          "**Les 4 modes réseau fondamentaux étudiés en cours et TP :**",
          "1. **Mode NAT (Network Address Translation) :**",
          "- La VM utilise l'adresse IP de l'hôte pour sortir sur Internet.",
          "- La VM a accès à Internet (navigation, mises à jour de paquets).",
          "- La VM est totalement invisible et inaccessible depuis le réseau physique extérieur (sécurité par défaut excellente pour un labo).",
          "2. **Mode Internal Network (Réseau Interne, ex: M352-INT) :**",
          "- Réseau hermétique reliant uniquement les VM configurées avec le même identifiant de réseau interne.",
          "- Aucun dialogue possible avec le PC hôte physique.",
          "- Aucun accès à Internet (même si le câble de l'ordinateur portable est branché).",
          "- Idéal pour faire communiquer en toute sécurité une VM cliente et une VM serveur de base de données.",
          "3. **Mode Host-only Network (Réseau privé hôte) :**",
          "- Crée un commutateur virtuel reliant exclusivement le système hôte physique et les machines virtuelles.",
          "- Permet à l'étudiant d'accéder à sa VM depuis son terminal hôte (ex: session SSH sur 192.168.56.x).",
          "- Le trafic ne quitte jamais la mémoire du PC : aucun autre étudiant de la classe ne peut scanner votre VM.",
          "4. **Mode Bridged (Accès par pont) :**",
          "- La carte virtuelle de la VM est raccordée directement au switch réseau physique réel.",
          "- La VM reçoit une adresse IP du réseau local réel (ex: DHCP de l'école ou de votre box).",
          "- **Danger :** La VM est exposée à toutes les machines du réseau physique et peut perturber le réseau de l'entreprise si elle lance des requêtes non autorisées."
        ],
        example: "🏫 **Démonstration 2 du cours & TP1 :** On équipe `VM-SRV` de deux cartes réseau : l'Adaptateur 1 en NAT (pour télécharger `ufw` depuis Internet) et l'Adaptateur 2 en Host-only (pour permettre à l'administrateur de s'y connecter en SSH sans exposer le port SSH au wifi de l'école).",
        security: "🔐 **Questions sécurité réflexes du cours (Slide 15) :** 'Qui peut parler avec qui ? Quelle VM a accès à Internet ? Quel trafic est filtré ? Où capturer les logs ? Comment administrer sans exposer ?'",
        keyPoints: [
          "NAT = sortie Internet sécurisée.",
          "Internal = bulle hermétique entre VM.",
          "Host-only = liaison privée exclusive Hôte <-> VM.",
          "Bridged = exposition directe sur le LAN réel (à manier avec précaution)."
        ],
        traps: "⚠️ **Attention :** Ne confondez pas Internal Network et Host-only ! Si vous voulez vous connecter en SSH depuis votre PC à la VM, le mode Internal Network ne fonctionnera pas car votre PC hôte n'en fait pas partie."
      }
    },
    {
      id: "ch3-sec6-acces-admin-hardening-hyperviseur",
      title: "6. Sécurisation de l'Administration & Hardening de l'Hyperviseur",
      badge: "Durcissement plateforme",
      content: {
        idea: "🎯 La console d'administration est la cible n°1 des attaquants : sécuriser les VM sans sécuriser la console revient à fermer les portes tout en laissant le trousseau de clés dehors !",
        analogy: "🧩 💡 Ajout pédagogique : Vous pouvez blinder toutes les portes de chaque appartement, si vous laissez la clé du portail d'entrée sous le paillasson avec l'adresse écrite dessus, n'importe qui peut entrer.",
        explanation: [
          "**Menaces majeures pesant sur l'administration (Slide 19) :**",
          "- Comptes administrateurs génériques et partagés (ex: 'admin' ou 'root' utilisé par 3 personnes).",
          "- Mots de passe faibles et absence d'authentification multifacteur (MFA).",
          "- Console web de gestion exposée sur tout le réseau ou pire, accessible sur Internet public.",
          "- Absence de journalisation des actions administratives.",
          "- Clés API ou certificats d'administration stockés en clair dans des fichiers de scripts.",
          "**Contrôles indispensables à mettre en place (Slide 19 & 20) :**",
          "- **Comptes nominatifs obligatoires :** Chaque administrateur possède son propre compte avec traçabilité complète de ses actions.",
          "- **Principe du moindre privilège :** Attribuer uniquement les permissions strictement nécessaires (RBAC).",
          "- **Authentification multifacteur (MFA) :** Obligatoire pour toute ouverture de session d'administration.",
          "- **Segmentation du réseau d'administration :** Isoler l'interface de gestion dans un VLAN d'administration hermétique.",
          "- **Journalisation & synchronisation NTP :** Enregistrer toutes les connexions et changements de configuration avec horodatage certifié.",
          "**Checklist de durcissement (Hardening) de l'hyperviseur (Slide 20) :**",
          "- Appliquer les patchs de sécurité et suivre les bulletins de vulnérabilités.",
          "- Désactiver tous les services, interfaces de gestion et modules non nécessaires.",
          "- Restreindre l'accès à l'interface d'administration par pare-feu.",
          "- Séparer physiquement ou logiquement : Réseau de gestion, Réseau des VM et Réseau de stockage (VLANs distincts)."
        ],
        example: "🏫 **Cas AtlasTech (TD1) :** Les 3 administrateurs utilisent le même compte partagé 'admin' pour se connecter à l'hyperviseur sans MFA. Lorsqu'une VM de production est supprimée un vendredi soir, il est impossible de savoir qui a commis l'erreur ou si un pirate a volé le mot de passe !",
        security: "🔐 **Phrase d'or du cours :** *« Sécuriser les VM sans sécuriser la console d'administration revient à fermer les portes tout en laissant le trousseau de clés dehors. »*",
        keyPoints: [
          "Comptes nominatifs et MFA obligatoires pour l'administration.",
          "Isoler la console d'administration sur un réseau dédié.",
          "Désactiver tout service ou module inutile sur l'hyperviseur."
        ],
        traps: "⚠️ **Confusion fréquente :** Penser que le mot de passe root de l'OS invité protège la VM si la console de l'hyperviseur est compromise. Un pirate ayant accès à l'hyperviseur peut cloner le disque virtuel de la VM et lire les données directement depuis l'extérieur sans jamais avoir besoin du mot de passe de la VM !"
      }
    },
    {
      id: "ch3-sec7-hardening-vm-ufw",
      title: "7. Hardening d'une VM, Filtrage UFW & Démonstration Pratique",
      badge: "Durcissement VM (TP1)",
      content: {
        idea: "🎯 Une machine virtuelle doit être traitée comme un serveur physique réel : elle exige un pare-feu local, des services réduits au strict minimum et des preuves vérifiables.",
        analogy: "🧩 💡 Ajout pédagogique : Installer une VM sans la durcir, c'est comme garer une voiture neuve dans une ruelle sombre en laissant les vitres ouvertes et les clés sur le contact.",
        explanation: [
          "**La checklist de durcissement d'une VM (Slide 21) :**",
          "- **Système :** Installer les mises à jour de sécurité (`apt upgrade`), arrêter et désinstaller tous les services inutiles, configurer le pare-feu local (UFW), contrôler les comptes utilisateurs, sécuriser l'accès SSH (désactiver `PermitRootLogin`, interdire les mots de passe vides).",
          "- **Configuration :** Définir un hostname clair et unique, justifier chaque adresse IP et flux réseau ouvert, restreindre les permissions des fichiers sensibles (`chmod 600`), synchroniser l'horloge système via NTP.",
          "- **Exploitation :** Planifier des sauvegardes réelles, maîtriser et supprimer les snapshots temporaires, maintenir un inventaire CMDB à jour, activer la supervision.",
          "**Démonstration 3 du cours & TP1 : Configuration du pare-feu UFW (Slides 22-24) :**",
          "1. `sudo ufw default deny incoming` : Règle d'or de sécurité, bloquer par défaut tout trafic entrant non explicitement autorisé.",
          "2. `sudo ufw default allow outgoing` : Autoriser les connexions sortantes (ex: pour télécharger les mises à jour de paquets).",
          "3. `sudo ufw allow proto tcp from <IP_HOST_ONLY>/24 to any port 22` : Autoriser le service SSH UNIQUEMENT depuis le sous-réseau privé d'administration (Host-only).",
          "4. `sudo ufw enable` : Activer le filtrage du pare-feu.",
          "5. `sudo ufw status verbose` : Fournir la preuve vérifiable que la politique est en vigueur.",
          "**Important pour VirtualBox :** Désactiver impérativement le presse-papiers partagé et le glisser-déposer s'ils ne sont pas nécessaires pour éviter toute fuite de données entre l'hôte et la VM."
        ],
        example: "🏫 **Activité 2 du cours : Ordre de correction d'une VM mal configurée :**",
        exampleList: [
          "1. Sécuriser immédiatement l'accès d'administration SSH (changer le mot de passe faible, interdire root).",
          "2. Activer le pare-feu UFW avec politique de refus par défaut pour bloquer les attaques extérieures.",
          "3. Appliquer les mises à jour de sécurité du système (`apt update && apt upgrade`).",
          "4. Identifier et couper les services inutiles qui tournent en arrière-plan.",
          "5. Activer la journalisation et vérifier le bon état avec `ufw status verbose`."
        ],
        security: "🔐 **Principe d'ingénierie :** *« Une mesure de sécurité doit toujours produire une preuve vérifiable (capture de statut, journaux, audit). »*",
        keyPoints: [
          "UFW : Refus par défaut en entrée (`default deny incoming`).",
          "SSH restreint exclusivement au réseau d'administration privé.",
          "Désactiver le presse-papiers partagé et les dossiers partagés permanents."
        ],
        traps: "⚠️ **Mise en garde pratique du cours (Slide 165 de TP1) :** Attention ! N'activez JAMAIS UFW à distance avec une règle SSH erronée, sous peine de couper immédiatement votre propre session et d'être définitivement enfermé dehors !"
      }
    },
    {
      id: "ch3-sec8-maintenance-logs-conteneurs",
      title: "8. Mises à Jour Sécurisées, Journalisation & VM vs Conteneurs",
      badge: "Gouvernance & Perspectives",
      content: {
        idea: "🎯 Sécuriser un environnement implique d'appliquer les correctifs sans casser la production, de conserver des traces d'audit et de comprendre la différence fondamentale entre VM et conteneurs.",
        analogy: "🧩 💡 Ajout pédagogique : Une VM est une maison individuelle avec sa propre plomberie et ses propres fondations (OS invité complet). Un conteneur est une chambre dans un hôtel qui partage les mêmes canalisations et la même chaudière que toutes les autres chambres (noyau partagé).",
        explanation: [
          "**Le processus de mise à jour sécurisée en 3 temps (Slide 26) :**",
          "- **Avant :** Consulter l'inventaire des VM, prioriser selon le niveau d'exposition, prendre un snapshot ou backup de sécurité de précaution, définir une fenêtre de maintenance et un plan de retour arrière.",
          "- **Pendant :** Appliquer les correctifs (patches), redémarrer les services si nécessaire, surveiller les journaux d'erreurs et tester la connectivité applicative.",
          "- **Après :** Valider le bon fonctionnement métier, **supprimer le snapshot temporaire** (pour ne pas dégrader le stockage), mettre à jour la CMDB et documenter l'intervention.",
          "**Journalisation et Détection d'anomalies (Slide 27) :**",
          "- *Logs de la plateforme hyperviseur :* Connexions admin, créations/suppressions de VM, modifications du vSwitch, accès aux disques, erreurs système.",
          "- *Logs internes des VM :* Authentifications SSH/RDP, alertes pare-feu, exécution de commandes sudo, arrêts de services.",
          "- *Alertes vitales :* Connexion admin hors des heures de travail, snapshot massif imprévu, volume de stockage presque plein, flux réseau anormal.",
          "**VM vs Conteneur : Comparaison officielle (Slide 30 & Activité 3) :**",
          "- **Machine Virtuelle :** Possède son propre système d'exploitation invité et son propre noyau (kernel). Isolation forte assurée par l'hyperviseur au niveau matériel. Plus lourde en mémoire et CPU.",
          "- **Conteneur (ex: Docker) :** Partage le noyau (kernel) du système hôte. Isolation logique par des fonctionnalités du noyau Linux (*namespaces* et *cgroups*). Démarrage quasi instantané et très léger.",
          "- **Point critique de sécurité :** Un **conteneur privilégié** (`--privileged`) qui partage le noyau avec l'hôte présente un risque d'évasion majeur : si le conteneur est piraté, l'attaquant peut directement prendre le contrôle du noyau de l'ordinateur hôte !"
        ],
        example: "🏫 **Mini-cas ENSIA-Tech (Slide 32) :** L'école virtualise 5 serveurs physiques vers 6 VM (Web, DB, Fichiers, Annuaire Active Directory, Supervision, Test). Politique de hardening : réseaux séparés (VLANs), accès admin strictement limité à la VM Supervision via Host-only/VPN, extinction de la VM de test en dehors des cours, et suppression des snapshots après 48h.",
        security: "🔐 **Checklist de l'ingénieur en sécurité de virtualisation (Slide 33) :**",
        securityChecklist: [
          "✓ Inventaire exact des hôtes, VM, images et snapshots actifs.",
          "✓ Accès d'administration nominatif, restreint et tracé avec MFA.",
          "✓ Séparation étanche : Réseau de gestion / Réseau des VM / Réseau de stockage.",
          "✓ Hyperviseur physique et machines virtuelles maintenus à jour de patchs.",
          "✓ Services et périphériques virtuels inutiles désactivés.",
          "✓ Pare-feu local (UFW) et segmentation réseau appliqués.",
          "✓ Sauvegardes externalisées et régulièrement testées en restauration.",
          "✓ Snapshots nommés, datés et supprimés après validation."
        ],
        keyPoints: [
          "Cycle de patch : Snapshot de précaution -> Application -> Test -> Suppression du snapshot.",
          "Conteneur = noyau partagé (léger mais attention aux conteneurs privilégiés).",
          "VM = noyau propre et isolation matérielle forte via l'hyperviseur."
        ],
        traps: "⚠️ **Question classique d'examen :** 'Pourquoi l'utilisation d'un conteneur avec l'option privilégiée (--privileged) est-elle hautement déconseillée en production ?' Parce qu'un conteneur privilégié désactive la majorité des barrières d'isolation du noyau : une faille applicative permet d'exécuter du code directement avec les droits root sur le serveur hôte !"
      }
    }
  ],

  // Activités officielles de CH3
  activities: [
    {
      id: "ch3-act1",
      title: "Activité 1 • Localiser les Contrôles de Sécurité sur la Plateforme",
      duration: "10 minutes",
      description: "Sur un schéma comprenant Matériel, Hyperviseur, VM et Réseau virtuel, positionnez les contrôles clés :",
      controls: [
        { zone: "Plan de gestion", control: "Comptes nominatifs, MFA, restriction IP d'administration, logs d'audit." },
        { zone: "Hyperviseur", control: "Mises à jour des patchs constructeur, désactivation des services inutiles, segmentation VLAN." },
        { zone: "Machines Virtuelles", control: "Pare-feu local UFW, sécurisation SSH, désactivation du presse-papiers partagé." },
        { zone: "Réseau virtuel", control: "Séparation en modes NAT (sortie), Internal (étanche) et Host-only (administration privée)." },
        { zone: "Stockage & Sauvegardes", control: "Chiffrement des datastores, politique de purge des snapshots, sauvegardes externalisées." }
      ],
      mostCritical: "Le contrôle le plus critique est la sécurisation de l'accès au Plan de gestion et à l'Hyperviseur (MFA + réseau d'administration isolé), car sa compromission entraîne la chute de toutes les VM hébergées."
    },
    {
      id: "ch3-act2",
      title: "Activité 2 • Durcir une Machine Virtuelle Mal Configurée",
      duration: "10 minutes",
      description: "Une VM Linux présente SSH ouvert avec mot de passe faible, pare-feu désactivé et services inutiles. Donnez les 5 actions de correction prioritaires dans l'ordre chronologique justifié :",
      actions: [
        { step: 1, action: "Sécuriser l'accès SSH", reason: "Changer immédiatement le mot de passe faible pour stopper le risque d'intrusion bruteforce immédiate." },
        { step: 2, action: "Activer et configurer le pare-feu UFW", reason: "Bloquer par défaut tout le trafic entrant non justifié (`default deny incoming`) et restreindre SSH au réseau d'administration." },
        { step: 3, action: "Appliquer les mises à jour du système (`apt update && apt upgrade`)", reason: "Combler les vulnérabilités logicielles et les failles connues de l'OS." },
        { step: 4, action: "Désactiver et désinstaller les services et daemons inutiles", reason: "Réduire la surface d'attaque en éliminant les processus inutiles écoutant sur le réseau." },
        { step: 5, action: "Activer les logs et vérifier l'état du système", reason: "S'assurer avec `ufw status verbose` et les journaux système que les mesures sont efficaces et pérennes." }
      ]
    },
    {
      id: "ch3-act3",
      title: "Activité 3 • VM ou Conteneur ?",
      duration: "10 minutes",
      description: "Comparez la machine virtuelle et le conteneur sur les critères fondamentaux du cours :",
      comparison: [
        {
          criterion: "Niveau d'isolation",
          vm: "Isolation forte au niveau matériel assurée par l'hyperviseur. Chaque VM possède son propre noyau indépendant.",
          container: "Isolation logique assurée par le noyau partagé de l'hôte (namespaces, cgroups). Séparation moins étanche."
        },
        {
          criterion: "Consommation de ressources",
          vm: "Plus lourde : chaque VM réserve de la mémoire vive pour son propre OS invité complet et ses processus de base.",
          container: "Très légère : partage les binaires et le noyau de l'hôte, démarrage en quelques fractions de seconde."
        },
        {
          criterion: "Surface d'attaque & Risques",
          vm: "Attaque sur les pilotes virtualisés ou évasion d'hyperviseur (très rare et complexe).",
          container: "Attaque sur les failles du noyau partagé ; un conteneur privilégié permet la prise de contrôle immédiate du serveur hôte."
        }
      ]
    },
    {
      id: "ch3-act4",
      title: "Activité 4 • Quiz Final CH3 (Questions Officielles)",
      duration: "5 minutes",
      description: "Les 5 questions de synthèse officielles de la fin du chapitre CH3 :",
      questions: [
        {
          q: "1) Pourquoi doit-on impérativement protéger les snapshots de VM ?",
          resp: "Parce qu'ils contiennent des copies figées de disques et de mémoire vive pouvant renfermer des mots de passe, des clés de session et des données confidentielles non chiffrées."
        },
        {
          q: "2) Quelle est la différence fondamentale entre le réseau Host-only et le mode NAT en TP ?",
          resp: "Le mode NAT permet à la VM de sortir sur Internet de façon masquée sans être joignable depuis l'extérieur. Le mode Host-only crée un réseau privé exclusif entre l'ordinateur hôte et la VM, sans aucun accès à Internet."
        },
        {
          q: "3) Citez 3 mesures indispensables de durcissement (hardening) d'un hyperviseur.",
          resp: "1. Appliquer les correctifs de sécurité régulièrement. 2. Restreindre l'accès à l'interface d'administration à un réseau dédié avec MFA. 3. Désactiver tous les modules et services superflus."
        },
        {
          q: "4) Pourquoi une console d'administration exposée sur un réseau public est-elle ultra-critique ?",
          resp: "Parce qu'elle offre un contrôle absolu sur la plateforme : un attaquant peut créer, arrêter, cloner ou supprimer des machines virtuelles en quelques secondes."
        },
        {
          q: "5) Un snapshot peut-il être considéré comme une sauvegarde ? Justifiez votre réponse.",
          resp: "NON. Un snapshot dépend techniquement du stockage source d'origine. Si le disque dur physique de l'hyperviseur crashe ou est corrompu par un ransomware, la VM et ses snapshots sont détruits ensemble."
        }
      ]
    }
  ],

  // QCM complets pour CH3 (15+ questions avec justifications détaillées)
  quiz: [
    {
      id: "q-ch3-01",
      level: "facile",
      type: "single",
      question: "Pourquoi l'hyperviseur est-il qualifié de 'racine de confiance technique' dans un environnement virtualisé ?",
      options: [
        "Parce qu'il coûte plus cher que les machines virtuelles.",
        "Parce que s'il est compromis par un attaquant, l'ensemble des machines virtuelles qu'il héberge est immédiatement en danger.",
        "Parce qu'il empêche les ordinateurs de chauffer.",
        "Parce qu'il est obligatoirement certifié par Microsoft."
      ],
      answer: 1,
      explanation: "Question officielle du cours ! L'hyperviseur contrôle directement le matériel et alloue le CPU et la RAM à toutes les VM. Sa compromission donne un contrôle total sur l'intégralité des systèmes hébergés.",
      courseRef: "ch3-sec2-architecture-hyperviseur"
    },
    {
      id: "q-ch3-02",
      level: "facile",
      type: "boolean",
      question: "Vrai ou Faux : Un instantané (snapshot) régulier d'une machine virtuelle remplace parfaitement une stratégie de sauvegarde externalisée.",
      options: [
        "VRAI : Un snapshot enregistre tout l'état de la machine, c'est donc une sauvegarde complète.",
        "FAUX : Un snapshot dépend du disque et du stockage source de l'hyperviseur. Si le disque physique de l'hôte tombe en panne, le snapshot est détruit en même temps que la VM."
      ],
      answer: 1,
      explanation: "Question incontournable du cours et piège récurrent ! Les snapshots sont des fichiers différentiels dépendant du disque d'origine. Seule une sauvegarde autonome, exportée et idéalement déconnectée permet la reprise après sinistre.",
      courseRef: "ch3-sec4-stockage-snapshots"
    },
    {
      id: "q-ch3-03",
      level: "facile",
      type: "single",
      question: "Dans le logiciel VirtualBox (utilisé en TP1), quel mode réseau permet à deux VM de communiquer entre elles dans une bulle étanche, sans AUCUN accès à l'ordinateur hôte ni à Internet ?",
      options: [
        "Mode Accès par pont (Bridged)",
        "Mode NAT",
        "Mode Réseau interne (Internal Network, ex: M352-INT)",
        "Mode Réseau privé hôte (Host-only)"
      ],
      answer: 2,
      explanation: "Le mode Internal Network crée un commutateur virtuel totalement hermétique : les VM qui y sont reliées communiquent entre elles, mais ni l'hôte physique ni Internet ne peuvent interagir avec ce réseau.",
      courseRef: "ch3-sec5-reseaux-virtuels"
    },
    {
      id: "q-ch3-04",
      level: "facile",
      type: "single",
      question: "Quelle commande Linux standard permet d'instaurer une règle de pare-feu UFW qui refuse par défaut toutes les connexions réseau entrantes non explicitement autorisées ?",
      options: [
        "sudo ufw disable all",
        "sudo ufw default deny incoming",
        "sudo ufw allow 80/tcp",
        "sudo iptables --flush"
      ],
      answer: 1,
      explanation: "Commande officielle de la Démonstration 3 et du TP1 : `sudo ufw default deny incoming` applique le principe fondamental de sécurité de blocage par défaut.",
      courseRef: "ch3-sec7-hardening-vm-ufw"
    },
    {
      id: "q-ch3-05",
      level: "facile",
      type: "single",
      question: "Parmi les 5 objectifs fondamentaux de sécurité d'un environnement virtualisé (C3), lequel vise à réduire au minimum les services, les ports ouverts et les paramètres faibles ?",
      options: [
        "Isoler",
        "Observer",
        "Durcir (Hardening)",
        "Restaurer"
      ],
      answer: 2,
      explanation: "Les 5 objectifs sont : Isoler, Contrôler, Durcir, Observer, Restaurer. L'objectif 'Durcir' consiste à éliminer tout ce qui est superflu pour minimiser la surface d'attaque.",
      courseRef: "ch3-sec1-objectifs-pile"
    },
    {
      id: "q-ch3-06",
      level: "moyen",
      type: "single",
      question: "Pourquoi est-il fortement recommandé de supprimer un snapshot temporaire quelques jours après avoir validé le succès d'une mise à jour logicielle sur une VM ?",
      options: [
        "Parce que les snapshots expirent automatiquement au bout de 24 heures.",
        "Parce qu'un snapshot accumule les écritures dans des fichiers différentiels, ce qui dégrade les performances du stockage et risque de saturer l'espace disque physique de l'hôte.",
        "Parce que garder un snapshot empêche d'allumer la machine virtuelle.",
        "Pour respecter la loi sur la protection de la vie privée."
      ],
      answer: 1,
      explanation: "Tant qu'un snapshot est actif, l'hyperviseur redirige les nouvelles écritures vers un fichier de différences. Plus le snapshot vieillit, plus ce fichier grossit, ralentissant les entrées/sorties et risquant de saturer le datastore.",
      courseRef: "ch3-sec4-stockage-snapshots"
    },
    {
      id: "q-ch3-07",
      level: "moyen",
      type: "single",
      question: "Dans une configuration VirtualBox à double carte réseau (Démonstration 2 du cours), pourquoi configure-t-on la carte NAT pour Internet et la carte Host-only pour l'administration SSH ?",
      options: [
        "Parce que VirtualBox interdit d'activer SSH sur une carte NAT.",
        "Pour permettre à la VM de télécharger ses mises à jour via NAT tout en isolant l'accès SSH sur un canal privé exclusif entre l'hôte et la VM, sans exposition au Wifi de l'école.",
        "Pour doubler le débit de connexion réseau.",
        "Parce que le mode Host-only fournit une adresse IP publique."
      ],
      answer: 1,
      explanation: "Cette architecture sépare les flux : la VM peut sortir sur Internet pour ses paquets via NAT, mais le port 22 d'administration SSH n'est joignable que depuis votre machine hôte via Host-only, restant invisible aux autres étudiants.",
      courseRef: "ch3-sec5-reseaux-virtuels"
    },
    {
      id: "q-ch3-08",
      level: "moyen",
      type: "single",
      question: "Quelle différence technique majeure sépare une Machine Virtuelle (VM) d'un Conteneur (ex: conteneur Docker) en termes d'architecture ?",
      options: [
        "Les conteneurs ne peuvent fonctionner que sur Windows.",
        "Chaque VM possède son propre système d'exploitation et son propre noyau (kernel), tandis que les conteneurs partagent le même noyau que le système hôte.",
        "Une VM démarre en 1 milliseconde alors qu'un conteneur met 10 minutes.",
        "Les conteneurs nécessitent obligatoirement un hyperviseur de Type 1."
      ],
      answer: 1,
      explanation: "Slide 30 du cours : La VM virtualise le matériel complet et embarque son propre noyau invité. Le conteneur s'exécute directement sur le système hôte en partageant son noyau via les namespaces et cgroups Linux.",
      courseRef: "ch3-sec8-maintenance-logs-conteneurs"
    },
    {
      id: "q-ch3-09",
      level: "moyen",
      type: "single",
      question: "Pourquoi l'utilisation d'une image modèle (Template de VM) compromise ou jamais mise à jour est-elle qualifiée d'extrêmement dangereuse dans le cours ?",
      options: [
        "Parce que l'image refuse de se copier sur le disque.",
        "Parce qu'elle propage automatiquement ses vulnérabilités et ses mots de passe par défaut à toutes les nouvelles machines virtuelles déployées dans l'organisation.",
        "Parce que le format de fichier image est interdit par la norme ISO.",
        "Parce qu'elle consomme toute la bande passante réseau."
      ],
      answer: 1,
      explanation: "Slide 9 du cours : 'Une image compromise propage la vulnérabilité à toutes les VM créées.' Si l'image de base contient une faille ou un compte avec mot de passe 'admin', chaque serveur créé avec ce modèle sera vulnérable dès la première seconde.",
      courseRef: "ch3-sec3-cycle-vie-isolation"
    },
    {
      id: "q-ch3-10",
      level: "moyen",
      type: "single",
      question: "Dans le cycle de maintenance et d'application de correctifs d'une plateforme virtualisée (Slide 26), que doit impérativement faire l'administrateur APRÈS avoir validé que la mise à jour fonctionne correctement ?",
      options: [
        "Éteindre définitivement le serveur physique.",
        "Supprimer les snapshots temporaires créés avant l'intervention, valider la sécurité et mettre à jour la documentation / CMDB.",
        "Créer 10 nouveaux clones de la machine.",
        "Désactiver le pare-feu UFW."
      ],
      answer: 1,
      explanation: "Le snapshot de précaution ne doit pas être conservé indéfiniment. Une fois la validation réussie, sa suppression libère les ressources et consolide les disques.",
      courseRef: "ch3-sec8-maintenance-logs-conteneurs"
    },
    {
      id: "q-ch3-11",
      level: "piege",
      type: "single",
      question: "Quel danger redoutable pour la sécurité peut survenir si un administrateur restaure imprudemment un vieux snapshot d'une VM datant de 4 mois pour réparer un bug logiciel ?",
      options: [
        "Le disque dur physique de l'ordinateur va fondre.",
        "Le retour arrière annule tous les patchs et correctifs de sécurité appliqués sur l'OS au cours des 4 derniers mois, réouvrant d'anciennes vulnérabilités corrigées !",
        "La mémoire RAM est définitivement effacée.",
        "L'adresse MAC de la carte réseau est modifiée par le système."
      ],
      answer: 1,
      explanation: "Slide 11 de CH3 (Risque de rollback) : Revenir à un état antérieur remet le système exactement comme il était 4 mois plus tôt. Les failles comblées entre-temps réapparaissent instantanément, exposant la VM à des attaques pourtant neutralisées.",
      courseRef: "ch3-sec4-stockage-snapshots"
    },
    {
      id: "q-ch3-12",
      level: "piege",
      type: "single",
      question: "Dans le cadre de l'isolation des ressources physiques sur l'hyperviseur, quel problème de sécurité majeur peut être provoqué par l'absence totale de quotas de vCPU sur les machines virtuelles ?",
      options: [
        "Un risque de déni de service (DoS) où une seule VM compromise ou saturée monopolise 100% de la puissance de calcul du serveur hôte, bloquant toutes les autres VM.",
        "Une fuite de mémoire vidéo vers Internet.",
        "Une modification automatique des adresses IP privées.",
        "L'impossibilité de créer des fichiers texte."
      ],
      answer: 0,
      explanation: "Slide 10 du cours : 'CPU : Éviter la saturation par une VM gourmande. Utiliser quotas, réservations, priorités.' L'isolation des ressources est un prérequis pour garantir la disponibilité du système.",
      courseRef: "ch3-sec3-cycle-vie-isolation"
    },
    {
      id: "q-ch3-13",
      level: "piege",
      type: "multiple",
      question: "Quelles mauvaises configurations sont fréquemment constatées sur les plateformes virtualisées lors des audits de sécurité ? (Sélectionnez TOUTES les réponses valides du cours)",
      options: [
        "VM de test laissée allumée avec des mots de passe faibles et par défaut",
        "Interface d'administration de l'hyperviseur accessible depuis un réseau trop large",
        "Snapshots anciens oubliés contenant des données et secrets sensibles",
        "Réseaux virtuels de production, de test et d'administration mélangés sans segmentation"
      ],
      answer: [0, 1, 2, 3],
      explanation: "Slide 29 du cours : Toutes ces mauvaises configurations sont des causes fréquentes et réelles d'incidents majeurs constatés lors des pré-audits (comme dans le cas AtlasTech de TD1).",
      courseRef: "ch3-sec8-maintenance-logs-conteneurs"
    },
    {
      id: "q-ch3-14",
      level: "piege",
      type: "single",
      question: "Pourquoi est-il préconisé dans le cours et le TP1 de désactiver le presse-papiers partagé (Shared Clipboard) et le glisser-déposer sur les VM sensibles dans VirtualBox ?",
      options: [
        "Pour accélérer la vitesse de calcul du processeur.",
        "Pour empêcher le transfert accidentel ou malveillant de données sensibles (mots de passe, fichiers) entre l'environnement hôte et la VM invitée.",
        "Parce que VirtualBox plante si on fait un copier-coller.",
        "Parce que le protocole TCP l'interdit."
      ],
      answer: 1,
      explanation: "Instructions officielles du TP1 (Étape 5) : Le presse-papiers partagé et le drag-and-drop créent un pont logiciel entre la mémoire de l'hôte et la VM. Sur une machine isolée ou contenant des secrets, ce canal doit être désactivé pour éviter toute fuite.",
      courseRef: "ch3-sec7-hardening-vm-ufw"
    },
    {
      id: "q-ch3-15",
      level: "piege",
      type: "single",
      question: "Pourquoi l'exécution d'un conteneur avec l'option privilèges étendus (`--privileged`) est-elle considérée comme un danger critique de sécurité comparée à une machine virtuelle isolée ?",
      options: [
        "Parce qu'un conteneur privilégié consomme 100 fois plus de bande passante.",
        "Parce qu'un conteneur privilégié désactive l'isolation du noyau : si l'application est compromise, l'attaquant peut interagir directement avec le noyau du serveur hôte et s'en emparer.",
        "Parce que les conteneurs privilégiés ne peuvent pas exécuter de requêtes SQL.",
        "Parce que les conteneurs privilégiés s'éteignent au bout de 5 minutes."
      ],
      answer: 1,
      explanation: "Slide 31 de CH3 : Comme les conteneurs partagent le même noyau que l'hôte, un conteneur privilégié possède les capacités d'accéder aux périphériques matériels et aux modules noyau du système hôte, annihilant l'isolation.",
      courseRef: "ch3-sec8-maintenance-logs-conteneurs"
    }
  ]
};

