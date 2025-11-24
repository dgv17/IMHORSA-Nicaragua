"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.logout = logout;
const db_1 = require("../models/db");
async function login(req, res) {
    const { username, password } = req.body;
    try {
        const [rows] = await db_1.pool.query("SELECT id, username, CAST(AES_DECRYPT(password_user, ?) AS CHAR) AS password, rol_id FROM usuarios WHERE username = ?", [process.env.AES_KEY, username]);
        if (rows.length === 0) {
            return res.status(401).send("Usuario no encontrado");
        }
        const user = rows[0];
        if (user.password !== password) {
            return res.status(401).send("Contraseña incorrecta");
        }
        // Guardar sesión
        req.session.user = { id: user.id, username: user.username, rol: user.rol_id };
        return res.redirect("/admin/admondashb0ard");
    }
    catch (error) {
        console.error("Error en login:", error);
        return res.status(500).send("Error interno del servidor");
    }
}
function logout(req, res) {
    req.session.destroy(() => {
        res.redirect("/admin/adlog1n");
    });
}
//# sourceMappingURL=adminController.js.map