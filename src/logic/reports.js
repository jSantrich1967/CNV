/**
 * Motor de Reportes Regulatorios CBCNV (SUNAVAL)
 */

import { PlanDeCuentas } from '../data/chartOfAccounts.js';

export class ReportingEngine {
    constructor(accountData = PlanDeCuentas) {
        this.accounts = accountData;
        this.reportDate = new Date();
    }

    /**
     * Genera el Balance General resumido (Forma A)
     * Enfocado en las grandes categorías de Activo, Pasivo y Patrimonio.
     */
    generateBalanceFormaA() {
        const balance = {
            fecha: this.reportDate.toISOString().split('T')[0],
            entidad: "Casa de Bolsa Venezolana (CBCNV)",
            moneda: "Bolívares (Bs.)",
            categorias: []
        };

        this.accounts.forEach(grupo => {
            balance.categorias.push({
                codigo: grupo.codigo,
                descripcion: grupo.descripcion,
                monto: this._calculateSum(grupo)
            });
        });

        return balance;
    }

    /**
     * Genera el Reporte de Actividades Sospechosas (RAS)
     * Estructura compatible con la circular DSNV/GPFCLCFT/00002.
     */
    generateRAS(cliente, inusualidad, soportes) {
        return {
            idReporte: `RAS-${Date.now()}`,
            tipo: "ACTIVIDAD_SOSPECHOSA",
            fechaDeteccion: this.reportDate.toISOString(),
            cliente: {
                nombre: cliente.nombre,
                id: cliente.id,
                perfilRiesgo: cliente.riesgo
            },
            descripcion: inusualidad,
            documentosAdjuntos: soportes.map(s => s.nombre),
            firmaOficialCumplimiento: "PENDIENTE",
            estatus: "BORRADOR"
        };
    }

    /**
     * Genera el Reporte de Inexistencia de Actividades Sospechosas (RIAS)
     * Reporte mensual obligatorio.
     */
    generateRIAS(mes, anio) {
        return {
            idReporte: `RIAS-${mes}-${anio}`,
            tipo: "INEXISTENCIA_ACTIVIDADES",
            periodo: `${mes}/${anio}`,
            declaracion: "Se hace constar que durante el periodo indicado NO se detectaron actividades sospechosas de LC/FT.",
            fechaGeneracion: this.reportDate.toISOString(),
            estatus: "LISTO_PARA_ENVIO"
        };
    }

    /**
     * Genera el Estado de Resultados (Forma B)
     */
    generateFormaB() {
        const ingresos = this._calculateSum(this.accounts.find(a => a.codigo === "400"));
        const egresos = this._calculateSum(this.accounts.find(a => a.codigo === "500"));

        return {
            entidad: "CBCNV",
            tipo: "Estado de Resultados (Forma B)",
            periodo: "Mensual",
            totalIngresos: ingresos,
            totalEgresos: egresos,
            utilidadNeta: ingresos - egresos,
            moneda: "Bs."
        };
    }

    /**
     * Genera el Estado de Movimiento del Patrimonio (Forma C)
     */
    generateFormaC() {
        const patrimonio = this.accounts.find(a => a.codigo === "300");
        return {
            entidad: "CBCNV",
            tipo: "Estado de Movimiento del Patrimonio (Forma C)",
            detalles: patrimonio.subcuentas.map(s => ({
                cuenta: s.descripcion,
                saldo: s.saldo
            }))
        };
    }

    /**
     * Genera el Reporte de Cartera de Inversiones Detallado
     */
    generatePortfolioReport(portafolio) {
        return {
            tipo: "Reporte de Cartera de Inversiones",
            fecha: this.reportDate.toISOString(),
            titulos: portafolio.map(t => ({
                nombre: t.nombre,
                emisor: t.emisor || "N/A",
                vencimiento: t.vencimiento || "N/A",
                valorNominal: t.valorNominal || t.costo,
                valorMercado: t.valorMercado || (t.costo * t.cantidad)
            }))
        };
    }

    /**
     * Función interna para calcular sumas jerárquicas
     */
    _calculateSum(node) {
        if (node.tipo === "D" || !node.subcuentas) {
            return node.saldo || 0;
        }
        return node.subcuentas.reduce((acc, curr) => acc + this._calculateSum(curr), 0);
    }
}
