import { Router } from "express";
import path from "path";
import { login, logout, restoreRequest, restoreForm, restorePassword } from "../controllers/adminController";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();
// Login
router.get("/adlog1n", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "admin", "logadm.html"));
});
router.post("/login", login);
// Dashboard protegido (todos los roles autenticados)
router.get("/admondashb0ard", requireAuth, (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "admin", "adashboard.html"));
});
// Ejemplo: sección Usuarios (solo admin)
router.get("/usuarios", requireAdmin, (req, res) => {
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
export default router;
