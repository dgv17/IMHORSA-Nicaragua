import { Request, Response } from "express";
import { pool } from "../models/db";
import { crearCotizacionEvento } from "../models/eventoModel";
import nodemailer from "nodemailer";
import axios from "axios";

export async function postCotizacionEvento(req: Request, res: Response) {
  const connection = await pool.getConnection();
  try {
    const captchaResponse = req.body["g-recaptcha-response"];
    if (!captchaResponse) return res.status(400).json({ error: "Captcha no completado" });

    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${captchaResponse}`;
    const { data } = await axios.post(verifyURL);
    if (!data.success) return res.status(400).json({ error: "Captcha inválido" });

    const { nombre, correo, direccion } = req.body;
    if (nombre.length > 20) return res.status(400).json({ error: "Nombre de organización demasiado largo" });
    if (correo.length > 50) return res.status(400).json({ error: "Correo demasiado largo" });
    if (direccion.length > 100) return res.status(400).json({ error: "Dirección demasiado larga" });

    await connection.beginTransaction();
    const id = await crearCotizacionEvento(req.body);

    const numeroFactura = `IMH-${String(id).padStart(6, "0")}`;
    await connection.query("UPDATE cotizaciones SET numero_factura = ? WHERE id = ?", [numeroFactura, id]);

    // Obtener nombres de ubicación
    const [[departamento]]: any = await connection.query("SELECT nombre FROM departamentos WHERE id = ?", [req.body.departamento_id]);
    const [[municipio]]: any = await connection.query("SELECT nombre FROM municipios WHERE id = ?", [req.body.municipio_id]);

    // Configurar correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mensajeHTML = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color:#2c3e50;">Su cotización de evento fue registrada correctamente!</h2>
        <h3>Detalles:</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Número de Factura</td><td>${numeroFactura}</td></tr>
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Organización</td><td>${req.body.nombre}</td></tr>
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Correo</td><td>${req.body.correo}</td></tr>
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Departamento</td><td>${departamento?.nombre}</td></tr>
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Municipio</td><td>${municipio?.nombre}</td></tr>
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Dirección</td><td>${req.body.direccion}</td></tr>
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Fecha Inicio</td><td>${req.body.fecha_inicio}</td></tr>
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Fecha Fin</td><td>${req.body.fecha_fin}</td></tr>
          <tr><td style="border:1px solid #ccc; padding:8px; font-weight:bold;">Cantidad Solicitada</td><td>${req.body.cantidad}</td></tr>
        </table>
      </div>`;

    await transporter.sendMail({ from: process.env.EMAIL_USER, to: req.body.correo, subject: "Cotización de Evento - IMHORSA", html: mensajeHTML });
    await transporter.sendMail({ from: process.env.EMAIL_USER, to: "sansgodoyvallecillo123@gmail.com", subject: "Nueva Cotización de Evento - IMHORSA", html: mensajeHTML });

    await connection.commit();
    res.status(201).json({ message: "Cotización de evento enviada con éxito", id, numeroFactura });
  } catch (error: any) {
    await connection.rollback();
    res.status(500).json({ error: "No se pudo completar la cotización: " + error.message });
  } finally {
    connection.release();
  }
}