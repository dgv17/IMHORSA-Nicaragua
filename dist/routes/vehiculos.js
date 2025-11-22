"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehiculosController_1 = require("../controllers/vehiculosController");
const router = express_1.default.Router();
router.get("/", vehiculosController_1.getVehiculos);
exports.default = router;
//# sourceMappingURL=vehiculos.js.map