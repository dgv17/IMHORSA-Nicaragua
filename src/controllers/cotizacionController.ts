import { Request, Response } from "express";
import { crearCotizacionVehiculo } from "../models/cotizacionModel";
import { validarTelefono, validarCedula } from "../utils/validaciones";

export async function postCotizacionVehiculo(req: Request, res: Response) {
  try {
    const { telefono, cedula, correo, direccion } = req.body;

    // Validaciones
    const errorTel = validarTelefono(telefono);
    if (errorTel) return res.status(400).json({ error: errorTel });

    const errorCed = validarCedula(cedula);
    if (errorCed) return res.status(400).json({ error: errorCed });

    if (correo.length > 50) return res.status(400).json({ error: "Correo demasiado largo" });
    if (direccion.length > 100) return res.status(400).json({ error: "Dirección demasiado larga" });

    // Crear cotización
    const id = await crearCotizacionVehiculo(req.body);
    res.status(201).json({ message: "Cotización creada exitosamente", id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
