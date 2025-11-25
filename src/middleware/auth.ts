import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.user) {
    return next();
  }
  if (req.xhr || req.headers.accept?.includes("application/json")) {
    return res.status(401).json({ error: "No autenticado" });
  }
  return res.redirect("/admin/adlog1n");
}
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session?.user?.rol === 1) {
    return next();
  }
  return res.status(403).send("Acceso denegado: solo administradores");
}
export function requireAdminOrGerenteGeneral(req: Request, res: Response, next: NextFunction) {
  const user = req.session?.user;
  if (!user) {
    return res.status(401).json({ error: "No autenticado" });
  }
  if (user.rol === 1 || user.rol === 2) {
    return next();
  }
  return res.status(403).json({ error: "No autorizado" });
}