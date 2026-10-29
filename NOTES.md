# NOTES & AMBIGUÏTÉS RELEVÉES DANS LES SOURCES PDF (M352)

Ce document recense les erreurs factuelles, coquilles typographiques, ambiguïtés ou incohérences relevées lors de la lecture approfondie des supports officiels du cours (Prof. AGALIT Mohamed Amine, ENSIASD). Conformément aux consignes, ces erreurs sont documentées ici et corrigées/clarifiées dans l'application pédagogique sans propager d'incohérences.

---

## 1. M352_CH1.pdf (Fondamentaux du Cloud et de la virtualisation)
- **Durée incohérente dans l'Activité 3 (Slide 20)** : Le sous-titre de la slide indique « 7 min | activité intégrée à la séance », tandis que le bloc consigne affiche « 10 minutes ».
  *Correction dans l'app* : standardisé à un minuteur interactif de 10 minutes (ou mode libre sans chrono).
- **Typographie / Espacement** : Slide 26 intitulée `Virtualisation != Cloud`. Le symbole standard `≠` (différent de) est utilisé dans l'application pour plus de clarté.
- **Acronymes non explicités dans certaines slides** :
  - *VMM* (Virtual Machine Monitor) mentionné à côté d'Hyperviseur (slide 6) sans définition détaillée.
  - *AD* (Active Directory) présent sur le schéma slide 6 sans mention du nom complet.
  *Correction dans l'app* : définition systématique avec infobulle interactive.

---

## 2. M352_CH2.pdf (Fournisseurs, composants, SecaaS, responsabilité partagée, risques)
- **Typographie des parenthèses (Slide 15 & 22)** :
  - `KMS (Key Management Service )/ secrets` (espace parasite avant la parenthèse fermante).
  - `LB (Load Balancer )/WAF` (espace parasite avant la parenthèse).
- **Nuance de responsabilité sur le stockage public (Slide 17 vs 23)** :
  - Dans la slide 17 (Tableau Responsabilité partagée), les *Données* et la *Configuration de sécurité* en IaaS sont à la charge exclusive du **Client**.
  - Dans la slide 23 (Quiz final), à la question *« Qui est responsable d'un bucket public mal configuré ? »*, la correction rapide indique *« Client ou partagé selon contexte »*.
  - *Clarification pédagogique dans l'app* : Selon le modèle de responsabilité partagée AWS/Azure/GCP et le corps du cours (slide 18, 19, 20), la configuration des permissions d'un bucket de stockage (S3, Blob, Cloud Storage) incombe au **Client** (mauvaise configuration utilisateur), bien que le fournisseur fournisse les mécanismes techniques (chiffrement par défaut, blocage d'accès public). Nous expliquons cette nuance pour éviter tout piège d'examen !

---

## 3. M352_CH3.pdf (Sécurité des environnements virtualisés)
- **Démonstrations pratiques intégrées au cours magistral (Slides 12-14, 16-18, 22-24)** :
  - Trois démonstrations pratiques sur macOS/Ubuntu sont insérées directement dans les diapositives (Démonstration 1 : Snapshot & Rollback ; Démonstration 2 : Réseau NAT + Host-only ; Démonstration 3 : UFW & SSH). Les captures d'écran des terminaux font référence à un environnement spécifique ("le Mac").
  *Clarification pédagogique dans l'app* : Ces 3 démonstrations sont intégrées comme des ateliers guidés interactifs universels (Linux/macOS/Windows) avec terminal interactif simulé.
- **Mention de "Préparer C4" (Slide 2)** :
  - La slide 2 indique : *« Préparer C4 : Comprendre les bases avant d’étudier VM escape, hyperjacking et vulnérabilités »*. Cela confirme que C3 pose le socle défensif indispensable avant les attaques avancées.

---

## 4. M352_TD1.pdf (Analyse des risques d'un environnement virtualisé - AtlasTech)
- **Encodage / Ligatures typographiques corrompues dans le PDF exporté** :
  - La ligature `ti` et certaines lettres avec accents ont été corrompues lors de la génération PDF, donnant des mots comme :
    - `virtualisaAon`, `CompuAng`, `FoncEon`, `CriEcité méEer`, `authen4ﬁca4on`, `uRlisé`, `AD-01 fournit l’authenRﬁcaRon`, `acRfs`, `idenRté`, `DisRnguez`, `JusRﬁez`, `idenRﬁants`, `ExploitaRon`, `PropagaRon`, `chiﬀrant`, `ExposiRon`, `URlisaRon`, `JusEﬁcaEon`, `organisaRon`, `acRon`, `iniEal`.
  *Correction dans l'app* : Tous les textes ont été réécrits en français impeccable avec orthographe et typographie soignées.
- **Règle d'association pour les scores limites** :
  - La matrice indique : 1-4 (Faible), 5-9 (Modéré), 10-16 (Élevé), 17-25 (Critique).
  - Attention au calcul : par exemple $2 \times 5 = 10 \rightarrow$ Élevé ; $3 \times 3 = 9 \rightarrow$ Modéré. L'application calcule automatiquement ces tranches sans ambiguïté.

---

## 5. M352_TP1.pdf (Création et isolation d'un environnement virtualisé)
- **Numérotation continue décalée des étapes et questions** :
  - Les questions et étapes sont numérotées de façon hétérogène (étapes 1 à 6, puis numéros 1 à 21 pour les actions, puis questions de synthèse numérotées 22 à 27).
  - Le document demande 5 preuves (`P1` à `P5`).
  *Correction dans l'app* : Structure harmonisée en 5 étapes claires correspondant exactement aux 5 preuves `P1` à `P5`, avec un terminal simulé validant chaque étape et les 6 questions de synthèse (22 à 27) clairement identifiées.

