import { Request, Response } from "express";
import { pool } from "../models/db";

export const getAccesorios = async (req: Request, res: Response) => {
  const serie = req.query.serie as string | undefined;
  try {
    const [rows] = await pool.query(
      `
      SELECT a.id, a.nombre, a.precio, a.descripcion, s.nombre AS serie, a.stock
      FROM accesorios a
      JOIN series s ON a.series_id = s.id
      WHERE (? IS NULL OR s.nombre = ?)
      ORDER BY s.nombre, a.nombre
      `,
      [serie || null, serie || null]
    );
    const accesorios = (rows as any[]).map(a => ({
      ...a,
      precio: Number(a.precio),
      stock: Number(a.stock),
    }));
    res.json(accesorios);
  } catch (error) {
    console.error("Error al obtener accesorios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
