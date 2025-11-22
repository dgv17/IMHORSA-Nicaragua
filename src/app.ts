import express from "express";
import cors from "cors";
import vehiculosRoutes from "./routes/vehiculos";
import catalogoRoutes from "./routes/catalogo";
import cotizacionRoutes from "./routes/cotizacion";
import eventoRoutes from "./routes/evento";
import repuestosRoutes from "./routes/repuestos";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/api/vehiculos", vehiculosRoutes);
app.use("/api/catalogo", catalogoRoutes);
app.use("/api", cotizacionRoutes);
app.use("/api", eventoRoutes);
app.use("/api", repuestosRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
