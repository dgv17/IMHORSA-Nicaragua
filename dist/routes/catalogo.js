"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catalogoController_1 = require("../controllers/catalogoController");
const router = (0, express_1.Router)();
router.get("/departamentos", catalogoController_1.departamentos);
router.get("/municipios/:departamentoId", catalogoController_1.municipios);
router.get("/modelos", catalogoController_1.modelos);
exports.default = router;
//# sourceMappingURL=catalogo.js.map