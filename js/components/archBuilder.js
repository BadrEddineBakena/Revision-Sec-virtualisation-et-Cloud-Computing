// Constructeur Interactif d'Architecture Sécurisée ENSIA-Tech (CH2)
window.ArchBuilder = (function () {
  const componentsList = [
    { id: "lb_waf", name: "Load Balancer + WAF", expectedZone: "public", icon: "🛡️", desc: "Point d'entrée HTTP/HTTPS sécurisé et répartiteur" },
    { id: "app_srv", name: "Serveurs d'Application (Portail)", expectedZone: "private", icon: "⚙️", desc: "Traitement de la logique métier sans IP publique" },
    { id: "db_cluster", name: "Base de Données Relationnelle", expectedZone: "data", icon: "🗄️", desc: "Stockage des notes et données hautement sensibles" },
    { id: "bastion_vpn", name: "Serveur Bastion / VPN + MFA", expectedZone: "admin", icon: "🔑", desc: "Point unique d'accès pour l'administration distante" },
    { id: "s3_bucket", name: "Bucket de Stockage Chiffré", expectedZone: "data", icon: "📦", desc: "Stockage des documents et sauvegardes d'examens" },
    { id: "siem_logs", name: "Collecteur de Logs & Alertes", expectedZone: "admin", icon: "📊", desc: "Centralisation des journaux et surveillance SOC" }
  ];

  let placements = {}; // componentId -> zoneId ('unassigned', 'public', 'private', 'data', 'admin')
  let validationResult = null;

  function init(containerId) {
    placements = {};
    componentsList.forEach(c => placements[c.id] = 'unassigned');
    validationResult = null;
    render(containerId);
  }

  function moveComponent(compId, targetZone, containerId) {
    placements[compId] = targetZone;
    validationResult = null; // reset validation
    render(containerId);
  }

  function validateArchitecture(containerId) {
    let errors = [];
    let warnings = [];
    let correctCount = 0;

    componentsList.forEach(c => {
      const currentZone = placements[c.id];
      if (currentZone === 'unassigned') {
        warnings.push(`Le composant "${c.name}" n'a pas encore été positionné dans l'architecture.`);
      } else if (c.id === 'db_cluster' && currentZone === 'public') {
        errors.push(`🚨 DANGER MORTEL : La Base de Données est placée en Zone Publique ! Elle recevrait une IP publique et serait scannée par tous les pirates sur Internet.`);
      } else if (c.id === 'lb_waf' && currentZone !== 'public') {
        errors.push(`⚠️ Problème de routage : Le Load Balancer / WAF doit être en Zone Publique pour accueillir le trafic légitime des étudiants depuis Internet.`);
      } else if (c.id === 'bastion_vpn' && currentZone === 'public') {
        warnings.push(`Attention : Le Bastion est en zone publique directe. Veillez à ce qu'il soit protégé par MFA et restriction stricte d'IP !`);
      } else if (currentZone === c.expectedZone) {
        correctCount++;
      } else {
        warnings.push(`Le composant "${c.name}" est placé en zone "${currentZone}", alors que la bonne pratique du cours recommande la zone "${c.expectedZone}".`);
      }
    });

    validationResult = {
      isPerfect: (correctCount === componentsList.length && errors.length === 0),
      errors,
      warnings,
      correctCount
    };

    render(containerId);
  }

  function resetBuilder(containerId) {
    init(containerId);
  }

  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const zones = [
      { id: "public", title: "🌐 Zone Publique (Subnet Public)", desc: "Exposée à Internet via Internet Gateway (IGW)", color: "zone-public" },
      { id: "private", title: "🔒 Zone Privée (Subnet Privé)", desc: "Accessible uniquement depuis la zone publique (pas d'IP publique)", color: "zone-private" },
      { id: "data", title: "🗄️ Zone Données (Data Subnet)", desc: "Hermétique : accessible uniquement par les serveurs applicatifs", color: "zone-data" },
      { id: "admin", title: "🔑 Zone Administration & Supervision", desc: "Canal dédié pour les ingénieurs IT avec MFA et logs", color: "zone-admin" }
    ];

    container.innerHTML = `
      <div class="arch-builder-card">
        <div class="arch-builder-header">
          <h3>Constructeur d'Architecture ENSIA-Tech (Défi Interactif)</h3>
          <p>Placez chaque composant dans la zone réseau appropriée pour construire une architecture conforme aux principes de défense en profondeur du cours CH2.</p>
        </div>

        <!-- Composants disponibles -->
        <div class="arch-unassigned-pool">
          <h4>Composants à placer :</h4>
          <div class="comp-chip-container">
            ${componentsList.filter(c => placements[c.id] === 'unassigned').map(c => `
              <div class="comp-chip" title="${c.desc}">
                <span class="comp-icon">${c.icon}</span>
                <span class="comp-name">${c.name}</span>
                <div class="comp-quick-actions">
                  <button class="btn-micro" onclick="ArchBuilder.moveComponent('${c.id}', 'public', '${containerId}')">Public</button>
                  <button class="btn-micro" onclick="ArchBuilder.moveComponent('${c.id}', 'private', '${containerId}')">Privé</button>
                  <button class="btn-micro" onclick="ArchBuilder.moveComponent('${c.id}', 'data', '${containerId}')">Données</button>
                  <button class="btn-micro" onclick="ArchBuilder.moveComponent('${c.id}', 'admin', '${containerId}')">Admin</button>
                </div>
              </div>
            `).join('')}
            ${componentsList.every(c => placements[c.id] !== 'unassigned') ? '<span class="all-placed">✅ Tous les composants ont été positionnés dans l\'architecture !</span>' : ''}
          </div>
        </div>

        <!-- Les 4 zones réseau -->
        <div class="arch-zones-grid">
          ${zones.map(z => {
            const inZone = componentsList.filter(c => placements[c.id] === z.id);
            return `
              <div class="arch-zone-column ${z.color}">
                <div class="zone-head">
                  <h4>${z.title}</h4>
                  <small>${z.desc}</small>
                </div>
                <div class="zone-drop-area">
                  ${inZone.length === 0 ? '<div class="zone-empty-tip">Aucun composant ici</div>' : ''}
                  ${inZone.map(c => `
                    <div class="comp-chip in-zone" title="${c.desc}">
                      <span class="comp-icon">${c.icon}</span>
                      <span class="comp-name">${c.name}</span>
                      <button class="btn-chip-remove" onclick="ArchBuilder.moveComponent('${c.id}', 'unassigned', '${containerId}')" title="Retirer">✕</button>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Boutons d'action -->
        <div class="arch-actions-bar">
          <button class="btn btn-primary" onclick="ArchBuilder.validateArchitecture('${containerId}')">
            🔍 Analyser l'exposition et valider
          </button>
          <button class="btn btn-secondary" onclick="ArchBuilder.resetBuilder('${containerId}')">
            🔄 Réinitialiser
          </button>
        </div>

        <!-- Résultats de la validation -->
        ${validationResult ? `
          <div class="arch-validation-box ${validationResult.isPerfect ? 'validation-success' : validationResult.errors.length > 0 ? 'validation-danger' : 'validation-warning'}">
            <h4>${validationResult.isPerfect ? '🎉 Architecture Parfaite ! Félicitations !' : '⚠️ Bilan de Sécurité de l\'Architecture :'}</h4>
            <p><strong>Score de conformité :</strong> ${validationResult.correctCount} / ${componentsList.length} composants idéalement positionnés.</p>
            
            ${validationResult.errors.length > 0 ? `
              <div class="val-errors-list">
                ${validationResult.errors.map(err => `<p class="val-err">${err}</p>`).join('')}
              </div>
            ` : ''}

            ${validationResult.warnings.length > 0 ? `
              <div class="val-warnings-list">
                ${validationResult.warnings.map(warn => `<p class="val-warn">${warn}</p>`).join('')}
              </div>
            ` : ''}

            ${validationResult.isPerfect ? `
              <p class="val-success-text">Votre architecture respecte parfaitement la séparation des privilèges, la défense en profondeur et le principe de moindre exposition d'ENSIA-Tech !</p>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }

  return {
    init,
    moveComponent,
    validateArchitecture,
    resetBuilder
  };
})();

