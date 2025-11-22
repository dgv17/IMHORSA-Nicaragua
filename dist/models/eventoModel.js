"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearCotizacionEvento = crearCotizacionEvento;
const db_1 = require("./db");
async function crearCotizacionEvento(data) {
    const municipioId = Number(data.municipio_id);
    // Buscar cliente jurídico por nombre
    const [existe] = await db_1.pool.query("SELECT id FROM cliente_juridico WHERE nombre = ?", [data.nombre]);
    let clienteId;
    if (existe.length > 0) {
        const juridicoId = existe[0].id;
        const [clienteRow] = await db_1.pool.query("SELECT id FROM clientes WHERE juridico_id = ?", [juridicoId]);
        if (clienteRow.length > 0) {
            clienteId = clienteRow[0].id;
        }
        else {
            const [clienteResult] = await db_1.pool.query("INSERT INTO clientes (tipo, juridico_id) VALUES ('juridico', ?)", [juridicoId]);
            clienteId = clienteResult.insertId;
        }
    }
    else {
        const [dirResult] = await db_1.pool.query("INSERT INTO direcciones (municipio_id, direccion) VALUES (?, ?)", [municipioId, data.direccion]);
        const direccionId = dirResult.insertId;
        const [jurResult] = await db_1.pool.query("INSERT INTO cliente_juridico (direccion_id, nombre, correo) VALUES (?, ?, ?)", [direccionId, data.nombre, data.correo]);
        const juridicoId = jurResult.insertId;
        const [clienteResult] = await db_1.pool.query("INSERT INTO clientes (tipo, juridico_id) VALUES ('juridico', ?)", [juridicoId]);
        clienteId = clienteResult.insertId;
    }
    const [cotResult] = await db_1.pool.query("INSERT INTO cotizaciones (cliente_id, tipo, estado) VALUES (?, 'renta_evento', 'En proceso')", [clienteId]);
    const cotizacionId = cotResult.insertId;
    await db_1.pool.query("INSERT INTO renta_eventos (cotizacion_id, fecha_inicio, fecha_fin, cantidad) VALUES (?, ?, ?, ?)", [cotizacionId, data.fecha_inicio, data.fecha_fin, data.cantidad]);
    return cotizacionId;
}
//# sourceMappingURL=eventoModel.js.map