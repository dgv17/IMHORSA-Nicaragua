import { Router } from "express";
import { getAccesorios } from "../controllers/accesoriosController";

const router = Router();

router.get("/", getAccesorios);

export default router;
