import { pool } from "./db";

export async function getDepartamentos() {
  const [rows] = await pool.query("SELECT id, nombre FROM departamentos");
  return rows;
}
export async function getMunicipios(departamentoId: number) {
  const [rows] = await pool.query(
    "SELECT id, nombre FROM municipios WHERE departamento_id = ?",
    [departamentoId]
  );
  return rows;
}
export async function getModelos() {
  const [rows] = await pool.query(`
    SELECT m.id, m.nombre, v.precio, s.nombre AS serie
    FROM modelos m
    JOIN vehiculos v ON v.modelo_id = m.id
    JOIN series s ON m.serie_id = s.id
    WHERE v.stock = 1;
  `);
  return rows;
}
