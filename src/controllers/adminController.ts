import { Request, Response } from "express";
import { pool } from "../models/db";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { encryptLuciferBlocks, decryptLuciferBlocks } from "../utils/lucifer";
import nodemailer from "nodemailer";
import path from "path";
import { validarCorreo } from "../utils/validaciones";


export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  try {
    const [rows]: any = await pool.query(
      "SELECT id, username, password_user, rol_id FROM usuarios WHERE username = ?",
      [username]
    );
    if (rows.length === 0) {
      return res.status(401).send("Usuario no encontrado");
    }
    const user = rows[0];
    const bcryptHash = decryptLuciferBlocks(
      user.password_user,
      process.env.LUCIFER_KEY!
    );
    const match = await bcrypt.compare(password, bcryptHash);
    if (!match) {
      return res.status(401).send("Contraseña incorrecta");
    }
    req.session.user = {
      id: user.id,
      username: user.username,
      rol: user.rol_id,
    };
    return res.redirect("/admin/admondashb0ard");
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).send("Error interno del servidor");
  }
}

export function logout(req: Request, res: Response) {
  req.session.destroy(() => {
    res.redirect("/admin/adlog1n");
  });
}

export async function restoreRequest(req: Request, res: Response) {
  const { correores } = req.body;
  try {
    const [rows]: any = await pool.query(
      "SELECT id, correo FROM usuarios WHERE correo = ?",
      [correores]
    );
    if (rows.length === 0) {
      return res.status(404).send("No existe usuario con ese correo");
    }
    const user = rows[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min
    await pool.query(
      "INSERT INTO restore_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, token, expires]
    );
    // Configurar transporte de correo
    const transporter = nodemailer.createTransport({
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
  } catch (error) {
    console.error("Error en restoreRequest:", error);
    return res.status(500).send("Error interno del servidor");
  }
}
export async function restoreForm(req: Request, res: Response) {
  const { token } = req.params;
  try {
    const [rows]: any = await pool.query(
      "SELECT user_id FROM restore_tokens WHERE token = ? AND expires_at > NOW()",
      [token]
    );
    if (rows.length === 0) {
      return res.status(403).send("Link inválido o expirado");
    }
    return res.sendFile(
      path.join(process.cwd(), "public", "admin", "restorepass.html")
    );
  } catch (error) {
    console.error("Error en restoreForm:", error);
    return res.status(500).send("Error interno del servidor");
  }
}
export async function restorePassword(req: Request, res: Response) {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const [rows]: any = await pool.query(
      "SELECT user_id FROM restore_tokens WHERE token = ? AND expires_at > NOW()",
      [token]
    );
    if (rows.length === 0) {
      return res.status(403).send("Link inválido o expirado");
    }
    const userId = rows[0].user_id;
    const bcryptHash = await bcrypt.hash(newPassword, 12);
    const luciferCipher = encryptLuciferBlocks(
      bcryptHash,
      process.env.LUCIFER_KEY!
    );
    await pool.query("UPDATE usuarios SET password_user = ? WHERE id = ?", [
      luciferCipher,
      userId,
    ]);
    await pool.query("DELETE FROM restore_tokens WHERE token = ?", [token]);
    return res.redirect("/admin/adlog1n");
  } catch (error) {
    console.error("Error en restorePassword:", error);
    return res.status(500).send("Error interno del servidor");
  }
}
// Obtener lista de usuarios
export async function getUsuarios(req: Request, res: Response) {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.username, u.nombre, u.correo, r.nombre AS rol
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      ORDER BY u.id ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
// Obtener lista de roles
export async function getRoles(req: Request, res: Response) {
  try {
    const [rows] = await pool.query("SELECT id, nombre FROM roles ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener roles:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function createUsuario(req: Request, res: Response) {
  const { username, password_user, nombre, correo, rol_id } = req.body;
  const errores: string[] = [];

  if (!username || username.trim().length < 3 || username.trim().length > 25)
    errores.push("El username debe tener entre 3 y 25 caracteres");
  if (!password_user || password_user.length < 6)
    errores.push("La contraseña debe tener al menos 6 caracteres");
  if (!nombre || nombre.trim().length < 3 || nombre.trim().length > 25)
    errores.push("El nombre debe tener entre 3 y 25 caracteres");
  const correoError = validarCorreo(correo);
  if (correoError) errores.push(correoError);
  if (!rol_id) errores.push("Debe seleccionar un rol");
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }
  try {
    const bcryptHash = await bcrypt.hash(password_user, 12);
    const luciferCipher = encryptLuciferBlocks(bcryptHash, process.env.LUCIFER_KEY!);
    const [result]: any = await pool.query(
      "INSERT INTO usuarios (username, password_user, nombre, correo, rol_id) VALUES (?, ?, ?, ?, ?)",
      [username.trim(), luciferCipher, nombre.trim(), correo.trim(), rol_id]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err: any) {
    console.error("Error al crear usuario:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ errores: ["El username o correo ya están registrados"] });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateUsuario(req: Request, res: Response) {
  const { id } = req.params;
  const { username, nombre, correo, rol_id } = req.body;
  const errores: string[] = [];

  if (!username || username.trim().length < 3 || username.trim().length > 25)
    errores.push("El username debe tener entre 3 y 25 caracteres");
  if (!nombre || nombre.trim().length < 3 || nombre.trim().length > 25)
    errores.push("El nombre debe tener entre 3 y 25 caracteres");
  const correoError = validarCorreo(correo);
  if (correoError) errores.push(correoError);
  if (!rol_id) errores.push("Debe seleccionar un rol");
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }
  try {
    await pool.query(
      "UPDATE usuarios SET username = ?, nombre = ?, correo = ?, rol_id = ? WHERE id = ?",
      [username.trim(), nombre.trim(), correo.trim(), rol_id, id]
    );
    res.json({ success: true });
  } catch (err: any) {
    console.error("Error al actualizar usuario:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ errores: ["El username o correo ya están registrados"] });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function forcePasswordChange(req: Request, res: Response) {
  const { username, newPassword } = req.body;
  const errores: string[] = [];
  if (!username || username.trim().length < 3 || username.trim().length > 25)
    errores.push("El username debe tener entre 3 y 25 caracteres");
  if (!newPassword || newPassword.length < 6)
    errores.push("La nueva contraseña debe tener al menos 6 caracteres");
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }
  try {
    const [rows]: any = await pool.query(
      "SELECT id FROM usuarios WHERE username = ?",
      [username.trim()]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const userId = rows[0].id;
    const bcryptHash = await bcrypt.hash(newPassword, 12);
    const luciferCipher = encryptLuciferBlocks(bcryptHash, process.env.LUCIFER_KEY!);
    await pool.query("UPDATE usuarios SET password_user = ? WHERE id = ?", [
      luciferCipher,
      userId,
    ]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error al forzar cambio de contraseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

