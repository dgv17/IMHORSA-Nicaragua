import { Router } from "express";
import { departamentos, municipios, modelos} from "../controllers/catalogoController";

const router = Router();

router.get("/departamentos", departamentos);
router.get("/municipios/:departamentoId", municipios);
router.get("/modelos", modelos);
export default router;
