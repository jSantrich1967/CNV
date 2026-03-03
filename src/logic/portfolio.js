/**
 * Reglas de Negocio para Portafolios (SUNAVAL)
 */

export class PortfolioManager {
    constructor(portafolioT, portafolioPIC) {
        this.portafolioT = portafolioT; // Deuda cotizable (máximo 90 días)
        this.portafolioPIC = portafolioPIC; // Inversión para comercialización (Valor Razonable)
    }

    /**
     * Valida el cumplimiento del límite de 90 días en el Portafolio T
     */
    validatePortafolioT() {
        const alerts = [];
        const hoy = new Date();

        this.portafolioT.forEach(titulo => {
            const fechaAdq = new Date(titulo.fechaAdquisicion);
            const diffTime = Math.abs(hoy - fechaAdq);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 90) {
                alerts.push({
                    titulo: titulo.nombre,
                    dias: diffDays,
                    status: "EXCEEDED",
                    msg: `Título ${titulo.nombre} ha superado el límite legal de 90 días (Total: ${diffDays} días).`
                });
            } else if (diffDays > 75) {
                alerts.push({
                    titulo: titulo.nombre,
                    dias: diffDays,
                    status: "WARNING",
                    msg: `Título ${titulo.nombre} está próximo a vencer el límite de 90 días (${diffDays}/90).`
                });
            }
        });

        return alerts;
    }

    /**
     * Calcula la variación a Valor Razonable para el Portafolio PIC
     * Las variaciones deben reconocerse en el Patrimonio según SUNAVAL.
     */
    calculatePICValuation(preciosMercado) {
        let variacionTotalPatrimonio = 0;
        const detalles = this.portafolioPIC.map(titulo => {
            const precioActual = preciosMercado[titulo.id] || titulo.costo;
            const variacion = (precioActual - titulo.costo) * titulo.cantidad;
            variacionTotalPatrimonio += variacion;

            return {
                id: titulo.id,
                nombre: titulo.nombre,
                valorLibros: titulo.costo * titulo.cantidad,
                valorMercado: precioActual * titulo.cantidad,
                variacionPatrimonial: variacion
            };
        });

        return {
            detalles,
            impactoPatrimonio: variacionTotalPatrimonio
        };
    }

    /**
     * Regla de Provisión: 100% para deudoras > 60 días no conciliadas
     */
    calculateProvisions(cuentasDeudoras) {
        return cuentasDeudoras.filter(cta => cta.diasAntigüedad > 60)
            .map(cta => ({
                cuenta: cta.codigo,
                montoBase: cta.monto,
                provisionARegistrar: cta.monto * 1.0,
                motivo: "Antigüedad > 60 días (SUNAVAL)"
            }));
    }
}
