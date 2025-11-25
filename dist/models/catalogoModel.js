"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartamentos = getDepartamentos;
exports.getMunicipios = getMunicipios;
exports.getModelos = getModelos;
const db_1 = __importDefault(require("./db"));
async function getDepartamentos() {
    const [rows] = await db_1.default.query("SELECT id, nombre FROM departamentos");
    return rows;
}
async function getMunicipios(departamentoId) {
    const [rows] = await db_1.default.query("SELECT id, nombre FROM municipios WHERE departamento_id = ?", [departamentoId]);
    return rows;
}
async function getModelos() {
    const [rows] = await db_1.default.query(`
    SELECT m.id, m.nombre, v.precio, s.nombre AS serie
    FROM modelos m
    JOIN vehiculos v ON v.modelo_id = m.id
    JOIN series s ON m.serie_id = s.id
    WHERE v.stock = 1;
  `);
    return rows;
}
//# sourceMappingURL=catalogoModel.js.map