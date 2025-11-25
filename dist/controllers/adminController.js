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
exports.getUsuarios = getUsuarios;
exports.getRoles = getRoles;
exports.createUsuario = createUsuario;
exports.updateUsuario = updateUsuario;
exports.forcePasswordChange = forcePasswordChange;
exports.getClientesNaturales = getClientesNaturales;
exports.getClientesJuridicos = getClientesJuridicos;
exports.updateClienteNatural = updateClienteNatural;
exports.updateClienteJuridico = updateClienteJuridico;
const db_1 = require("../models/db");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const lucifer_1 = require("../utils/lucifer");
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const validaciones_1 = require("../utils/validaciones");
async function login(req, res) {
    const { username, password } = req.body;
    try {
        const [rows] = await db_1.pool.query("SELECT id, username, password_user, rol_id FROM usuarios WHERE username = ?", [username]);
        if (rows.length === 0) {
            return res.status(401).send("Usuario no encontrado");
        }
        const user = rows[0];
        const bcryptHash = (0, lucifer_1.decryptLuciferBlocks)(user.password_user, process.env.LUCIFER_KEY);
        const match = await bcrypt_1.default.compare(password, bcryptHash);
        if (!match) {
            return res.status(401).send("Contraseña incorrecta");
        }
        req.session.user = {
            id: user.id,
            username: user.username,
            rol: user.rol_id,
        };
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
        const bcryptHash = await bcrypt_1.default.hash(newPassword, 12);
        const luciferCipher = (0, lucifer_1.encryptLuciferBlocks)(bcryptHash, process.env.LUCIFER_KEY);
        await db_1.pool.query("UPDATE usuarios SET password_user = ? WHERE id = ?", [
            luciferCipher,
            userId,
        ]);
        await db_1.pool.query("DELETE FROM restore_tokens WHERE token = ?", [token]);
        return res.redirect("/admin/adlog1n");
    }
    catch (error) {
        console.error("Error en restorePassword:", error);
        return res.status(500).send("Error interno del servidor");
    }
}
// Obtener lista de usuarios
async function getUsuarios(req, res) {
    try {
        const [rows] = await db_1.pool.query(`
      SELECT u.id, u.username, u.nombre, u.correo, r.nombre AS rol
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      ORDER BY u.id ASC
    `);
        res.json(rows);
    }
    catch (err) {
        console.error("Error al obtener usuarios:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
// Obtener lista de roles
async function getRoles(req, res) {
    try {
        const [rows] = await db_1.pool.query("SELECT id, nombre FROM roles ORDER BY id ASC");
        res.json(rows);
    }
    catch (err) {
        console.error("Error al obtener roles:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
async function createUsuario(req, res) {
    const { username, password_user, nombre, correo, rol_id } = req.body;
    const errores = [];
    if (!username || username.trim().length < 3 || username.trim().length > 25)
        errores.push("El username debe tener entre 3 y 25 caracteres");
    if (!password_user || password_user.length < 6)
        errores.push("La contraseña debe tener al menos 6 caracteres");
    if (!nombre || nombre.trim().length < 3 || nombre.trim().length > 25)
        errores.push("El nombre debe tener entre 3 y 25 caracteres");
    const correoError = (0, validaciones_1.validarCorreo)(correo);
    if (correoError)
        errores.push(correoError);
    if (!rol_id)
        errores.push("Debe seleccionar un rol");
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    try {
        const bcryptHash = await bcrypt_1.default.hash(password_user, 12);
        const luciferCipher = (0, lucifer_1.encryptLuciferBlocks)(bcryptHash, process.env.LUCIFER_KEY);
        const [result] = await db_1.pool.query("INSERT INTO usuarios (username, password_user, nombre, correo, rol_id) VALUES (?, ?, ?, ?, ?)", [username.trim(), luciferCipher, nombre.trim(), correo.trim(), rol_id]);
        res.json({ success: true, id: result.insertId });
    }
    catch (err) {
        console.error("Error al crear usuario:", err);
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ errores: ["El username o correo ya están registrados"] });
        }
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
async function updateUsuario(req, res) {
    const { id } = req.params;
    const { username, nombre, correo, rol_id } = req.body;
    const errores = [];
    if (!username || username.trim().length < 3 || username.trim().length > 25)
        errores.push("El username debe tener entre 3 y 25 caracteres");
    if (!nombre || nombre.trim().length < 3 || nombre.trim().length > 25)
        errores.push("El nombre debe tener entre 3 y 25 caracteres");
    const correoError = (0, validaciones_1.validarCorreo)(correo);
    if (correoError)
        errores.push(correoError);
    if (!rol_id)
        errores.push("Debe seleccionar un rol");
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    try {
        await db_1.pool.query("UPDATE usuarios SET username = ?, nombre = ?, correo = ?, rol_id = ? WHERE id = ?", [username.trim(), nombre.trim(), correo.trim(), rol_id, id]);
        res.json({ success: true });
    }
    catch (err) {
        console.error("Error al actualizar usuario:", err);
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ errores: ["El username o correo ya están registrados"] });
        }
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
async function forcePasswordChange(req, res) {
    const { username, newPassword } = req.body;
    const errores = [];
    if (!username || username.trim().length < 3 || username.trim().length > 25)
        errores.push("El username debe tener entre 3 y 25 caracteres");
    if (!newPassword || newPassword.length < 6)
        errores.push("La nueva contraseña debe tener al menos 6 caracteres");
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    try {
        const [rows] = await db_1.pool.query("SELECT id FROM usuarios WHERE username = ?", [username.trim()]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        const userId = rows[0].id;
        const bcryptHash = await bcrypt_1.default.hash(newPassword, 12);
        const luciferCipher = (0, lucifer_1.encryptLuciferBlocks)(bcryptHash, process.env.LUCIFER_KEY);
        await db_1.pool.query("UPDATE usuarios SET password_user = ? WHERE id = ?", [
            luciferCipher,
            userId,
        ]);
        res.json({ success: true });
    }
    catch (error) {
        console.error("Error al forzar cambio de contraseña:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
async function getClientesNaturales(req, res) {
    try {
        const [rows] = await db_1.pool.query(`
      SELECT cn.id,
             CONCAT_WS(' ', cn.primer_nombre, cn.segundo_nombre, cn.primer_apellido, cn.segundo_apellido) AS nombre_completo,
             cn.cedula,
             cn.telefono,
             cn.correo,
             d.nombre AS departamento,
             m.nombre AS municipio,
             dir.direccion
      FROM cliente_natural cn
      LEFT JOIN direcciones dir ON cn.direccion_id = dir.id
      LEFT JOIN municipios m ON dir.municipio_id = m.id
      LEFT JOIN departamentos d ON m.departamento_id = d.id
      ORDER BY cn.id ASC
    `);
        res.json(rows);
    }
    catch (error) {
        console.error("Error al obtener clientes naturales:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
async function getClientesJuridicos(req, res) {
    try {
        const [rows] = await db_1.pool.query(`
      SELECT cj.id,
             cj.nombre AS nombre_empresa,
             cj.correo,
             d.nombre AS departamento,
             m.nombre AS municipio,
             dir.direccion
      FROM cliente_juridico cj
      LEFT JOIN direcciones dir ON cj.direccion_id = dir.id
      LEFT JOIN municipios m ON dir.municipio_id = m.id
      LEFT JOIN departamentos d ON m.departamento_id = d.id
      ORDER BY cj.id ASC
    `);
        res.json(rows);
    }
    catch (error) {
        console.error("Error al obtener clientes jurídicos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
// Actualizar Cliente Natural
async function updateClienteNatural(req, res) {
    const { id } = req.params;
    const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, cedula, telefono, correo, departamento, municipio, direccion, } = req.body;
    const errores = [];
    if (!primer_nombre)
        errores.push("Debe ingresar el primer nombre");
    if (!primer_apellido)
        errores.push("Debe ingresar el primer apellido");
    if (!cedula)
        errores.push("Debe ingresar la cédula");
    if (!correo)
        errores.push("Debe ingresar el correo");
    if (!departamento)
        errores.push("Debe seleccionar un departamento");
    if (!municipio)
        errores.push("Debe seleccionar un municipio");
    if (!direccion)
        errores.push("Debe ingresar la dirección");
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    try {
        // Buscar o crear dirección
        const [rows] = await db_1.pool.query(`SELECT id FROM direcciones WHERE direccion = ? AND municipio_id = ?`, [direccion.trim(), municipio]);
        let direccionId;
        if (rows.length > 0) {
            direccionId = rows[0].id;
        }
        else {
            const [result] = await db_1.pool.query(`INSERT INTO direcciones (direccion, municipio_id) VALUES (?, ?)`, [direccion.trim(), municipio]);
            direccionId = result.insertId;
        }
        // Actualizar cliente natural
        await db_1.pool.query(`UPDATE cliente_natural 
       SET primer_nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?, 
           cedula = ?, telefono = ?, correo = ?, direccion_id = ? 
       WHERE id = ?`, [
            primer_nombre.trim(),
            segundo_nombre?.trim() || null,
            primer_apellido.trim(),
            segundo_apellido?.trim() || null,
            cedula.trim(),
            telefono?.trim() || null,
            correo.trim(),
            direccionId,
            id,
        ]);
        res.json({ success: true });
    }
    catch (error) {
        console.error("Error al actualizar cliente natural:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
// Actualizar Cliente Jurídico
async function updateClienteJuridico(req, res) {
    const { id } = req.params;
    const { nombre_empresa, correo, departamento, municipio, direccion } = req.body;
    const errores = [];
    if (!nombre_empresa)
        errores.push("Debe ingresar el nombre de la empresa");
    if (!correo)
        errores.push("Debe ingresar el correo");
    if (!departamento)
        errores.push("Debe seleccionar un departamento");
    if (!municipio)
        errores.push("Debe seleccionar un municipio");
    if (!direccion)
        errores.push("Debe ingresar la dirección");
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }
    try {
        // Buscar o crear dirección
        const [rows] = await db_1.pool.query(`SELECT id FROM direcciones WHERE direccion = ? AND municipio_id = ?`, [direccion.trim(), municipio]);
        let direccionId;
        if (rows.length > 0) {
            direccionId = rows[0].id;
        }
        else {
            const [result] = await db_1.pool.query(`INSERT INTO direcciones (direccion, municipio_id) VALUES (?, ?)`, [direccion.trim(), municipio]);
            direccionId = result.insertId;
        }
        // Actualizar cliente jurídico
        await db_1.pool.query(`UPDATE cliente_juridico 
       SET nombre = ?, correo = ?, direccion_id = ? 
       WHERE id = ?`, [nombre_empresa.trim(), correo.trim(), direccionId, id]);
        res.json({ success: true });
    }
    catch (error) {
        console.error("Error al actualizar cliente jurídico:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
//# sourceMappingURL=adminController.js.map