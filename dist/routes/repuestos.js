"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const repuestosController_1 = require("../controllers/repuestosController");
const router = (0, express_1.Router)();
router.post("/cotizacion/repuestos", repuestosController_1.postCotizacionRepuestos);
exports.default = router;
//# sourceMappingURL=repuestos.js.map