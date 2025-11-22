"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cotizacionController_1 = require("../controllers/cotizacionController");
const router = (0, express_1.Router)();
router.post("/cotizacion/vehiculo", cotizacionController_1.postCotizacionVehiculo);
exports.default = router;
//# sourceMappingURL=cotizacion.js.map