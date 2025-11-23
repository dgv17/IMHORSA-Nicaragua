"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccesorios = void 0;
exports.postCotizacionAccesorio = postCotizacionAccesorio;
const db_1 = require("../models/db");
const accesoriosModel_1 = require("../models/accesoriosModel");
const nodemailer_1 = __importDefault(require("nodemailer"));
const axios_1 = __importDefault(require("axios"));
const validaciones_1 = require("../utils/validaciones");
const getAccesorios = async (req, res) => {
    const serie = req.query.serie;
    try {
        const [rows] = await db_1.pool.query(`
      SELECT a.id, a.nombre, a.precio, a.descripcion, s.nombre AS serie, a.stock
      FROM accesorios a
      JOIN series s ON a.series_id = s.id
      WHERE (? IS NULL OR s.nombre = ?)
      ORDER BY s.nombre, a.nombre
      `, [serie || null, serie || null]);
        const accesorios = rows.map(a => ({
            ...a,
            precio: Number(a.precio),
            stock: Number(a.stock),
        }));
        res.json(accesorios);
    }
    catch (error) {
        console.error("Error al obtener accesorios:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.getAccesorios = getAccesorios;
async function postCotizacionAccesorio(req, res) {
    const connection = await db_1.pool.getConnection();
    try {
        const captchaResponse = req.body["g-recaptcha-response"];
        if (!captchaResponse)
            return res.status(400).json({ error: "Captcha no completado" });
        const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${captchaResponse}`;
        const { data } = await axios_1.default.post(verifyURL);
        if (!data.success)
            return res.status(400).json({ error: "Captcha inválido" });
        const { telefono, cedula, correo, direccion, cantidad } = req.body;
        // Validaciones
        const errorTel = (0, validaciones_1.validarTelefono)(telefono);
        if (errorTel)
            return res.status(400).json({ error: errorTel });
        const errorCed = (0, validaciones_1.validarCedula)(cedula);
        if (errorCed)
            return res.status(400).json({ error: errorCed });
        if (correo.length > 50)
            return res.status(400).json({ error: "Correo demasiado largo" });
        if (direccion.length > 100)
            return res.status(400).json({ error: "Dirección demasiado larga" });
        if (Number(cantidad) <= 0)
            return res.status(400).json({ error: "Cantidad inválida" });
        await connection.beginTransaction();
        const id = await (0, accesoriosModel_1.crearCotizacionAccesorio)(req.body);
        const numeroFactura = `IMH-${String(id).padStart(6, "0")}`;
        await connection.query("UPDATE cotizaciones SET numero_factura = ? WHERE id = ?", [numeroFactura, id]);
        const [[departamento]] = await connection.query("SELECT nombre FROM departamentos WHERE id = ?", [req.body.departamento_id]);
        const [[municipio]] = await connection.query("SELECT nombre FROM municipios WHERE id = ?", [req.body.municipio_id]);
        const [[accesorio]] = await connection.query("SELECT nombre, precio FROM accesorios WHERE id = ?", [req.body.accesorio_id]);
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
        const mensajeHTML = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color:#2c3e50;">Su cotización de accesorios fue registrada correctamente!</h2>
        <h3>Detalles de la cotización:</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr><td>Número de Factura</td><td>${numeroFactura}</td></tr>
          <tr><td>Nombre</td><td>${req.body.nombre}</td></tr>
          <tr><td>Cédula</td><td>${req.body.cedula}</td></tr>
          <tr><td>Teléfono</td><td>${req.body.telefono}</td></tr>
          <tr><td>Correo</td><td>${req.body.correo}</td></tr>
          <tr><td>Departamento</td><td>${departamento?.nombre}</td></tr>
          <tr><td>Municipio</td><td>${municipio?.nombre}</td></tr>
          <tr><td>Dirección</td><td>${req.body.direccion}</td></tr>
          <tr><td>Accesorio</td><td>${accesorio?.nombre}</td></tr>
          <tr><td>Cantidad</td><td>${req.body.cantidad}</td></tr>
          <tr><td>Total Neto</td><td>${req.body.total_neto}</td></tr>
        </table>
      </div>`;
        await transporter.sendMail({ from: process.env.EMAIL_USER, to: req.body.correo, subject: "Cotización de Accesorios - IMHORSA", html: mensajeHTML });
        await transporter.sendMail({ from: process.env.EMAIL_USER, to: "sansgodoyvallecillo123@gmail.com", subject: "Nueva Cotización de Accesorios - IMHORSA", html: mensajeHTML });
        await connection.commit();
        res.status(201).json({ message: "Cotización enviada con éxito", id, numeroFactura });
    }
    catch (error) {
        await connection.rollback();
        res.status(500).json({ error: "No se pudo completar la cotización: " + error.message });
    }
    finally {
        connection.release();
    }
}
//# sourceMappingURL=accesoriosController.js.map