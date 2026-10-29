// Matrice Interactive de Responsabilité Partagée (CH1 & CH2)
window.SharedRespMatrix = (function () {
  const layers = [
    { id: "app", name: "Application", onprem: "client", iaas: "client", paas: "client", saas: "fournisseur" },
    { id: "data", name: "Données & Identités", onprem: "client", iaas: "client", paas: "client", saas: "client" },
    { id: "runtime", name: "Environnement d'exécution (Runtime)", onprem: "client", iaas: "client", paas: "fournisseur", saas: "fournisseur" },
    { id: "os", name: "Système d'exploitation (OS) & Patchs", onprem: "client", iaas: "client", paas: "fournisseur", saas: "fournisseur" },
    { id: "virt", name: "Virtualisation (Hyperviseur)", onprem: "client", iaas: "fournisseur", paas: "fournisseur", saas: "fournisseur" },
    { id: "hardware", name: "Matériel, Datacenter, Réseau physique", onprem: "client", iaas: "fournisseur", paas: "fournisseur", saas: "fournisseur" }
  ];

  let userSelection = {}; // key: "layerId-model" -> "client" ou "fournisseur"
  let showCorrection = false;

  function init(containerId) {
    userSelection = {};
    showCorrection = false;
    render(containerId);
  }

  function toggleChoice(layerId, model, containerId) {
    const key = `${layerId}-${model}`;
    const current = userSelection[key];
    if (!current) userSelection[key] = 'client';
    else if (current === 'client') userSelection[key] = 'fournisseur';
    else delete userSelection[key];
    render(containerId);
  }

  function checkAnswers(containerId) {
    showCorrection = true;
    render(containerId);
  }

  function resetMatrix(containerId) {
    init(containerId);
  }

  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const models = [
      { key: "onprem", label: "On-Premise (Local)" },
      { key: "iaas", label: "IaaS" },
      { key: "paas", label: "PaaS" },
      { key: "saas", label: "SaaS" }
    ];

    let totalCells = layers.length * models.length;
    let correctCells = 0;

    container.innerHTML = `
      <div class="resp-matrix-card">
        <div class="resp-matrix-header">
          <h3>Matrice Interactive de Responsabilité Partagée</h3>
          <p>Pour chaque couche technique et chaque modèle, cliquez sur la cellule pour alterner entre 👤 <strong>Client</strong> et 🏢 <strong>Fournisseur</strong>. Cliquez ensuite sur <em>« Vérifier »</em>.</p>
        </div>

        <div class="table-responsive">
          <table class="resp-interactive-table">
            <thead>
              <tr>
                <th class="th-layer">Couche Technique</th>
                ${models.map(m => `<th>${m.label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${layers.map(layer => `
                <tr>
                  <td class="td-layer-title"><strong>${layer.name}</strong></td>
                  ${models.map(m => {
                    const key = `${layer.id}-${m.key}`;
                    const expected = layer[m.key];
                    const selected = userSelection[key] || 'non-defini';
                    const isCorrect = (selected === expected);
                    if (showCorrection && isCorrect) correctCells++;

                    let cellClass = 'resp-cell';
                    let text = '❓ À choisir';
                    let icon = '⚪';

                    if (selected === 'client') {
                      cellClass += ' cell-client';
                      text = 'Client';
                      icon = '👤';
                    } else if (selected === 'fournisseur') {
                      cellClass += ' cell-provider';
                      text = 'Fournisseur';
                      icon = '🏢';
                    }

                    if (showCorrection) {
                      cellClass += isCorrect ? ' cell-eval-correct' : ' cell-eval-wrong';
                    }

                    return `
                      <td class="${cellClass}" onclick="SharedRespMatrix.toggleChoice('${layer.id}', '${m.key}', '${containerId}')" title="Cliquez pour changer">
                        <span class="cell-icon">${icon}</span>
                        <span class="cell-text">${text}</span>
                        ${showCorrection && !isCorrect ? `<div class="corr-badge">Attendu : ${expected === 'client' ? '👤 Client' : '🏢 Fournisseur'}</div>` : ''}
                      </td>
                    `;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="resp-matrix-actions">
          <button class="btn btn-primary" onclick="SharedRespMatrix.checkAnswers('${containerId}')">
            ✅ Vérifier mes réponses
          </button>
          <button class="btn btn-secondary" onclick="SharedRespMatrix.resetMatrix('${containerId}')">
            🔄 Réinitialiser
          </button>
        </div>

        ${showCorrection ? `
          <div class="resp-feedback-box ${correctCells === totalCells ? 'feedback-success' : 'feedback-warning'}">
            <h4>Résultat : ${correctCells} sur ${totalCells} correspondances exactes (${Math.round((correctCells / totalCells) * 100)}%)</h4>
            <p><strong>Règle d'or à retenir :</strong> En IaaS, la coupure se fait sous l'OS. En PaaS, sous l'application. En SaaS, l'application est fournie, mais <strong>les données et les identités restent TOUJOURS à la charge du client !</strong></p>
          </div>
        ` : ''}
      </div>
    `;
  }

  return {
    init,
    toggleChoice,
    checkAnswers,
    resetMatrix
  };
})();

