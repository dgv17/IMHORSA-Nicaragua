"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.redirect("/admin/adlog1n");
}
function requireAdmin(req, res, next) {
    if (req.session?.user?.rol === 1) {
        return next();
    }
    return res.status(403).send("Acceso denegado: solo administradores");
}
//# sourceMappingURL=auth.js.map