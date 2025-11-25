"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
console.log("proyecto ing. de software UNI segundo semestre 2025");
const supportsIntersectionObserver = "IntersectionObserver" in window;
const gridBoxes = document.querySelectorAll("#valores-virtudes .wrapper > div");
if (!supportsIntersectionObserver) {
    gridBoxes.forEach((box) => box.classList.add("reveal"));
}
else {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = entry.target;
                target.classList.add("reveal");
                obs.unobserve(target); //animar una sola vez
            }
        });
    }, {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.15,
    });
    gridBoxes.forEach((box) => observer.observe(box));
}
document.addEventListener("DOMContentLoaded", () => {
    const serviceBoxes = document.querySelectorAll("#servicios .container > div");
    const supportsIO = "IntersectionObserver" in window;
    if (!supportsIO) {
        serviceBoxes.forEach((box) => box.classList.add("reveal"));
        return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const index = Array.from(serviceBoxes).indexOf(target);
                target.style.animationDelay = `${index * 120}ms`;
                target.classList.add("reveal");
                obs.unobserve(target); // Animar solo una vez
            }
        });
    }, {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.15,
    });
    serviceBoxes.forEach((box) => observer.observe(box));
});
document.addEventListener("DOMContentLoaded", () => {
    const toggles = document.querySelectorAll(".menu-toggle");
    const submenus = document.querySelectorAll(".submenu");
    toggles.forEach((toggle, index) => {
        const submenu = submenus[index];
        if (!submenu)
            return;
        toggle.addEventListener("click", (event) => {
            event.preventDefault();
            const isOpen = submenu.classList.contains("visible");
            if (window.innerWidth > 768) {
                submenus.forEach((sm, i) => {
                    if (i !== index)
                        sm.classList.remove("visible");
                });
            }
            if (isOpen) {
                submenu.classList.remove("visible");
            }
            else {
                setTimeout(() => {
                    submenu.classList.add("visible");
                }, 400); // 0.4s delay
            }
        });
    });
});
function fetchVehiculos(serie) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = serie
            ? `/api/vehiculos?serie=${encodeURIComponent(serie)}`
            : "/api/vehiculos";
        const res = yield fetch(url);
        const data = yield res.json();
        renderVehiculos(data);
    });
}
function normalizeFileName(modelo) {
    return (modelo
        .toLowerCase()
        .replace(/\s+/g, "-") // espacios → guiones
        .replace(/[^\w-]/g, "") + // elimina caracteres especiales (+, /, etc.)
        ".png");
}
function renderVehiculos(vehiculos) {
    const grid = document.getElementById("vehiculos-grid");
    if (!grid)
        return;
    grid.innerHTML = vehiculos
        .map((v) => {
        const imgFile = normalizeFileName(v.modelo);
        const imgPath = `/images/vehiculos/${imgFile}`;
        return `
      <div class="vehiculo-card">
        <img src="${imgPath}" alt="${v.modelo}" />
        <h3>${v.modelo}</h3>
        <p>Serie: ${v.serie}<br/>Precio: C$${v.precio.toFixed(2)}</p>
        <a href="/HTML/detalle/${v.modelo}.html" class="vehiculo-btn">CONOCER MÁS</a>
      </div>
    `;
    })
        .join("");
}
document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("serie-select");
    fetchVehiculos();
    select === null || select === void 0 ? void 0 : select.addEventListener("change", () => {
        const serie = select.value;
        fetchVehiculos(serie || undefined);
    });
});
function normalizeAccesorioFileName(nombre) {
    return (nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "+")
        .replace(/[^\w+]/g, "") + ".png");
}
function fetchAccesorios(serie, containerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`/api/accesorios?serie=${encodeURIComponent(serie)}`);
        const accesorios = yield res.json();
        console.log(`Accesorios para ${serie}:`, accesorios);
        const grid = document.getElementById(containerId);
        if (!grid)
            return;
        grid.innerHTML = accesorios
            .map((a) => {
            const imgFile = normalizeAccesorioFileName(a.nombre);
            const imgPath = `/images/accesorios/${imgFile}`;
            return `
      <a href="/HTML/formaccesorios.html" class="vehiculo-card card-link">
        <img src="${imgPath}" alt="${a.nombre}" onerror="this.src='/images/placeholder.png'" />
        <h3>${a.nombre}</h3>
        <p>${a.descripcion}</p>
        <p><strong>Precio:</strong> C$${a.precio.toFixed(2)}</p>
        <span class="vehiculo-btn">Cotizar</span>
      </a>
    `;
        })
            .join("");
    });
}
document.addEventListener("DOMContentLoaded", () => {
    fetchAccesorios("D5", "grid-d5");
    fetchAccesorios("D2", "grid-d2");
});
function cargarModelos() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/api/catalogo/modelos");
        const modelos = yield res.json();
        const select = document.getElementById("modelo_vehiculo");
        if (!select)
            return;
        modelos.forEach((m) => {
            const opt = document.createElement("option");
            opt.value = String(m.id);
            opt.textContent = `${m.serie} ${m.nombre}`;
            opt.dataset.precio = String(m.precio);
            select.appendChild(opt);
        });
        select.addEventListener("change", () => {
            const selected = select.selectedOptions[0];
            if (selected && selected.dataset.precio) {
                const precio = selected.dataset.precio;
                document.getElementById("precio_base").value =
                    precio;
                document.getElementById("total_neto").value =
                    precio;
            }
        });
    });
}
function cargarDepartamentos() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/api/catalogo/departamentos");
        const departamentos = yield res.json();
        const select = document.getElementById("departamento");
        if (!select)
            return;
        departamentos.forEach((d) => {
            const opt = document.createElement("option");
            opt.value = String(d.id);
            opt.textContent = d.nombre;
            select.appendChild(opt);
        });
        select.addEventListener("change", () => __awaiter(this, void 0, void 0, function* () {
            const depId = select.value;
            const resMun = yield fetch(`/api/catalogo/municipios/${depId}`);
            const municipios = yield resMun.json();
            const munSelect = document.getElementById("municipio");
            if (!munSelect)
                return;
            munSelect.innerHTML = "<option disabled selected>Seleccione...</option>";
            municipios.forEach((m) => {
                const opt = document.createElement("option");
                opt.value = String(m.id);
                opt.textContent = m.nombre;
                munSelect.appendChild(opt);
            });
        }));
    });
}
function cargarAccesorios() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/api/accesorios");
        const accesorios = yield res.json();
        const select = document.getElementById("accesorio_select");
        if (!select)
            return;
        accesorios.forEach((a) => {
            const opt = document.createElement("option");
            opt.value = String(a.id);
            opt.textContent = `${a.serie} - ${a.nombre}`;
            opt.dataset.precio = String(a.precio);
            select.appendChild(opt);
        });
        select.addEventListener("change", () => {
            const selected = select.selectedOptions[0];
            if (selected && selected.dataset.precio) {
                const precio = Number(selected.dataset.precio);
                document.getElementById("precio_base").value =
                    precio.toFixed(2);
                const cantidad = Number(document.getElementById("cantidad").value || 1);
                document.getElementById("total_neto").value = (precio * cantidad).toFixed(2);
            }
        });
    });
}
document.addEventListener("DOMContentLoaded", () => {
    cargarAccesorios();
});
document.addEventListener("DOMContentLoaded", () => {
    cargarModelos();
    cargarDepartamentos();
    cargarAccesorios();
});
// Validaciones en frontend
function getCsrfToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/csrf-token");
        const data = yield res.json();
        return data.csrfToken;
    });
}
function validarNombreFront(nombre) {
    const trimmed = nombre.trim();
    // Longitud mínima y máxima
    if (trimmed.length < 3) {
        return "El nombre completo es demasiado corto";
    }
    if (trimmed.length > 50) {
        return "El nombre completo no puede superar 50 caracteres";
    }
    const repetidoLetras = /^([A-Za-zÁÉÍÓÚÑ])\1{4,}$/; // 5+ veces la misma letra
    if (repetidoLetras.test(trimmed)) {
        return "El nombre no puede ser solo letras repetidas";
    }
    const repetidoNumeros = /^(\d)\1{4,}$/;
    if (repetidoNumeros.test(trimmed)) {
        return "Ingrese un nombre valido (nombre + nombre + apellido + apellido) o (nombre + apellido)";
    }
    if (!/[A-Za-zÁÉÍÓÚÑ]/.test(trimmed)) {
        return "Ingrese un nombre valido (nombre + nombre + apellido + apellido) o (nombre + apellido)";
    }
    const soloLetrasSinEspacios = /^[A-Za-zÁÉÍÓÚÑ]{20,}$/;
    if (soloLetrasSinEspacios.test(trimmed)) {
        return "Ingrese un nombre valido (nombre + nombre + apellido + apellido) o (nombre + apellido)";
    }
    return null;
}
function validarTelefonoFront(telefono) {
    const regex = /^\d{4}-\d{4}$/;
    const repetido = /^(\d)\1{7}$/;
    if (!regex.test(telefono))
        return "Formato inválido (xxxx-xxxx)";
    const sinGuion = telefono.replace("-", "");
    if (repetido.test(sinGuion))
        return "El numero de telefono no puede repetir el mismo dígito 8 veces";
    return null;
}
function validarCedulaFront(cedula) {
    const regex = /^\d{3}-\d{6}-\d{4}[A-Za-z]$/;
    if (!regex.test(cedula))
        return "Formato inválido (001-000000-0000A)";
    if (cedula.length !== 16)
        return "La cedula debe tener 16 caracteres";
    return null;
}
function validarCorreoFront(correo) {
    if (correo.length > 50)
        return "Correo demasiado extenso (máximo de 50 caracteres)";
    return null;
}
function validarDireccionFront(direccion) {
    if (direccion.length > 100)
        return "Dirección demasiado larga (máximo de 100 caracteres)";
    return null;
}
function validarOrganizacionFront(nombre) {
    const trimmed = nombre.trim();
    if (trimmed.length > 20) {
        return "El nombre de la organización no puede superar 20 caracteres";
    }
    if (trimmed.length < 3) {
        return "El nombre de la organización es demasiado corto, procure no usar siglas o abreviaciones";
    }
    const repetidoLetras = /^([A-Za-z])\1{4,}$/;
    if (repetidoLetras.test(trimmed)) {
        return "Ingrese un nombre de organizacion validovalido";
    }
    const repetidoNumeros = /^(\d)\1{4,}$/;
    if (repetidoNumeros.test(trimmed)) {
        return "Ingrese un nombre de organizacion valido";
    }
    if (!/[A-Za-z]/.test(trimmed)) {
        return "Ingrese un nombre de organizacion valido";
    }
    return null;
}
function validarProblemaFront(problema) {
    if (problema.length > 100) {
        return "La descripción del problema no puede superar 100 caracteres";
    }
    // Evitar incoherencias
    const repetido = /^(\d)\1{6,}$/; // 7 o más veces el mismo dígito
    if (repetido.test(problema)) {
        return "La descripción no puede ser solo números repetidos";
    }
    const soloLetras = /^[A-Za-z]{20,}$/; // 20+ letras sin espacios
    if (soloLetras.test(problema)) {
        return "La descripción parece incoherente (solo letras sin sentido)";
    }
    return null;
}
function validarUsernameFront(username) {
    const trimmed = username.trim();
    if (trimmed.length < 3)
        return "El username es demasiado corto";
    if (trimmed.length > 25)
        return "El username no puede superar 25 caracteres";
    return null;
}
function validarNombreUsuarioFront(nombre) {
    const trimmed = nombre.trim();
    if (trimmed.length < 3)
        return "El nombre es demasiado corto";
    if (trimmed.length > 25)
        return "El nombre no puede superar 25 caracteres";
    return null;
}
function validarCorreoUsuarioFront(correo) {
    const trimmed = correo.trim();
    if (trimmed.length < 3)
        return "El correo es demasiado corto";
    if (trimmed.length > 50)
        return "El correo no puede superar 50 caracteres";
    return null;
}
function validarPasswordFront(pass) {
    if (pass.length < 6)
        return "La contraseña debe tener al menos 6 caracteres";
    return null;
}
function validarCorreo(correo) {
    const trimmed = correo.trim();
    if (trimmed.length < 3)
        return "El correo es demasiado corto";
    if (trimmed.length > 50)
        return "El correo no puede superar 50 caracteres";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(trimmed))
        return "Formato de correo inválido";
    return null;
}
function initEventoFormDates() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const minDate = `${yyyy}-${mm}-${dd}`;
    const maxYear = yyyy + 3;
    const maxDate = `${maxYear}-${mm}-${dd}`;
    const fechaInicio = document.getElementById("fecha_inicio");
    const fechaFin = document.getElementById("fecha_fin");
    if (fechaInicio && fechaFin) {
        fechaInicio.min = minDate;
        fechaFin.min = minDate;
        fechaInicio.max = maxDate;
        fechaFin.max = maxDate;
        fechaInicio.addEventListener("change", function () {
            if (fechaFin) {
                fechaFin.min = this.value;
                if (fechaFin.value && fechaFin.value < this.value) {
                    fechaFin.value = this.value;
                }
            }
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    initEventoFormDates();
});
function mostrarNotif(mensaje, tipo = "loading") {
    const notif = document.createElement("div");
    notif.className = "loader-notification";
    if (tipo === "error")
        notif.classList.add("error");
    if (tipo === "success")
        notif.classList.add("success");
    if (tipo === "loading") {
        notif.innerHTML = `
      <span>${mensaje}</span>
      <div class="loader-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    }
    else {
        notif.innerHTML = `<span>${mensaje}</span>`;
    }
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}
document.addEventListener("DOMContentLoaded", () => {
    const vehiculoForm = document.querySelector("form.vehiculo-form");
    const eventoForm = document.querySelector("form.evento-form");
    const repuestosForm = document.querySelector("form.repuestos-form");
    // --- Vehículos ---
    if (vehiculoForm) {
        vehiculoForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            e.preventDefault();
            const formData = new FormData(vehiculoForm);
            const data = {};
            formData.forEach((value, key) => (data[key] = value.toString()));
            // Validaciones
            const errorNombre = validarNombreFront(data.nombre);
            if (errorNombre)
                return mostrarNotif(errorNombre, "error");
            const errorTel = validarTelefonoFront(data.telefono);
            if (errorTel)
                return mostrarNotif(errorTel, "error");
            const errorCed = validarCedulaFront(data.cedula);
            if (errorCed)
                return mostrarNotif(errorCed, "error");
            const errorCorreo = validarCorreoFront(data.correo);
            if (errorCorreo)
                return mostrarNotif(errorCorreo, "error");
            const errorDir = validarDireccionFront(data.direccion);
            if (errorDir)
                return mostrarNotif(errorDir, "error");
            mostrarNotif("Enviando solicitud", "loading");
            try {
                const token = yield getCsrfToken();
                const res = yield fetch("/api/cotizacion/vehiculo", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "CSRF-Token": token,
                    },
                    body: JSON.stringify(data),
                });
                const result = yield res.json();
                if (res.ok && result.id) {
                    mostrarNotif((_a = result.message) !== null && _a !== void 0 ? _a : "¡Éxito!", "success");
                    vehiculoForm.reset();
                }
                else {
                    mostrarNotif("Error: " + ((_b = result.error) !== null && _b !== void 0 ? _b : "Error desconocido"), "error");
                }
            }
            catch (err) {
                console.error(err);
                mostrarNotif("Error de conexión", "error");
            }
        }));
    }
    // --- Eventos ---
    if (eventoForm) {
        eventoForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            e.preventDefault();
            const formData = new FormData(eventoForm);
            const data = {};
            formData.forEach((value, key) => (data[key] = value.toString()));
            const errorOrg = validarOrganizacionFront(data.nombre);
            if (errorOrg)
                return mostrarNotif(errorOrg, "error");
            const errorCorreo = validarCorreoFront(data.correo);
            if (errorCorreo)
                return mostrarNotif(errorCorreo, "error");
            const errorDir = validarDireccionFront(data.direccion);
            if (errorDir)
                return mostrarNotif(errorDir, "error");
            mostrarNotif("Enviando solicitud", "loading");
            try {
                const token = yield getCsrfToken();
                const res = yield fetch("/api/cotizacion/evento", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "CSRF-Token": token,
                    },
                    body: JSON.stringify(data),
                });
                const result = yield res.json();
                if (res.ok && result.id) {
                    mostrarNotif((_a = result.message) !== null && _a !== void 0 ? _a : "¡Éxito!", "success");
                    eventoForm.reset();
                }
                else {
                    mostrarNotif("Error: " + ((_b = result.error) !== null && _b !== void 0 ? _b : "Error desconocido"), "error");
                }
            }
            catch (err) {
                console.error(err);
                mostrarNotif("Error de conexión", "error");
            }
        }));
    }
    // --- Repuestos ---
    if (repuestosForm) {
        repuestosForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            e.preventDefault();
            const formData = new FormData(repuestosForm);
            const data = {};
            formData.forEach((value, key) => (data[key] = value.toString()));
            // Validaciones
            const errorNombre = validarNombreFront(data.nombre);
            if (errorNombre)
                return mostrarNotif(errorNombre, "error");
            const errorTel = validarTelefonoFront(data.telefono);
            if (errorTel)
                return mostrarNotif(errorTel, "error");
            const errorCed = validarCedulaFront(data.cedula);
            if (errorCed)
                return mostrarNotif(errorCed, "error");
            const errorCorreo = validarCorreoFront(data.correo);
            if (errorCorreo)
                return mostrarNotif(errorCorreo, "error");
            const errorDir = validarDireccionFront(data.direccion);
            if (errorDir)
                return mostrarNotif(errorDir, "error");
            const errorProb = validarProblemaFront(data.problema);
            if (errorProb)
                return mostrarNotif(errorProb, "error");
            mostrarNotif("Enviando solicitud", "loading");
            try {
                const token = yield getCsrfToken();
                const res = yield fetch("/api/cotizacion/repuestos", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "CSRF-Token": token,
                    },
                    body: JSON.stringify(data),
                });
                const result = yield res.json();
                if (res.ok && result.id) {
                    mostrarNotif((_a = result.message) !== null && _a !== void 0 ? _a : "¡Éxito!", "success");
                    repuestosForm.reset();
                }
                else {
                    mostrarNotif("Error: " + ((_b = result.error) !== null && _b !== void 0 ? _b : "Error desconocido"), "error");
                }
            }
            catch (err) {
                console.error(err);
                mostrarNotif("Error de conexión", "error");
            }
        }));
    }
    // --- Accesorios ---
    const accesoriosForm = document.querySelector("form.accesorios-form");
    if (accesoriosForm) {
        accesoriosForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            e.preventDefault();
            const formData = new FormData(accesoriosForm);
            const data = {};
            formData.forEach((value, key) => (data[key] = value.toString()));
            // Recalcular total neto antes de enviar
            const precio = Number(document.getElementById("precio_base").value || 0);
            const cantidadCalc = Number(document.getElementById("cantidad").value || 1);
            const totalNeto = precio * cantidadCalc;
            document.getElementById("total_neto").value =
                totalNeto.toFixed(2);
            data.total_neto = totalNeto.toFixed(2);
            // Validaciones
            const errorNombre = validarNombreFront(data.nombre);
            if (errorNombre)
                return mostrarNotif(errorNombre, "error");
            const errorTel = validarTelefonoFront(data.telefono);
            if (errorTel)
                return mostrarNotif(errorTel, "error");
            const errorCed = validarCedulaFront(data.cedula);
            if (errorCed)
                return mostrarNotif(errorCed, "error");
            const errorCorreo = validarCorreoFront(data.correo);
            if (errorCorreo)
                return mostrarNotif(errorCorreo, "error");
            const errorDir = validarDireccionFront(data.direccion);
            if (errorDir)
                return mostrarNotif(errorDir, "error");
            const cantidad = Number(data.cantidad);
            if (isNaN(cantidad) || cantidad <= 0) {
                return mostrarNotif("La cantidad debe ser mayor a 0", "error");
            }
            mostrarNotif("Enviando solicitud", "loading");
            try {
                const token = yield getCsrfToken();
                const res = yield fetch("/api/accesorios/cotizacion", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "CSRF-Token": token,
                    },
                    body: JSON.stringify(data),
                });
                const result = yield res.json();
                if (res.ok && result.id) {
                    mostrarNotif((_a = result.message) !== null && _a !== void 0 ? _a : "¡Éxito!", "success");
                    accesoriosForm.reset();
                }
                else {
                    mostrarNotif("Error: " + ((_b = result.error) !== null && _b !== void 0 ? _b : "Error desconocido"), "error");
                }
            }
            catch (err) {
                console.error(err);
                mostrarNotif("Error de conexión", "error");
            }
        }));
    }
});
// --- Admin ---
function initLogin() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm)
        return;
    loginForm.addEventListener("submit", (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        if (!username || !password) {
            mostrarNotif("Debe ingresar usuario y contraseña", "error");
            return;
        }
        mostrarNotif("Verificando credenciales...", "loading");
        try {
            const token = yield getCsrfToken();
            const res = yield fetch("/admin/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "CSRF-Token": token,
                },
                body: JSON.stringify({ username, password }),
            });
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                if (res.ok) {
                    mostrarNotif("¡Bienvenido!", "success");
                    setTimeout(() => {
                        window.location.href = "/admin/admondashb0ard";
                    }, 2000);
                }
                else {
                    const text = yield res.text();
                    mostrarNotif(text || "Usuario o contraseña incorrectos", "error");
                }
            }), 3200);
        }
        catch (err) {
            console.error(err);
            mostrarNotif("Error de conexión con el servidor", "error");
        }
    }));
}
function initCorreoRestore() {
    const correoForm = document.getElementById("correoForm");
    if (!correoForm)
        return;
    correoForm.addEventListener("submit", (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const correo = document.getElementById("correores").value.trim();
        if (!correo) {
            mostrarNotif("Ingrese un correo válido", "error");
            return;
        }
        mostrarNotif("Enviando correo...", "loading");
        try {
            const token = yield getCsrfToken();
            const res = yield fetch("/admin/restore-request", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "CSRF-Token": token,
                },
                body: JSON.stringify({ correores: correo }),
            });
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                if (res.ok) {
                    mostrarNotif("Correo enviado, revise su bandeja", "success");
                }
                else {
                    const text = yield res.text();
                    mostrarNotif(text || "Error al enviar correo", "error");
                }
            }), 3200);
        }
        catch (err) {
            console.error(err);
            mostrarNotif("Error de conexión", "error");
        }
    }));
}
function initRestorePass() {
    const restoreForm = document.getElementById("restoreForm");
    if (!restoreForm)
        return;
    // 👉 Leer token y username desde query params
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const username = params.get("username");
    if (username) {
        const userInput = document.getElementById("username");
        if (userInput) {
            userInput.value = username;
        }
    }
    restoreForm.addEventListener("submit", (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const pw = document.getElementById("newPassword").value.trim();
        const pw2 = document.getElementById("confirmPassword").value.trim();
        if (!pw || pw !== pw2) {
            mostrarNotif("Las contraseñas no coinciden", "error");
            return;
        }
        mostrarNotif("Procesando...", "loading");
        try {
            const tokencsrf = yield getCsrfToken();
            const res = yield fetch(`/admin/restore/${token}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "CSRF-Token": tokencsrf,
                },
                body: JSON.stringify({ newPassword: pw }),
            });
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                if (res.ok) {
                    mostrarNotif("¡Contraseña restablecida con éxito!", "success");
                    setTimeout(() => {
                        window.location.href = "/admin/adlog1n";
                    }, 2000);
                }
                else {
                    const text = yield res.text();
                    mostrarNotif(text || "Error al restablecer", "error");
                }
            }), 3200);
        }
        catch (err) {
            console.error(err);
            mostrarNotif("Error de conexión", "error");
        }
    }));
}
function getCurrentUserRole() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const res = yield fetch("/admin/me", { credentials: "same-origin" });
            if (!res.ok)
                return null;
            const data = yield res.json();
            if (!data.authenticated)
                return null;
            return (_a = data.rol) !== null && _a !== void 0 ? _a : null;
        }
        catch (_b) {
            return null;
        }
    });
}
function hideUsuariosIfNotAdmin(rol) {
    if (rol !== 1) {
        const usuariosLink = document.querySelector('[data-nav="usuarios"]');
        if (usuariosLink) {
            const li = usuariosLink.closest("li");
            if (li)
                li.remove();
        }
    }
}
function setActiveNav(key) {
    document.querySelectorAll(".sidebar-nav a").forEach((a) => {
        a.classList.remove("active");
    });
    const active = document.querySelector(`[data-nav="${key}"]`);
    active === null || active === void 0 ? void 0 : active.classList.add("active");
}
const navGroups = {
    home: "Main",
    usuarios: "Main",
    clientes: "Main",
    vehiculos: "Inventario",
    accesorios: "Inventario",
    modelos: "Inventario",
    series: "Inventario",
    "sol-vehiculos": "Solicitudes",
    mantenimiento: "Solicitudes",
    "sol-accesorios": "Solicitudes",
    eventos: "Solicitudes",
};
function updateHeader(key) {
    const pageTitle = document.getElementById("page-title");
    const breadcrumb = document.getElementById("breadcrumb");
    const groupLabel = navGroups[key] || "Main";
    const sectionLabel = key.replace("sol-", "").charAt(0).toUpperCase() +
        key.replace("sol-", "").slice(1);
    if (pageTitle)
        pageTitle.textContent = sectionLabel;
    if (breadcrumb) {
        breadcrumb.innerHTML = `${groupLabel} <i class="bx bx-chevron-right"></i> ${sectionLabel}`;
    }
}
function initSidebarToggle() {
    const toggleBtn = document.querySelector(".toggle-sidebar");
    const sidebar = document.querySelector(".sidebar");
    const container = document.querySelector(".admin-container");
    if (!toggleBtn || !sidebar || !container)
        return;
    const isMobile = () => window.matchMedia("(max-width: 768px)").matches;
    const applyState = (hidden) => {
        if (isMobile()) {
            if (hidden) {
                sidebar.classList.remove("active");
                toggleBtn.innerHTML = '<i class="bx bx-menu"></i>';
            }
            else {
                sidebar.classList.add("active");
                toggleBtn.innerHTML = '<i class="bx bx-x"></i>';
            }
        }
        else {
            if (hidden) {
                container.classList.add("sidebar-collapsed");
                toggleBtn.innerHTML = '<i class="bx bx-menu"></i>';
            }
            else {
                container.classList.remove("sidebar-collapsed");
                toggleBtn.innerHTML = '<i class="bx bx-menu-alt-left"></i>';
            }
        }
    };
    let isHidden = isMobile();
    applyState(isHidden);
    toggleBtn.addEventListener("click", () => {
        isHidden = !isHidden;
        applyState(isHidden);
    });
    window.addEventListener("resize", () => {
        const mobileNow = isMobile();
        if (mobileNow) {
            isHidden = true;
        }
        else {
            isHidden = false;
        }
        applyState(isHidden);
    });
}
// Vistas de panel admin
// usuarios
function cargarUsuarios() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch("/admin/usuarios", { credentials: "same-origin" });
            if (!res.ok)
                throw new Error("Error al cargar usuarios");
            const usuarios = yield res.json();
            const tbody = document.querySelector("#section-usuarios tbody");
            if (!tbody)
                return;
            tbody.innerHTML = ""; // Limpiar tabla
            usuarios.forEach((u) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
        <td>${u.username}</td>
        <td>${u.nombre || "-"}</td>
        <td>${u.correo || "-"}</td>
        <td>${u.rol}</td>
        <td>
          <button 
            class="cotizar-btn edit-btn"
            data-id="${u.id}"
            data-username="${u.username}"
            data-nombre="${u.nombre || ""}"
            data-correo="${u.correo || ""}"
            data-rol="${u.rol}">
            Editar
          </button>
        </td>
      `;
                tbody.appendChild(tr);
            });
            document.querySelectorAll(".edit-btn").forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    const target = e.currentTarget;
                    const details = document.getElementById("modificar-usuario");
                    if (details) {
                        details.open = true;
                        details.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                    const idInput = document.querySelector("input[name='mod_id']");
                    const usernameInput = document.querySelector("input[name='mod_username']");
                    const nombreInput = document.querySelector("input[name='mod_nombre']");
                    const correoInput = document.querySelector("input[name='mod_correo']");
                    const rolSelect = document.querySelector("select[name='mod_rol']");
                    if (idInput)
                        idInput.value = target.dataset.id || "";
                    if (usernameInput)
                        usernameInput.value = target.dataset.username || "";
                    if (nombreInput)
                        nombreInput.value = target.dataset.nombre || "";
                    if (correoInput)
                        correoInput.value = target.dataset.correo || "";
                    if (rolSelect)
                        rolSelect.value = target.dataset.rol || "";
                });
            });
        }
        catch (err) {
            console.error("Error al mostrar usuarios:", err);
        }
    });
}
function cargarRoles() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch("/admin/roles", { credentials: "same-origin" });
            if (!res.ok)
                throw new Error("Error al cargar roles");
            const roles = yield res.json();
            const selects = [
                document.querySelector("select[name='rol']"),
                document.querySelector("select[name='mod_rol']"),
            ];
            selects.forEach((select) => {
                if (!select)
                    return;
                select.innerHTML = "";
                roles.forEach((r) => {
                    const option = document.createElement("option");
                    option.value = r.id;
                    option.textContent = r.nombre;
                    select.appendChild(option);
                });
            });
        }
        catch (err) {
            console.error("Error al mostrar roles:", err);
        }
    });
}
function initAgregarUsuario() {
    const form = document.querySelector("#agregar-usuario .form-wrapper");
    if (!form)
        return;
    const btnGuardar = form.querySelector("button");
    btnGuardar.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const username = form.querySelector("input[name='username']").value;
        const password = form.querySelector("input[name='password_user']").value;
        const nombre = form.querySelector("input[name='nombre']").value;
        const correo = form.querySelector("input[name='correo']").value;
        const rol = form.querySelector("select[name='rol']")
            .value;
        const errores = [];
        const errUser = validarUsernameFront(username);
        if (errUser)
            errores.push(errUser);
        const errPass = validarPasswordFront(password);
        if (errPass)
            errores.push(errPass);
        const errNombre = validarNombreUsuarioFront(nombre);
        if (errNombre)
            errores.push(errNombre);
        const errCorreo = validarCorreo(correo);
        if (errCorreo)
            errores.push(errCorreo);
        if (!rol)
            errores.push("Debe seleccionar un rol");
        if (errores.length > 0) {
            errores.forEach((err, i) => setTimeout(() => mostrarNotif(err, "error"), i * 500));
            return;
        }
        mostrarNotif("Guardando usuario...", "loading");
        try {
            const token = yield getCsrfToken();
            const res = yield fetch("/admin/usuarios", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "CSRF-Token": token,
                },
                body: JSON.stringify({
                    username,
                    password_user: password,
                    nombre,
                    correo,
                    rol_id: rol,
                }),
            });
            const data = yield res.json();
            if (!res.ok) {
                if (data.errores && Array.isArray(data.errores)) {
                    data.errores.forEach((err, i) => setTimeout(() => mostrarNotif(err, "error"), i * 500));
                }
                else {
                    mostrarNotif(data.error || "Error al crear usuario", "error");
                }
                return;
            }
            mostrarNotif("Usuario creado correctamente", "success");
            form.querySelector("input[name='username']").value =
                "";
            form.querySelector("input[name='password_user']").value = "";
            form.querySelector("input[name='nombre']").value =
                "";
            form.querySelector("input[name='correo']").value =
                "";
            form.querySelector("select[name='rol']").selectedIndex = 0;
            const details = document.getElementById("agregar-usuario");
            if (details)
                details.open = false;
            cargarUsuarios(); // refrescar tabla
        }
        catch (err) {
            console.error("Error al crear usuario:", err);
            mostrarNotif("Error de conexión", "error");
        }
    }));
}
function initModificarUsuario() {
    const form = document.querySelector("#modificar-usuario .form-wrapper");
    if (!form)
        return;
    const btnActualizar = form.querySelector("button");
    btnActualizar.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const id = form.querySelector("input[name='mod_id']")
            .value;
        const username = form.querySelector("input[name='mod_username']").value;
        const nombre = form.querySelector("input[name='mod_nombre']").value;
        const correo = form.querySelector("input[name='mod_correo']").value;
        const rol = form.querySelector("select[name='mod_rol']").value;
        const errores = [];
        const errUser = validarUsernameFront(username);
        if (errUser)
            errores.push(errUser);
        const errNombre = validarNombreUsuarioFront(nombre);
        if (errNombre)
            errores.push(errNombre);
        const errCorreo = validarCorreo(correo);
        if (errCorreo)
            errores.push(errCorreo);
        if (!rol)
            errores.push("Debe seleccionar un rol");
        if (errores.length > 0) {
            errores.forEach((err, i) => setTimeout(() => mostrarNotif(err, "error"), i * 500));
            return;
        }
        mostrarNotif("Actualizando usuario...", "loading");
        try {
            const token = yield getCsrfToken();
            const res = yield fetch(`/admin/usuarios/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "CSRF-Token": token,
                },
                credentials: "same-origin",
                body: JSON.stringify({ username, nombre, correo, rol_id: rol }),
            });
            const data = yield res.json();
            if (!res.ok) {
                if (data.errores && Array.isArray(data.errores)) {
                    data.errores.forEach((err, i) => setTimeout(() => mostrarNotif(err, "error"), i * 500));
                }
                else {
                    mostrarNotif(data.error || "Error al actualizar usuario", "error");
                }
                return;
            }
            mostrarNotif("Usuario actualizado correctamente", "success");
            cargarUsuarios(); // refrescar tabla
        }
        catch (err) {
            console.error("Error al actualizar usuario:", err);
            mostrarNotif("Error de conexión", "error");
        }
    }));
}
function initPasswordManagement() {
    var _a, _b;
    // --- Enviar correo de restablecimiento ---
    const correoInput = document.querySelector("input[name='reset_correo']");
    const btnCorreo = (_a = correoInput === null || correoInput === void 0 ? void 0 : correoInput.closest(".form-wrapper")) === null || _a === void 0 ? void 0 : _a.querySelector("button");
    if (correoInput && btnCorreo) {
        btnCorreo.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const correo = correoInput.value.trim();
            const error = validarCorreo(correo);
            if (error)
                return mostrarNotif(error, "error");
            mostrarNotif("Enviando correo...", "loading");
            try {
                const token = yield getCsrfToken();
                const res = yield fetch("/admin/restore-request", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "CSRF-Token": token,
                    },
                    body: JSON.stringify({ correores: correo }),
                });
                const text = yield res.text();
                if (res.ok) {
                    mostrarNotif("Correo enviado, revise su bandeja", "success");
                }
                else {
                    mostrarNotif(text || "Error al enviar correo", "error");
                }
            }
            catch (err) {
                console.error(err);
                mostrarNotif("Error de conexión", "error");
            }
        }));
    }
    // --- Forzar cambio de contraseña ---
    const usuarioInput = document.querySelector("input[name='force_usuario']");
    const nuevaInput = document.querySelector("input[name='force_nueva']");
    const confirmarInput = document.querySelector("input[name='force_confirmar']");
    const btnForce = (_b = confirmarInput === null || confirmarInput === void 0 ? void 0 : confirmarInput.closest(".form-wrapper")) === null || _b === void 0 ? void 0 : _b.querySelector("button");
    if (usuarioInput && nuevaInput && confirmarInput && btnForce) {
        btnForce.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const usuario = usuarioInput.value.trim();
            const nueva = nuevaInput.value.trim();
            const confirmar = confirmarInput.value.trim();
            const errores = [];
            if (!usuario)
                errores.push("Debe ingresar el usuario");
            if (nueva.length < 6)
                errores.push("La nueva contraseña debe tener al menos 6 caracteres");
            if (nueva !== confirmar)
                errores.push("Las contraseñas no coinciden");
            if (errores.length > 0) {
                errores.forEach((err, i) => setTimeout(() => mostrarNotif(err, "error"), i * 500));
                return;
            }
            mostrarNotif("Actualizando contraseña...", "loading");
            try {
                const token = yield getCsrfToken();
                const res = yield fetch("/admin/force-password", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "CSRF-Token": token,
                    },
                    body: JSON.stringify({ username: usuario, newPassword: nueva }),
                });
                const text = yield res.text();
                if (res.ok) {
                    mostrarNotif("Contraseña actualizada correctamente", "success");
                }
                else {
                    mostrarNotif(text || "Error al actualizar", "error");
                }
            }
            catch (err) {
                console.error(err);
                mostrarNotif("Error de conexión", "error");
            }
        }));
    }
}
function cargarClientes() {
    // Clientes Naturales
    fetch("/admin/clientes/naturales")
        .then((res) => res.json())
        .then((clientes) => {
        const tbody = document.getElementById("tabla-clientes-naturales");
        tbody.innerHTML = "";
        clientes.forEach((c) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
          <td>${c.nombre_completo}</td>
          <td>${c.cedula || "-"}</td>
          <td>${c.telefono || "-"}</td>
          <td>${c.correo || "-"}</td>
          <td>${c.departamento || "-"}</td>
          <td>${c.municipio || "-"}</td>
          <td>${c.direccion || "-"}</td>
          <td><button class="cotizar-btn" data-id="${c.id}" data-tipo="natural">Editar</button></td>
        `;
            tbody.appendChild(tr);
        });
    })
        .catch((err) => {
        console.error("Error al cargar clientes naturales:", err);
        mostrarNotif("Error al cargar clientes naturales", "error");
    });
    // Clientes Jurídicos
    fetch("/admin/clientes/juridicos")
        .then((res) => res.json())
        .then((clientes) => {
        const tbody = document.getElementById("tabla-clientes-juridicos");
        tbody.innerHTML = "";
        clientes.forEach((c) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
          <td>${c.nombre_empresa}</td>
          <td>${c.correo || "-"}</td>
          <td>${c.departamento || "-"}</td>
          <td>${c.municipio || "-"}</td>
          <td>${c.direccion || "-"}</td>
          <td><button class="cotizar-btn" data-id="${c.id}" data-tipo="juridico">Editar</button></td>
        `;
            tbody.appendChild(tr);
        });
    })
        .catch((err) => {
        console.error("Error al cargar clientes jurídicos:", err);
        mostrarNotif("Error al cargar clientes jurídicos", "error");
    });
}
function cargarDepartamentosClientes(depSelectName, munSelectName) {
    return __awaiter(this, void 0, void 0, function* () {
        const depSelect = document.querySelector(`select[name='${depSelectName}']`);
        const munSelect = document.querySelector(`select[name='${munSelectName}']`);
        if (!depSelect || !munSelect)
            return;
        // Cargar departamentos
        const res = yield fetch("/api/catalogo/departamentos");
        const departamentos = yield res.json();
        depSelect.innerHTML = "<option disabled selected>Seleccione...</option>";
        departamentos.forEach((d) => {
            const opt = document.createElement("option");
            opt.value = String(d.id);
            opt.textContent = d.nombre;
            depSelect.appendChild(opt);
        });
        // Al cambiar departamento, cargar municipios
        depSelect.addEventListener("change", () => __awaiter(this, void 0, void 0, function* () {
            const depId = depSelect.value;
            const resMun = yield fetch(`/api/catalogo/municipios/${depId}`);
            const municipios = yield resMun.json();
            munSelect.innerHTML = "<option disabled selected>Seleccione...</option>";
            municipios.forEach((m) => {
                const opt = document.createElement("option");
                opt.value = String(m.id);
                opt.textContent = m.nombre;
                munSelect.appendChild(opt);
            });
        }));
    });
}
function initModificarClienteNatural() {
    const form = document.querySelector("#modificar-cliente-natural .form-wrapper");
    if (!form)
        return;
    const btnActualizar = form.querySelector("button");
    btnActualizar.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const id = form.querySelector("input[name='mod_nat_id']").value;
        const primer_nombre = form.querySelector("input[name='mod_nat_primer_nombre']").value;
        const segundo_nombre = form.querySelector("input[name='mod_nat_segundo_nombre']").value;
        const primer_apellido = form.querySelector("input[name='mod_nat_primer_apellido']").value;
        const segundo_apellido = form.querySelector("input[name='mod_nat_segundo_apellido']").value;
        const cedula = form.querySelector("input[name='mod_nat_cedula']").value;
        const telefono = form.querySelector("input[name='mod_nat_telefono']").value;
        const correo = form.querySelector("input[name='mod_nat_correo']").value;
        const departamento = form.querySelector("select[name='mod_nat_departamento']").value;
        const municipio = form.querySelector("select[name='mod_nat_municipio']").value;
        const direccion = form.querySelector("input[name='mod_nat_direccion']").value;
        const errores = [];
        if (!primer_nombre)
            errores.push("Debe ingresar el primer nombre");
        if (!primer_apellido)
            errores.push("Debe ingresar el primer apellido");
        if (!cedula)
            errores.push("Debe ingresar la cédula");
        const errCorreo = validarCorreo(correo);
        if (errCorreo)
            errores.push(errCorreo);
        if (!departamento)
            errores.push("Debe seleccionar un departamento");
        if (!municipio)
            errores.push("Debe seleccionar un municipio");
        if (!direccion)
            errores.push("Debe ingresar la dirección");
        if (errores.length > 0) {
            errores.forEach((err, i) => setTimeout(() => mostrarNotif(err, "error"), i * 500));
            return;
        }
        mostrarNotif("Actualizando cliente natural...", "loading");
        try {
            const token = yield getCsrfToken();
            const res = yield fetch(`/admin/clientes/naturales/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "CSRF-Token": token,
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    primer_nombre,
                    segundo_nombre,
                    primer_apellido,
                    segundo_apellido,
                    cedula,
                    telefono,
                    correo,
                    departamento,
                    municipio,
                    direccion,
                }),
            });
            const data = yield res.json();
            if (!res.ok) {
                if (data.errores && Array.isArray(data.errores)) {
                    data.errores.forEach((err, i) => setTimeout(() => mostrarNotif(err, "error"), i * 500));
                }
                else {
                    mostrarNotif(data.error || "Error al actualizar cliente", "error");
                }
                return;
            }
            mostrarNotif("Cliente natural actualizado correctamente", "success");
            cargarClientes(); // refrescar tablas
        }
        catch (err) {
            console.error("Error al actualizar cliente natural:", err);
            mostrarNotif("Error de conexión", "error");
        }
    }));
}
function initModificarClienteJuridico() {
    const form = document.querySelector("#modificar-cliente-juridico .form-wrapper");
    if (!form)
        return;
    const btnActualizar = form.querySelector("button");
    btnActualizar.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const id = form.querySelector("input[name='mod_jur_id']").value;
        const nombre_empresa = form.querySelector("input[name='mod_jur_nombre']").value;
        const correo = form.querySelector("input[name='mod_jur_correo']").value;
        const departamento = form.querySelector("select[name='mod_jur_departamento']").value;
        const municipio = form.querySelector("select[name='mod_jur_municipio']").value;
        const direccion = form.querySelector("input[name='mod_jur_direccion']").value;
        const errores = [];
        if (!nombre_empresa)
            errores.push("Debe ingresar el nombre de la empresa");
        const errCorreo = validarCorreo(correo);
        if (errCorreo)
            errores.push(errCorreo);
        if (!departamento)
            errores.push("Debe seleccionar un departamento");
        if (!municipio)
            errores.push("Debe seleccionar un municipio");
        if (!direccion)
            errores.push("Debe ingresar la dirección");
        if (errores.length > 0) {
            errores.forEach((err, i) => setTimeout(() => mostrarNotif(err, "error"), i * 500));
            return;
        }
        mostrarNotif("Actualizando cliente jurídico...", "loading");
        try {
            const token = yield getCsrfToken();
            const res = yield fetch(`/admin/clientes/juridicos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "CSRF-Token": token,
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    nombre_empresa,
                    correo,
                    departamento,
                    municipio,
                    direccion,
                }),
            });
            const data = yield res.json();
            if (!res.ok) {
                if (data.errores && Array.isArray(data.errores)) {
                    data.errores.forEach((err, i) => setTimeout(() => mostrarNotif(err, "error"), i * 500));
                }
                else {
                    mostrarNotif(data.error || "Error al actualizar cliente", "error");
                }
                return;
            }
            mostrarNotif("Cliente jurídico actualizado correctamente", "success");
            cargarClientes(); // refrescar tablas
        }
        catch (err) {
            console.error("Error al actualizar cliente jurídico:", err);
            mostrarNotif("Error de conexión", "error");
        }
    }));
}
document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn)
        return;
    if (btn.dataset.tipo === "natural") {
        const fila = btn.closest("tr");
        const celdas = fila.querySelectorAll("td");
        document.querySelector("input[name='mod_nat_id']").value = btn.dataset.id;
        document.querySelector("input[name='mod_nat_primer_nombre']").value = extraerParte(celdas[0].textContent, 0);
        document.querySelector("input[name='mod_nat_segundo_nombre']").value = extraerParte(celdas[0].textContent, 1);
        document.querySelector("input[name='mod_nat_primer_apellido']").value = extraerParte(celdas[0].textContent, 2);
        document.querySelector("input[name='mod_nat_segundo_apellido']").value = extraerParte(celdas[0].textContent, 3);
        document.querySelector("input[name='mod_nat_cedula']").value = celdas[1].textContent || "";
        document.querySelector("input[name='mod_nat_telefono']").value = celdas[2].textContent || "";
        document.querySelector("input[name='mod_nat_correo']").value = celdas[3].textContent || "";
        document.querySelector("select[name='mod_nat_departamento']").value = celdas[4].textContent || "";
        document.querySelector("select[name='mod_nat_municipio']").value = celdas[5].textContent || "";
        document.querySelector("input[name='mod_nat_direccion']").value = celdas[6].textContent || "";
        const detailsNat = document.getElementById("modificar-cliente-natural");
        if (detailsNat) {
            detailsNat.open = true;
            detailsNat.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }
    if (btn.dataset.tipo === "juridico") {
        const fila = btn.closest("tr");
        const celdas = fila.querySelectorAll("td");
        document.querySelector("input[name='mod_jur_id']").value = btn.dataset.id;
        document.querySelector("input[name='mod_jur_nombre']").value = celdas[0].textContent || "";
        document.querySelector("input[name='mod_jur_correo']").value = celdas[1].textContent || "";
        document.querySelector("select[name='mod_jur_departamento']").value = celdas[2].textContent || "";
        document.querySelector("select[name='mod_jur_municipio']").value = celdas[3].textContent || "";
        document.querySelector("input[name='mod_jur_direccion']").value = celdas[4].textContent || "";
        const details = document.getElementById("modificar-cliente-juridico");
        if (details) {
            details.open = true;
            details.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }
});
function extraerParte(nombre, index) {
    const partes = nombre.trim().split(" ");
    return partes[index] || "";
}
function cargarVehiculos() {
    fetch("/admin/vehiculos")
        .then((res) => res.json())
        .then((vehiculos) => {
        const tbody = document.getElementById("tabla-vehiculos");
        tbody.innerHTML = "";
        vehiculos.forEach((v) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
          <td>${v.modelo_nombre}</td>
          <td>${v.anio || "-"}</td>
          <td>${v.serie_nombre}</td>
          <td>${v.marca || "-"}</td>
          <td>${v.precio}</td>
          <td>${v.stock === 1 ? "Hay stock" : "No hay stock"}</td>
          <td>
            <button class="cotizar-btn" data-id="${v.id}" data-tipo="vehiculo">
              Editar
            </button>
          </td>
        `;
            tbody.appendChild(tr);
        });
    })
        .catch((err) => {
        console.error("Error al cargar vehículos:", err);
        mostrarNotif("Error al cargar vehículos", "error");
    });
}
function cargarSelectVehiculos() {
    return __awaiter(this, void 0, void 0, function* () {
        const select = document.querySelector("select[name='mod_vehiculo']");
        if (!select) {
            console.error("No se encontró el select mod_vehiculo");
            return;
        }
        try {
            const res = yield fetch("/admin/vehiculos");
            const vehiculos = yield res.json();
            select.innerHTML =
                "<option disabled selected>Seleccione un vehículo...</option>";
            vehiculos.forEach((v) => {
                const opt = document.createElement("option");
                opt.value = String(v.id);
                opt.textContent = `${v.modelo_nombre} ${v.anio || ""} - ${v.marca || ""}`;
                select.appendChild(opt);
            });
        }
        catch (err) {
            console.error("Error al cargar vehículos en select:", err);
            mostrarNotif("Error al cargar vehículos en select", "error");
        }
    });
}
document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn)
        return;
    // --- Vehículos ---
    if (btn.dataset.tipo === "vehiculo") {
        const fila = btn.closest("tr");
        const celdas = fila.querySelectorAll("td");
        document.querySelector("input[name='mod_veh_id']").value = btn.dataset.id;
        const selectVehiculo = document.querySelector("select[name='mod_vehiculo']");
        if (selectVehiculo) {
            const modeloTexto = `${celdas[0].textContent} ${celdas[1].textContent} - ${celdas[3].textContent}`;
            Array.from(selectVehiculo.options).forEach((opt) => {
                if (opt.textContent === modeloTexto) {
                    selectVehiculo.value = opt.value;
                }
            });
        }
        const stockSelect = document.querySelector("select[name='mod_stock']");
        if (stockSelect) {
            stockSelect.value = celdas[5].textContent === "Hay stock" ? "1" : "0";
        }
        const detailsVeh = document.getElementById("modificar-vehiculo");
        if (detailsVeh) {
            detailsVeh.open = true;
            detailsVeh.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }
});
function initModificarVehiculo() {
    const form = document.querySelector("#modificar-vehiculo .form-wrapper");
    if (!form)
        return;
    const btnActualizar = form.querySelector("button");
    btnActualizar.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const id = form.querySelector("input[name='mod_veh_id']").value;
        const stock = form.querySelector("select[name='mod_stock']").value;
        mostrarNotif("Actualizando stock...", "loading");
        try {
            const token = yield getCsrfToken();
            const res = yield fetch(`/admin/vehiculos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "CSRF-Token": token,
                },
                credentials: "same-origin",
                body: JSON.stringify({ stock }),
            });
            const data = yield res.json();
            if (!res.ok) {
                mostrarNotif(data.error || "Error al actualizar stock", "error");
                return;
            }
            mostrarNotif("Stock actualizado correctamente", "success");
            cargarVehiculos(); // refrescar tabla
        }
        catch (err) {
            console.error("Error al actualizar stock:", err);
            mostrarNotif("Error de conexión", "error");
        }
    }));
}
function cargarSolicitudesVehiculos() {
    fetch("/admin/solicitudes/vehiculos")
        .then((res) => res.json())
        .then((solicitudes) => {
        const tbody = document.getElementById("tabla-cotizaciones-vehiculos");
        tbody.innerHTML = "";
        solicitudes.forEach((s) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
          <td>${s.numero_factura || "-"}</td>
          <td>${s.cliente}</td>
          <td>${new Date(s.fecha_solicitud).toLocaleString()}</td>
          <td>${s.estado}</td>
          <td>
            <button class="cotizar-btn" data-id="${s.id}" data-tipo="sol-vehiculo">
              Gestionar
            </button>
          </td>
        `;
            tbody.appendChild(tr);
        });
    })
        .catch((err) => {
        console.error("Error al cargar solicitudes de vehículos:", err);
        mostrarNotif("Error al cargar solicitudes de vehículos", "error");
    });
}
document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn)
        return;
    if (btn.dataset.tipo === "sol-vehiculo") {
        const fila = btn.closest("tr");
        const celdas = fila.querySelectorAll("td");
        // Guardar id real en hidden
        document.querySelector("input[name='cotizacion_id']").value = btn.dataset.id;
        // Mostrar factura en input visible
        document.querySelector("input[name='cotizacion_factura']").value = celdas[0].textContent || "";
        // Estado actual
        const estadoSelect = document.querySelector("select[name='cotizacion_estado']");
        if (estadoSelect) {
            estadoSelect.value = celdas[3].textContent || "Aceptada";
        }
        const detailsCot = document.getElementById("gestionar-cotizacion-vehiculo");
        if (detailsCot) {
            detailsCot.open = true;
            detailsCot.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }
});
function initGestionarCotizacionVehiculo() {
    const form = document.querySelector("#gestionar-cotizacion-vehiculo .form-wrapper");
    if (!form)
        return;
    const btnActualizar = form.querySelector("button");
    btnActualizar.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        const id = form.querySelector("input[name='cotizacion_id']").value;
        const estado = form.querySelector("select[name='cotizacion_estado']").value;
        mostrarNotif("Actualizando estado...", "loading");
        try {
            const token = yield getCsrfToken();
            const res = yield fetch(`/admin/solicitudes/vehiculos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "CSRF-Token": token,
                },
                credentials: "same-origin",
                body: JSON.stringify({ estado }),
            });
            const data = yield res.json();
            if (!res.ok) {
                mostrarNotif(data.error || "Error al actualizar estado", "error");
                return;
            }
            mostrarNotif(`Cotización ${id} actualizada a ${estado}`, "success");
            cargarSolicitudesVehiculos(); // refrescar tabla
        }
        catch (err) {
            console.error("Error al actualizar estado:", err);
            mostrarNotif("Error de conexión", "error");
        }
    }));
}
document.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    const btn = e.target.closest("button");
    if (!btn)
        return;
    // --- Enviar correo ---
    if (btn.dataset.tipo === "enviar-correo") {
        e.preventDefault();
        const id = document.querySelector("input[name='cotizacion_id']").value;
        const factura = document.querySelector("input[name='cotizacion_factura']").value;
        const estado = document.querySelector("select[name='cotizacion_estado']").value;
        if (!id) {
            mostrarNotif("No se encontró la cotización seleccionada", "error");
            return;
        }
        mostrarNotif("Enviando correo...", "loading");
        try {
            const token = yield getCsrfToken();
            const res = yield fetch(`/admin/solicitudes/vehiculos/${id}/correo`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "CSRF-Token": token,
                },
                body: JSON.stringify({ estado, numero_factura: factura }),
            });
            const data = yield res.json();
            if (!res.ok) {
                mostrarNotif(data.error || "Error al enviar correo", "error");
                return;
            }
            mostrarNotif(`Correo enviado para factura ${factura} (${estado})`, "success");
        }
        catch (err) {
            console.error("Error al enviar correo:", err);
            mostrarNotif("Error de conexión", "error");
        }
    }
}));
document.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    const btn = e.target.closest("button");
    if (!btn)
        return;
    if (btn.dataset.tipo === "logout") {
        e.preventDefault();
        try {
            const token = yield getCsrfToken();
            const res = yield fetch("/admin/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    "CSRF-Token": token,
                },
            });
            const data = yield res.json();
            if (res.ok) {
                mostrarNotif("Sesión cerrada correctamente", "success");
                window.location.href = "/admin/adlog1n";
            }
            else {
                mostrarNotif(data.error || "Error al cerrar sesión", "error");
            }
        }
        catch (err) {
            console.error("Error en logout:", err);
            mostrarNotif("Error de conexión", "error");
        }
    }
}));
// Vistas de panel admin
function showSection(key) {
    document.querySelectorAll(".content-section").forEach((section) => {
        section.classList.add("hidden");
    });
    const target = document.getElementById(`section-${key}`);
    if (target)
        target.classList.remove("hidden");
    setActiveNav(key);
    updateHeader(key);
    if (key === "usuarios") {
        cargarUsuarios();
        cargarRoles();
        initModificarUsuario();
        initPasswordManagement();
    }
    if (key === "clientes") {
        cargarClientes();
        cargarDepartamentosClientes("mod_nat_departamento", "mod_nat_municipio");
        cargarDepartamentosClientes("mod_jur_departamento", "mod_jur_municipio");
        initModificarClienteNatural();
        initModificarClienteJuridico();
    }
    if (key === "vehiculos") {
        cargarVehiculos();
        cargarSelectVehiculos();
        initModificarVehiculo();
    }
    if (key === "sol-vehiculos") {
        cargarSolicitudesVehiculos();
        initGestionarCotizacionVehiculo();
    }
}
function initPanelNavigation() {
    const toggleBtn = document.querySelector(".toggle-sidebar");
    const sidebar = document.querySelector(".sidebar");
    document.querySelectorAll(".sidebar-nav a").forEach((a) => {
        const key = a.getAttribute("data-nav");
        if (!key)
            return;
        a.addEventListener("click", (e) => {
            e.preventDefault();
            showSection(key);
            // Si está en mobile, cerrar el sidebar
            if (window.matchMedia("(max-width: 768px)").matches) {
                sidebar.classList.remove("active");
                toggleBtn.innerHTML = '<i class="bx bx-menu"></i>';
            }
        });
    });
    showSection("home");
}
function initHomeActions() {
    document.querySelectorAll("#section-home .action-btn").forEach((btn) => {
        const key = btn.getAttribute("data-nav");
        if (!key)
            return;
        btn.addEventListener("click", () => {
            showSection(key);
            const sidebar = document.querySelector(".sidebar");
            const toggleBtn = document.querySelector(".toggle-sidebar");
            if (window.matchMedia("(max-width: 768px)").matches &&
                sidebar &&
                toggleBtn) {
                sidebar.classList.remove("active");
                toggleBtn.innerHTML = '<i class="bx bx-menu"></i>';
            }
        });
    });
}
document.addEventListener("DOMContentLoaded", () => {
    initLogin();
    initCorreoRestore();
    initRestorePass();
});
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const path = window.location.pathname.replace(/\/$/, "");
    if (path.includes("admondashb0ard")) {
        const rol = yield getCurrentUserRole();
        hideUsuariosIfNotAdmin(rol);
        initPanelNavigation();
        initSidebarToggle();
        initHomeActions();
        initAgregarUsuario();
    }
}));
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield getCsrfToken();
    document.querySelectorAll("input[name='_csrf']").forEach((input) => {
        input.value = token;
    });
}));
