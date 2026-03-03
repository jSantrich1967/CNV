/**
 * Report Controller - Integración Acciones UI CBCNV
 */

import { ReportingEngine } from '../logic/reports.js';
import { AuditLogger } from '../security/audit.js';

export class ReportController {
    constructor(currentUser) {
        this.reporter = new ReportingEngine();
        this.audit = new AuditLogger();
        this.user = currentUser;
    }

    /**
     * Maneja el click en "Generar Balance Forma A"
     */
    handleGenerateBalance() {
        const balance = this.reporter.generateBalanceFormaA();
        this.audit.log(this.user, "GENERATE_BALANCE_A", "REPORTES", "Balance General Forma A generado para exportación.");

        console.log("[UI] Balance Forma A listo para descarga.");
        return balance;
    }

    /**
     * Maneja el click en "Generar Estado de Resultados Forma B"
     */
    handleGenerateFormaB() {
        const report = this.reporter.generateFormaB();
        this.audit.log(this.user, "GENERATE_FORMA_B", "REPORTES", "Estado de Resultados Forma B generado.");
        return report;
    }

    /**
     * Maneja el click en "Generar Estado de Patrimonio Forma C"
     */
    handleGenerateFormaC() {
        const report = this.reporter.generateFormaC();
        this.audit.log(this.user, "GENERATE_FORMA_C", "REPORTES", "Estado de Patrimonio Forma C generado.");
        return report;
    }

    /**
     * Maneja el envío de reporte RAS (Sospechosa)
     */
    handleSubmitRAS(cliente, inusualidad, soportes) {
        const ras = this.reporter.generateRAS(cliente, inusualidad, soportes);
        this.audit.log(this.user, "SUBMIT_RAS", "LCFT", `Reporte RAS generado para cliente ${cliente.nombre}`);

        // Simulación de envío a la UNIF
        ras.estatus = "ENVIADO_UNIF";
        console.log(`[UI] RAS ${ras.idReporte} enviado exitosamente.`);
        return ras;
    }
}
