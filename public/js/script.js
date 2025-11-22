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
            // Desktop: close others first
            if (window.innerWidth > 768) {
                submenus.forEach((sm, i) => {
                    if (i !== index)
                        sm.classList.remove("visible");
                });
            }
            if (isOpen) {
                // If already open, close immediately
                submenu.classList.remove("visible");
            }
            else {
                // If closed, open with a small delay
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
document.addEventListener("DOMContentLoaded", () => {
    cargarModelos();
    cargarDepartamentos();
});
// Validaciones en frontend
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
    const form = document.querySelector("form");
    if (!form)
        return;
    form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        e.preventDefault();
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });
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
        // Loader de envío
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
                form.reset();
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
});
