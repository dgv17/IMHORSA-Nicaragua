"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCotizacionVehiculo = postCotizacionVehiculo;
const cotizacionModel_1 = require("../models/cotizacionModel");
const validaciones_1 = require("../utils/validaciones");
async function postCotizacionVehiculo(req, res) {
    try {
        const { telefono, cedula, correo, direccion } = req.body;
        // Validaciones
        const errorTel = (0, validaciones_1.validarTelefono)(telefono);
        if (errorTel)
            return res.status(400).json({ error: errorTel });
        const errorCed = (0, validaciones_1.validarCedula)(cedula);
        if (errorCed)
            return res.status(400).json({ error: errorCed });
        if (correo.length > 50)
            return res.status(400).json({ error: "Correo demasiado largo" });
        if (direccion.length > 100)
            return res.status(400).json({ error: "Dirección demasiado larga" });
        // Crear cotización
        const id = await (0, cotizacionModel_1.crearCotizacionVehiculo)(req.body);
        res.status(201).json({ message: "Cotización creada exitosamente", id });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
//# sourceMappingURL=cotizacionController.js.map