import { Router } from "express";
import { postCotizacionRepuestos } from "../controllers/repuestosController";

const router = Router();
router.post("/cotizacion/repuestos", postCotizacionRepuestos);
export default router;
