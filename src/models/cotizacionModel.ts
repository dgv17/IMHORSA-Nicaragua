import { pool } from "./db";
import { dividirNombreCompleto } from "../utils/validaciones";

export async function crearCotizacionVehiculo(data: any) {
  const municipioId = Number(data.municipio_id);

  // 1. Buscar cliente natural por cédula
  const [existe]: any = await pool.query(
    "SELECT id FROM cliente_natural WHERE cedula = ?",
    [data.cedula]
  );

  let clienteId: number;

  if (existe.length > 0) {
    const clienteNaturalId = existe[0].id;
    const [clienteRow]: any = await pool.query(
      "SELECT id FROM clientes WHERE natural_id = ?",
      [clienteNaturalId]
    );
    if (clienteRow.length > 0) {
      clienteId = clienteRow[0].id;
    } else {
      const [clienteResult]: any = await pool.query(
        "INSERT INTO clientes (tipo, natural_id) VALUES ('natural', ?)",
        [clienteNaturalId]
      );
      clienteId = clienteResult.insertId;
    }
  } else {
    const [dirResult]: any = await pool.query(
      "INSERT INTO direcciones (municipio_id, direccion) VALUES (?, ?)",
      [municipioId, data.direccion]
    );
    const direccionId = dirResult.insertId;
    const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } =
      dividirNombreCompleto(data.nombre);
    const telefonoSinGuion = data.telefono.replace("-", "");
    const [cliResult]: any = await pool.query(
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
    );
    const clienteNaturalId = cliResult.insertId;
    const [clienteResult]: any = await pool.query(
      "INSERT INTO clientes (tipo, natural_id) VALUES ('natural', ?)",
      [clienteNaturalId]
    );
    clienteId = clienteResult.insertId;
  }
  const [cotResult]: any = await pool.query(
    "INSERT INTO cotizaciones (cliente_id, tipo, estado) VALUES (?, 'vehiculo', 'En proceso')",
    [clienteId]
  );
  const cotizacionId = cotResult.insertId;
  await pool.query(
    "INSERT INTO cotizacion_vehiculo (cotizacion_id, vehiculo_id) VALUES (?, ?)",
    [cotizacionId, data.modelo_id]
  );

  return cotizacionId;
}
export async function crearCotizacionAccesorio(data: any): Promise<number> {
  const connection = await pool.getConnection();
  try {
    const [cotizacionResult]: any = await connection.query(
      "INSERT INTO cotizaciones (tipo, nombre, cedula, correo, telefono, direccion, departamento_id, municipio_id, total_neto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        "accesorio",
        data.nombre,
        data.cedula,
        data.correo,
        data.telefono,
        data.direccion,
        data.departamento_id,
        data.municipio_id,
        data.total_neto,
      ]
    );
    const cotizacionId = cotizacionResult.insertId;
    await connection.query(
      "INSERT INTO cotizacion_accesorio (cotizacion_id, accesorio_id, cantidad, precio_unitario, total) VALUES (?, ?, ?, ?, ?)",
      [
        cotizacionId,
        data.accesorio_id,
        data.cantidad,
        data.precio_base,
        data.total_neto,
      ]
    );
    return cotizacionId;
  } finally {
    connection.release();
  }
}