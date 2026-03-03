/**
 * Definición de Roles y Permisos (RBAC) - CBCNV
 */

export const ROLES = {
    ADMIN: "ADMINISTRADOR",
    CONTADOR: "CONTADOR_GENERAL",
    OFICIAL_CUMPLIMIENTO: "OFICIAL_CUMPLIMIENTO",
    AUDITOR: "AUDITOR_EXTERNO"
};

export const PERMISOS = {
    [ROLES.ADMIN]: ["*"], // Acceso total

    [ROLES.CONTADOR]: [
        "CONTABILIDAD_READ", "CONTABILIDAD_WRITE",
        "PORTAFOLIO_READ", "PORTAFOLIO_WRITE",
        "REPORTES_CONTABLES_GENERATE",
        "TASAS_UPDATE"
    ],

    [ROLES.OFICIAL_CUMPLIMIENTO]: [
        "KYC_READ", "KYC_WRITE",
        "LCFT_READ", "LCFT_WRITE",
        "REPORTES_SUNAVAL_GENERATE",
        "INDICES_READ"
    ],

    [ROLES.AUDITOR]: [
        "CONTABILIDAD_READ",
        "PORTAFOLIO_READ",
        "INDICES_READ",
        "AUDITORIA_READ"
    ]
};

export class AccessControl {
    constructor(userRole) {
        this.userRole = userRole;
    }

    canAccess(permission) {
        const userPermissions = PERMISOS[this.userRole] || [];
        return userPermissions.includes("*") || userPermissions.includes(permission);
    }

    getModules() {
        // Retorna los módulos visibles según el rol para la barra lateral
        const modules = [
            { id: "dashboard", label: "Dashboard", icon: "home", public: true },
            { id: "contabilidad", label: "Contabilidad", permission: "CONTABILIDAD_READ" },
            { id: "portafolios", label: "Portafolios", permission: "PORTAFOLIO_READ" },
            { id: "reportes", label: "Reportes SUNAVAL", permission: "REPORTES_SUNAVAL_GENERATE" },
            { id: "lcft", label: "Prevención LC/FT", permission: "LCFT_READ" },
            { id: "indices", label: "Índices Patrimoniales", permission: "INDICES_READ" },
            { id: "auditoria", label: "Auditoría", permission: "AUDITORIA_READ" }
        ];

        return modules.filter(m => m.public || this.canAccess(m.permission));
    }
}
