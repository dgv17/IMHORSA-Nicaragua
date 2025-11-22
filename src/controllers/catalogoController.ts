import { Request, Response } from "express";
import { getDepartamentos, getMunicipios, getModelos } from "../models/catalogoModel";

export async function departamentos(req: Request, res: Response) {
  res.json(await getDepartamentos());
}

export async function municipios(req: Request, res: Response) {
  const { departamentoId } = req.params;
  res.json(await getMunicipios(Number(departamentoId)));
}

export async function modelos(req: Request, res: Response) {
  res.json(await getModelos());
}
