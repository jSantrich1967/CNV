/**
 * Prueba de Exportación de Reportes SUNAVAL - CBCNV
 * Genera los archivos que serían enviados a la plataforma del regulador.
 */

import { ReportingEngine } from './src/logic/reports.js';
import { PortfolioManager } from './src/logic/portfolio.js';
import fs from 'fs';

const reporter = new ReportingEngine();
const outputDir = './exports_test';

// Crear directorio de exportación si no existe
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

console.log("--- INICIANDO EXPORTACIÓN DE PRUEBA SUNAVAL ---");

// 1. Exportar Forma A (Balance)
const formaA = reporter.generateBalanceFormaA();
fs.writeFileSync(`${outputDir}/FormaA_Balance.json`, JSON.stringify(formaA, null, 2));
console.log("- Forma A (Balance) exportada con éxito.");

// 2. Exportar Forma B (Resultados)
const formaB = reporter.generateFormaB();
fs.writeFileSync(`${outputDir}/FormaB_Resultados.json`, JSON.stringify(formaB, null, 2));
console.log("- Forma B (Resultados) exportada con éxito.");

// 3. Exportar Forma C (Patrimonio)
const formaC = reporter.generateFormaC();
fs.writeFileSync(`${outputDir}/FormaC_Patrimonio.json`, JSON.stringify(formaC, null, 2));
console.log("- Forma C (Patrimonio) exportada con éxito.");

// 4. Exportar Reporte de Cartera
const mockPortfolio = [
    { id: 1, nombre: "VENEZ 2027", emisor: "República Bolivariana", costo: 100, cantidad: 1000 },
    { id: 2, nombre: "T-BILL 2025", emisor: "Tesoro Nacional", costo: 95, cantidad: 500 }
];
const cartera = reporter.generatePortfolioReport(mockPortfolio);
fs.writeFileSync(`${outputDir}/Reporte_Cartera.json`, JSON.stringify(cartera, null, 2));
console.log("- Reporte de Cartera exportado con éxito.");

console.log("\n--- EXPORTACIÓN COMPLETADA ---");
console.log(`Los archivos se encuentran en: ${outputDir}`);
