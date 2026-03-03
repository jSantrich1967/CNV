/**
 * Dashboard Controller - Integración UI + Lógica CBCNV
 */

import { ComplianceEngine } from '../logic/indices.js';
import { PortfolioManager } from '../logic/portfolio.js';
import { AuditLogger } from '../security/audit.js';

export class DashboardController {
    constructor(uiElements, financialData) {
        this.ui = uiElements;
        this.engine = new ComplianceEngine(financialData);
        this.audit = new AuditLogger();
    }

    /**
     * Inicializa el Dashboard con datos dinámicos
     */
    init() {
        console.log("[UI] Inicializando Dashboard Integrado...");
        this.updateIndices();
        this.renderAlerts();
    }

    /**
     * Actualiza los widgets de Índices Patrimoniales
     */
    updateIndices() {
        const solvencia = this.engine.getSolvencia();
        const liquidez = this.engine.getLiquidez();
        const capitalStatus = this.engine.checkCapitalMinimo();

        // Simulación de actualización de DOM
        if (this.ui.solvenciaGauge) {
            this.ui.solvenciaGauge.setValue(solvencia * 100);
            this.ui.solvenciaStatus.setText(solvencia >= 0.15 ? "CUMPLE" : "BAJO");
        }

        console.log(`[UI] Índices Actualizados: Solvencia ${solvencia.toFixed(2)}, Liquidez ${liquidez.toFixed(2)}`);
    }

    /**
     * Renderiza las alertas de cumplimiento en el panel visual
     */
    renderAlerts() {
        const complianceAlerts = this.engine.getAlerts();

        // Inyectar alertas en el widget de la UI
        if (this.ui.alertsContainer) {
            this.ui.alertsContainer.innerHTML = complianceAlerts.map(alert => `
        <div class="alert-item ${alert.tipo.toLowerCase()}">
          <span class="icon">⚠️</span>
          <p>${alert.msg}</p>
        </div>
      `).join('');
        }

        console.log(`[UI] ${complianceAlerts.length} alertas de cumplimiento renderizadas.`);
    }

    /**
     * Acción: Sincronizar BCV
     */
    onSyncBCV(nuevaTasa) {
        this.audit.log({ username: "admin" }, "SYNC_BCV", "CONFIG", `Tasa actualizada a ${nuevaTasa} Bs/USD`);
        // Notificar a otros módulos...
    }
}
