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
// Vista Usuarios (solo admin)
router.get("/usuarios/vista", auth_1.requireAdmin, (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), "public", "admin", "usuarios.html"));
});
// Logout
router.get("/logout", adminController_1.logout);
// Restore
router.get("/restore-request", (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), "public", "admin", "correorestore.html"));
});
router.post("/restore-request", adminController_1.restoreRequest);
router.get("/restore/:token", adminController_1.restoreForm);
router.post("/restore/:token", adminController_1.restorePassword);
// Endpoint para rol actual
router.get("/me", auth_1.requireAuth, (req, res) => {
    const user = req.session.user;
    if (!user)
        return res.status(401).json({ authenticated: false });
    res.json({
        authenticated: true,
        username: user.username,
        rol: user.rol,
    });
});
// API Usuarios y Roles
router.get("/usuarios", auth_1.requireAuth, adminController_1.getUsuarios);
router.get("/roles", auth_1.requireAuth, adminController_1.getRoles);
router.post("/usuarios", auth_1.requireAdmin, adminController_1.createUsuario);
router.put("/usuarios/:id", auth_1.requireAdmin, adminController_1.updateUsuario);
router.put("/force-password", auth_1.requireAdmin, adminController_1.forcePasswordChange);
exports.default = router;
//# sourceMappingURL=admin.js.map