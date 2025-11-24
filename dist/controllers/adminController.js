"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.logout = logout;
exports.restoreRequest = restoreRequest;
exports.restoreForm = restoreForm;
exports.restorePassword = restorePassword;
const db_1 = require("../models/db");
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
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
async function restoreRequest(req, res) {
    const { correores } = req.body;
    try {
        const [rows] = await db_1.pool.query("SELECT id, correo FROM usuarios WHERE correo = ?", [correores]);
        if (rows.length === 0) {
            return res.status(404).send("No existe usuario con ese correo");
        }
        const user = rows[0];
        const token = crypto_1.default.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min
        await db_1.pool.query("INSERT INTO restore_tokens (user_id, token, expires_at) VALUES (?, ?, ?)", [user.id, token, expires]);
        // Configurar transporte de correo
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const link = `http://localhost:3000/admin/restore/${token}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.correo,
            subject: "Restablecimiento de contraseña IMHORSA",
            html: `<p>Haz click en el siguiente enlace para restablecer tu contraseña:</p>
             <a href="${link}">${link}</a>
             <p>Este enlace expira en 30 minutos.</p>`,
        });
        return res.send("Correo de restablecimiento enviado");
    }
    catch (error) {
        console.error("Error en restoreRequest:", error);
        return res.status(500).send("Error interno del servidor");
    }
}
async function restoreForm(req, res) {
    const { token } = req.params;
    try {
        const [rows] = await db_1.pool.query("SELECT user_id FROM restore_tokens WHERE token = ? AND expires_at > NOW()", [token]);
        if (rows.length === 0) {
            return res.status(403).send("Link inválido o expirado");
        }
        return res.sendFile(path_1.default.join(process.cwd(), "public", "admin", "restorepass.html"));
    }
    catch (error) {
        console.error("Error en restoreForm:", error);
        return res.status(500).send("Error interno del servidor");
    }
}
async function restorePassword(req, res) {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const [rows] = await db_1.pool.query("SELECT user_id FROM restore_tokens WHERE token = ? AND expires_at > NOW()", [token]);
        if (rows.length === 0) {
            return res.status(403).send("Link inválido o expirado");
        }
        const userId = rows[0].user_id;
        await db_1.pool.query("UPDATE usuarios SET password_user = AES_ENCRYPT(?, ?) WHERE id = ?", [newPassword, process.env.AES_KEY, userId]);
        await db_1.pool.query("DELETE FROM restore_tokens WHERE token = ?", [token]);
        return res.redirect("/admin/adlog1n");
    }
    catch (error) {
        console.error("Error en restorePassword:", error);
        return res.status(500).send("Error interno del servidor");
    }
}
//# sourceMappingURL=adminController.js.map