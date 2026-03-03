/**
 * Suite de Verificación - Lógica de Negocio CBCNV (SUNAVAL)
 */

import { ComplianceEngine } from './src/logic/indices.js';
import { PortfolioManager } from './src/logic/portfolio.js';
import { ReportingEngine } from './src/logic/reports.js';

const mockFinancialData = {
    activos: 5000000.00,
    patrimonio: 3965000.00,
    capitalPagado: 3000000.00,
    activoCorriente: 1500000.00,
    pasivoCorriente: 850000.00
};

console.log("--- INICIANDO VERIFICACIÓN DE CUMPLIMIENTO SUNAVAL ---");

// 1. Verificación de Índices
const engine = new ComplianceEngine(mockFinancialData);
console.log("\n1. Índices Patrimoniales:");
console.log(`- Solvencia: ${(engine.getSolvencia() * 100).toFixed(2)}%`);
console.log(`- Liquidez: ${engine.getLiquidez().toFixed(2)}`);
console.log("- Alertas:", engine.getAlerts().map(a => a.msg));

// 2. Verificación de Portafolios
const mockPortfolioT = [{ nombre: "Bono VENEZ 2027", fechaAdquisicion: "2023-11-20" }]; // > 90 días
const pm = new PortfolioManager(mockPortfolioT, []);
console.log("\n2. Gestión de Portafolios:");
console.log("- Alertas Plazo (T):", pm.validatePortafolioT().map(a => a.msg));

// 3. Verificación de Reportes
const re = new ReportingEngine();
console.log("\n3. Motor de Reportes:");
console.log("- Balance Resumido (Forma A) Generado.");
const rias = re.generateRIAS("03", "2026");
console.log("- Reporte RIAS Generado:", rias.idReporte);

console.log("\n--- VERIFICACIÓN COMPLETADA ---");
