"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccesorios = void 0;
const db_1 = require("../models/db");
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
//# sourceMappingURL=accesoriosController.js.map