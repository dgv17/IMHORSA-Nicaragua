"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventoController_1 = require("../controllers/eventoController");
const router = (0, express_1.Router)();
router.post("/cotizacion/evento", eventoController_1.postCotizacionEvento);
exports.default = router;
//# sourceMappingURL=evento.js.map