/**
 * Suite de Verificación - Seguridad y Auditoría CBCNV
 */

import { AuthManager } from './src/security/auth.js';
import { AccessControl, ROLES } from './src/security/roles.js';
import { AuditLogger } from './src/security/audit.js';

console.log("--- INICIANDO VERIFICACIÓN DE SEGURIDAD CBCNV ---");

const auth = new AuthManager();
const audit = new AuditLogger();

// 1. Simulación de Flujo de Login y 2FA
console.log("\n1. Flujo de Autenticación:");
const loginAttempt = auth.login("admin", "sunaval2026");
console.log("- Login inicial:", loginAttempt.status);

if (loginAttempt.status === "2FA_REQUIRED") {
    const userProfile = { id: 1, name: "Jack Nickelsen", role: ROLES.OFICIAL_CUMPLIMIENTO };
    const authVerify = auth.verify2FA("123456", userProfile);
    console.log("- Verificación 2FA:", authVerify.status);

    if (authVerify.status === "SUCCESS") {
        audit.log(authVerify.session, "LOGIN_SUCCESS", "AUTH", "Inicio de sesión con 2FA exitoso.");

        // 2. Verificación de Control de Acceso (RBAC)
        const access = new AccessControl(authVerify.session.role);
        console.log("\n2. Control de Acceso (Rol: Oficial de Cumplimiento):");
        console.log("- ¿Puede generar reportes SUNAVAL?:", access.canAccess("REPORTES_SUNAVAL_GENERATE"));
        console.log("- ¿Puede editar contabilidad?:", access.canAccess("CONTABILIDAD_WRITE")); // Debería ser false

        // 3. Verificación de Auditoría
        console.log("\n3. Bitácora de Auditoría:");
        audit.log(authVerify.session, "GENERATE_RIAS", "LCFT", "Generación de reporte mensual RIAS.");
        console.log("- Entradas en bitácora:", audit.logs.length);
    }
}

console.log("\n--- VERIFICACIÓN DE SEGURIDAD COMPLETADA ---");
