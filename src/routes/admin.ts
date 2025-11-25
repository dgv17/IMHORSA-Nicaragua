import { Router } from "express";
import path from "path";
import { 
  login, logout, restoreRequest, restoreForm, restorePassword,
  getUsuarios, getRoles, createUsuario
} from "../controllers/adminController";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

// Login
router.get("/adlog1n", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "admin", "logadm.html"));
});
router.post("/login", login);

// Dashboard protegido
router.get("/admondashb0ard", requireAuth, (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "admin", "adashboard.html"));
});

// Vista Usuarios (solo admin)
router.get("/usuarios/vista", requireAdmin, (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "admin", "usuarios.html"));
});

// Logout
router.get("/logout", logout);

// Restore
router.get("/restore-request", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "admin", "correorestore.html"));
});
router.post("/restore-request", restoreRequest);
router.get("/restore/:token", restoreForm);
router.post("/restore/:token", restorePassword);

// Endpoint para rol actual
router.get("/me", requireAuth, (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ authenticated: false });
  res.json({
    authenticated: true,
    username: user.username,
    rol: user.rol,
  });
});
// API Usuarios y Roles
router.get("/usuarios", requireAuth, getUsuarios);
router.get("/roles", requireAuth, getRoles);
router.post("/usuarios", requireAdmin, createUsuario);

export default router;