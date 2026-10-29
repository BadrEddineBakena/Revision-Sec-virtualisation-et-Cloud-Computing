// Module Flashcards avec Répétition Espacée pour M352
window.FlashcardsEngine = (function () {
  let deck = [];
  let currentIndex = 0;
  let isFlipped = false;
  let stats = { known: 0, review: 0 };

  // Cartes par défaut créées à partir des notions incontournables des PDF
  const defaultCards = [
    {
      id: "fc-1",
      chapter: "CH1",
      front: "Quelle est la définition formelle du Cloud selon le NIST SP 800-145 ?",
      back: "Accès à la demande, via le réseau, à un pool partagé de ressources informatiques configurables.",
      key: "Formule : Cloud = Virtualisation + Automatisation + Service mesuré."
    },
    {
      id: "fc-2",
      chapter: "CH1",
      front: "Quelles sont les 5 caractéristiques essentielles du Cloud NIST ?",
      back: "1. On-demand self-service\n2. Broad network access\n3. Resource pooling (Multi-tenancy)\n4. Rapid elasticity\n5. Measured service",
      key: "Si une dimension manque, on parle d'hébergement ou de virtualisation, pas de Cloud !"
    },
    {
      id: "fc-3",
      chapter: "CH1",
      front: "Quelle est la différence fondamentale entre Virtualisation et Cloud Computing ?",
      back: "La virtualisation est une technologie d'abstraction matérielle (consolidation de serveurs). Le Cloud est un modèle complet de fourniture de services en self-service avec élasticité et mesure.",
      key: "Virtualisation = technologie facilitatrice ; Cloud = modèle de service."
    },
    {
      id: "fc-4",
      chapter: "CH1",
      front: "Quelle est la différence entre Hyperviseur Type 1 et Type 2 ?",
      back: "Type 1 (Bare-metal) : installé directement sur le matériel (ESXi, KVM).\nType 2 (Hosted) : installé comme une application sur un OS hôte (VirtualBox).",
      key: "VirtualBox = Type 2 dans son usage courant."
    },
    {
      id: "fc-5",
      chapter: "CH2",
      front: "Quels sont les 5 acteurs du Cloud selon le NIST SP 500-292 ?",
      back: "1. Cloud Consumer (Client)\n2. Cloud Provider (Fournisseur)\n3. Cloud Broker (Intermédiaire)\n4. Cloud Auditor (Auditeur indépendant)\n5. Cloud Carrier (Transporteur réseau/télécom)",
      key: "L'auditeur vérifie la sécurité et conformité sans biais commercial."
    },
    {
      id: "fc-6",
      chapter: "CH2",
      front: "Management Plane vs Data Plane : quelle distinction de sécurité ?",
      back: "Management Plane = Console, API, IAM, modification d'architecture (contrôle total).\nData Plane = Trafic applicatif et requêtes utilisateur vers les bases/fichiers.",
      key: "Dans le Cloud, contrôler le management plane est aussi important que filtrer les ports réseau."
    },
    {
      id: "fc-7",
      chapter: "CH2",
      front: "Quelles sont les 6 familles de services SecaaS (Security as a Service) ?",
      back: "1. IAM / MFA\n2. KMS & secrets\n3. WAF & API Security\n4. SIEM & Logs\n5. CSPM (Posture)\n6. Backup & Disaster Recovery (PRA)",
      key: "Souscrire à un service ne remplace jamais son exploitation humaine."
    },
    {
      id: "fc-8",
      chapter: "CH2",
      front: "Qui est responsable d'un bucket de stockage rendu public par erreur ?",
      back: "Le CLIENT. En IaaS/PaaS/SaaS, la configuration des droits d'accès aux données relève de la responsabilité du client.",
      key: "Le fournisseur fournit l'outil, le client configure la politique d'accès."
    },
    {
      id: "fc-9",
      chapter: "CH3",
      front: "Quels sont les 5 objectifs de sécurité d'un environnement virtualisé ?",
      back: "1. ISOLER (éviter l'influence entre VM)\n2. CONTRÔLER (limiter accès admin et privilèges)\n3. DURCIR (fermer ports et services inutiles)\n4. OBSERVER (logs et supervision)\n5. RESTAURER (snapshots et PRA testé)",
      key: "Isoler - Contrôler - Durcir - Observer - Restaurer."
    },
    {
      id: "fc-10",
      chapter: "CH3",
      front: "Pourquoi un snapshot n'est-il JAMAIS une sauvegarde ?",
      back: "Parce qu'un snapshot dépend techniquement du même support physique de stockage. Si l'hôte ou le datastore crashe, la VM et ses snapshots sont détruits ensemble.",
      key: "Une sauvegarde doit être autonome, externalisée et testée en restauration."
    },
    {
      id: "fc-11",
      chapter: "CH3",
      front: "Quelle est la différence entre VM et Conteneur sur le plan de la sécurité ?",
      back: "Une VM virtualise tout le matériel et possède son propre noyau (isolation forte par hyperviseur).\nUn conteneur partage le noyau de l'hôte (léger, mais un conteneur privilégié peut compromettre l'hôte).",
      key: "Conteneur privilégié = danger d'évasion directe sur le noyau hôte."
    },
    {
      id: "fc-12",
      chapter: "TP1",
      front: "En VirtualBox, quelle différence entre Internal Network et Host-only ?",
      back: "Internal Network = communication hermétique entre VM uniquement (l'hôte ne peut pas communiquer).\nHost-only = liaison privée directe entre le PC hôte et les VM (idéal pour SSH sans exposer au LAN).",
      key: "Pour faire du SSH depuis votre PC physique vers la VM : Host-only !"
    },
    {
      id: "fc-13",
      chapter: "TP1",
      front: "Quelle politique minimale UFW a-t-on configurée lors du TP1 ?",
      back: "sudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow proto tcp from <HOST_ONLY>/24 to any port 22",
      key: "Refus par défaut en entrée + SSH restreint au réseau privé d'administration."
    },
    {
      id: "fc-14",
      chapter: "TD1",
      front: "Dans l'analyse des risques AtlasTech, quelle est la formule de calcul ?",
      back: "Risque = Vraisemblance (1 à 5) × Impact (1 à 5).\nScores : 1–4 (Faible), 5–9 (Modéré), 10–16 (Élevé), 17–25 (Critique).",
      key: "R1 (Console) et R4 (Ransomware) obtiennent 20 -> Niveau Critique !"
    },
    {
      id: "fc-15",
      chapter: "TD1",
      front: "Quels sont les 4 types de traitement d'un risque en cybersécurité ?",
      back: "1. Réduire (mesures de protection et contrôles)\n2. Éviter (renoncer à l'activité risquée)\n3. Transférer (assurance, sous-traitance)\n4. Accepter (valider formellement le risque résiduel faible)",
      key: "On ne peut accepter un risque que s'il est devenu faible ou modéré."
    }
  ];

  function init(containerId, chapter = 'all') {
    let cards = [...defaultCards];
    if (chapter !== 'all') {
      cards = cards.filter(c => c.chapter === chapter);
    }

    // Récupérer historique des difficultés stocké dans LocalStorage
    const storedDifficulty = JSON.parse(localStorage.getItem('m352_fc_difficulty') || '{}');
    // Trier : les cartes difficiles en priorité (répétition espacée)
    cards.sort((a, b) => (storedDifficulty[b.id] || 0) - (storedDifficulty[a.id] || 0));

    deck = cards;
    currentIndex = 0;
    isFlipped = false;
    stats = { known: 0, review: 0 };

    render(containerId, chapter);
  }

  function render(containerId, activeChapter) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (deck.length === 0) {
      container.innerHTML = `<p class="empty-state">Aucune carte disponible pour cette section.</p>`;
      return;
    }

    const card = deck[currentIndex];

    container.innerHTML = `
      <div class="flashcard-wrapper">
        <div class="flashcard-filters">
          <button class="btn btn-sm ${activeChapter === 'all' ? 'btn-primary' : 'btn-outline'}" onclick="FlashcardsEngine.filterBy('${containerId}', 'all')">Toutes (${defaultCards.length})</button>
          <button class="btn btn-sm ${activeChapter === 'CH1' ? 'btn-primary' : 'btn-outline'}" onclick="FlashcardsEngine.filterBy('${containerId}', 'CH1')">CH1</button>
          <button class="btn btn-sm ${activeChapter === 'CH2' ? 'btn-primary' : 'btn-outline'}" onclick="FlashcardsEngine.filterBy('${containerId}', 'CH2')">CH2</button>
          <button class="btn btn-sm ${activeChapter === 'CH3' ? 'btn-primary' : 'btn-outline'}" onclick="FlashcardsEngine.filterBy('${containerId}', 'CH3')">CH3</button>
          <button class="btn btn-sm ${activeChapter === 'TD1' ? 'btn-primary' : 'btn-outline'}" onclick="FlashcardsEngine.filterBy('${containerId}', 'TD1')">TD1</button>
          <button class="btn btn-sm ${activeChapter === 'TP1' ? 'btn-primary' : 'btn-outline'}" onclick="FlashcardsEngine.filterBy('${containerId}', 'TP1')">TP1</button>
        </div>

        <div class="flashcard-counter">
          <span>Carte ${currentIndex + 1} sur ${deck.length}</span>
          <span class="badge badge-info">${card.chapter}</span>
        </div>

        <div class="flashcard-container ${isFlipped ? 'flipped' : ''}" onclick="FlashcardsEngine.flipCard('${containerId}', '${activeChapter}')">
          <div class="flashcard-inner">
            <div class="flashcard-front">
              <div class="card-prompt-label">❓ Question (cliquez pour retourner)</div>
              <h3 class="card-text">${card.front}</h3>
              <div class="card-hint-tap">👆 Cliquez ou appuyez sur Espace pour voir la réponse</div>
            </div>
            <div class="flashcard-back">
              <div class="card-prompt-label">💡 Réponse clé</div>
              <div class="card-text-back">${card.back.replace(/\n/g, '<br>')}</div>
              <div class="card-key-takeaway"><strong>À retenir :</strong> ${card.key}</div>
            </div>
          </div>
        </div>

        <div class="flashcard-controls">
          <button class="btn btn-danger btn-rating" onclick="FlashcardsEngine.rateCard(false, '${containerId}', '${activeChapter}')">
            ❌ Je ne savais pas (À revoir)
          </button>
          <button class="btn btn-success btn-rating" onclick="FlashcardsEngine.rateCard(true, '${containerId}', '${activeChapter}')">
            ✅ Je savais parfaitement
          </button>
        </div>

        <div class="flashcard-stats-bar">
          <span class="stat-known">Maîtrisées : ${stats.known}</span>
          <span class="stat-review">À revoir : ${stats.review}</span>
        </div>
      </div>
    `;
  }

  function flipCard(containerId, activeChapter) {
    isFlipped = !isFlipped;
    render(containerId, activeChapter);
  }

  function rateCard(known, containerId, activeChapter) {
    const card = deck[currentIndex];
    const stored = JSON.parse(localStorage.getItem('m352_fc_difficulty') || '{}');

    if (known) {
      stats.known++;
      stored[card.id] = Math.max(0, (stored[card.id] || 0) - 1);
    } else {
      stats.review++;
      stored[card.id] = (stored[card.id] || 0) + 2; // Pondération répétition espacée
      deck.push(card); // La carte reviendra plus tard dans la session
    }
    localStorage.setItem('m352_fc_difficulty', JSON.stringify(stored));

    if (currentIndex < deck.length - 1) {
      currentIndex++;
      isFlipped = false;
      render(containerId, activeChapter);
    } else {
      showFinished(containerId, activeChapter);
    }
  }

  function showFinished(containerId, activeChapter) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
      <div class="flashcard-summary">
        <h3>🎉 Session de Flashcards terminée !</h3>
        <p>Cartes maîtrisées : <strong>${stats.known}</strong> | Cartes revues : <strong>${stats.review}</strong></p>
        <button class="btn btn-primary" onclick="FlashcardsEngine.init('${containerId}', '${activeChapter}')">Recommencer une session</button>
      </div>
    `;
  }

  function filterBy(containerId, chapter) {
    init(containerId, chapter);
  }

  return {
    init,
    flipCard,
    rateCard,
    filterBy
  };
})();

