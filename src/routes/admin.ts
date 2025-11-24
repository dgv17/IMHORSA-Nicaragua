import { Router } from "express";
import path from "path";
import { login, logout, restoreRequest, restoreForm, restorePassword} from "../controllers/adminController";
import { requireAuth } from "../middleware/auth";

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
// Logout
router.get("/logout", logout);
router.get("/restore-request", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "admin", "correorestore.html"));
});
router.post("/restore-request", restoreRequest);
// Vista de formulario de nueva contraseña
router.get("/restore/:token", restoreForm);
router.post("/restore/:token", restorePassword);

export default router;
