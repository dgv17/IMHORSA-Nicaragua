import { Router } from "express";
import path from "path";
import {
  login,
  logout,
  restoreRequest,
  restoreForm,
  restorePassword,
  getUsuarios,
  getRoles,
  createUsuario,
  updateUsuario,
  forcePasswordChange,
  getClientesNaturales,
  getClientesJuridicos,
  updateClienteNatural, 
  updateClienteJuridico,
  getVehiculos,
  updateVehiculoStock,
  getSolicitudesVehiculos,
  updateCotizacionVehiculo,
  enviarCorreoCotizacionVehiculo
} from "../controllers/adminController";
import { requireAuth, requireAdmin, requireAdminOrGerenteGeneral } from "../middleware/auth";

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
  res.sendFile(
    path.join(process.cwd(), "public", "admin", "correorestore.html")
  );
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
router.put("/usuarios/:id", requireAdmin, updateUsuario);
router.put("/force-password", requireAdmin, forcePasswordChange);
router.get("/clientes/naturales", requireAuth, getClientesNaturales);
router.get("/clientes/juridicos", requireAuth, getClientesJuridicos);
router.put("/clientes/naturales/:id", requireAdminOrGerenteGeneral, updateClienteNatural);
router.put("/clientes/juridicos/:id", requireAdminOrGerenteGeneral, updateClienteJuridico);
router.get("/vehiculos", requireAuth, getVehiculos);
router.put("/vehiculos/:id", requireAdminOrGerenteGeneral, updateVehiculoStock);
router.get("/solicitudes/vehiculos", requireAuth, getSolicitudesVehiculos);
router.put("/solicitudes/vehiculos/:id", requireAdminOrGerenteGeneral, updateCotizacionVehiculo);
router.post("/solicitudes/vehiculos/:id/correo", requireAdminOrGerenteGeneral, enviarCorreoCotizacionVehiculo);

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
      return res.status(500).json({ error: "Error al cerrar sesión" });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});
export default router;
