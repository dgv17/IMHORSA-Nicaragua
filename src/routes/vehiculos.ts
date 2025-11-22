import express from "express";
import { getVehiculos } from "../controllers/vehiculosController";

const router = express.Router();

router.get("/", getVehiculos);

export default router;

