import express from "express";
import cors from "cors";
import session from "express-session";
import csrf from "csurf";
import vehiculosRoutes from "./routes/vehiculos";
import catalogoRoutes from "./routes/catalogo";
import cotizacionRoutes from "./routes/cotizacion";
import eventoRoutes from "./routes/evento";
import repuestosRoutes from "./routes/repuestos";
import accesoriosRoutes from "./routes/accesorios";
import adminRoutes from "./routes/admin";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || "supersecreto",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true,
    sameSite: "strict",   // evita CSRF básico
    secure: false         // en producción pon true si usas HTTPS
  }
}));
const csrfProtection = csrf({ cookie: false });
app.use(csrfProtection);
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
app.use("/api/vehiculos", vehiculosRoutes);
app.use("/api/catalogo", catalogoRoutes);
app.use("/api", cotizacionRoutes);
app.use("/api", eventoRoutes);
app.use("/api", repuestosRoutes);
app.use("/api/accesorios", accesoriosRoutes);
app.use("/admin", adminRoutes);
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).send("Solicitud inválida o expirada (CSRF detectado)");
  }
  next(err);
});
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
