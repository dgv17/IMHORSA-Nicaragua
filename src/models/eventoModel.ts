import { pool } from "./db";
import type { ResultSetHeader } from "mysql2";

export async function crearCotizacionEvento(data: any) {
  const municipioId = Number(data.municipio_id);

  // Buscar cliente jurídico por nombre
  const [existe] = await pool.query(
    "SELECT id FROM cliente_juridico WHERE nombre = ?",
    [data.nombre]
  ) as [Array<{ id: number }>, any];

  let clienteId: number;

  if (existe.length > 0) {
    const juridicoId = existe[0].id;

    const [clienteRow] = await pool.query(
      "SELECT id FROM clientes WHERE juridico_id = ?",
      [juridicoId]
    ) as [Array<{ id: number }>, any];

    if (clienteRow.length > 0) {
      clienteId = clienteRow[0].id;
    } else {
      const [clienteResult] = await pool.query(
        "INSERT INTO clientes (tipo, juridico_id) VALUES ('juridico', ?)",
        [juridicoId]
      ) as [ResultSetHeader, any];
      clienteId = clienteResult.insertId;
    }
  } else {
    const [dirResult] = await pool.query(
      "INSERT INTO direcciones (municipio_id, direccion) VALUES (?, ?)",
      [municipioId, data.direccion]
    ) as [ResultSetHeader, any];
    const direccionId = dirResult.insertId;

    const [jurResult] = await pool.query(
      "INSERT INTO cliente_juridico (direccion_id, nombre, correo) VALUES (?, ?, ?)",
      [direccionId, data.nombre, data.correo]
    ) as [ResultSetHeader, any];
    const juridicoId = jurResult.insertId;

    const [clienteResult] = await pool.query(
      "INSERT INTO clientes (tipo, juridico_id) VALUES ('juridico', ?)",
      [juridicoId]
    ) as [ResultSetHeader, any];
    clienteId = clienteResult.insertId;
  }

  const [cotResult] = await pool.query(
    "INSERT INTO cotizaciones (cliente_id, tipo, estado) VALUES (?, 'renta_evento', 'En proceso')",
    [clienteId]
  ) as [ResultSetHeader, any];
  const cotizacionId = cotResult.insertId;

  await pool.query(
    "INSERT INTO renta_eventos (cotizacion_id, fecha_inicio, fecha_fin, cantidad) VALUES (?, ?, ?, ?)",
    [cotizacionId, data.fecha_inicio, data.fecha_fin, data.cantidad]
  );

  return cotizacionId;
}
