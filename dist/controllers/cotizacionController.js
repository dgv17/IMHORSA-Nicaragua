"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCotizacionVehiculo = postCotizacionVehiculo;
const db_1 = require("../models/db");
const cotizacionModel_1 = require("../models/cotizacionModel");
const nodemailer_1 = __importDefault(require("nodemailer"));
const validaciones_1 = require("../utils/validaciones");
const axios_1 = __importDefault(require("axios"));
async function postCotizacionVehiculo(req, res) {
    const connection = await db_1.pool.getConnection();
    try {
        const captchaResponse = req.body["g-recaptcha-response"];
        if (!captchaResponse) {
            return res.status(400).json({ error: "Captcha no completado" });
        }
        const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${captchaResponse}`;
        const { data } = await axios_1.default.post(verifyURL);
        if (!data.success) {
            return res.status(400).json({ error: "Captcha inválido" });
        }
        const { telefono, cedula, correo, direccion } = req.body;
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
        await connection.beginTransaction();
        const id = await (0, cotizacionModel_1.crearCotizacionVehiculo)(req.body);
        const numeroFactura = `IMH-${String(id).padStart(6, "0")}`;
        await connection.query("UPDATE cotizaciones SET numero_factura = ? WHERE id = ?", [numeroFactura, id]);
        const [[departamento]] = await connection.query("SELECT nombre FROM departamentos WHERE id = ?", [req.body.departamento_id]);
        const [[municipio]] = await connection.query("SELECT nombre FROM municipios WHERE id = ?", [req.body.municipio_id]);
        const [[modelo]] = await connection.query(` 
        SELECT mo.nombre AS modelo, s.nombre AS serie
        FROM modelos mo
        JOIN series s ON mo.serie_id = s.id
        WHERE mo.id = ?`, [req.body.modelo_id]);
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mensajeHTML = `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color:#2c3e50;">Su cotización fue registrada correctamente!</h2>
        <p>Nos comunicaremos con usted dentro de poco.</p>
        <h3 style="color:#2c3e50;">Detalles de la cotización:</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Número de Factura</td><td style="border:1px solid #ccc; padding:8px;">${numeroFactura}</td></tr>
        <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Nombre</td><td style="border:1px solid #ccc; padding:8px;">${req.body.nombre}</td></tr>
        <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Cédula</td><td style="border:1px solid #ccc; padding:8px;">${req.body.cedula}</td></tr>
        <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Teléfono</td><td style="border:1px solid #ccc; padding:8px;">${req.body.telefono}</td></tr>
        <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Correo</td><td style="border:1px solid #ccc; padding:8px;">${req.body.correo}</td></tr>
        <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Departamento</td><td style="border:1px solid #ccc; padding:8px;">${departamento?.nombre}</td></tr>
        <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Municipio</td><td style="border:1px solid #ccc; padding:8px;">${municipio?.nombre}</td></tr>
        <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Dirección</td><td style="border:1px solid #ccc; padding:8px;">${req.body.direccion}</td></tr>
        <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Modelo</td><td style="border:1px solid #ccc; padding:8px;">${modelo?.serie} ${modelo?.modelo}</td></tr>
        <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Precio Base</td><td style="border:1px solid #ccc; padding:8px;">${req.body.precio_base}</td></tr>
        <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Total Neto</td><td style="border:1px solid #ccc; padding:8px;">${req.body.total_neto}</td></tr>
        </table>
        <p style="margin-top:20px; font-size:14px; color:#555;">
        Gracias por preferirnos<br/>
        <strong>IMHORSA NICARAGUA</strong>
        </p>
      </div>`;
        // Enviar correos
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: req.body.correo,
            subject: "Comprobante de Cotización - IMHORSA",
            html: mensajeHTML,
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "sansgodoyvallecillo123@gmail.com",
            subject: "Nueva Cotización Registrada - IMHORSA",
            html: mensajeHTML,
        });
        await connection.commit();
        res.status(201).json({
            message: "Cotización enviada con éxito",
            id,
            numeroFactura,
        });
    }
    catch (error) {
        await connection.rollback();
        res
            .status(500)
            .json({ error: "No se pudo completar la cotización: " + error.message });
    }
    finally {
        connection.release();
    }
}
//# sourceMappingURL=cotizacionController.js.map