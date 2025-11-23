"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearCotizacionAccesorio = crearCotizacionAccesorio;
const db_1 = require("./db");
const validaciones_1 = require("../utils/validaciones");
async function crearCotizacionAccesorio(data) {
    const municipioId = Number(data.municipio_id);
    const [existe] = await db_1.pool.query("SELECT id FROM cliente_natural WHERE cedula = ?", [data.cedula]);
    let clienteId;
    if (existe.length > 0) {
        const clienteNaturalId = existe[0].id;
        const [clienteRow] = await db_1.pool.query("SELECT id FROM clientes WHERE natural_id = ?", [clienteNaturalId]);
        if (clienteRow.length > 0) {
            clienteId = clienteRow[0].id;
        }
        else {
            const [clienteResult] = await db_1.pool.query("INSERT INTO clientes (tipo, natural_id) VALUES ('natural', ?)", [clienteNaturalId]);
            clienteId = clienteResult.insertId;
        }
    }
    else {
        const [dirResult] = await db_1.pool.query("INSERT INTO direcciones (municipio_id, direccion) VALUES (?, ?)", [municipioId, data.direccion]);
        const direccionId = dirResult.insertId;
        const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } = (0, validaciones_1.dividirNombreCompleto)(data.nombre);
        const telefonoSinGuion = data.telefono.replace("-", "");
        const [cliResult] = await db_1.pool.query(`INSERT INTO cliente_natural 
       (direccion_id, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, cedula, telefono, correo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [direccionId, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, data.cedula, telefonoSinGuion, data.correo]);
        const clienteNaturalId = cliResult.insertId;
        const [clienteResult] = await db_1.pool.query("INSERT INTO clientes (tipo, natural_id) VALUES ('natural', ?)", [clienteNaturalId]);
        clienteId = clienteResult.insertId;
    }
    const [cotResult] = await db_1.pool.query("INSERT INTO cotizaciones (cliente_id, tipo, estado) VALUES (?, 'accesorio', 'En proceso')", [clienteId]);
    const cotizacionId = cotResult.insertId;
    await db_1.pool.query("INSERT INTO cotizacion_accesorio (cotizacion_id, accesorio_id, cantidad) VALUES (?, ?, ?)", [cotizacionId, data.accesorio_id, data.cantidad]);
    return cotizacionId;
}
//# sourceMappingURL=accesoriosModel.js.map