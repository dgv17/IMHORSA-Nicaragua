import { pool } from "./db";
import { dividirNombreCompleto } from "../utils/validaciones";
import type { ResultSetHeader } from "mysql2";

export async function crearCotizacionRepuestos(data: any) {
  const municipioId = Number(data.municipio_id);
  const [existe] = await pool.query(
    "SELECT id FROM cliente_natural WHERE cedula = ?",
    [data.cedula]
  ) as [Array<{ id: number }>, any];
  let clienteId: number;
  if (existe.length > 0) {
    const clienteNaturalId = existe[0].id;
    const [clienteRow] = await pool.query(
      "SELECT id FROM clientes WHERE natural_id = ?",
      [clienteNaturalId]
    ) as [Array<{ id: number }>, any];
    if (clienteRow.length > 0) {
      clienteId = clienteRow[0].id;
    } else {
      const [clienteResult] = await pool.query(
        "INSERT INTO clientes (tipo, natural_id) VALUES ('natural', ?)",
        [clienteNaturalId]
      ) as [ResultSetHeader, any];
      clienteId = clienteResult.insertId;
    }
  } else {
    const [dirResult] = await pool.query(
      "INSERT INTO direcciones (municipio_id, direccion) VALUES (?, ?)",
      [municipioId, data.direccion]
    ) as [ResultSetHeader, any];
    const direccionId = dirResult.insertId;
    const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } =
      dividirNombreCompleto(data.nombre);
    const telefonoSinGuion = data.telefono.replace("-", "");
    const [cliResult] = await pool.query(
      `INSERT INTO cliente_natural 
       (direccion_id, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, cedula, telefono, correo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        direccionId,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        data.cedula,
        telefonoSinGuion,
        data.correo,
      ]
    ) as [ResultSetHeader, any];
    const clienteNaturalId = cliResult.insertId;
    const [clienteResult] = await pool.query(
      "INSERT INTO clientes (tipo, natural_id) VALUES ('natural', ?)",
      [clienteNaturalId]
    ) as [ResultSetHeader, any];
    clienteId = clienteResult.insertId;
  }
  const [cotResult] = await pool.query(
    "INSERT INTO cotizaciones (cliente_id, tipo, estado) VALUES (?, 'mantenimiento', 'En proceso')",
    [clienteId]
  ) as [ResultSetHeader, any];
  const cotizacionId = cotResult.insertId;
  await pool.query(
    "INSERT INTO solicitud_mantenimiento (cotizacion_id, modelo_id, problema) VALUES (?, ?, ?)",
    [cotizacionId, data.modelo_id, data.problema]
  );
  return cotizacionId;
}