import { Router } from "express";
import { postCotizacionEvento } from "../controllers/eventoController";

const router = Router();
router.post("/cotizacion/evento", postCotizacionEvento);
export default router;
