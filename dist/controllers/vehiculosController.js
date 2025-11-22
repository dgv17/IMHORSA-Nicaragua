"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVehiculos = void 0;
const db_1 = require("../models/db");
const getVehiculos = async (req, res) => {
    const serie = req.query.serie;
    try {
        const [rows] = await db_1.pool.query(`
      SELECT v.id, m.nombre AS modelo, s.nombre AS serie, v.precio, v.stock
      FROM vehiculos v
      JOIN modelos m ON v.modelo_id = m.id
      JOIN series s ON m.serie_id = s.id
      WHERE (? IS NULL OR s.nombre = ?)
      ORDER BY s.nombre, m.nombre
      `, [serie || null, serie || null]);
        const vehiculos = rows.map(v => ({
            ...v,
            precio: Number(v.precio),
            stock: Number(v.stock),
        }));
        res.json(vehiculos);
    }
    catch (error) {
        console.error("Error al obtener vehículos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
exports.getVehiculos = getVehiculos;
//# sourceMappingURL=vehiculosController.js.map