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
                const res = yield fetch("/api/cotizacion/vehiculo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
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
                const res = yield fetch("/api/cotizacion/evento", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
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
                const res = yield fetch("/api/cotizacion/repuestos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
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
                const res = yield fetch("/api/accesorios/cotizacion", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
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
