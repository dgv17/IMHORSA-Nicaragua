import { Router } from "express";
import { postCotizacionVehiculo } from "../controllers/cotizacionController";

const router = Router();
router.post("/cotizacion/vehiculo", postCotizacionVehiculo);
export default router;
