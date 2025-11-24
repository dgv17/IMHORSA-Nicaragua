import { Router } from "express";
import path from "path";
import { login, logout } from "../controllers/adminController";
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

export default router;
