// Moteur de QCM Interactif Avancé pour M352
window.QuizEngine = (function () {
  let currentQuestions = [];
  let currentIndex = 0;
  let userAnswers = {};
  let currentFilter = 'all';
  let onFinishCallback = null;

  function init(questions, containerId, options = {}) {
    currentQuestions = [...questions];
    currentIndex = 0;
    userAnswers = {};
    currentFilter = options.filter || 'all';
    onFinishCallback = options.onFinish || null;

    if (currentFilter !== 'all') {
      currentQuestions = currentQuestions.filter(q => q.level === currentFilter);
    }

    render(containerId);
  }

  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (currentQuestions.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>Aucune question disponible pour ce filtre de difficulté.</p>
          <button class="btn btn-secondary" onclick="QuizEngine.setFilter('all', '${containerId}')">Voir toutes les questions</button>
        </div>`;
      return;
    }

    const q = currentQuestions[currentIndex];
    const isAnswered = userAnswers[q.id] !== undefined;
    const currentAns = userAnswers[q.id];

    let levelBadge = '';
    if (q.level === 'facile') levelBadge = '<span class="badge badge-success">🟢 Facile</span>';
    else if (q.level === 'moyen') levelBadge = '<span class="badge badge-warning">🟡 Moyen</span>';
    else if (q.level === 'piege') levelBadge = '<span class="badge badge-danger">🔴 Piégeux</span>';

    let html = `
      <div class="quiz-card">
        <div class="quiz-header">
          <div class="quiz-meta">
            <span class="quiz-progress-label">Question ${currentIndex + 1} sur ${currentQuestions.length}</span>
            ${levelBadge}
            <span class="badge badge-info">${q.type === 'multiple' ? '☑️ Choix multiple' : q.type === 'boolean' ? '⚖️ Vrai / Faux' : '🔘 Choix unique'}</span>
          </div>
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width: ${((currentIndex + 1) / currentQuestions.length) * 100}%"></div>
          </div>
        </div>

        <h3 class="quiz-question-title">${q.question}</h3>

        <div class="quiz-options-list" id="quiz-options-${q.id}">
    `;

    q.options.forEach((opt, idx) => {
      let optionClass = 'quiz-option';
      let icon = q.type === 'multiple' ? '⬜' : '⚪';

      if (isAnswered) {
        const isSelected = q.type === 'multiple' ? (currentAns.includes(idx)) : (currentAns === idx);
        const isCorrect = q.type === 'multiple' ? (q.answer.includes(idx)) : (q.answer === idx);

        if (isCorrect) {
          optionClass += ' option-correct';
          icon = '✅';
        } else if (isSelected && !isCorrect) {
          optionClass += ' option-wrong';
          icon = '❌';
        } else {
          optionClass += ' option-disabled';
        }
      }

      html += `
        <button class="${optionClass}" 
                onclick="QuizEngine.selectOption(${idx}, '${containerId}')" 
                ${isAnswered && q.type !== 'multiple' ? 'disabled' : ''}>
          <span class="option-icon">${icon}</span>
          <span class="option-text">${opt}</span>
        </button>
      `;
    });

    html += `</div>`;

    if (q.type === 'multiple' && !isAnswered) {
      html += `
        <div class="quiz-submit-multi">
          <button class="btn btn-primary" onclick="QuizEngine.submitMultiple('${containerId}')">Valider mes réponses</button>
        </div>
      `;
    }

    if (isAnswered) {
      const isSuccess = checkSuccess(q, currentAns);

      html += `
        <div class="quiz-feedback-box ${isSuccess ? 'feedback-success' : 'feedback-wrong'}">
          <div class="feedback-header">
            <h4>${isSuccess ? '🎉 Excellente réponse !' : '⚠️ Attention à l\'erreur !'}</h4>
          </div>
          <div class="feedback-body">
            <p class="feedback-explanation"><strong>Explication détaillée :</strong> ${q.explanation}</p>
            ${q.courseRef ? `
              <div class="feedback-link">
                <a href="#${q.courseRef}" class="btn-link" onclick="window.App.navigateTo('${q.courseRef}')">
                  📖 Revoir cette notion dans le cours
                </a>
              </div>` : ''}
          </div>
        </div>
      `;
    }

    html += `
      <div class="quiz-actions-footer">
        <button class="btn btn-secondary" onclick="QuizEngine.prevQuestion('${containerId}')" ${currentIndex === 0 ? 'disabled' : ''}>
          ⬅️ Précédente
        </button>
        <button class="btn btn-secondary" onclick="QuizEngine.resetQuiz('${containerId}')">
          🔄 Recommencer
        </button>
        <button class="btn btn-primary" onclick="QuizEngine.nextQuestion('${containerId}')">
          ${currentIndex === currentQuestions.length - 1 ? 'Voir le bilan 📊' : 'Suivante ➡️'}
        </button>
      </div>
    </div>`;

    container.innerHTML = html;
  }

  function selectOption(optionIndex, containerId) {
    const q = currentQuestions[currentIndex];

    if (q.type === 'multiple') {
      if (!userAnswers[q.id]) userAnswers[q.id] = [];
      const idx = userAnswers[q.id].indexOf(optionIndex);
      if (idx > -1) {
        userAnswers[q.id].splice(idx, 1);
      } else {
        userAnswers[q.id].push(optionIndex);
      }
      render(containerId);
      return;
    }

    userAnswers[q.id] = optionIndex;
    const isSuccess = (optionIndex === q.answer);
    recordAnswer(q, isSuccess);
    render(containerId);
  }

  function submitMultiple(containerId) {
    const q = currentQuestions[currentIndex];
    const userSelected = userAnswers[q.id] || [];
    if (userSelected.length === 0) {
      alert("Veuillez sélectionner au moins une option.");
      return;
    }
    const isSuccess = checkSuccess(q, userSelected);
    recordAnswer(q, isSuccess);
    render(containerId);
  }

  function checkSuccess(q, answer) {
    if (q.type === 'multiple') {
      if (!Array.isArray(answer)) return false;
      if (answer.length !== q.answer.length) return false;
      return answer.every(val => q.answer.includes(val));
    }
    return answer === q.answer;
  }

  function recordAnswer(q, isSuccess) {
    if (window.App && window.App.recordQuestionResult) {
      window.App.recordQuestionResult(q.id, isSuccess, q);
    }
  }

  function nextQuestion(containerId) {
    if (currentIndex < currentQuestions.length - 1) {
      currentIndex++;
      render(containerId);
    } else {
      renderSummary(containerId);
    }
  }

  function prevQuestion(containerId) {
    if (currentIndex > 0) {
      currentIndex--;
      render(containerId);
    }
  }

  function resetQuiz(containerId) {
    userAnswers = {};
    currentIndex = 0;
    render(containerId);
  }

  function setFilter(filter, containerId) {
    currentFilter = filter;
    init(currentQuestions, containerId, { filter });
  }

  function renderSummary(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let total = currentQuestions.length;
    let correct = 0;
    let mistakes = [];

    currentQuestions.forEach(q => {
      const ans = userAnswers[q.id];
      const success = checkSuccess(q, ans);
      if (success) correct++;
      else mistakes.push(q);
    });

    const scorePct = Math.round((correct / total) * 100);
    const score20 = ((correct / total) * 20).toFixed(1);

    let message = '';
    if (scorePct >= 80) message = '🌟 Bravo ! Excellente maîtrise des notions de cette section.';
    else if (scorePct >= 50) message = '👍 Bon score, mais quelques notions méritent d\'être revues.';
    else message = '⚠️ Prenez le temps de relire le cours pour consolider ces bases indispensables.';

    container.innerHTML = `
      <div class="quiz-summary-card">
        <div class="summary-score-circle ${scorePct >= 70 ? 'score-high' : scorePct >= 50 ? 'score-mid' : 'score-low'}">
          <span class="score-number">${score20} / 20</span>
          <span class="score-pct">${scorePct}% de réussite</span>
        </div>
        <h3 class="summary-title">${message}</h3>
        <p class="summary-detail">${correct} réponse(s) correcte(s) sur ${total} questions.</p>

        ${mistakes.length > 0 ? `
          <div class="mistakes-review-box">
            <h4>💡 Points à revoir (${mistakes.length} erreurs) :</h4>
            <ul class="mistakes-list">
              ${mistakes.map(m => `
                <li>
                  <strong>${m.question}</strong>
                  <p class="mistake-expl">${m.explanation}</p>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="summary-buttons">
          <button class="btn btn-primary" onclick="QuizEngine.resetQuiz('${containerId}')">🔄 Refaire ce QCM</button>
          <button class="btn btn-secondary" onclick="window.App.navigateTo('dashboard')">🏠 Retour au Tableau de bord</button>
        </div>
      </div>
    `;

    if (onFinishCallback) onFinishCallback({ total, correct, score20, scorePct });
  }

  return {
    init,
    selectOption,
    submitMultiple,
    nextQuestion,
    prevQuestion,
    resetQuiz,
    setFilter
  };
})();

