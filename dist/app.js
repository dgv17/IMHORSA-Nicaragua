"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const vehiculos_1 = __importDefault(require("./routes/vehiculos"));
const catalogo_1 = __importDefault(require("./routes/catalogo"));
const cotizacion_1 = __importDefault(require("./routes/cotizacion"));
const evento_1 = __importDefault(require("./routes/evento"));
const repuestos_1 = __importDefault(require("./routes/repuestos"));
const accesorios_1 = __importDefault(require("./routes/accesorios"));
const admin_1 = __importDefault(require("./routes/admin"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "supersecreto",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } //en producción pon true si usa HTTPS
}));
// Rutas
app.use("/api/vehiculos", vehiculos_1.default);
app.use("/api/catalogo", catalogo_1.default);
app.use("/api", cotizacion_1.default);
app.use("/api", evento_1.default);
app.use("/api", repuestos_1.default);
app.use("/api/accesorios", accesorios_1.default);
app.use("/admin", admin_1.default);
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), "public", "index.html"));
});
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map