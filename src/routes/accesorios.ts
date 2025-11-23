import { Router } from "express";
import { getAccesorios, postCotizacionAccesorio } from "../controllers/accesoriosController";

const router = Router();

router.get("/", getAccesorios);
router.post("/cotizacion", postCotizacionAccesorio);

export default router;
