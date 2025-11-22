import { Request, Response } from "express";
import { pool } from "../models/db";

export const getVehiculos = async (req: Request, res: Response) => {
  const serie = req.query.serie as string | undefined;

  try {
    const [rows] = await pool.query(
      `
      SELECT v.id, m.nombre AS modelo, s.nombre AS serie, v.precio, v.stock
      FROM vehiculos v
      JOIN modelos m ON v.modelo_id = m.id
      JOIN series s ON m.serie_id = s.id
      WHERE (? IS NULL OR s.nombre = ?)
      ORDER BY s.nombre, m.nombre
      `,
      [serie || null, serie || null]
    );
    
    const vehiculos = (rows as any[]).map(v => ({
      ...v,
      precio: Number(v.precio),
      stock: Number(v.stock),
    }));

    res.json(vehiculos);
  } catch (error) {
    console.error("Error al obtener vehículos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

