"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accesoriosController_1 = require("../controllers/accesoriosController");
const router = (0, express_1.Router)();
router.get("/", accesoriosController_1.getAccesorios);
router.post("/cotizacion", accesoriosController_1.postCotizacionAccesorio);
exports.default = router;
//# sourceMappingURL=accesorios.js.map