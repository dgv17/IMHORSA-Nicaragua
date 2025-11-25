"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCotizacionRepuestos = postCotizacionRepuestos;
const db_1 = __importDefault(require("../models/db"));
const repuestosModel_1 = require("../models/repuestosModel");
const nodemailer_1 = __importDefault(require("nodemailer"));
const axios_1 = __importDefault(require("axios"));
const validaciones_1 = require("../utils/validaciones");
async function postCotizacionRepuestos(req, res) {
    const connection = await db_1.default.getConnection();
    try {
        const captchaResponse = req.body["g-recaptcha-response"];
        if (!captchaResponse)
            return res.status(400).json({ error: "Captcha no completado" });
        const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${captchaResponse}`;
        const { data } = await axios_1.default.post(verifyURL);
        if (!data.success)
            return res.status(400).json({ error: "Captcha inválido" });
        const { telefono, cedula, correo, direccion, problema } = req.body;
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
        if (problema.length > 100)
            return res.status(400).json({ error: "Problema demasiado largo" });
        await connection.beginTransaction();
        const id = await (0, repuestosModel_1.crearCotizacionRepuestos)(req.body);
        const numeroFactura = `IMH-${String(id).padStart(6, "0")}`;
        await connection.query("UPDATE cotizaciones SET numero_factura = ? WHERE id = ?", [numeroFactura, id]);
        const [[departamento]] = await connection.query("SELECT nombre FROM departamentos WHERE id = ?", [req.body.departamento_id]);
        const [[municipio]] = await connection.query("SELECT nombre FROM municipios WHERE id = ?", [req.body.municipio_id]);
        const [[modelo]] = await connection.query("SELECT nombre FROM modelos WHERE id = ?", [req.body.modelo_id]);
        // Correo adaptado
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
        const mensajeHTML = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color:#2c3e50;">Su solicitud fue registrada correctamente!</h2>
        <h3>Detalles de la solicitud:</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Número de Factura</td><td>${numeroFactura}</td></tr>
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Nombre</td><td>${req.body.nombre}</td></tr>
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Cédula</td><td>${req.body.cedula}</td></tr>
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Teléfono</td><td>${req.body.telefono}</td></tr>
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Correo</td><td>${req.body.correo}</td></tr>
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Departamento</td><td>${departamento?.nombre}</td></tr>
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Municipio</td><td>${municipio?.nombre}</td></tr>
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Dirección</td><td>${req.body.direccion}</td></tr>
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Modelo</td><td>${modelo?.nombre}</td></tr>
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Problema/Pieza</td><td>${req.body.problema}</td></tr>
        </table>
      </div>`;
        await transporter.sendMail({ from: process.env.EMAIL_USER, to: req.body.correo, subject: "Solicitud de Repuestos/Taller - IMHORSA", html: mensajeHTML });
        await transporter.sendMail({ from: process.env.EMAIL_USER, to: "sansgodoyvallecillo123@gmail.com", subject: "Nueva Solicitud de Repuestos/Taller - IMHORSA", html: mensajeHTML });
        await connection.commit();
        res.status(201).json({ message: "Solicitud enviada con éxito", id, numeroFactura });
    }
    catch (error) {
        await connection.rollback();
        res.status(500).json({ error: "No se pudo completar la solicitud: " + error.message });
    }
    finally {
        connection.release();
    }
}
//# sourceMappingURL=repuestosController.js.map