// Simulateur Interactif de Matrice des Risques (TD1 AtlasTech)
window.RiskMatrixSimulator = (function () {
  let likelihood = 3;
  let impact = 3;

  const presets = [
    { id: "R1", label: "R1 : Console admin identifiants partagés", V: 4, I: 5, expectedScore: 20, level: "Critique" },
    { id: "R2", label: "R2 : Faille non corrigée hyperviseur (VM Escape)", V: 3, I: 5, expectedScore: 15, level: "Élevé" },
    { id: "R3", label: "R3 : Propagation latérale réseau plat (WEB vers DB)", V: 4, I: 4, expectedScore: 16, level: "Élevé" },
    { id: "R4", label: "R4 : Ransomware chiffrant VM et sauvegardes montées", V: 4, I: 5, expectedScore: 20, level: "Critique" },
    { id: "R5", label: "R5 : Données sensibles dans vieux snapshot", V: 3, I: 3, expectedScore: 9, level: "Modéré" },
    { id: "R6", label: "R6 : Compte par défaut dans modèle de VM", V: 3, I: 3, expectedScore: 9, level: "Modéré" }
  ];

  function getLevelInfo(score) {
    if (score <= 4) return { label: "Faible", color: "green", cssClass: "risk-low", desc: "Risque acceptable sous surveillance ordinaire." };
    if (score <= 9) return { label: "Modéré", color: "yellow", cssClass: "risk-mid", desc: "Risque tolérable sous réserve de contrôles existants." };
    if (score <= 16) return { label: "Élevé", color: "orange", cssClass: "risk-high", desc: "Risque inacceptable : plan d'action correctif obligatoire à court terme." };
    return { label: "Critique", color: "red", cssClass: "risk-crit", desc: "Risque INTOLÉRABLE : remédiation d'extrême urgence (priorité P1)." };
  }

  function init(containerId) {
    likelihood = 3;
    impact = 3;
    render(containerId);
  }

  function setLikelihood(v, containerId) {
    likelihood = parseInt(v);
    render(containerId);
  }

  function setImpact(i, containerId) {
    impact = parseInt(i);
    render(containerId);
  }

  function applyPreset(presetId, containerId) {
    const p = presets.find(item => item.id === presetId);
    if (!p) return;
    likelihood = p.V;
    impact = p.I;
    render(containerId, p);
  }

  function render(containerId, activePreset = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const score = likelihood * impact;
    const info = getLevelInfo(score);

    const vLabels = ["", "1 - Rare", "2 - Peu probable", "3 - Possible", "4 - Probable", "5 - Très probable"];
    const iLabels = ["", "1 - Négligeable", "2 - Faible", "3 - Modéré", "4 - Élevé", "5 - Critique"];

    container.innerHTML = `
      <div class="risk-sim-card">
        <div class="risk-sim-header">
          <h3>Simulateur de Cotation des Risques (Méthode TD1)</h3>
          <p>Ajustez les curseurs ou cliquez sur un scénario officiel pour observer le calcul dynamique du score et le niveau d'intervention requis.</p>
        </div>

        <div class="risk-presets-bar">
          <span class="preset-label"><strong>Scénarios officiels AtlasTech :</strong></span>
          <div class="preset-buttons">
            ${presets.map(p => `
              <button class="btn btn-sm ${activePreset && activePreset.id === p.id ? 'btn-primary' : 'btn-outline'}" 
                      onclick="RiskMatrixSimulator.applyPreset('${p.id}', '${containerId}')">
                ${p.id}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="risk-sim-controls-grid">
          <div class="risk-slider-box">
            <label><strong>Vraisemblance (V) :</strong> <span class="badge badge-info">${vLabels[likelihood]}</span></label>
            <input type="range" min="1" max="5" value="${likelihood}" 
                   oninput="RiskMatrixSimulator.setLikelihood(this.value, '${containerId}')">
            <div class="slider-marks"><span>1 (Rare)</span><span>3 (Possible)</span><span>5 (Très probable)</span></div>
          </div>

          <div class="risk-slider-box">
            <label><strong>Impact métier (I) :</strong> <span class="badge badge-warning">${iLabels[impact]}</span></label>
            <input type="range" min="1" max="5" value="${impact}" 
                   oninput="RiskMatrixSimulator.setImpact(this.value, '${containerId}')">
            <div class="slider-marks"><span>1 (Négligeable)</span><span>3 (Modéré)</span><span>5 (Critique)</span></div>
          </div>
        </div>

        <div class="risk-result-banner ${info.cssClass}">
          <div class="calc-formula">
            <span class="calc-part">V: ${likelihood}</span>
            <span class="calc-times">×</span>
            <span class="calc-part">I: ${impact}</span>
            <span class="calc-equals">=</span>
            <span class="calc-score">Score : ${score} / 25</span>
          </div>
          <div class="calc-verdict">
            <span class="verdict-level">Niveau : <strong>${info.label.toUpperCase()}</strong></span>
            <span class="verdict-desc">${info.desc}</span>
          </div>
        </div>

        <div class="risk-grid-wrapper">
          <h4>Matrice Qualitative 5 × 5 :</h4>
          <table class="risk-table-5x5">
            <thead>
              <tr>
                <th rowspan="2" class="th-axis">Vraisemblance ↓</th>
                <th colspan="5" class="th-axis-h">Impact métier ➔</th>
              </tr>
              <tr>
                <th>1 (Négligeable)</th>
                <th>2 (Faible)</th>
                <th>3 (Modéré)</th>
                <th>4 (Élevé)</th>
                <th>5 (Critique)</th>
              </tr>
            </thead>
            <tbody>
              ${[5, 4, 3, 2, 1].map(v => `
                <tr>
                  <th class="th-v-label">${vLabels[v]}</th>
                  ${[1, 2, 3, 4, 5].map(i => {
                    const s = v * i;
                    const cInfo = getLevelInfo(s);
                    const isSelected = (v === likelihood && i === impact);
                    return `
                      <td class="cell-${cInfo.cssClass} ${isSelected ? 'cell-selected' : ''}" 
                          onclick="RiskMatrixSimulator.setLikelihood(${v}, '${containerId}'); RiskMatrixSimulator.setImpact(${i}, '${containerId}');">
                        <span class="cell-score">${s}</span>
                        ${isSelected ? '<span class="cell-marker">📍 ACTIF</span>' : ''}
                      </td>
                    `;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  return {
    init,
    setLikelihood,
    setImpact,
    applyPreset
  };
})();

