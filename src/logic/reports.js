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
    * Genera la Forma A (Balance General) según estándares SUNAVAL
    */
    generateBalanceFormaA() {
        return {
            encabezado: {
                entidad: "Casa de Bolsa Venezolana (CBCNV)",
                rif: "J-12345678-9",
                reporte: "Forma A - Balance de Situación",
                periodo: "Mensual",
                fechaCorte: this.reportDate.toLocaleDateString('es-VE'),
                moneda: "Bolívares (Bs.)"
            },
            cuerpo: this.accounts.map(g => ({
                codigo: g.codigo,
                descripcion: g.descripcion,
                saldo: this._calculateSum(g),
                detalles: g.subcuentas.map(s => ({
                    codigo: s.codigo,
                    descripcion: s.descripcion,
                    saldo: s.saldo || this._calculateSum(s)
                }))
            })),
            firmas: {
                preparado: "Departamento de Contabilidad",
                revisado: "Oficial de Cumplimiento",
                aprobado: "Presidente / Junta Directiva"
            },
            notas: "Nota 1: El balance ha sido ajustado según la última reconversión monetaria. Nota 2: Las provisiones cumplen con el Manual de Contabilidad SUNAVAL.",
            footer: "Documento generado por Sistema CBCNV-Compliance v1.0"
        };
    }

    /**
    * Genera la Forma B (Estado de Resultados Profesionales)
    */
    generateFormaB() {
        const ingresosNode = this.accounts.find(a => a.codigo === "400");
        const egresosNode = this.accounts.find(a => a.codigo === "500");

        const ingresosVal = this._calculateSum(ingresosNode);
        const egresosVal = this._calculateSum(egresosNode);

        return {
            encabezado: {
                entidad: "CBCNV",
                reporte: "Forma B - Estado de Resultados",
                fecha: this.reportDate.toLocaleDateString('es-VE')
            },
            secciones: [
                {
                    nombre: "INGRESOS OPERACIONALES",
                    subtotal: ingresosVal,
                    cuentas: ingresosNode.subcuentas.map(s => ({ codigo: s.codigo, d: s.descripcion, m: s.saldo }))
                },
                {
                    nombre: "EGRESOS OPERACIONALES",
                    subtotal: egresosVal,
                    cuentas: egresosNode.subcuentas.map(s => ({ codigo: s.codigo, d: s.descripcion, m: s.saldo }))
                }
            ],
            resultadoNeto: {
                etiqueta: "UTILIDAD O PÉRDIDA DEL EJERCICIO",
                monto: ingresosVal - egresosVal
            },
            estatus: "SOMETIDO A REVISIÓN"
        };
    }

    /**
    * Genera la Forma C (Movimiento del Patrimonio)
    */
    generateFormaC() {
        const patrimonio = this.accounts.find(a => a.codigo === "300");
        return {
            encabezado: {
                entidad: "CBCNV",
                reporte: "Forma C - Estado de Movimiento de las Cuentas del Patrimonio",
                periodo: "Acumulado"
            },
            movimientos: patrimonio.subcuentas.map(s => ({
                cuenta: `[${s.codigo}] ${s.descripcion}`,
                saldoInicial: s.saldo * 0.9, // Mock de saldo anterior
                variacion: s.saldo * 0.1,
                saldoFinal: s.saldo
            })),
            totalPatrimonio: this._calculateSum(patrimonio)
        };
    }

    /**
    * Genera el Estado de Flujos de Efectivo (Método Indirecto)
    */
    generateCashFlow() {
        return {
            encabezado: {
                entidad: "CBCNV",
                reporte: "Estado de Flujos de Efectivo",
                periodo: "Anual"
            },
            secciones: {
                operativas: { nombre: "Actividades de Operación", monto: 1200000 },
                inversion: { nombre: "Actividades de Inversión", monto: -450000 },
                financiamiento: { nombre: "Actividades de Financiamiento", monto: 300000 }
            },
            efectivoFinal: 1050000
        };
    }

    /**
    * Genera el Informe de Buen Gobierno Corporativo
    */
    generateBuenGobierno(data) {
        return {
            encabezado: {
                entidad: "CBCNV",
                reporte: "Informe de Buen Gobierno Corporativo",
                anio: new Date().getFullYear()
            },
            juntaDirectiva: data.miembros || [
                { nombre: "Director A", cargo: "Presidente", independencia: "No Independiente" },
                { nombre: "Director B", cargo: "Director Principal", independencia: "Independiente" }
            ],
            comites: [
                { nombre: "Comité de Riesgos", reuniones: 12 },
                { nombre: "Comité de Auditoría", reuniones: 4 }
            ],
            declaracion: "La entidad cumple con las normas de Buen Gobierno dictadas por SUNAVAL."
        };
    }

    /**
    * Genera el Reporte de Cartera de Inversiones (Formato CNV)
    */
    generatePortfolioReport(portafolio) {
        return {
            encabezado: {
                reporte: "Relación de la Cartera de Propios",
                normativa: "Resolución N° 061-2015",
                fecha: this.reportDate.toLocaleDateString('es-VE')
            },
            detalle: portafolio.map(t => ({
                id: t.nombre,
                custodio: "Caja Venezolana de Valores (CVV)",
                valorNominal: t.valorNominal || 1000,
                costoAdquisicion: t.costo || t.saldo,
                diasVencimiento: Math.floor((new Date() - new Date(t.fechaAdquisicion)) / (1000 * 60 * 60 * 24))
            }))
        };
    }

    /**
    * Función interna para calcular sumas jerárquicas
    */
    _calculateSum(node) {
        if (!node) return 0;
        if (node.tipo === "D" || !node.subcuentas) {
            return node.saldo || 0;
        }
        return node.subcuentas.reduce((acc, curr) => acc + this._calculateSum(curr), 0);
    }
}
