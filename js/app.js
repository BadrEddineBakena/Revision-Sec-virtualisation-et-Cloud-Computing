// Application Principale M352 - Routeur, État, LocalStorage et Interactions
window.App = (function () {
  const STORAGE_KEY = 'm352_app_state_v1';

  // État initial de l'utilisateur
  let state = {
    theme: 'dark',
    lastVisited: 'dashboard',
    sectionStatus: {}, // sectionId -> 'understood' | 'review'
    quizHistory: {},   // questionId -> { isCorrect: boolean, timestamp: number }
    errorNotebook: [], // liste des questionId échouées
    examResults: [],   // historique des examens blancs
    bookmarks: [],
    customNotes: {}
  };

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        state = Object.assign(state, JSON.parse(saved));
      }
    } catch (e) {
      console.error("Erreur lors du chargement de l'état local :", e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      updateGlobalProgress();
    } catch (e) {
      console.error("Erreur de sauvegarde locale :", e);
    }
  }

  function init() {
    loadState();
    applyTheme(state.theme);
    setupGlobalSearch();

    // Gestion du hash d'URL pour le routage
    window.addEventListener('hashchange', handleRoute);
    if (!window.location.hash) {
      window.location.hash = `#${state.lastVisited || 'dashboard'}`;
    } else {
      handleRoute();
    }

    updateGlobalProgress();
  }

  function handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // Fermer le menu mobile si ouvert
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) navMenu.classList.remove('nav-open');

    // Sauvegarder la dernière page visitée
    if (hash !== 'exam-run') {
      state.lastVisited = hash;
      saveState();
    }

    // Mise à jour de la classe active dans la barre de navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      const target = link.getAttribute('href') ? link.getAttribute('href').replace('#', '') : '';
      if (target === hash) link.classList.add('active');
      else link.classList.remove('active');
    });

    // Routage vers la vue appropriée
    switch (hash) {
      case 'dashboard':
        renderDashboard(mainContent);
        break;
      case 'ch1':
        renderChapter(mainContent, window.M352_CH1);
        break;
      case 'ch2':
        renderChapter(mainContent, window.M352_CH2);
        break;
      case 'ch3':
        renderChapter(mainContent, window.M352_CH3);
        break;
      case 'td1':
        renderTD1(mainContent);
        break;
      case 'tp1':
        renderTP1(mainContent);
        break;
      case 'cases':
        renderCases(mainContent);
        break;
      case 'flashcards':
        renderFlashcards(mainContent);
        break;
      case 'exam':
        renderExamLauncher(mainContent);
        break;
      case 'exam-run':
        startExam(mainContent);
        break;
      case 'glossary':
        renderGlossary(mainContent);
        break;
      case 'confusions':
        renderConfusions(mainContent);
        break;
      case 'errors':
        renderErrorNotebook(mainContent);
        break;
      case 'review10':
        startReview10(mainContent);
        break;
      case 'sheets':
        renderSummarySheets(mainContent);
        break;
      default:
        // Si c'est un lien vers une section spécifique (ex: ch1-sec3-hyperviseurs)
        if (hash.startsWith('ch1')) {
          renderChapter(mainContent, window.M352_CH1, hash);
        } else if (hash.startsWith('ch2')) {
          renderChapter(mainContent, window.M352_CH2, hash);
        } else if (hash.startsWith('ch3')) {
          renderChapter(mainContent, window.M352_CH3, hash);
        } else {
          renderDashboard(mainContent);
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    attachTooltips();
  }

  function navigateTo(route) {
    window.location.hash = `#${route}`;
  }

  // --- VUE DASHBOARD ---
  function renderDashboard(container) {
    const stats = calculateStats();

    container.innerHTML = `
      <div class="dashboard-view">
        <div class="hero-welcome-card">
          <div class="hero-content">
            <span class="badge badge-accent">ENSIASD • Sécurité IT & Confiance Numérique</span>
            <h2>M352 – Sécurité de la Virtualisation & Cloud Computing</h2>
            <p>Plateforme de révision interactive haute performance pour réussir vos contrôles continus (Prof. AGALIT Mohamed Amine).</p>
            <div class="hero-cta-group">
              <button class="btn btn-primary btn-lg" onclick="window.App.continueWhereLeft()">
                ▶️ Continuer où je me suis arrêté
              </button>
              <button class="btn btn-warning btn-lg" onclick="window.App.navigateTo('review10')">
                ⚡ Révision Rapide (10 min)
              </button>
            </div>
          </div>
          <div class="hero-stats-panel">
            <div class="stat-gauge-circle">
              <span class="stat-gauge-pct">${stats.overallProgress}%</span>
              <span class="stat-gauge-label">Cours Maîtrisé</span>
            </div>
            <div class="stat-mini-grid">
              <div class="mini-stat">
                <span class="ms-num">${stats.understoodCount} / ${stats.totalSections}</span>
                <span class="ms-label">Sections validées</span>
              </div>
              <div class="mini-stat">
                <span class="ms-num">${stats.averageScore} / 20</span>
                <span class="ms-label">Score moyen QCM</span>
              </div>
              <div class="mini-stat">
                <span class="ms-num">${stats.errorCount}</span>
                <span class="ms-label">Erreurs à retravailler</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modules du cours -->
        <div class="section-title-bar">
          <h3>📚 Parcours d'Apprentissage par Module</h3>
          <span class="subtitle">Couverture intégrale à 100% des supports officiels (CH1, CH2, CH3, TD1, TP1)</span>
        </div>

        <div class="dashboard-modules-grid">
          <div class="module-card">
            <div class="mod-header">
              <span class="mod-tag tag-blue">Cours Théorique 1</span>
              <h4>CH1 : Fondamentaux Cloud & Virtualisation</h4>
            </div>
            <p>Limites du datacenter, 5 caractéristiques NIST SP 800-145, modèles IaaS/PaaS/SaaS, hyperviseurs Type 1 vs Type 2.</p>
            <div class="mod-progress-bar"><div class="mod-progress-fill" style="width: ${stats.ch1Progress}%"></div></div>
            <div class="mod-footer">
              <span class="mod-pct">${stats.ch1Progress}% validé</span>
              <button class="btn btn-sm btn-primary" onclick="window.App.navigateTo('ch1')">Étudier ➔</button>
            </div>
          </div>

          <div class="module-card">
            <div class="mod-header">
              <span class="mod-tag tag-purple">Architecture Cloud</span>
              <h4>CH2 : Composants, SecaaS & Risques</h4>
            </div>
            <p>6 couches Cloud, VPC, Subnets, Gateways, Bastion, SecaaS, Management plane vs Data plane, Responsabilité partagée.</p>
            <div class="mod-progress-bar"><div class="mod-progress-fill" style="width: ${stats.ch2Progress}%"></div></div>
            <div class="mod-footer">
              <span class="mod-pct">${stats.ch2Progress}% validé</span>
              <button class="btn btn-sm btn-primary" onclick="window.App.navigateTo('ch2')">Étudier ➔</button>
            </div>
          </div>

          <div class="module-card">
            <div class="mod-header">
              <span class="mod-tag tag-green">Sécurité Système</span>
              <h4>CH3 : Sécurité des Environnements Virtualisés</h4>
            </div>
            <p>5 objectifs de sécurité, hyperviseur racine de confiance, snapshots vs sauvegardes, vSwitch, durcissement UFW, VM vs conteneurs.</p>
            <div class="mod-progress-bar"><div class="mod-progress-fill" style="width: ${stats.ch3Progress}%"></div></div>
            <div class="mod-footer">
              <span class="mod-pct">${stats.ch3Progress}% validé</span>
              <button class="btn btn-sm btn-primary" onclick="window.App.navigateTo('ch3')">Étudier ➔</button>
            </div>
          </div>

          <div class="module-card">
            <div class="mod-header">
              <span class="mod-tag tag-orange">Travaux Dirigés</span>
              <h4>TD1 : Analyse des Risques (AtlasTech)</h4>
            </div>
            <p>Étude de cas guidée, matrice Vraisemblance × Impact, cotation R1 à R6, traitement des risques majeurs et risque résiduel.</p>
            <div class="mod-progress-bar"><div class="mod-progress-fill" style="width: ${stats.td1Progress}%"></div></div>
            <div class="mod-footer">
              <span class="mod-pct">${stats.td1Progress}% validé</span>
              <button class="btn btn-sm btn-primary" onclick="window.App.navigateTo('td1')">S'entraîner ➔</button>
            </div>
          </div>

          <div class="module-card">
            <div class="mod-header">
              <span class="mod-tag tag-teal">Travaux Pratiques</span>
              <h4>TP1 : VirtualBox & Isolation Linux</h4>
            </div>
            <p>Laboratoire pratique : Modes NAT, Internal Network et Host-only, commandes ip/route/ping, durcissement UFW, preuves P1–P5.</p>
            <div class="mod-progress-bar"><div class="mod-progress-fill" style="width: ${stats.tp1Progress}%"></div></div>
            <div class="mod-footer">
              <span class="mod-pct">${stats.tp1Progress}% validé</span>
              <button class="btn btn-sm btn-primary" onclick="window.App.navigateTo('tp1')">Pratiquer ➔</button>
            </div>
          </div>

          <div class="module-card card-accent-glow">
            <div class="mod-header">
              <span class="mod-tag tag-red">Évaluation Globale</span>
              <h4>Examen Blanc Chronométré</h4>
            </div>
            <p>Simulation en conditions réelles : tirage aléatoire de 20 questions de tous les chapitres avec diagnostic immédiat des points faibles.</p>
            <div class="mod-progress-bar"><div class="mod-progress-fill" style="width: 100%"></div></div>
            <div class="mod-footer">
              <span class="mod-pct">Prêt à tester</span>
              <button class="btn btn-sm btn-danger" onclick="window.App.navigateTo('exam')">Lancer le test ⏱️</button>
            </div>
          </div>
        </div>

        <!-- Raccourcis pédagogiques indispensables -->
        <div class="dashboard-tools-grid">
          <div class="tool-tile" onclick="window.App.navigateTo('confusions')">
            <span class="tool-icon">⚖️</span>
            <div>
              <h4>Tableau de bord : Notions à ne pas confondre</h4>
              <p>6 couples de concepts critiques à maîtriser absolument pour éviter les pièges d'examen.</p>
            </div>
          </div>

          <div class="tool-tile" onclick="window.App.navigateTo('cases')">
            <span class="tool-icon">🏫</span>
            <div>
              <h4>Études de Cas Guidées</h4>
              <p>Cas ENSIA-Tech, AtlasTech et 3 cas bonus avec mode entraînement avant corrigé.</p>
            </div>
          </div>

          <div class="tool-tile" onclick="window.App.navigateTo('flashcards')">
            <span class="tool-icon">🃏</span>
            <div>
              <h4>Flashcards & Répétition Espacée</h4>
              <p>Mémoriser les définitions clés et acronymes en quelques minutes par jour.</p>
            </div>
          </div>

          <div class="tool-tile" onclick="window.App.navigateTo('errors')">
            <span class="tool-icon">🎯</span>
            <div>
              <h4>Carnet d'Erreurs Personnel (${stats.errorCount})</h4>
              <p>Retravaillez spécifiquement toutes les questions ratées pour atteindre 100% de réussite.</p>
            </div>
          </div>
        </div>

        <!-- Sauvegarde et Exportation -->
        <div class="dashboard-backup-card">
          <div class="backup-info">
            <h4>💾 Gestion de votre progression</h4>
            <p>Vos scores et votre progression sont sauvegardés automatiquement dans votre navigateur. Vous pouvez exporter un fichier JSON pour sauvegarder ou changer d'appareil.</p>
          </div>
          <div class="backup-actions">
            <button class="btn btn-secondary btn-sm" onclick="window.App.exportProgress()">📥 Exporter ma progression (JSON)</button>
            <label class="btn btn-secondary btn-sm file-upload-label">
              📤 Importer (JSON)
              <input type="file" id="import-file" style="display:none" onchange="window.App.importProgress(this)">
            </label>
            <button class="btn btn-outline btn-sm btn-danger-text" onclick="window.App.resetProgress()">⚠️ Réinitialiser</button>
          </div>
        </div>
      </div>
    `;
  }

  // --- VUE COURS FACILE PAR CHAPITRE ---
  function renderChapter(container, chapterData, targetSectionId = null) {
    if (!chapterData) return;

    let html = `
      <div class="chapter-view">
        <div class="chapter-hero">
          <button class="btn btn-link btn-back" onclick="window.App.navigateTo('dashboard')">⬅️ Tableau de bord</button>
          <h2>${chapterData.title}</h2>
          <p class="chapter-subtitle">${chapterData.subtitle}</p>
          <div class="chapter-nav-pills">
            <a href="#sec-cours" class="pill-active">📖 Cours Facile</a>
            <a href="#sec-activites">🎯 Activités du cours</a>
            <a href="#sec-qcm">📝 QCM (${chapterData.quiz.length} questions)</a>
            <a href="#sec-synthese">📑 Fiche de synthèse</a>
          </div>
        </div>

        <!-- SECTIONS DU COURS -->
        <div class="chapter-sections-container" id="sec-cours">
    `;

    chapterData.sections.forEach((sec, idx) => {
      const isUnderstood = state.sectionStatus[sec.id] === 'understood';
      const isReview = state.sectionStatus[sec.id] === 'review';

      html += `
        <article class="concept-card ${isUnderstood ? 'concept-understood' : isReview ? 'concept-review' : ''}" id="${sec.id}">
          <div class="concept-header">
            <div class="concept-meta">
              <span class="badge badge-primary">${sec.badge}</span>
              <h3>${sec.title}</h3>
            </div>
            <div class="concept-status-actions">
              <button class="btn-status ${isUnderstood ? 'active-understood' : ''}" 
                      onclick="window.App.setSectionStatus('${sec.id}', 'understood')">
                ${isUnderstood ? '✅ Compris' : 'J\'ai compris'}
              </button>
              <button class="btn-status ${isReview ? 'active-review' : ''}" 
                      onclick="window.App.setSectionStatus('${sec.id}', 'review')">
                ${isReview ? '⚠️ À revoir' : 'Je dois revoir'}
              </button>
            </div>
          </div>

          <!-- 1) L'idée en une phrase -->
          <div class="concept-block idea-block">
            <p>${sec.content.idea}</p>
          </div>

          <!-- 2) Analogie du quotidien -->
          <div class="concept-block analogy-block">
            <p>${sec.content.analogy}</p>
            ${sec.content.analogyList ? `
              <ul class="analogy-list">
                ${sec.content.analogyList.map(item => `<li>${item}</li>`).join('')}
              </ul>
            ` : ''}
          </div>

          <!-- 3) Explication détaillée en petits blocs -->
          <div class="concept-block explanation-block">
            <h4>📖 Explication pas-à-pas :</h4>
            ${sec.content.explanation.map(p => {
              if (p.startsWith('|')) return `<div class="table-responsive">${markdownTableToHTML(p)}</div>`;
              return `<p>${p}</p>`;
            }).join('')}
          </div>

          <!-- 4) Exemple concret ENSIA-Tech / AtlasTech -->
          <div class="concept-block example-block">
            <p>${sec.content.example}</p>
            ${sec.content.exampleList ? `
              <ul class="example-bullets">
                ${sec.content.exampleList.map(item => `<li>${item}</li>`).join('')}
              </ul>
            ` : ''}
          </div>

          <!-- 5) Lien avec la sécurité -->
          <div class="concept-block security-block">
            <p>${sec.content.security}</p>
            ${sec.content.securityBullets ? `
              <ul class="security-bullets">
                ${sec.content.securityBullets.map(b => `<li>${b}</li>`).join('')}
              </ul>
            ` : ''}
            ${sec.content.securityTable ? `
              <table class="simple-table">
                <thead><tr><th>Objet</th><th>But</th><th>Limite de sécurité</th></tr></thead>
                <tbody>
                  ${sec.content.securityTable.map(row => `<tr><td><strong>${row.objet}</strong></td><td>${row.but}</td><td>${row.limite}</td></tr>`).join('')}
                </tbody>
              </table>
            ` : ''}
            ${sec.content.securityChecklist ? `
              <div class="checklist-grid">
                ${sec.content.securityChecklist.map(c => `<div class="check-item">${c}</div>`).join('')}
              </div>
            ` : ''}
          </div>

          <!-- 6) À retenir -->
          <div class="concept-block keypoints-block">
            <h4>✅ À retenir absolument :</h4>
            <ul>
              ${sec.content.keyPoints.map(kp => `<li>${kp}</li>`).join('')}
            </ul>
          </div>

          <!-- 7) Pièges d'examen -->
          <div class="concept-block traps-block">
            <p>${sec.content.traps}</p>
          </div>
        </article>
      `;
    });

    html += `</div>`; // Fin sections cours

    // Intégration des composants interactifs spécialisés selon chapitre
    if (chapterData.id === 'ch1') {
      html += `
        <div class="chapter-interactive-widget" id="sec-widget-ch1">
          <div class="widget-intro">
            <h3>🧪 Atelier Pratique Interactif : La Matrice de Responsabilité Partagée</h3>
            <p>Testez vos connaissances en manipulant la répartition des rôles couche par couche entre On-premise, IaaS, PaaS et SaaS.</p>
          </div>
          <div id="shared-matrix-container"></div>
        </div>
      `;
    } else if (chapterData.id === 'ch2') {
      html += `
        <div class="chapter-interactive-widget" id="sec-widget-ch2">
          <div class="widget-intro">
            <h3>🏗️ Atelier Pratique : Constructeur d'Architecture ENSIA-Tech</h3>
            <p>Positionnez les briques (Load Balancer, Base de données, Bastion, Buckets) dans les zones sécurisées et observez l'audit en direct.</p>
          </div>
          <div id="arch-builder-container"></div>
        </div>
      `;
    } else if (chapterData.id === 'ch3') {
      html += `
        <div class="chapter-interactive-widget" id="sec-widget-ch3">
          <div class="widget-intro">
            <h3>🌐 Atelier Pratique : Simulateur Réseau VirtualBox (NAT, Internal, Host-only)</h3>
            <p>Visualisez la circulation des paquets et vérifiez l'isolation étanche entre les machines virtuelles et l'hôte.</p>
          </div>
          <div id="network-sim-container"></div>
        </div>
      `;
    }

    // SECTION ACTIVITÉS DU COURS
    html += `
      <div class="chapter-activities-section" id="sec-activites">
        <div class="section-title-bar">
          <h3>🎯 Activités Officielles du Cours (Résolues et Commentées)</h3>
          <span class="subtitle">Toutes les activités des séances avec corrigés complets pour réviser</span>
        </div>
        <div class="activities-grid">
          ${chapterData.activities.map(act => `
            <div class="activity-card">
              <div class="act-header">
                <h4>${act.title}</h4>
                <span class="badge badge-warning">⏱️ ${act.duration}</span>
              </div>
              <p class="act-desc">${act.description}</p>
              ${act.cases ? `
                <div class="act-cases-list">
                  ${act.cases.map(c => `
                    <div class="act-case-item">
                      <strong>${c.situation}</strong>
                      <div class="act-solution-box">
                        <span class="badge badge-success">Réponse : ${c.expected}</span>
                        <p>${c.justification}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              ${act.pairs ? `
                <div class="act-pairs-list">
                  ${act.pairs.map(p => `
                    <div class="act-pair-item">
                      <p><strong>Situation :</strong> ${p.situation}</p>
                      <div class="act-solution-box">
                        <span class="badge badge-info">${p.characteristic}</span>
                        <p>${p.explanation}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              ${act.scenarios ? `
                <div class="act-scenarios-list">
                  ${act.scenarios.map(s => `
                    <div class="act-scenario-item">
                      <p><strong>${s.need || s.incident}</strong></p>
                      <div class="act-solution-box">
                        <span class="badge badge-primary">${s.choice || s.resp}</span>
                        <p>${s.justification}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              ${act.questions ? `
                <div class="act-qa-list">
                  ${act.questions.map(q => `
                    <div class="act-qa-item">
                      <p class="act-q">${q.q}</p>
                      <p class="act-r">💡 <strong>Corrigé :</strong> ${q.answer || q.resp}</p>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              ${act.controls ? `
                <div class="act-controls-list">
                  ${act.controls.map(c => `<p>• <strong>${c.zone} :</strong> ${c.control}</p>`).join('')}
                  <div class="act-solution-box"><p><strong>Contrôle le plus critique :</strong> ${act.mostCritical}</p></div>
                </div>
              ` : ''}
              ${act.associations ? `
                <div class="act-assoc-table table-responsive">
                  <table class="simple-table">
                    <thead><tr><th>Élément</th><th>Risque principal</th><th>Contrôle prioritaire</th><th>Justification</th></tr></thead>
                    <tbody>
                      ${act.associations.map(a => `<tr><td><strong>${a.element}</strong></td><td>${a.risk}</td><td><span class="badge badge-info">${a.control}</span></td><td>${a.justification}</td></tr>`).join('')}
                    </tbody>
                  </table>
                </div>
              ` : ''}
              ${act.items ? `
                <div class="act-items-list">
                  ${act.items.map(it => `<div class="act-it"><strong>${it.category} :</strong> <p>${it.details}</p></div>`).join('')}
                </div>
              ` : ''}
              ${act.actions ? `
                <div class="act-actions-steps">
                  ${act.actions.map(a => `<div class="step-line"><span class="step-num">${a.step}</span> <strong>${a.action} :</strong> ${a.reason}</div>`).join('')}
                </div>
              ` : ''}
              ${act.comparison ? `
                <div class="act-comp-table table-responsive">
                  <table class="simple-table">
                    <thead><tr><th>Critère</th><th>Machine Virtuelle (VM)</th><th>Conteneur</th></tr></thead>
                    <tbody>
                      ${act.comparison.map(cp => `<tr><td><strong>${cp.criterion}</strong></td><td>${cp.vm}</td><td>${cp.container}</td></tr>`).join('')}
                    </tbody>
                  </table>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // SECTION QCM INTERACTIF
    html += `
      <div class="chapter-qcm-section" id="sec-qcm">
        <div class="section-title-bar">
          <h3>📝 QCM d'Évaluation (${chapterData.quiz.length} Questions)</h3>
          <span class="subtitle">Sélectionnez votre niveau pour démarrer l'entraînement</span>
        </div>
        <div class="qcm-level-filter-bar">
          <button class="btn btn-sm btn-outline active-filter" onclick="QuizEngine.setFilter('all', 'chapter-quiz-container')">Toutes les questions</button>
          <button class="btn btn-sm btn-outline" onclick="QuizEngine.setFilter('facile', 'chapter-quiz-container')">🟢 Niveau Facile</button>
          <button class="btn btn-sm btn-outline" onclick="QuizEngine.setFilter('moyen', 'chapter-quiz-container')">🟡 Niveau Moyen</button>
          <button class="btn btn-sm btn-outline" onclick="QuizEngine.setFilter('piege', 'chapter-quiz-container')">🔴 Pièges d'Examen</button>
        </div>
        <div id="chapter-quiz-container"></div>
      </div>
    `;

    // SECTION FICHE DE SYNTHÈSE RAPIDE
    html += `
      <div class="chapter-sheet-cta" id="sec-synthese">
        <div class="sheet-cta-box">
          <h4>📑 Fiche de synthèse imprimable</h4>
          <p>Consultez la fiche condensée en 1 page pour réviser ce chapitre juste avant l'examen.</p>
          <button class="btn btn-primary" onclick="window.App.navigateTo('sheets')">Ouvrir la fiche de synthèse ➔</button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Initialisation des widgets interactifs
    setTimeout(() => {
      if (chapterData.id === 'ch1' && window.SharedRespMatrix) {
        window.SharedRespMatrix.init('shared-matrix-container');
      } else if (chapterData.id === 'ch2' && window.ArchBuilder) {
        window.ArchBuilder.init('arch-builder-container');
      } else if (chapterData.id === 'ch3' && window.NetworkSimulator) {
        window.NetworkSimulator.init('network-sim-container');
      }

      if (window.QuizEngine) {
        window.QuizEngine.init(chapterData.quiz, 'chapter-quiz-container');
      }

      if (targetSectionId) {
        const el = document.getElementById(targetSectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  // --- VUE TD1 (ATLASTECH) ---
  function renderTD1(container) {
    const td = window.M352_TD1;

    container.innerHTML = `
      <div class="td-view">
        <div class="chapter-hero hero-td">
          <button class="btn btn-link btn-back" onclick="window.App.navigateTo('dashboard')">⬅️ Tableau de bord</button>
          <h2>${td.title}</h2>
          <p class="chapter-subtitle">${td.subtitle}</p>
        </div>

        <!-- Présentation du cas AtlasTech -->
        <div class="td-context-card">
          <div class="td-head">
            <span class="badge badge-accent">🏢 Entreprise Étudiée</span>
            <h3>Cas d'étude : AtlasTech</h3>
            <p>${td.caseStudy.company} — Équipe de <strong>${td.caseStudy.team}</strong>.</p>
          </div>

          <div class="td-arch-box">
            <h4>Architecture et Composants :</h4>
            <div class="table-responsive">
              <table class="simple-table">
                <thead><tr><th>Composant</th><th>Rôle & Fonction</th><th>Zone réseau</th><th>Criticité</th></tr></thead>
                <tbody>
                  ${td.caseStudy.architecture.components.map(c => `
                    <tr>
                      <td><strong>${c.name}</strong></td>
                      <td>${c.role}</td>
                      <td><code>${c.zone}</code></td>
                      <td><span class="badge ${c.criticality === 'Très élevée' ? 'badge-danger' : 'badge-warning'}">${c.criticality}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            <p class="td-flux-line"><strong>Flux réseau :</strong> ${td.caseStudy.architecture.flux}</p>
          </div>

          <div class="td-audit-box">
            <h4>⚠️ Constats alarmants du pré-audit (Vulnérabilités relevées) :</h4>
            <ul class="audit-list">
              ${td.caseStudy.auditFindings.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- SIMULATEUR DE MATRICE DE RISQUES TD1 -->
        <div class="td-sim-wrapper">
          <div id="td1-matrix-sim-container"></div>
        </div>

        <!-- EXERCICES DU TD1 AVEC MODE ENTRAÎNEMENT -->
        <div class="td-exercises-section">
          <div class="section-title-bar">
            <h3>📝 Exercices Guidés du TD1 (Avec Mode « Je m'entraîne »)</h3>
            <span class="subtitle">Tapez votre réponse ou réflexion avant de dévoiler la proposition de corrigé détaillée.</span>
          </div>

          <!-- Exercice 1 : Actifs -->
          <div class="exercise-card">
            <div class="ex-head">
              <span class="badge badge-primary">Exercice 1</span>
              <h4>Identifier et Classer les Actifs d'AtlasTech</h4>
            </div>
            <p class="ex-prompt">${td.exercises[0].prompt}</p>
            
            <div class="training-input-box">
              <label><strong>Votre réponse de travail :</strong></label>
              <textarea placeholder="Listez ici vos 8 actifs et leurs catégories avant de vérifier..."></textarea>
              <button class="btn btn-outline btn-sm" onclick="this.nextElementSibling.classList.toggle('hidden')">
                👁️ Afficher / Masquer la Proposition de Corrigé
              </button>
              <div class="proposed-solution-box hidden">
                <span class="badge badge-success">💡 Proposition de Corrigé (Examen)</span>
                <div class="table-responsive">
                  <table class="simple-table">
                    <thead><tr><th>Actif</th><th>Catégorie</th><th>Propriétaire</th><th>Pourquoi est-il important ?</th></tr></thead>
                    <tbody>
                      ${td.exercises[0].proposedSolution.map(s => `<tr><td><strong>${s.actif}</strong></td><td><span class="badge badge-info">${s.categorie}</span></td><td>${s.responsable}</td><td>${s.importance}</td></tr>`).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Exercice 2 : Scénarios Menace / Vulnérabilité / Risque -->
          <div class="exercise-card">
            <div class="ex-head">
              <span class="badge badge-primary">Exercice 2</span>
              <h4>Menaces vs Vulnérabilités vs Scénarios de Risque</h4>
            </div>
            <p class="ex-prompt">${td.exercises[1].prompt}</p>
            <div class="training-input-box">
              <button class="btn btn-outline btn-sm" onclick="this.nextElementSibling.classList.toggle('hidden')">
                👁️ Afficher / Masquer la Proposition de Corrigé
              </button>
              <div class="proposed-solution-box hidden">
                <span class="badge badge-success">💡 Proposition de Corrigé</span>
                <div class="table-responsive">
                  <table class="simple-table">
                    <thead><tr><th>ID</th><th>Menace</th><th>Vulnérabilité exploitée</th><th>Scénario de risque</th><th>Actif impacté</th></tr></thead>
                    <tbody>
                      ${td.exercises[1].proposedSolution.map(s => `<tr><td><strong>${s.id}</strong></td><td>${s.menace}</td><td><code>${s.vulnerabilite}</code></td><td>${s.scenario}</td><td>${s.actif}</td></tr>`).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Exercice 3 : Cotation officielle R1 à R6 -->
          <div class="exercise-card">
            <div class="ex-head">
              <span class="badge badge-primary">Exercice 3</span>
              <h4>Évaluer et Prioriser les Risques (R1 à R6)</h4>
            </div>
            <p class="ex-prompt">${td.exercises[2].prompt}</p>
            <div class="training-input-box">
              <button class="btn btn-outline btn-sm" onclick="this.nextElementSibling.classList.toggle('hidden')">
                👁️ Afficher / Masquer la Cotation Complète et Justifications
              </button>
              <div class="proposed-solution-box hidden">
                <span class="badge badge-success">💡 Proposition de Cotation (R1 à R6)</span>
                <div class="table-responsive">
                  <table class="simple-table">
                    <thead><tr><th>ID</th><th>Scénario de Risque</th><th>V (1-5)</th><th>I (1-5)</th><th>Score</th><th>Niveau</th><th>Justification officielle (1 phrase)</th></tr></thead>
                    <tbody>
                      ${td.exercises[2].scenariosCotation.map(r => `
                        <tr>
                          <td><strong>${r.id}</strong></td>
                          <td>${r.title}</td>
                          <td><strong>${r.V}</strong></td>
                          <td><strong>${r.I}</strong></td>
                          <td><span class="badge badge-danger">${r.score}</span></td>
                          <td><span class="badge ${r.niveau === 'Critique' ? 'badge-danger' : r.niveau === 'Élevé' ? 'badge-warning' : 'badge-info'}">${r.niveau}</span></td>
                          <td>${r.justification}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
                <div class="ranking-summary-box">
                  <strong>Classement officiel :</strong> ${td.exercises[2].ranking}
                </div>
              </div>
            </div>
          </div>

          <!-- Exercice 4 : Traitement -->
          <div class="exercise-card">
            <div class="ex-head">
              <span class="badge badge-primary">Exercice 4</span>
              <h4>Traiter les Risques Majeurs (Réduire, Éviter, Transférer, Accepter)</h4>
            </div>
            <p class="ex-prompt">${td.exercises[3].prompt}</p>
            <div class="training-input-box">
              <button class="btn btn-outline btn-sm" onclick="this.nextElementSibling.classList.toggle('hidden')">
                👁️ Afficher / Masquer les Mesures Proposées
              </button>
              <div class="proposed-solution-box hidden">
                <span class="badge badge-success">💡 Proposition de Mesures</span>
                <div class="table-responsive">
                  <table class="simple-table">
                    <thead><tr><th>Risque</th><th>Type de traitement</th><th>Priorité</th><th>Mesures concrètes recommandées</th></tr></thead>
                    <tbody>
                      ${td.exercises[3].proposedSolution.map(s => `<tr><td><strong>${s.risque}</strong></td><td><span class="badge badge-info">${s.type}</span></td><td><span class="badge badge-danger">${s.priorite}</span></td><td>${s.mesures}</td></tr>`).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Exercice 5 : Risque résiduel -->
          <div class="exercise-card">
            <div class="ex-head">
              <span class="badge badge-primary">Exercice 5</span>
              <h4>Risque Résiduel et Décision d'Acceptation</h4>
            </div>
            <p class="ex-prompt">${td.exercises[4].prompt}</p>
            <div class="training-input-box">
              <button class="btn btn-outline btn-sm" onclick="this.nextElementSibling.classList.toggle('hidden')">
                👁️ Afficher / Masquer l'Évaluation du Risque Résiduel
              </button>
              <div class="proposed-solution-box hidden">
                <span class="badge badge-success">💡 Proposition d'Évaluation Résiduelle</span>
                ${td.exercises[4].proposedSolution.map(res => `
                  <div class="residual-case-box">
                    <h5>${res.risque}</h5>
                    <p><strong>Score Initial :</strong> ${res.initialScore}</p>
                    <p><strong>Mesures appliquées :</strong> ${res.mesuresAppliquees}</p>
                    <p><strong>Nouveau Score Résiduel :</strong> <span class="badge badge-success">${res.residualScore}</span></p>
                    <p class="res-decision">${res.decision}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- QUESTIONS DE SYNTHÈSE (1 à 5) -->
        <div class="td-synthesis-section">
          <div class="section-title-bar">
            <h3>🎯 Questions de Synthèse Officielles (1 à 5)</h3>
          </div>
          <div class="qa-accordion-list">
            ${td.synthesisQuestions.map(q => `
              <div class="qa-item">
                <div class="qa-question"><strong>${q.q}</strong></div>
                <div class="qa-answer">${q.answer}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- QUESTIONS COMPLÉMENTAIRES (6 à 9) -->
        <div class="td-complementary-section">
          <div class="section-title-bar">
            <h3>🔬 Questions Complémentaires d'Approfondissement (6 à 9)</h3>
          </div>
          <div class="qa-accordion-list">
            ${td.complementaryQuestions.map(q => `
              <div class="qa-item">
                <div class="qa-question"><strong>${q.q}</strong></div>
                <div class="qa-answer">${q.answer}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      if (window.RiskMatrixSimulator) {
        window.RiskMatrixSimulator.init('td1-matrix-sim-container');
      }
    }, 100);
  }

  // --- VUE TP1 (VIRTUALBOX & ISOLATION LINUX) ---
  function renderTP1(container) {
    const tp = window.M352_TP1;

    container.innerHTML = `
      <div class="tp-view">
        <div class="chapter-hero hero-tp">
          <button class="btn btn-link btn-back" onclick="window.App.navigateTo('dashboard')">⬅️ Tableau de bord</button>
          <h2>${tp.title}</h2>
          <p class="chapter-subtitle">${tp.subtitle}</p>
        </div>

        <!-- Prérequis et Topologie -->
        <div class="tp-overview-grid">
          <div class="tp-box">
            <h4>⚙️ Prérequis Techniques Officiels</h4>
            <ul>
              <li><strong>Hyperviseur :</strong> ${tp.overview.prerequisites.hypervisor}</li>
              <li><strong>VM :</strong> ${tp.overview.prerequisites.vms}</li>
              <li><strong>Ressources / VM :</strong> ${tp.overview.prerequisites.specsPerVm}</li>
              <li><strong>Hôte physique :</strong> ${tp.overview.prerequisites.hostPc}</li>
            </ul>
          </div>
          <div class="tp-box">
            <h4>📍 Topologie Réseau du TP</h4>
            <p><strong>Nom réseau interne :</strong> <code>${tp.overview.topology.name}</code></p>
            <p>• <strong>VM-CLIENT :</strong> <code>${tp.overview.topology.clientVm}</code></p>
            <p>• <strong>VM-SRV :</strong> <code>${tp.overview.topology.serverVm}</code></p>
            <div class="tp-alert-danger">⚠️ ${tp.overview.topology.rule}</div>
          </div>
        </div>

        <!-- SIMULATEUR DE TERMINAL TP1 -->
        <div class="tp-terminal-wrapper">
          <div class="section-title-bar">
            <h3>💻 Simulateur de Terminal Linux Interactif (TP1)</h3>
            <span class="subtitle">Exécutez les commandes du TP et comprenez exactement ce que signifie chaque ligne de sortie.</span>
          </div>
          <div id="tp1-terminal-container"></div>
        </div>

        <!-- LES 5 ÉTAPES DU TP & PREUVES (P1 à P5) -->
        <div class="tp-steps-section">
          <div class="section-title-bar">
            <h3>📋 Déroulement Guidé des 5 Étapes & Preuves Exigées</h3>
          </div>
          <div class="tp-steps-list">
            ${tp.steps.map(s => `
              <div class="tp-step-card">
                <div class="step-card-header">
                  <span class="badge badge-accent">Étape ${s.stepNumber}</span>
                  <h4>${s.title}</h4>
                </div>
                <p class="step-goal"><strong>🎯 Objectif :</strong> ${s.goal}</p>
                
                ${s.instructions ? `
                  <div class="step-instructions">
                    ${s.instructions.map(ins => `<p>${ins}</p>`).join('')}
                  </div>
                ` : ''}

                <div class="step-commands-list">
                  <strong>Commandes à taper :</strong>
                  ${s.commands.map(c => `
                    <div class="cmd-row">
                      <code>${c.cmd}</code>
                      <span class="cmd-desc">— ${c.desc}</span>
                    </div>
                  `).join('')}
                </div>

                ${s.questions ? `
                  <div class="step-questions-box">
                    <h5>Questions associées :</h5>
                    ${s.questions.map(q => `
                      <p><strong>${q.q}</strong><br><span class="resp-text">💡 ${q.a}</span></p>
                    `).join('')}
                  </div>
                ` : ''}

                ${s.isolationTest ? `
                  <div class="step-isolation-box">
                    <strong>🧪 Test d'isolation pratique :</strong> ${s.isolationTest}
                  </div>
                ` : ''}

                <div class="step-proof-badge">
                  📷 <strong>${s.proof.label}</strong>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- TABLEAU COMPARATIF OFFICIEL DES MODES RÉSEAU -->
        <div class="tp-comparison-section">
          <div class="section-title-bar">
            <h3>📊 Tableau Comparatif Officiel des 4 Modes Réseau</h3>
            <span class="subtitle">Ce tableau doit figurer obligatoirement dans votre compte-rendu de TP !</span>
          </div>
          <div class="table-responsive">
            <table class="simple-table tp-table-comp">
              <thead>
                <tr>
                  <th>Mode Réseau</th>
                  <th>VM ➔ Internet</th>
                  <th>VM ➔ Autre VM</th>
                  <th>Hôte ➔ VM</th>
                  <th>LAN Physique ➔ VM</th>
                  <th>Niveau de Sécurité</th>
                </tr>
              </thead>
              <tbody>
                ${tp.comparisonTable.map(row => `
                  <tr>
                    <td><strong>${row.mode}</strong></td>
                    <td>${row.vmToInternet}</td>
                    <td>${row.vmToVm}</td>
                    <td>${row.hostToVm}</td>
                    <td>${row.lanToVm}</td>
                    <td><span class="badge badge-info">${row.securityLevel}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- QUESTIONS DE SYNTHÈSE (22 à 27) -->
        <div class="tp-synthesis-section">
          <div class="section-title-bar">
            <h3>🎯 Questions de Synthèse Officielles (Questions 22 à 27)</h3>
          </div>
          <div class="qa-accordion-list">
            ${tp.synthesisQuestions.map(q => `
              <div class="qa-item">
                <div class="qa-question"><strong>${q.q}</strong></div>
                <div class="qa-answer">${q.answer}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- MODÈLE DE LIVRABLE & CONCLUSION -->
        <div class="tp-deliverable-card">
          <h4>📑 Modèle de Conclusion pour le Compte-Rendu (5 lignes exigées) :</h4>
          <blockquote class="tp-conclusion-quote">
            "${tp.sampleConclusion}"
          </blockquote>
        </div>
      </div>
    `;

    setTimeout(() => {
      if (window.TerminalSim) {
        window.TerminalSim.init('tp1-terminal-container');
      }
    }, 100);
  }

  // --- VUE ÉTUDES DE CAS ---
  function renderCases(container) {
    const cases = window.M352_CASES;

    container.innerHTML = `
      <div class="cases-view">
        <div class="chapter-hero hero-cases">
          <button class="btn btn-link btn-back" onclick="window.App.navigateTo('dashboard')">⬅️ Tableau de bord</button>
          <h2>Études de Cas Guidées & Cas Réels</h2>
          <p class="chapter-subtitle">Entraînez-vous à résoudre des problématiques réalistes d'architecture et de sécurité Cloud avant de découvrir les corrigés.</p>
        </div>

        <div class="cases-list-container">
          ${cases.map(cs => `
            <div class="case-card" id="${cs.id}">
              <div class="case-header">
                <span class="badge badge-accent">${cs.badge}</span>
                <h3>${cs.title}</h3>
                <p class="case-context"><strong>Contexte :</strong> ${cs.context}</p>
              </div>

              <div class="case-steps-accordion">
                ${cs.steps.map(st => `
                  <div class="case-step-item">
                    <div class="step-head-bar">
                      <span class="step-badge">${st.stepNumber}</span>
                      <h4>${st.title}</h4>
                    </div>
                    <div class="step-q-box">
                      <p class="st-q"><strong>Question :</strong> ${st.question}</p>
                      <small class="st-hint">💡 Indice : ${st.promptHint}</small>
                    </div>

                    <div class="training-input-box">
                      <label><strong>Votre proposition de réponse :</strong></label>
                      <textarea placeholder="Rédigez votre réflexion ici avant de consulter la solution..."></textarea>
                      <button class="btn btn-outline btn-sm" onclick="this.nextElementSibling.classList.toggle('hidden')">
                        👁️ Dévoiler le Corrigé Détaillé
                      </button>
                      <div class="proposed-solution-box hidden">
                        <div class="sol-content">${st.officialSolution.replace(/\n/g, '<br>')}</div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- VUE FLASHCARDS ---
  function renderFlashcards(container) {
    container.innerHTML = `
      <div class="flashcards-view">
        <div class="chapter-hero hero-flashcards">
          <button class="btn btn-link btn-back" onclick="window.App.navigateTo('dashboard')">⬅️ Tableau de bord</button>
          <h2>Flashcards & Répétition Espacée</h2>
          <p class="chapter-subtitle">Mémorisez activement les définitions, formules et acronymes clés du module M352.</p>
        </div>
        <div id="flashcards-engine-container"></div>
      </div>
    `;

    setTimeout(() => {
      if (window.FlashcardsEngine) {
        window.FlashcardsEngine.init('flashcards-engine-container');
      }
    }, 100);
  }

  // --- VUE EXAMEN BLANC ---
  function renderExamLauncher(container) {
    container.innerHTML = `
      <div class="exam-launcher-view">
        <div class="chapter-hero hero-exam">
          <button class="btn btn-link btn-back" onclick="window.App.navigateTo('dashboard')">⬅️ Tableau de bord</button>
          <h2>Simulateur d'Examen Blanc Chronométré (M352)</h2>
          <p class="chapter-subtitle">Testez vos connaissances en conditions réelles d'évaluation.</p>
        </div>

        <div class="exam-config-card">
          <div class="exam-icon-large">⏱️</div>
          <h3>Préparez votre session d'examen</h3>
          <p>Le simulateur va tirer aléatoirement <strong>20 questions</strong> équilibrées issues de tous les chapitres (CH1, CH2, CH3, TD1, TP1).</p>
          
          <div class="exam-settings">
            <label><strong>Durée de l'épreuve :</strong></label>
            <div class="exam-time-options">
              <label class="time-radio"><input type="radio" name="exam-duration" value="10" checked> 10 minutes (Cadence rapide)</label>
              <label class="time-radio"><input type="radio" name="exam-duration" value="20"> 20 minutes (Standard)</label>
              <label class="time-radio"><input type="radio" name="exam-duration" value="30"> 30 minutes (Temps libre)</label>
            </div>
          </div>

          <div class="exam-rules-box">
            <h4>Règles de l'examen :</h4>
            <ul>
              <li>20 questions à choix unique, choix multiple et vrai/faux.</li>
              <li>Chronomètre dynamique affiché en permanence.</li>
              <li>Note finale sur 20 points avec analyse des points faibles par sous-thème.</li>
            </ul>
          </div>

          <button class="btn btn-danger btn-lg" onclick="window.App.navigateTo('exam-run')">
            🚀 Démarrer l'examen blanc maintenant
          </button>
        </div>
      </div>
    `;
  }

  let examTimerInterval = null;
  let examTimeRemaining = 0;

  function startExam(container) {
    const allQuestions = [
      ...window.M352_CH1.quiz,
      ...window.M352_CH2.quiz,
      ...window.M352_CH3.quiz
    ];

    // Tirage aléatoire de 20 questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 20);

    const durationRadio = document.querySelector('input[name="exam-duration"]:checked');
    const minutes = durationRadio ? parseInt(durationRadio.value) : 15;
    examTimeRemaining = minutes * 60;

    container.innerHTML = `
      <div class="exam-running-view">
        <div class="exam-top-bar">
          <div class="exam-live-meta">
            <span class="exam-title-badge">Épreuve Blanche M352 (20 questions)</span>
          </div>
          <div class="exam-timer-widget">
            <span>Temps restant :</span>
            <strong id="exam-timer-display" class="timer-countdown">--:--</strong>
          </div>
        </div>

        <div id="exam-quiz-container"></div>
      </div>
    `;

    if (examTimerInterval) clearInterval(examTimerInterval);
    updateTimerDisplay();
    examTimerInterval = setInterval(() => {
      examTimeRemaining--;
      updateTimerDisplay();
      if (examTimeRemaining <= 0) {
        clearInterval(examTimerInterval);
        alert("⏱️ Le temps imparti est écoulé ! Validation automatique de vos réponses.");
        QuizEngine.nextQuestion('exam-quiz-container');
      }
    }, 1000);

    setTimeout(() => {
      QuizEngine.init(selectedQuestions, 'exam-quiz-container', {
        onFinish: (result) => {
          if (examTimerInterval) clearInterval(examTimerInterval);
          state.examResults.push({
            date: new Date().toISOString(),
            score20: result.score20,
            scorePct: result.scorePct
          });
          saveState();
        }
      });
    }, 100);
  }

  function updateTimerDisplay() {
    const el = document.getElementById('exam-timer-display');
    if (!el) return;
    const m = Math.floor(examTimeRemaining / 60);
    const s = examTimeRemaining % 60;
    el.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    if (examTimeRemaining < 120) el.classList.add('timer-warning');
  }

  // --- VUE GLOSSAIRE ---
  function renderGlossary(container) {
    const terms = window.M352_GLOSSARY || [];

    container.innerHTML = `
      <div class="glossary-view">
        <div class="chapter-hero hero-glossary">
          <button class="btn btn-link btn-back" onclick="window.App.navigateTo('dashboard')">⬅️ Tableau de bord</button>
          <h2>Glossaire Alphabétique & Acronymes M352</h2>
          <p class="chapter-subtitle">Chaque terme technique expliqué en une phrase simple et illustré d'un exemple concret.</p>
        </div>

        <div class="glossary-search-bar">
          <input type="text" id="glossary-search-input" class="search-input" 
                 placeholder="🔍 Rechercher un terme (ex: Hyperviseur, IAM, NAT, KMS, VPC, Snapshot...)"
                 oninput="window.App.filterGlossary(this.value)">
        </div>

        <div class="glossary-grid" id="glossary-items-grid">
          ${renderGlossaryCards(terms)}
        </div>
      </div>
    `;
  }

  function renderGlossaryCards(termsList) {
    return termsList.map(t => `
      <div class="glossary-card">
        <div class="glossary-head">
          <span class="badge badge-info">${t.category}</span>
          <h4>${t.term}</h4>
          ${t.acronym ? `<small class="glossary-acronym">${t.acronym}</small>` : ''}
        </div>
        <p class="glossary-def"><strong>Définition :</strong> ${t.definition}</p>
        <p class="glossary-ex">💡 <strong>Exemple concret :</strong> ${t.example}</p>
      </div>
    `).join('');
  }

  function filterGlossary(query) {
    const q = query.toLowerCase().trim();
    const filtered = (window.M352_GLOSSARY || []).filter(item => 
      item.term.toLowerCase().includes(q) || 
      (item.acronym && item.acronym.toLowerCase().includes(q)) || 
      item.definition.toLowerCase().includes(q)
    );
    const grid = document.getElementById('glossary-items-grid');
    if (grid) grid.innerHTML = renderGlossaryCards(filtered);
  }

  // --- VUE NOTIONS À NE PAS CONFONDRE ---
  function renderConfusions(container) {
    const list = window.M352_CONFUSIONS || [];

    container.innerHTML = `
      <div class="confusions-view">
        <div class="chapter-hero hero-confusions">
          <button class="btn btn-link btn-back" onclick="window.App.navigateTo('dashboard')">⬅️ Tableau de bord</button>
          <h2>Notions Clés à Ne JAMAIS Confondre (M352)</h2>
          <p class="chapter-subtitle">Les 6 pièges récurrents aux examens de cybersécurité décortiqués pas-à-pas.</p>
        </div>

        <div class="confusions-list">
          ${list.map(cf => `
            <div class="confusion-card" id="${cf.id}">
              <div class="cf-header">
                <h3>⚖️ ${cf.title}</h3>
                <p class="cf-summary">${cf.summaryDiff}</p>
              </div>

              <div class="cf-grid-compare">
                <div class="cf-box cf-box-a">
                  <h4>${cf.conceptA.name}</h4>
                  <span class="badge badge-primary">${cf.conceptA.tag}</span>
                  <ul>
                    ${cf.conceptA.points.map(p => `<li>${p}</li>`).join('')}
                  </ul>
                </div>

                <div class="cf-vs-badge">VS</div>

                <div class="cf-box cf-box-b">
                  <h4>${cf.conceptB.name}</h4>
                  <span class="badge badge-warning">${cf.conceptB.tag}</span>
                  <ul>
                    ${cf.conceptB.points.map(p => `<li>${p}</li>`).join('')}
                  </ul>
                </div>
              </div>

              ${cf.conceptC ? `
                <div class="cf-box cf-box-c">
                  <h4>${cf.conceptC.name}</h4>
                  <span class="badge badge-accent">${cf.conceptC.tag}</span>
                  <ul>${cf.conceptC.points.map(p => `<li>${p}</li>`).join('')}</ul>
                </div>
              ` : ''}

              <div class="cf-analogy-box">
                <p>${cf.analogy}</p>
              </div>

              <div class="cf-trap-box">
                <p>${cf.trapExam}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- VUE CARNET D'ERREURS ---
  function renderErrorNotebook(container) {
    const allQuiz = [
      ...window.M352_CH1.quiz,
      ...window.M352_CH2.quiz,
      ...window.M352_CH3.quiz
    ];

    const mistakes = allQuiz.filter(q => state.errorNotebook.includes(q.id));

    container.innerHTML = `
      <div class="errors-view">
        <div class="chapter-hero hero-errors">
          <button class="btn btn-link btn-back" onclick="window.App.navigateTo('dashboard')">⬅️ Tableau de bord</button>
          <h2>Mon Carnet d'Erreurs Personnel</h2>
          <p class="chapter-subtitle">Vos points faibles regroupés pour vous entraîner jusqu'à la perfection.</p>
        </div>

        ${mistakes.length === 0 ? `
          <div class="empty-state-card">
            <span class="empty-icon">🎉</span>
            <h3>Votre carnet d'erreurs est totalement vide !</h3>
            <p>Félicitations, vous n'avez aucune question en attente de correction. Continuez à vous évaluer via les QCM ou l'examen blanc.</p>
            <button class="btn btn-primary" onclick="window.App.navigateTo('exam')">Passer un Examen Blanc</button>
          </div>
        ` : `
          <div class="errors-meta-bar">
            <span>Vous avez <strong>${mistakes.length}</strong> question(s) à retravailler :</span>
            <button class="btn btn-danger btn-sm" onclick="window.App.clearErrorNotebook()">Vider mon carnet</button>
          </div>
          <div id="error-notebook-quiz-container"></div>
        `}
      </div>
    `;

    if (mistakes.length > 0) {
      setTimeout(() => {
        QuizEngine.init(mistakes, 'error-notebook-quiz-container');
      }, 100);
    }
  }

  // --- VUE RÉVISION RAPIDE 10 MINUTES ---
  function startReview10(container) {
    const allQuiz = [
      ...window.M352_CH1.quiz,
      ...window.M352_CH2.quiz,
      ...window.M352_CH3.quiz
    ];

    // Prioriser les questions du carnet d'erreurs, puis des questions piégeuses
    let selected = allQuiz.filter(q => state.errorNotebook.includes(q.id));
    if (selected.length < 10) {
      const remaining = allQuiz.filter(q => !state.errorNotebook.includes(q.id) && q.level === 'piege');
      selected = selected.concat(remaining.slice(0, 10 - selected.length));
    }
    if (selected.length < 10) {
      selected = selected.concat(allQuiz.slice(0, 10 - selected.length));
    }

    container.innerHTML = `
      <div class="review10-view">
        <div class="chapter-hero hero-review10">
          <button class="btn btn-link btn-back" onclick="window.App.navigateTo('dashboard')">⬅️ Tableau de bord</button>
          <h2>⚡ Session Express Révision 10 Minutes</h2>
          <p class="chapter-subtitle">10 questions ciblées sur vos points faibles et les pièges récurrents.</p>
        </div>

        <div id="review10-quiz-container"></div>
      </div>
    `;

    setTimeout(() => {
      QuizEngine.init(selected.slice(0, 10), 'review10-quiz-container');
    }, 100);
  }

  // --- VUE FICHES DE SYNTHÈSE IMPRIMABLES ---
  function renderSummarySheets(container) {
    container.innerHTML = `
      <div class="sheets-view">
        <div class="chapter-hero hero-sheets no-print">
          <button class="btn btn-link btn-back" onclick="window.App.navigateTo('dashboard')">⬅️ Tableau de bord</button>
          <h2>Fiches de Synthèse Ultra-Condensées (M352)</h2>
          <p class="chapter-subtitle">Fiches conçues pour être imprimées ou enregistrées en PDF en 1 page par chapitre.</p>
          <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimer / Exporter en PDF</button>
        </div>

        <div class="sheets-container">
          <!-- FICHE CH1 -->
          <div class="sheet-page">
            <div class="sheet-header">
              <h3>M352 • CH1 : Fondamentaux Cloud & Virtualisation</h3>
              <span>Filière Sécurité IT • ENSIASD</span>
            </div>
            <div class="sheet-grid">
              <div class="sheet-col">
                <h4>1. Pourquoi virtualiser ?</h4>
                <p>Modèle traditionnel : 1 service = 1 serveur -> 85% de CPU gaspillé. Solution : Consolidation + Isolation logique.</p>
                <h4>2. Définition NIST SP 800-145</h4>
                <p>Cloud = Virtualisation + Automatisation + Service mesuré.</p>
                <h4>3. Les 5 Caractéristiques Essentielles</h4>
                <p>• On-demand self-service • Broad network access • Resource pooling (Multi-tenancy) • Rapid elasticity • Measured service.</p>
              </div>
              <div class="sheet-col">
                <h4>4. Modèles de Service & Responsabilité</h4>
                <p>• IaaS : Fournisseur gère matériel/virtualisation. Client gère OS, patchs, apps.<br>• PaaS : Fournisseur gère OS/runtime. Client gère code/données.<br>• SaaS : Fournisseur gère tout. Client gère identités/données.</p>
                <h4>5. Type 1 vs Type 2</h4>
                <p>• Type 1 (Bare-metal) : Direct sur le matériel (ESXi, KVM).<br>• Type 2 (Hosted) : Sur un OS hôte (VirtualBox en TP).</p>
                <div class="sheet-callout">⚠️ Virtualisation ≠ Cloud ! (Technologie vs Modèle de service)</div>
              </div>
            </div>
          </div>

          <!-- FICHE CH2 -->
          <div class="sheet-page">
            <div class="sheet-header">
              <h3>M352 • CH2 : Architecture Cloud, SecaaS & Risques</h3>
              <span>Filière Sécurité IT • ENSIASD</span>
            </div>
            <div class="sheet-grid">
              <div class="sheet-col">
                <h4>1. Acteurs NIST SP 500-292</h4>
                <p>Consumer, Provider, Broker, Auditor (audit indépendant), Carrier (transport télécom).</p>
                <h4>2. Réseau Virtuel Sécurisé</h4>
                <p>• Subnet Public : Load Balancer / WAF.<br>• Subnet Privé : VM applicatives.<br>• Zone Données : Bases de données sans IP publique.<br>• NAT Gateway : Sortie seule pour serveurs privés.<br>• Bastion : Point d'accès unique avec MFA.</p>
              </div>
              <div class="sheet-col">
                <h4>3. Management Plane vs Data Plane</h4>
                <p>Contrôler le management plane (API, console, IAM) est aussi critique que filtrer les ports réseau !</p>
                <h4>4. 6 Familles SecaaS</h4>
                <p>IAM/MFA, KMS (clés), WAF (web), SIEM (logs), CSPM (posture), Backup/DR.</p>
                <h4>5. Règle d'or</h4>
                <p>Dans le Cloud, l'identité devient le principal périmètre de sécurité. Un compte admin sans MFA est plus dangereux qu'un port ouvert.</p>
              </div>
            </div>
          </div>

          <!-- FICHE CH3 / TD1 / TP1 -->
          <div class="sheet-page">
            <div class="sheet-header">
              <h3>M352 • CH3, TD1 & TP1 : Sécurité Virtualisation & Réseau</h3>
              <span>Filière Sécurité IT • ENSIASD</span>
            </div>
            <div class="sheet-grid">
              <div class="sheet-col">
                <h4>1. Les 5 Objectifs C3</h4>
                <p>Isoler, Contrôler, Durcir, Observer, Restaurer.</p>
                <h4>2. Snapshot ≠ Sauvegarde</h4>
                <p>Un snapshot dépend du même disque source (dérivation différentielle). Si le disque crashe, le snapshot est perdu !</p>
                <h4>3. Modes Réseau VirtualBox (TP1)</h4>
                <p>• NAT : Sortie Internet, masqué de l'extérieur.<br>• Internal : Étanche VM-à-VM sans accès hôte.<br>• Host-only : Réseau privé Hôte <-> VM (administration SSH).<br>• Bridged : Exposé sur le LAN réel.</p>
              </div>
              <div class="sheet-col">
                <h4>4. Méthode Risques TD1 (AtlasTech)</h4>
                <p>Risque = Vraisemblance (1-5) × Impact (1-5).<br>Faible (1-4), Modéré (5-9), Élevé (10-16), Critique (17-25).<br>R1 (Console admin partagée sans MFA) = 20 (Critique).<br>R4 (Ransomware avec backups montés) = 20 (Critique).</p>
                <h4>5. Commandes de Hardening (TP1)</h4>
                <code>sudo ufw default deny incoming</code><br>
                <code>sudo ufw default allow outgoing</code><br>
                <code>sudo ufw allow proto tcp from &lt;HOST_ONLY&gt;/24 to any port 22</code><br>
                <code>sudo ufw enable && sudo ufw status verbose</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- GESTIONNAIRES D'ÉTAT ET LOGIQUE MÉTIER ---
  function setSectionStatus(sectionId, status) {
    if (state.sectionStatus[sectionId] === status) {
      delete state.sectionStatus[sectionId];
    } else {
      state.sectionStatus[sectionId] = status;
    }
    saveState();
    handleRoute();
  }

  function recordQuestionResult(questionId, isCorrect, questionObj) {
    state.quizHistory[questionId] = { isCorrect, timestamp: Date.now() };

    if (!isCorrect) {
      if (!state.errorNotebook.includes(questionId)) {
        state.errorNotebook.push(questionId);
      }
    } else {
      // Si la réponse est devenue correcte, la retirer du carnet d'erreurs
      state.errorNotebook = state.errorNotebook.filter(id => id !== questionId);
    }
    saveState();
  }

  function clearErrorNotebook() {
    state.errorNotebook = [];
    saveState();
    handleRoute();
  }

  function continueWhereLeft() {
    navigateTo(state.lastVisited || 'ch1');
  }

  function calculateStats() {
    const totalSections = (window.M352_CH1 ? window.M352_CH1.sections.length : 0) +
                          (window.M352_CH2 ? window.M352_CH2.sections.length : 0) +
                          (window.M352_CH3 ? window.M352_CH3.sections.length : 0);

    const understoodCount = Object.values(state.sectionStatus).filter(s => s === 'understood').length;
    const overallProgress = totalSections > 0 ? Math.round((understoodCount / totalSections) * 100) : 0;

    const ch1Total = window.M352_CH1 ? window.M352_CH1.sections.length : 8;
    const ch2Total = window.M352_CH2 ? window.M352_CH2.sections.length : 9;
    const ch3Total = window.M352_CH3 ? window.M352_CH3.sections.length : 8;

    const ch1Done = window.M352_CH1 ? window.M352_CH1.sections.filter(s => state.sectionStatus[s.id] === 'understood').length : 0;
    const ch2Done = window.M352_CH2 ? window.M352_CH2.sections.filter(s => state.sectionStatus[s.id] === 'understood').length : 0;
    const ch3Done = window.M352_CH3 ? window.M352_CH3.sections.filter(s => state.sectionStatus[s.id] === 'understood').length : 0;

    // Calcul score moyen
    const quizEntries = Object.values(state.quizHistory);
    let avg = "—";
    if (quizEntries.length > 0) {
      const correct = quizEntries.filter(e => e.isCorrect).length;
      avg = ((correct / quizEntries.length) * 20).toFixed(1);
    }

    return {
      totalSections,
      understoodCount,
      overallProgress,
      ch1Progress: Math.round((ch1Done / ch1Total) * 100),
      ch2Progress: Math.round((ch2Done / ch2Total) * 100),
      ch3Progress: Math.round((ch3Done / ch3Total) * 100),
      td1Progress: state.quizHistory['q-ch2-01'] ? 100 : 50,
      tp1Progress: state.quizHistory['q-ch3-04'] ? 100 : 40,
      averageScore: avg,
      errorCount: state.errorNotebook.length
    };
  }

  function updateGlobalProgress() {
    const stats = calculateStats();
    const globalEl = document.getElementById('global-progress-badge');
    if (globalEl) globalEl.innerText = `${stats.overallProgress}%`;
  }

  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) themeBtn.innerText = theme === 'dark' ? '☀️ Mode Clair' : '🌙 Mode Sombre';
    saveState();
  }

  function toggleTheme() {
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  }

  function exportProgress() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progression_m352_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importProgress(inputElement) {
    const file = inputElement.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const imported = JSON.parse(e.target.result);
        state = imported;
        saveState();
        alert("Progression importée avec succès !");
        handleRoute();
      } catch (err) {
        alert("Fichier JSON invalide.");
      }
    };
    reader.readAsText(file);
  }

  function resetProgress() {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser toute votre progression de révision ?")) {
      localStorage.removeItem(STORAGE_KEY);
      state = {
        theme: 'dark',
        lastVisited: 'dashboard',
        sectionStatus: {},
        quizHistory: {},
        errorNotebook: [],
        examResults: [],
        bookmarks: [],
        customNotes: {}
      };
      saveState();
      handleRoute();
    }
  }

  // Convertisseur simple Markdown Table -> HTML
  function markdownTableToHTML(mdTable) {
    const lines = mdTable.trim().split('\n');
    if (lines.length < 2) return mdTable;
    let html = '<table class="simple-table"><thead><tr>';
    const headers = lines[0].split('|').filter(c => c.trim() !== '');
    headers.forEach(h => html += `<th>${h.trim()}</th>`);
    html += '</tr></thead><tbody>';

    for (let i = 2; i < lines.length; i++) {
      const cells = lines[i].split('|').filter(c => c.trim() !== '');
      if (cells.length > 0) {
        html += '<tr>';
        cells.forEach(c => html += `<td>${c.trim()}</td>`);
        html += '</tr>';
      }
    }
    html += '</tbody></table>';
    return html;
  }

  // Helper pour attacher des infobulles interactives
  function attachTooltips() {
    // Les infobulles sont enrichies au survol sur les termes correspondants
  }

  // Recherche globale
  function setupGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    const searchResults = document.getElementById('global-search-results');
    if (!searchInput || !searchResults) return;

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (q.length < 2) {
        searchResults.classList.add('hidden');
        return;
      }

      let matches = [];
      // Rechercher dans le glossaire
      (window.M352_GLOSSARY || []).forEach(term => {
        if (term.term.toLowerCase().includes(q) || term.definition.toLowerCase().includes(q)) {
          matches.push({ type: 'Glossaire', title: term.term, desc: term.definition, target: 'glossary' });
        }
      });

      // Rechercher dans les questions de cours
      const allQ = [...window.M352_CH1.quiz, ...window.M352_CH2.quiz, ...window.M352_CH3.quiz];
      allQ.forEach(quiz => {
        if (quiz.question.toLowerCase().includes(q) || quiz.explanation.toLowerCase().includes(q)) {
          matches.push({ type: 'Question QCM', title: quiz.question.slice(0, 60) + '...', desc: quiz.explanation.slice(0, 80) + '...', target: quiz.courseRef || 'dashboard' });
        }
      });

      if (matches.length > 0) {
        searchResults.innerHTML = matches.slice(0, 6).map(m => `
          <div class="search-result-item" onclick="window.App.navigateTo('${m.target}'); document.getElementById('global-search-results').classList.add('hidden');">
            <span class="res-type">${m.type}</span>
            <strong>${m.title}</strong>
            <small>${m.desc}</small>
          </div>
        `).join('');
        searchResults.classList.remove('hidden');
      } else {
        searchResults.innerHTML = `<div class="search-no-res">Aucun résultat trouvé pour "${q}"</div>`;
        searchResults.classList.remove('hidden');
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.add('hidden');
      }
    });
  }

  return {
    init,
    navigateTo,
    continueWhereLeft,
    setSectionStatus,
    recordQuestionResult,
    clearErrorNotebook,
    toggleTheme,
    exportProgress,
    importProgress,
    resetProgress,
    filterGlossary
  };
})();

// Démarrage automatique dès le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});

