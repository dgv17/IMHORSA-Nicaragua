"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departamentos = departamentos;
exports.municipios = municipios;
exports.modelos = modelos;
const catalogoModel_1 = require("../models/catalogoModel");
async function departamentos(req, res) {
    res.json(await (0, catalogoModel_1.getDepartamentos)());
}
async function municipios(req, res) {
    const { departamentoId } = req.params;
    res.json(await (0, catalogoModel_1.getMunicipios)(Number(departamentoId)));
}
async function modelos(req, res) {
    res.json(await (0, catalogoModel_1.getModelos)());
}
//# sourceMappingURL=catalogoController.js.map