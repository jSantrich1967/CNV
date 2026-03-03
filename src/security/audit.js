/**
 * Sistema de Bitácora de Auditoría - CBCNV
 * Registra acciones críticas para cumplimiento regulatorio
 */

export class AuditLogger {
    constructor() {
        this.logs = [];
    }

    /**
     * Registra un evento en la bitácora
     */
    log(user, action, module, details, status = "SUCCESS") {
        const entry = {
            timestamp: new Date().toISOString(),
            user: user.username,
            role: user.role,
            action: action,
            module: module,
            details: details,
            status: status,
            ip: "192.168.1.100" // Simulado
        };

        this.logs.push(entry);
        console.log(`[AUDIT] ${entry.timestamp} | User: ${entry.user} | Action: ${entry.action} | Status: ${entry.status}`);

        // Aquí se integraría con una base de datos persistente
        return entry;
    }

    /**
     * Obtiene el historial de auditoría filtrado
     */
    getHistory(filters = {}) {
        return this.logs.filter(log => {
            let match = true;
            if (filters.module && log.module !== filters.module) match = false;
            if (filters.user && log.user !== filters.user) match = false;
            return match;
        });
    }

    /**
     * Exporta bitácora para auditores externos
     */
    exportAuditTrail() {
        return JSON.stringify(this.logs, null, 2);
    }
}
