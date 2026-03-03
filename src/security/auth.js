/**
 * Motor de Autenticación y 2FA (Simulado) - CBCNV
 */

export class AuthManager {
    constructor() {
        this.session = null;
        this.mock2FACode = "123456"; // Código estático para propósitos de demostración
    }

    /**
     * Intento de login inicial
     */
    login(username, password) {
        // Simulación de validación de credenciales
        if (username === "admin" && password === "sunaval2026") {
            return { status: "2FA_REQUIRED", msg: "Credenciales válidas. Ingrese código 2FA." };
        }
        return { status: "ERROR", msg: "Usuario o contraseña incorrectos." };
    }

    /**
     * Validación de Segundo Factor de Autenticación (2FA)
     */
    verify2FA(code, userProfile) {
        if (code === this.mock2FACode) {
            this.session = {
                userId: userProfile.id,
                username: userProfile.name,
                role: userProfile.role,
                lastLogin: new Date().toISOString(),
                token: `mock-jwt-${Date.now()}`
            };
            return { status: "SUCCESS", session: this.session };
        }
        return { status: "ERROR", msg: "Código 2FA inválido o expirado." };
    }

    logout() {
        this.session = null;
        return { status: "LOGOUT_SUCCESS" };
    }

    isSessionActive() {
        return this.session !== null;
    }
}
