"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Login
router.get("/adlog1n", (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), "public", "admin", "logadm.html"));
});
router.post("/login", adminController_1.login);
// Dashboard protegido
router.get("/admondashb0ard", auth_1.requireAuth, (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), "public", "admin", "adashboard.html"));
});
// Logout
router.get("/logout", adminController_1.logout);
exports.default = router;
//# sourceMappingURL=admin.js.map