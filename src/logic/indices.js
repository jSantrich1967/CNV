/**
 * Motor de Cálculo de Índices Patrimoniales SUNAVAL
 */

export class ComplianceEngine {
    constructor(financialData) {
        this.data = financialData;
        this.minCapitalExigido = 5000000.00; // Ejemplo: 5M Bs. según circular vigente
    }

    /**
     * Calcula el Índice de Solvencia
     * Fórmula: Patrimonio Neto / Activo Total
     */
    getSolvencia() {
        const patrimonio = this.data.patrimonio;
        const activos = this.data.activos;
        return activos > 0 ? (patrimonio / activos) : 0;
    }

    /**
     * Calcula el Índice de Liquidez
     * Fórmula: Activo Corriente / Pasivo Corriente
     */
    getLiquidez() {
        return this.data.pasivoCorriente > 0
            ? (this.data.activoCorriente / this.data.pasivoCorriente)
            : 0;
    }

    /**
     * Verifica el cumplimiento del Capital Pagado Mínimo
     */
    checkCapitalMinimo() {
        const capital = this.data.capitalPagado;
        return {
            cumple: capital >= this.minCapitalExigido,
            deficit: Math.max(0, this.minCapitalExigido - capital),
            porcentaje: (capital / this.minCapitalExigido) * 100
        };
    }

    /**
     * Alerta: Patrimonio Neto < 50% del Capital Social
     */
    checkRiesgoPatrimonial() {
        const patrimonio = this.data.patrimonio;
        const capital = this.data.capitalPagado;
        return patrimonio < (capital * 0.5);
    }

    /**
     * Genera reporte de alertas
     */
    getAlerts() {
        const alerts = [];
        if (!this.checkCapitalMinimo().cumple) {
            alerts.push({ tipo: "CRITICAL", msg: "Capital Pagado por debajo del mínimo exigido por SUNAVAL." });
        }
        if (this.checkRiesgoPatrimonial()) {
            alerts.push({ tipo: "WARNING", msg: "Riesgo Patrimonial: Patrimonio Neto inferior al 50% del Capital Social." });
        }
        if (this.getLiquidez() < 1) {
            alerts.push({ tipo: "DANGER", msg: "Índice de Liquidez por debajo de la unidad (1.0)." });
        }
        return alerts;
    }
}
