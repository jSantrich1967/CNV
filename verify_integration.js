/**
 * Suite de Verificación - Integración CBCNV
 * Simula el flujo completo UI -> Lógica -> Auditoría
 */

import { DashboardController } from './src/ui/dashboardController.js';
import { ReportController } from './src/ui/reportController.js';
import { ROLES } from './src/security/roles.js';

console.log("--- INICIANDO VERIFICACIÓN DE INTEGRACIÓN CBCNV ---");

const currentUser = { name: "Jack Nickelsen", role: ROLES.OFICIAL_CUMPLIMIENTO };
const financialData = { activos: 5000000, patrimonio: 4000000, capitalPagado: 3500000, activoCorriente: 2000000, pasivoCorriente: 500000 };

// 1. Simulación de Dashboard
const mockUI = {
    solvenciaGauge: { setValue: (v) => console.log(`[STITCH_GAUGE] Solvencia seteada en: ${v}%`) },
    solvenciaStatus: { setText: (t) => console.log(`[STITCH_TEXT] Status de Solvencia: ${t}`) },
    alertsContainer: { innerHTML: "" }
};

const controller = new DashboardController(mockUI, financialData);
console.log("\n1. Integración de Dashboard:");
controller.init();

// 2. Simulación de Acciones de Reporte
const reportCtrl = new ReportController(currentUser);
console.log("\n2. Integración de Reportes:");
const balance = reportCtrl.handleGenerateBalance();
console.log("- Resultado Balance A:", balance.entidad);

// 3. Verificación de Auditoría Integrada
console.log("\n3. Verificación de Trazabilidad:");
const auditLogs = controller.audit.getHistory();
console.log("- Total de eventos registrados tras interacción:", auditLogs.length);
console.log("- Último evento:", auditLogs[auditLogs.length - 1]?.action);

console.log("\n--- VERIFICACIÓN DE INTEGRACIÓN COMPLETADA ---");
