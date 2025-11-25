console.log("proyecto ing. de software UNI segundo semestre 2025");
const supportsIntersectionObserver = "IntersectionObserver" in window;
const gridBoxes: NodeListOf<HTMLDivElement> = document.querySelectorAll(
  "#valores-virtudes .wrapper > div"
);
if (!supportsIntersectionObserver) {
  gridBoxes.forEach((box) => box.classList.add("reveal"));
} else {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLDivElement;
          target.classList.add("reveal");
          obs.unobserve(target); //animar una sola vez
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.15,
    }
  );
  gridBoxes.forEach((box) => observer.observe(box));
}
document.addEventListener("DOMContentLoaded", () => {
  const serviceBoxes: NodeListOf<HTMLDivElement> = document.querySelectorAll(
    "#servicios .container > div"
  );
  const supportsIO = "IntersectionObserver" in window;
  if (!supportsIO) {
    serviceBoxes.forEach((box) => box.classList.add("reveal"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLDivElement;
          const index = Array.from(serviceBoxes).indexOf(target);
          target.style.animationDelay = `${index * 120}ms`;
          target.classList.add("reveal");
          obs.unobserve(target); // Animar solo una vez
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.15,
    }
  );
  serviceBoxes.forEach((box) => observer.observe(box));
});

document.addEventListener("DOMContentLoaded", () => {
  const toggles = document.querySelectorAll(
    ".menu-toggle"
  ) as NodeListOf<HTMLButtonElement>;
  const submenus = document.querySelectorAll(
    ".submenu"
  ) as NodeListOf<HTMLUListElement>;
  toggles.forEach((toggle, index) => {
    const submenu = submenus[index];
    if (!submenu) return;
    toggle.addEventListener("click", (event: MouseEvent) => {
      event.preventDefault();
      const isOpen = submenu.classList.contains("visible");
      if (window.innerWidth > 768) {
        submenus.forEach((sm, i) => {
          if (i !== index) sm.classList.remove("visible");
        });
      }
      if (isOpen) {
        submenu.classList.remove("visible");
      } else {
        setTimeout(() => {
          submenu.classList.add("visible");
        }, 400); // 0.4s delay
      }
    });
  });
});

interface Vehiculo {
  id: number;
  modelo: string;
  serie: string;
  precio: number;
  stock: number;
}

async function fetchVehiculos(serie?: string) {
  const url = serie
    ? `/api/vehiculos?serie=${encodeURIComponent(serie)}`
    : "/api/vehiculos";
  const res = await fetch(url);
  const data: Vehiculo[] = await res.json();
  renderVehiculos(data);
}

function normalizeFileName(modelo: string): string {
  return (
    modelo
      .toLowerCase()
      .replace(/\s+/g, "-") // espacios → guiones
      .replace(/[^\w-]/g, "") + // elimina caracteres especiales (+, /, etc.)
    ".png"
  );
}

function renderVehiculos(vehiculos: Vehiculo[]) {
  const grid = document.getElementById("vehiculos-grid");
  if (!grid) return;

  grid.innerHTML = vehiculos
    .map((v) => {
      const imgFile = normalizeFileName(v.modelo);
      const imgPath = `/images/vehiculos/${imgFile}`;

      return `
      <div class="vehiculo-card">
        <img src="${imgPath}" alt="${v.modelo}" />
        <h3>${v.modelo}</h3>
        <p>Serie: ${v.serie}<br/>Precio: C$${v.precio.toFixed(2)}</p>
        <a href="/HTML/detalle/${
          v.modelo
        }.html" class="vehiculo-btn">CONOCER MÁS</a>
      </div>
    `;
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("serie-select") as HTMLSelectElement;
  fetchVehiculos();
  select?.addEventListener("change", () => {
    const serie = select.value;
    fetchVehiculos(serie || undefined);
  });
});

interface Accesorio {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  serie: string;
}
function normalizeAccesorioFileName(nombre: string): string {
  return (
    nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "+")
      .replace(/[^\w+]/g, "") + ".png"
  );
}
async function fetchAccesorios(serie: string, containerId: string) {
  const res = await fetch(`/api/accesorios?serie=${encodeURIComponent(serie)}`);
  const accesorios: Accesorio[] = await res.json();
  console.log(`Accesorios para ${serie}:`, accesorios);
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = accesorios
    .map((a) => {
      const imgFile = normalizeAccesorioFileName(a.nombre);
      const imgPath = `/images/accesorios/${imgFile}`;
      return `
      <a href="/HTML/formaccesorios.html" class="vehiculo-card card-link">
        <img src="${imgPath}" alt="${
        a.nombre
      }" onerror="this.src='/images/placeholder.png'" />
        <h3>${a.nombre}</h3>
        <p>${a.descripcion}</p>
        <p><strong>Precio:</strong> C$${a.precio.toFixed(2)}</p>
        <span class="vehiculo-btn">Cotizar</span>
      </a>
    `;
    })
    .join("");
}
document.addEventListener("DOMContentLoaded", () => {
  fetchAccesorios("D5", "grid-d5");
  fetchAccesorios("D2", "grid-d2");
});

//form frontend

interface Departamento {
  id: number;
  nombre: string;
}

interface Municipio {
  id: number;
  nombre: string;
}

interface Modelo {
  id: number;
  nombre: string;
  precio: number;
  serie: string;
}

async function cargarModelos(): Promise<void> {
  const res = await fetch("/api/catalogo/modelos");
  const modelos: Modelo[] = await res.json();
  const select = document.getElementById(
    "modelo_vehiculo"
  ) as HTMLSelectElement;
  if (!select) return;
  modelos.forEach((m: Modelo) => {
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
      (document.getElementById("precio_base") as HTMLInputElement).value =
        precio;
      (document.getElementById("total_neto") as HTMLInputElement).value =
        precio;
    }
  });
}

async function cargarDepartamentos(): Promise<void> {
  const res = await fetch("/api/catalogo/departamentos");
  const departamentos: Departamento[] = await res.json();
  const select = document.getElementById("departamento") as HTMLSelectElement;
  if (!select) return;
  departamentos.forEach((d: Departamento) => {
    const opt = document.createElement("option");
    opt.value = String(d.id);
    opt.textContent = d.nombre;
    select.appendChild(opt);
  });

  select.addEventListener("change", async () => {
    const depId = select.value;
    const resMun = await fetch(`/api/catalogo/municipios/${depId}`);
    const municipios: Municipio[] = await resMun.json();
    const munSelect = document.getElementById("municipio") as HTMLSelectElement;
    if (!munSelect) return;
    munSelect.innerHTML = "<option disabled selected>Seleccione...</option>";
    municipios.forEach((m: Municipio) => {
      const opt = document.createElement("option");
      opt.value = String(m.id);
      opt.textContent = m.nombre;
      munSelect.appendChild(opt);
    });
  });
}
async function cargarAccesorios(): Promise<void> {
  const res = await fetch("/api/accesorios");
  const accesorios: Accesorio[] = await res.json();

  const select = document.getElementById(
    "accesorio_select"
  ) as HTMLSelectElement;
  if (!select) return;
  accesorios.forEach((a: Accesorio) => {
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
      (document.getElementById("precio_base") as HTMLInputElement).value =
        precio.toFixed(2);

      const cantidad = Number(
        (document.getElementById("cantidad") as HTMLInputElement).value || 1
      );
      (document.getElementById("total_neto") as HTMLInputElement).value = (
        precio * cantidad
      ).toFixed(2);
    }
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
async function getCsrfToken(): Promise<string> {
  const res = await fetch("/csrf-token");
  const data = await res.json();
  return data.csrfToken;
}
function validarNombreFront(nombre: string): string | null {
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
function validarTelefonoFront(telefono: string): string | null {
  const regex = /^\d{4}-\d{4}$/;
  const repetido = /^(\d)\1{7}$/;
  if (!regex.test(telefono)) return "Formato inválido (xxxx-xxxx)";
  const sinGuion = telefono.replace("-", "");
  if (repetido.test(sinGuion))
    return "El numero de telefono no puede repetir el mismo dígito 8 veces";
  return null;
}

function validarCedulaFront(cedula: string): string | null {
  const regex = /^\d{3}-\d{6}-\d{4}[A-Za-z]$/;
  if (!regex.test(cedula)) return "Formato inválido (001-000000-0000A)";
  if (cedula.length !== 16) return "La cedula debe tener 16 caracteres";
  return null;
}

function validarCorreoFront(correo: string): string | null {
  if (correo.length > 50)
    return "Correo demasiado extenso (máximo de 50 caracteres)";
  return null;
}

function validarDireccionFront(direccion: string): string | null {
  if (direccion.length > 100)
    return "Dirección demasiado larga (máximo de 100 caracteres)";
  return null;
}
function validarOrganizacionFront(nombre: string): string | null {
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

function validarProblemaFront(problema: string): string | null {
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
function validarUsernameFront(username: string): string | null {
  const trimmed = username.trim();
  if (trimmed.length < 3) return "El username es demasiado corto";
  if (trimmed.length > 25) return "El username no puede superar 25 caracteres";
  return null;
}
function validarNombreUsuarioFront(nombre: string): string | null {
  const trimmed = nombre.trim();
  if (trimmed.length < 3) return "El nombre es demasiado corto";
  if (trimmed.length > 25) return "El nombre no puede superar 25 caracteres";
  return null;
}
function validarCorreoUsuarioFront(correo: string): string | null {
  const trimmed = correo.trim();
  if (trimmed.length < 3) return "El correo es demasiado corto";
  if (trimmed.length > 50) return "El correo no puede superar 50 caracteres";
  return null;
}
function validarPasswordFront(pass: string): string | null {
  if (pass.length < 6) return "La contraseña debe tener al menos 6 caracteres";
  return null;
}
function validarCorreo(correo: string): string | null {
  const trimmed = correo.trim();
  if (trimmed.length < 3) return "El correo es demasiado corto";
  if (trimmed.length > 50) return "El correo no puede superar 50 caracteres";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(trimmed)) return "Formato de correo inválido";
  return null;
}
function initEventoFormDates(): void {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;
  const maxYear = yyyy + 3;
  const maxDate = `${maxYear}-${mm}-${dd}`;

  const fechaInicio = document.getElementById(
    "fecha_inicio"
  ) as HTMLInputElement | null;
  const fechaFin = document.getElementById(
    "fecha_fin"
  ) as HTMLInputElement | null;

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

function mostrarNotif(
  mensaje: string,
  tipo: "error" | "success" | "loading" = "loading"
) {
  const notif: HTMLDivElement = document.createElement("div");
  notif.className = "loader-notification";
  if (tipo === "error") notif.classList.add("error");
  if (tipo === "success") notif.classList.add("success");
  if (tipo === "loading") {
    notif.innerHTML = `
      <span>${mensaje}</span>
      <div class="loader-dots">
        <span></span><span></span><span></span>
      </div>
    `;
  } else {
    notif.innerHTML = `<span>${mensaje}</span>`;
  }
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  const vehiculoForm = document.querySelector(
    "form.vehiculo-form"
  ) as HTMLFormElement | null;
  const eventoForm = document.querySelector(
    "form.evento-form"
  ) as HTMLFormElement | null;
  const repuestosForm = document.querySelector(
    "form.repuestos-form"
  ) as HTMLFormElement | null;

  // --- Vehículos ---
  if (vehiculoForm) {
    vehiculoForm.addEventListener("submit", async (e: Event) => {
      e.preventDefault();
      const formData = new FormData(vehiculoForm);
      const data: Record<string, string> = {};
      formData.forEach((value, key) => (data[key] = value.toString()));
      // Validaciones
      const errorNombre = validarNombreFront(data.nombre);
      if (errorNombre) return mostrarNotif(errorNombre, "error");
      const errorTel = validarTelefonoFront(data.telefono);
      if (errorTel) return mostrarNotif(errorTel, "error");
      const errorCed = validarCedulaFront(data.cedula);
      if (errorCed) return mostrarNotif(errorCed, "error");
      const errorCorreo = validarCorreoFront(data.correo);
      if (errorCorreo) return mostrarNotif(errorCorreo, "error");
      const errorDir = validarDireccionFront(data.direccion);
      if (errorDir) return mostrarNotif(errorDir, "error");
      mostrarNotif("Enviando solicitud", "loading");
      try {
        const token = await getCsrfToken();
        const res = await fetch("/api/cotizacion/vehiculo", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": token,
          },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (res.ok && result.id) {
          mostrarNotif(result.message ?? "¡Éxito!", "success");
          vehiculoForm.reset();
        } else {
          mostrarNotif(
            "Error: " + (result.error ?? "Error desconocido"),
            "error"
          );
        }
      } catch (err) {
        console.error(err);
        mostrarNotif("Error de conexión", "error");
      }
    });
  }

  // --- Eventos ---
  if (eventoForm) {
    eventoForm.addEventListener("submit", async (e: Event) => {
      e.preventDefault();
      const formData = new FormData(eventoForm);
      const data: Record<string, string> = {};
      formData.forEach((value, key) => (data[key] = value.toString()));

      const errorOrg = validarOrganizacionFront(data.nombre);
      if (errorOrg) return mostrarNotif(errorOrg, "error");
      const errorCorreo = validarCorreoFront(data.correo);
      if (errorCorreo) return mostrarNotif(errorCorreo, "error");
      const errorDir = validarDireccionFront(data.direccion);
      if (errorDir) return mostrarNotif(errorDir, "error");

      mostrarNotif("Enviando solicitud", "loading");
      try {
        const token = await getCsrfToken();
        const res = await fetch("/api/cotizacion/evento", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": token,
          },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (res.ok && result.id) {
          mostrarNotif(result.message ?? "¡Éxito!", "success");
          eventoForm.reset();
        } else {
          mostrarNotif(
            "Error: " + (result.error ?? "Error desconocido"),
            "error"
          );
        }
      } catch (err) {
        console.error(err);
        mostrarNotif("Error de conexión", "error");
      }
    });
  }
  // --- Repuestos ---
  if (repuestosForm) {
    repuestosForm.addEventListener("submit", async (e: Event) => {
      e.preventDefault();
      const formData = new FormData(repuestosForm);
      const data: Record<string, string> = {};
      formData.forEach((value, key) => (data[key] = value.toString()));

      // Validaciones
      const errorNombre = validarNombreFront(data.nombre);
      if (errorNombre) return mostrarNotif(errorNombre, "error");
      const errorTel = validarTelefonoFront(data.telefono);
      if (errorTel) return mostrarNotif(errorTel, "error");
      const errorCed = validarCedulaFront(data.cedula);
      if (errorCed) return mostrarNotif(errorCed, "error");
      const errorCorreo = validarCorreoFront(data.correo);
      if (errorCorreo) return mostrarNotif(errorCorreo, "error");
      const errorDir = validarDireccionFront(data.direccion);
      if (errorDir) return mostrarNotif(errorDir, "error");
      const errorProb = validarProblemaFront(data.problema);
      if (errorProb) return mostrarNotif(errorProb, "error");

      mostrarNotif("Enviando solicitud", "loading");
      try {
        const token = await getCsrfToken();
        const res = await fetch("/api/cotizacion/repuestos", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": token,
          },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (res.ok && result.id) {
          mostrarNotif(result.message ?? "¡Éxito!", "success");
          repuestosForm.reset();
        } else {
          mostrarNotif(
            "Error: " + (result.error ?? "Error desconocido"),
            "error"
          );
        }
      } catch (err) {
        console.error(err);
        mostrarNotif("Error de conexión", "error");
      }
    });
  }
  // --- Accesorios ---
  const accesoriosForm = document.querySelector(
    "form.accesorios-form"
  ) as HTMLFormElement | null;

  if (accesoriosForm) {
    accesoriosForm.addEventListener("submit", async (e: Event) => {
      e.preventDefault();
      const formData = new FormData(accesoriosForm);
      const data: Record<string, string> = {};
      formData.forEach((value, key) => (data[key] = value.toString()));
      // Recalcular total neto antes de enviar
      const precio = Number(
        (document.getElementById("precio_base") as HTMLInputElement).value || 0
      );
      const cantidadCalc = Number(
        (document.getElementById("cantidad") as HTMLInputElement).value || 1
      );
      const totalNeto = precio * cantidadCalc;
      (document.getElementById("total_neto") as HTMLInputElement).value =
        totalNeto.toFixed(2);
      data.total_neto = totalNeto.toFixed(2);
      // Validaciones
      const errorNombre = validarNombreFront(data.nombre);
      if (errorNombre) return mostrarNotif(errorNombre, "error");
      const errorTel = validarTelefonoFront(data.telefono);
      if (errorTel) return mostrarNotif(errorTel, "error");
      const errorCed = validarCedulaFront(data.cedula);
      if (errorCed) return mostrarNotif(errorCed, "error");
      const errorCorreo = validarCorreoFront(data.correo);
      if (errorCorreo) return mostrarNotif(errorCorreo, "error");
      const errorDir = validarDireccionFront(data.direccion);
      if (errorDir) return mostrarNotif(errorDir, "error");
      const cantidad = Number(data.cantidad);
      if (isNaN(cantidad) || cantidad <= 0) {
        return mostrarNotif("La cantidad debe ser mayor a 0", "error");
      }
      mostrarNotif("Enviando solicitud", "loading");
      try {
        const token = await getCsrfToken();
        const res = await fetch("/api/accesorios/cotizacion", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": token,
          },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (res.ok && result.id) {
          mostrarNotif(result.message ?? "¡Éxito!", "success");
          accesoriosForm.reset();
        } else {
          mostrarNotif(
            "Error: " + (result.error ?? "Error desconocido"),
            "error"
          );
        }
      } catch (err) {
        console.error(err);
        mostrarNotif("Error de conexión", "error");
      }
    });
  }
});

// --- Admin ---
function initLogin(): void {
  const loginForm = document.getElementById(
    "loginForm"
  ) as HTMLFormElement | null;
  if (!loginForm) return;
  loginForm.addEventListener("submit", async (e: Event) => {
    e.preventDefault();
    const username = (
      document.getElementById("username") as HTMLInputElement
    ).value.trim();
    const password = (
      document.getElementById("password") as HTMLInputElement
    ).value.trim();
    if (!username || !password) {
      mostrarNotif("Debe ingresar usuario y contraseña", "error");
      return;
    }
    mostrarNotif("Verificando credenciales...", "loading");
    try {
      const token = await getCsrfToken();
      const res = await fetch("/admin/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": token,
        },
        body: JSON.stringify({ username, password }),
      });
      setTimeout(async () => {
        if (res.ok) {
          mostrarNotif("¡Bienvenido!", "success");
          setTimeout(() => {
            window.location.href = "/admin/admondashb0ard";
          }, 2000);
        } else {
          const text = await res.text();
          mostrarNotif(text || "Usuario o contraseña incorrectos", "error");
        }
      }, 3200);
    } catch (err) {
      console.error(err);
      mostrarNotif("Error de conexión con el servidor", "error");
    }
  });
}
function initCorreoRestore(): void {
  const correoForm = document.getElementById(
    "correoForm"
  ) as HTMLFormElement | null;
  if (!correoForm) return;
  correoForm.addEventListener("submit", async (e: Event) => {
    e.preventDefault();
    const correo = (
      document.getElementById("correores") as HTMLInputElement
    ).value.trim();
    if (!correo) {
      mostrarNotif("Ingrese un correo válido", "error");
      return;
    }
    mostrarNotif("Enviando correo...", "loading");
    try {
      const token = await getCsrfToken();
      const res = await fetch("/admin/restore-request", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": token,
        },
        body: JSON.stringify({ correores: correo }),
      });
      setTimeout(async () => {
        if (res.ok) {
          mostrarNotif("Correo enviado, revise su bandeja", "success");
        } else {
          const text = await res.text();
          mostrarNotif(text || "Error al enviar correo", "error");
        }
      }, 3200);
    } catch (err) {
      console.error(err);
      mostrarNotif("Error de conexión", "error");
    }
  });
}
function initRestorePass(): void {
  const restoreForm = document.getElementById("restoreForm") as HTMLFormElement | null;
  if (!restoreForm) return;

  // 👉 Leer token y username desde query params
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const username = params.get("username");

  if (username) {
    const userInput = document.getElementById("username") as HTMLInputElement | null;
    if (userInput) {
      userInput.value = username;
    }
  }

  restoreForm.addEventListener("submit", async (e: Event) => {
    e.preventDefault();

    const pw = (document.getElementById("newPassword") as HTMLInputElement).value.trim();
    const pw2 = (document.getElementById("confirmPassword") as HTMLInputElement).value.trim();

    if (!pw || pw !== pw2) {
      mostrarNotif("Las contraseñas no coinciden", "error");
      return;
    }

    mostrarNotif("Procesando...", "loading");

    try {
      const tokencsrf = await getCsrfToken();
      const res = await fetch(`/admin/restore/${token}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": tokencsrf,
        },
        body: JSON.stringify({ newPassword: pw }),
      });

      setTimeout(async () => {
        if (res.ok) {
          mostrarNotif("¡Contraseña restablecida con éxito!", "success");
          setTimeout(() => {
            window.location.href = "/admin/adlog1n";
          }, 2000);
        } else {
          const text = await res.text();
          mostrarNotif(text || "Error al restablecer", "error");
        }
      }, 3200);
    } catch (err) {
      console.error(err);
      mostrarNotif("Error de conexión", "error");
    }
  });
}

async function getCurrentUserRole(): Promise<number | null> {
  try {
    const res = await fetch("/admin/me", { credentials: "same-origin" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.authenticated) return null;
    return data.rol ?? null;
  } catch {
    return null;
  }
}
function hideUsuariosIfNotAdmin(rol: number | null): void {
  if (rol !== 1) {
    const usuariosLink = document.querySelector('[data-nav="usuarios"]');
    if (usuariosLink) {
      const li = usuariosLink.closest("li");
      if (li) li.remove();
    }
  }
}
function setActiveNav(key: string): void {
  document.querySelectorAll(".sidebar-nav a").forEach((a) => {
    a.classList.remove("active");
  });
  const active = document.querySelector(`[data-nav="${key}"]`);
  active?.classList.add("active");
}
const navGroups: Record<string, string> = {
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
function updateHeader(key: string): void {
  const pageTitle = document.getElementById("page-title");
  const breadcrumb = document.getElementById("breadcrumb");
  const groupLabel = navGroups[key] || "Main";
  const sectionLabel =
    key.replace("sol-", "").charAt(0).toUpperCase() +
    key.replace("sol-", "").slice(1);

  if (pageTitle) pageTitle.textContent = sectionLabel;
  if (breadcrumb) {
    breadcrumb.innerHTML = `${groupLabel} <i class="bx bx-chevron-right"></i> ${sectionLabel}`;
  }
}
function initSidebarToggle(): void {
  const toggleBtn = document.querySelector(".toggle-sidebar") as HTMLElement;
  const sidebar = document.querySelector(".sidebar") as HTMLElement;
  const container = document.querySelector(".admin-container") as HTMLElement;

  if (!toggleBtn || !sidebar || !container) return;

  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;
  const applyState = (hidden: boolean) => {
    if (isMobile()) {
      if (hidden) {
        sidebar.classList.remove("active");
        toggleBtn.innerHTML = '<i class="bx bx-menu"></i>';
      } else {
        sidebar.classList.add("active");
        toggleBtn.innerHTML = '<i class="bx bx-x"></i>';
      }
    } else {
      if (hidden) {
        container.classList.add("sidebar-collapsed");
        toggleBtn.innerHTML = '<i class="bx bx-menu"></i>';
      } else {
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
    } else {
      isHidden = false;
    }
    applyState(isHidden);
  });
}
// Vistas de panel admin
// usuarios
async function cargarUsuarios(): Promise<void> {
  try {
    const res = await fetch("/admin/usuarios", { credentials: "same-origin" });
    if (!res.ok) throw new Error("Error al cargar usuarios");
    const usuarios = await res.json();
    const tbody = document.querySelector("#section-usuarios tbody");
    if (!tbody) return;
    tbody.innerHTML = ""; // Limpiar tabla
    usuarios.forEach((u: any) => {
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
        const target = e.currentTarget as HTMLElement;
        const details = document.getElementById(
          "modificar-usuario"
        ) as HTMLDetailsElement;
        if (details) {
          details.open = true;
          details.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        const idInput = document.querySelector(
          "input[name='mod_id']"
        ) as HTMLInputElement;
        const usernameInput = document.querySelector(
          "input[name='mod_username']"
        ) as HTMLInputElement;
        const nombreInput = document.querySelector(
          "input[name='mod_nombre']"
        ) as HTMLInputElement;
        const correoInput = document.querySelector(
          "input[name='mod_correo']"
        ) as HTMLInputElement;
        const rolSelect = document.querySelector(
          "select[name='mod_rol']"
        ) as HTMLSelectElement;
        if (idInput) idInput.value = target.dataset.id || "";
        if (usernameInput) usernameInput.value = target.dataset.username || "";
        if (nombreInput) nombreInput.value = target.dataset.nombre || "";
        if (correoInput) correoInput.value = target.dataset.correo || "";
        if (rolSelect) rolSelect.value = target.dataset.rol || "";
      });
    });
  } catch (err) {
    console.error("Error al mostrar usuarios:", err);
  }
}

async function cargarRoles(): Promise<void> {
  try {
    const res = await fetch("/admin/roles", { credentials: "same-origin" });
    if (!res.ok) throw new Error("Error al cargar roles");
    const roles = await res.json();
    const selects = [
      document.querySelector("select[name='rol']") as HTMLSelectElement,
      document.querySelector("select[name='mod_rol']") as HTMLSelectElement,
    ];
    selects.forEach((select) => {
      if (!select) return;
      select.innerHTML = "";
      roles.forEach((r: any) => {
        const option = document.createElement("option");
        option.value = r.id;
        option.textContent = r.nombre;
        select.appendChild(option);
      });
    });
  } catch (err) {
    console.error("Error al mostrar roles:", err);
  }
}
function initAgregarUsuario(): void {
  const form = document.querySelector(
    "#agregar-usuario .form-wrapper"
  ) as HTMLElement;
  if (!form) return;

  const btnGuardar = form.querySelector("button") as HTMLButtonElement;
  btnGuardar.addEventListener("click", async (e) => {
    e.preventDefault();
    const username = (
      form.querySelector("input[name='username']") as HTMLInputElement
    ).value;
    const password = (
      form.querySelector("input[name='password_user']") as HTMLInputElement
    ).value;
    const nombre = (
      form.querySelector("input[name='nombre']") as HTMLInputElement
    ).value;
    const correo = (
      form.querySelector("input[name='correo']") as HTMLInputElement
    ).value;
    const rol = (form.querySelector("select[name='rol']") as HTMLSelectElement)
      .value;

    const errores: string[] = [];
    const errUser = validarUsernameFront(username);
    if (errUser) errores.push(errUser);
    const errPass = validarPasswordFront(password);
    if (errPass) errores.push(errPass);
    const errNombre = validarNombreUsuarioFront(nombre);
    if (errNombre) errores.push(errNombre);
    const errCorreo = validarCorreo(correo);
    if (errCorreo) errores.push(errCorreo);
    if (!rol) errores.push("Debe seleccionar un rol");
    if (errores.length > 0) {
      errores.forEach((err, i) =>
        setTimeout(() => mostrarNotif(err, "error"), i * 500)
      );
      return;
    }
    mostrarNotif("Guardando usuario...", "loading");
    try {
      const token = await getCsrfToken();
      const res = await fetch("/admin/usuarios", {
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
      const data = await res.json();
      if (!res.ok) {
        if (data.errores && Array.isArray(data.errores)) {
          data.errores.forEach((err: string, i: number) =>
            setTimeout(() => mostrarNotif(err, "error"), i * 500)
          );
        } else {
          mostrarNotif(data.error || "Error al crear usuario", "error");
        }
        return;
      }
      mostrarNotif("Usuario creado correctamente", "success");
      (form.querySelector("input[name='username']") as HTMLInputElement).value =
        "";
      (
        form.querySelector("input[name='password_user']") as HTMLInputElement
      ).value = "";
      (form.querySelector("input[name='nombre']") as HTMLInputElement).value =
        "";
      (form.querySelector("input[name='correo']") as HTMLInputElement).value =
        "";
      (
        form.querySelector("select[name='rol']") as HTMLSelectElement
      ).selectedIndex = 0;
      const details = document.getElementById(
        "agregar-usuario"
      ) as HTMLDetailsElement;
      if (details) details.open = false;
      cargarUsuarios(); // refrescar tabla
    } catch (err) {
      console.error("Error al crear usuario:", err);
      mostrarNotif("Error de conexión", "error");
    }
  });
}
function initModificarUsuario(): void {
  const form = document.querySelector(
    "#modificar-usuario .form-wrapper"
  ) as HTMLElement;
  if (!form) return;
  const btnActualizar = form.querySelector("button") as HTMLButtonElement;
  btnActualizar.addEventListener("click", async (e) => {
    e.preventDefault();
    const id = (form.querySelector("input[name='mod_id']") as HTMLInputElement)
      .value;
    const username = (
      form.querySelector("input[name='mod_username']") as HTMLInputElement
    ).value;
    const nombre = (
      form.querySelector("input[name='mod_nombre']") as HTMLInputElement
    ).value;
    const correo = (
      form.querySelector("input[name='mod_correo']") as HTMLInputElement
    ).value;
    const rol = (
      form.querySelector("select[name='mod_rol']") as HTMLSelectElement
    ).value;

    const errores: string[] = [];
    const errUser = validarUsernameFront(username);
    if (errUser) errores.push(errUser);
    const errNombre = validarNombreUsuarioFront(nombre);
    if (errNombre) errores.push(errNombre);
    const errCorreo = validarCorreo(correo);
    if (errCorreo) errores.push(errCorreo);
    if (!rol) errores.push("Debe seleccionar un rol");
    if (errores.length > 0) {
      errores.forEach((err, i) =>
        setTimeout(() => mostrarNotif(err, "error"), i * 500)
      );
      return;
    }
    mostrarNotif("Actualizando usuario...", "loading");
    try {
      const token = await getCsrfToken();
      const res = await fetch(`/admin/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": token,
        },
        credentials: "same-origin",
        body: JSON.stringify({ username, nombre, correo, rol_id: rol }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errores && Array.isArray(data.errores)) {
          data.errores.forEach((err: string, i: number) =>
            setTimeout(() => mostrarNotif(err, "error"), i * 500)
          );
        } else {
          mostrarNotif(data.error || "Error al actualizar usuario", "error");
        }
        return;
      }
      mostrarNotif("Usuario actualizado correctamente", "success");
      cargarUsuarios(); // refrescar tabla
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      mostrarNotif("Error de conexión", "error");
    }
  });
}
function initPasswordManagement(): void {
  // --- Enviar correo de restablecimiento ---
  const correoInput = document.querySelector(
    "input[name='reset_correo']"
  ) as HTMLInputElement;
  const btnCorreo = correoInput
    ?.closest(".form-wrapper")
    ?.querySelector("button");
  if (correoInput && btnCorreo) {
    btnCorreo.addEventListener("click", async (e) => {
      e.preventDefault();
      const correo = correoInput.value.trim();
      const error = validarCorreo(correo);
      if (error) return mostrarNotif(error, "error");
      mostrarNotif("Enviando correo...", "loading");
      try {
        const token = await getCsrfToken();
        const res = await fetch("/admin/restore-request", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": token,
          },
          body: JSON.stringify({ correores: correo }),
        });
        const text = await res.text();
        if (res.ok) {
          mostrarNotif("Correo enviado, revise su bandeja", "success");
        } else {
          mostrarNotif(text || "Error al enviar correo", "error");
        }
      } catch (err) {
        console.error(err);
        mostrarNotif("Error de conexión", "error");
      }
    });
  }
  // --- Forzar cambio de contraseña ---
  const usuarioInput = document.querySelector(
    "input[name='force_usuario']"
  ) as HTMLInputElement;
  const nuevaInput = document.querySelector(
    "input[name='force_nueva']"
  ) as HTMLInputElement;
  const confirmarInput = document.querySelector(
    "input[name='force_confirmar']"
  ) as HTMLInputElement;
  const btnForce = confirmarInput
    ?.closest(".form-wrapper")
    ?.querySelector("button");

  if (usuarioInput && nuevaInput && confirmarInput && btnForce) {
    btnForce.addEventListener("click", async (e) => {
      e.preventDefault();
      const usuario = usuarioInput.value.trim();
      const nueva = nuevaInput.value.trim();
      const confirmar = confirmarInput.value.trim();
      const errores: string[] = [];
      if (!usuario) errores.push("Debe ingresar el usuario");
      if (nueva.length < 6)
        errores.push("La nueva contraseña debe tener al menos 6 caracteres");
      if (nueva !== confirmar) errores.push("Las contraseñas no coinciden");
      if (errores.length > 0) {
        errores.forEach((err, i) =>
          setTimeout(() => mostrarNotif(err, "error"), i * 500)
        );
        return;
      }
      mostrarNotif("Actualizando contraseña...", "loading");
      try {
        const token = await getCsrfToken();
        const res = await fetch("/admin/force-password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": token,
          },
          body: JSON.stringify({ username: usuario, newPassword: nueva }),
        });
        const text = await res.text();
        if (res.ok) {
          mostrarNotif("Contraseña actualizada correctamente", "success");
        } else {
          mostrarNotif(text || "Error al actualizar", "error");
        }
      } catch (err) {
        console.error(err);
        mostrarNotif("Error de conexión", "error");
      }
    });
  }
}
function cargarClientes(): void {
  // Clientes Naturales
  fetch("/admin/clientes/naturales")
    .then((res) => res.json())
    .then((clientes) => {
      const tbody = document.getElementById("tabla-clientes-naturales")!;
      tbody.innerHTML = "";
      clientes.forEach((c: any) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${c.nombre_completo}</td>
          <td>${c.cedula || "-"}</td>
          <td>${c.telefono || "-"}</td>
          <td>${c.correo || "-"}</td>
          <td>${c.departamento || "-"}</td>
          <td>${c.municipio || "-"}</td>
          <td>${c.direccion || "-"}</td>
          <td><button class="cotizar-btn" data-id="${
            c.id
          }" data-tipo="natural">Editar</button></td>
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
      const tbody = document.getElementById("tabla-clientes-juridicos")!;
      tbody.innerHTML = "";
      clientes.forEach((c: any) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${c.nombre_empresa}</td>
          <td>${c.correo || "-"}</td>
          <td>${c.departamento || "-"}</td>
          <td>${c.municipio || "-"}</td>
          <td>${c.direccion || "-"}</td>
          <td><button class="cotizar-btn" data-id="${
            c.id
          }" data-tipo="juridico">Editar</button></td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch((err) => {
      console.error("Error al cargar clientes jurídicos:", err);
      mostrarNotif("Error al cargar clientes jurídicos", "error");
    });
}
async function cargarDepartamentosClientes(
  depSelectName: string,
  munSelectName: string
): Promise<void> {
  const depSelect = document.querySelector(
    `select[name='${depSelectName}']`
  ) as HTMLSelectElement;
  const munSelect = document.querySelector(
    `select[name='${munSelectName}']`
  ) as HTMLSelectElement;

  if (!depSelect || !munSelect) return;

  // Cargar departamentos
  const res = await fetch("/api/catalogo/departamentos");
  const departamentos: Departamento[] = await res.json();

  depSelect.innerHTML = "<option disabled selected>Seleccione...</option>";
  departamentos.forEach((d: Departamento) => {
    const opt = document.createElement("option");
    opt.value = String(d.id);
    opt.textContent = d.nombre;
    depSelect.appendChild(opt);
  });

  // Al cambiar departamento, cargar municipios
  depSelect.addEventListener("change", async () => {
    const depId = depSelect.value;
    const resMun = await fetch(`/api/catalogo/municipios/${depId}`);
    const municipios: Municipio[] = await resMun.json();
    munSelect.innerHTML = "<option disabled selected>Seleccione...</option>";
    municipios.forEach((m: Municipio) => {
      const opt = document.createElement("option");
      opt.value = String(m.id);
      opt.textContent = m.nombre;
      munSelect.appendChild(opt);
    });
  });
}
function initModificarClienteNatural(): void {
  const form = document.querySelector(
    "#modificar-cliente-natural .form-wrapper"
  ) as HTMLElement;
  if (!form) return;

  const btnActualizar = form.querySelector("button") as HTMLButtonElement;
  btnActualizar.addEventListener("click", async (e) => {
    e.preventDefault();

    const id = (
      form.querySelector("input[name='mod_nat_id']") as HTMLInputElement
    ).value;
    const primer_nombre = (
      form.querySelector(
        "input[name='mod_nat_primer_nombre']"
      ) as HTMLInputElement
    ).value;
    const segundo_nombre = (
      form.querySelector(
        "input[name='mod_nat_segundo_nombre']"
      ) as HTMLInputElement
    ).value;
    const primer_apellido = (
      form.querySelector(
        "input[name='mod_nat_primer_apellido']"
      ) as HTMLInputElement
    ).value;
    const segundo_apellido = (
      form.querySelector(
        "input[name='mod_nat_segundo_apellido']"
      ) as HTMLInputElement
    ).value;
    const cedula = (
      form.querySelector("input[name='mod_nat_cedula']") as HTMLInputElement
    ).value;
    const telefono = (
      form.querySelector("input[name='mod_nat_telefono']") as HTMLInputElement
    ).value;
    const correo = (
      form.querySelector("input[name='mod_nat_correo']") as HTMLInputElement
    ).value;
    const departamento = (
      form.querySelector(
        "select[name='mod_nat_departamento']"
      ) as HTMLSelectElement
    ).value;
    const municipio = (
      form.querySelector(
        "select[name='mod_nat_municipio']"
      ) as HTMLSelectElement
    ).value;
    const direccion = (
      form.querySelector("input[name='mod_nat_direccion']") as HTMLInputElement
    ).value;

    const errores: string[] = [];
    if (!primer_nombre) errores.push("Debe ingresar el primer nombre");
    if (!primer_apellido) errores.push("Debe ingresar el primer apellido");
    if (!cedula) errores.push("Debe ingresar la cédula");
    const errCorreo = validarCorreo(correo);
    if (errCorreo) errores.push(errCorreo);
    if (!departamento) errores.push("Debe seleccionar un departamento");
    if (!municipio) errores.push("Debe seleccionar un municipio");
    if (!direccion) errores.push("Debe ingresar la dirección");

    if (errores.length > 0) {
      errores.forEach((err, i) =>
        setTimeout(() => mostrarNotif(err, "error"), i * 500)
      );
      return;
    }

    mostrarNotif("Actualizando cliente natural...", "loading");
    try {
      const token = await getCsrfToken();
      const res = await fetch(`/admin/clientes/naturales/${id}`, {
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
      const data = await res.json();
      if (!res.ok) {
        if (data.errores && Array.isArray(data.errores)) {
          data.errores.forEach((err: string, i: number) =>
            setTimeout(() => mostrarNotif(err, "error"), i * 500)
          );
        } else {
          mostrarNotif(data.error || "Error al actualizar cliente", "error");
        }
        return;
      }
      mostrarNotif("Cliente natural actualizado correctamente", "success");
      cargarClientes(); // refrescar tablas
    } catch (err) {
      console.error("Error al actualizar cliente natural:", err);
      mostrarNotif("Error de conexión", "error");
    }
  });
}
function initModificarClienteJuridico(): void {
  const form = document.querySelector(
    "#modificar-cliente-juridico .form-wrapper"
  ) as HTMLElement;
  if (!form) return;
  const btnActualizar = form.querySelector("button") as HTMLButtonElement;
  btnActualizar.addEventListener("click", async (e) => {
    e.preventDefault();
    const id = (
      form.querySelector("input[name='mod_jur_id']") as HTMLInputElement
    ).value;
    const nombre_empresa = (
      form.querySelector("input[name='mod_jur_nombre']") as HTMLInputElement
    ).value;
    const correo = (
      form.querySelector("input[name='mod_jur_correo']") as HTMLInputElement
    ).value;
    const departamento = (
      form.querySelector(
        "select[name='mod_jur_departamento']"
      ) as HTMLSelectElement
    ).value;
    const municipio = (
      form.querySelector(
        "select[name='mod_jur_municipio']"
      ) as HTMLSelectElement
    ).value;
    const direccion = (
      form.querySelector("input[name='mod_jur_direccion']") as HTMLInputElement
    ).value;

    const errores: string[] = [];
    if (!nombre_empresa) errores.push("Debe ingresar el nombre de la empresa");
    const errCorreo = validarCorreo(correo);
    if (errCorreo) errores.push(errCorreo);
    if (!departamento) errores.push("Debe seleccionar un departamento");
    if (!municipio) errores.push("Debe seleccionar un municipio");
    if (!direccion) errores.push("Debe ingresar la dirección");

    if (errores.length > 0) {
      errores.forEach((err, i) =>
        setTimeout(() => mostrarNotif(err, "error"), i * 500)
      );
      return;
    }

    mostrarNotif("Actualizando cliente jurídico...", "loading");
    try {
      const token = await getCsrfToken();
      const res = await fetch(`/admin/clientes/juridicos/${id}`, {
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
      const data = await res.json();
      if (!res.ok) {
        if (data.errores && Array.isArray(data.errores)) {
          data.errores.forEach((err: string, i: number) =>
            setTimeout(() => mostrarNotif(err, "error"), i * 500)
          );
        } else {
          mostrarNotif(data.error || "Error al actualizar cliente", "error");
        }
        return;
      }
      mostrarNotif("Cliente jurídico actualizado correctamente", "success");
      cargarClientes(); // refrescar tablas
    } catch (err) {
      console.error("Error al actualizar cliente jurídico:", err);
      mostrarNotif("Error de conexión", "error");
    }
  });
}
document.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest("button");
  if (!btn) return;
  if (btn.dataset.tipo === "natural") {
    const fila = btn.closest("tr")!;
    const celdas = fila.querySelectorAll("td");
    (
      document.querySelector("input[name='mod_nat_id']") as HTMLInputElement
    ).value = btn.dataset.id!;
    (
      document.querySelector(
        "input[name='mod_nat_primer_nombre']"
      ) as HTMLInputElement
    ).value = extraerParte(celdas[0].textContent!, 0);
    (
      document.querySelector(
        "input[name='mod_nat_segundo_nombre']"
      ) as HTMLInputElement
    ).value = extraerParte(celdas[0].textContent!, 1);
    (
      document.querySelector(
        "input[name='mod_nat_primer_apellido']"
      ) as HTMLInputElement
    ).value = extraerParte(celdas[0].textContent!, 2);
    (
      document.querySelector(
        "input[name='mod_nat_segundo_apellido']"
      ) as HTMLInputElement
    ).value = extraerParte(celdas[0].textContent!, 3);
    (
      document.querySelector("input[name='mod_nat_cedula']") as HTMLInputElement
    ).value = celdas[1].textContent || "";
    (
      document.querySelector(
        "input[name='mod_nat_telefono']"
      ) as HTMLInputElement
    ).value = celdas[2].textContent || "";
    (
      document.querySelector("input[name='mod_nat_correo']") as HTMLInputElement
    ).value = celdas[3].textContent || "";
    (
      document.querySelector(
        "select[name='mod_nat_departamento']"
      ) as HTMLSelectElement
    ).value = celdas[4].textContent || "";
    (
      document.querySelector(
        "select[name='mod_nat_municipio']"
      ) as HTMLSelectElement
    ).value = celdas[5].textContent || "";
    (
      document.querySelector(
        "input[name='mod_nat_direccion']"
      ) as HTMLInputElement
    ).value = celdas[6].textContent || "";

    const detailsNat = document.getElementById(
      "modificar-cliente-natural"
    ) as HTMLDetailsElement;
    if (detailsNat) {
      detailsNat.open = true;
      detailsNat.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  if (btn.dataset.tipo === "juridico") {
    const fila = btn.closest("tr")!;
    const celdas = fila.querySelectorAll("td");
    (
      document.querySelector("input[name='mod_jur_id']") as HTMLInputElement
    ).value = btn.dataset.id!;
    (
      document.querySelector("input[name='mod_jur_nombre']") as HTMLInputElement
    ).value = celdas[0].textContent || "";
    (
      document.querySelector("input[name='mod_jur_correo']") as HTMLInputElement
    ).value = celdas[1].textContent || "";
    (
      document.querySelector(
        "select[name='mod_jur_departamento']"
      ) as HTMLSelectElement
    ).value = celdas[2].textContent || "";
    (
      document.querySelector(
        "select[name='mod_jur_municipio']"
      ) as HTMLSelectElement
    ).value = celdas[3].textContent || "";
    (
      document.querySelector(
        "input[name='mod_jur_direccion']"
      ) as HTMLInputElement
    ).value = celdas[4].textContent || "";
    const details = document.getElementById(
      "modificar-cliente-juridico"
    ) as HTMLDetailsElement;
    if (details) {
      details.open = true;
      details.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
});
function extraerParte(nombre: string, index: number): string {
  const partes = nombre.trim().split(" ");
  return partes[index] || "";
}
function cargarVehiculos(): void {
  fetch("/admin/vehiculos")
    .then((res) => res.json())
    .then((vehiculos) => {
      const tbody = document.getElementById("tabla-vehiculos")!;
      tbody.innerHTML = "";
      vehiculos.forEach((v: any) => {
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

async function cargarSelectVehiculos(): Promise<void> {
  const select = document.querySelector(
    "select[name='mod_vehiculo']"
  ) as HTMLSelectElement;
  if (!select) {
    console.error("No se encontró el select mod_vehiculo");
    return;
  }

  try {
    const res = await fetch("/admin/vehiculos");
    const vehiculos = await res.json();
    select.innerHTML =
      "<option disabled selected>Seleccione un vehículo...</option>";
    vehiculos.forEach((v: any) => {
      const opt = document.createElement("option");
      opt.value = String(v.id);
      opt.textContent = `${v.modelo_nombre} ${v.anio || ""} - ${v.marca || ""}`;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("Error al cargar vehículos en select:", err);
    mostrarNotif("Error al cargar vehículos en select", "error");
  }
}
document.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest("button");
  if (!btn) return;

  // --- Vehículos ---
  if (btn.dataset.tipo === "vehiculo") {
    const fila = btn.closest("tr")!;
    const celdas = fila.querySelectorAll("td");
    (
      document.querySelector("input[name='mod_veh_id']") as HTMLInputElement
    ).value = btn.dataset.id!;
    const selectVehiculo = document.querySelector(
      "select[name='mod_vehiculo']"
    ) as HTMLSelectElement;
    if (selectVehiculo) {
      const modeloTexto = `${celdas[0].textContent} ${celdas[1].textContent} - ${celdas[3].textContent}`;
      Array.from(selectVehiculo.options).forEach((opt) => {
        if (opt.textContent === modeloTexto) {
          selectVehiculo.value = opt.value;
        }
      });
    }
    const stockSelect = document.querySelector(
      "select[name='mod_stock']"
    ) as HTMLSelectElement;
    if (stockSelect) {
      stockSelect.value = celdas[5].textContent === "Hay stock" ? "1" : "0";
    }
    const detailsVeh = document.getElementById(
      "modificar-vehiculo"
    ) as HTMLDetailsElement;
    if (detailsVeh) {
      detailsVeh.open = true;
      detailsVeh.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
});
function initModificarVehiculo(): void {
  const form = document.querySelector(
    "#modificar-vehiculo .form-wrapper"
  ) as HTMLElement;
  if (!form) return;
  const btnActualizar = form.querySelector("button") as HTMLButtonElement;
  btnActualizar.addEventListener("click", async (e) => {
    e.preventDefault();
    const id = (
      form.querySelector("input[name='mod_veh_id']") as HTMLInputElement
    ).value;
    const stock = (
      form.querySelector("select[name='mod_stock']") as HTMLSelectElement
    ).value;
    mostrarNotif("Actualizando stock...", "loading");
    try {
      const token = await getCsrfToken();
      const res = await fetch(`/admin/vehiculos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": token,
        },
        credentials: "same-origin",
        body: JSON.stringify({ stock }),
      });
      const data = await res.json();
      if (!res.ok) {
        mostrarNotif(data.error || "Error al actualizar stock", "error");
        return;
      }
      mostrarNotif("Stock actualizado correctamente", "success");
      cargarVehiculos(); // refrescar tabla
    } catch (err) {
      console.error("Error al actualizar stock:", err);
      mostrarNotif("Error de conexión", "error");
    }
  });
}
function cargarSolicitudesVehiculos(): void {
  fetch("/admin/solicitudes/vehiculos")
    .then((res) => res.json())
    .then((solicitudes) => {
      const tbody = document.getElementById("tabla-cotizaciones-vehiculos")!;
      tbody.innerHTML = "";
      solicitudes.forEach((s: any) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${s.numero_factura || "-"}</td>
          <td>${s.cliente}</td>
          <td>${new Date(s.fecha_solicitud).toLocaleString()}</td>
          <td>${s.estado}</td>
          <td>
            <button class="cotizar-btn" data-id="${
              s.id
            }" data-tipo="sol-vehiculo">
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
  const btn = (e.target as HTMLElement).closest("button");
  if (!btn) return;
  if (btn.dataset.tipo === "sol-vehiculo") {
    const fila = btn.closest("tr")!;
    const celdas = fila.querySelectorAll("td");
    // Guardar id real en hidden
    (
      document.querySelector("input[name='cotizacion_id']") as HTMLInputElement
    ).value = btn.dataset.id!;
    // Mostrar factura en input visible
    (
      document.querySelector(
        "input[name='cotizacion_factura']"
      ) as HTMLInputElement
    ).value = celdas[0].textContent || "";
    // Estado actual
    const estadoSelect = document.querySelector(
      "select[name='cotizacion_estado']"
    ) as HTMLSelectElement;
    if (estadoSelect) {
      estadoSelect.value = celdas[3].textContent || "Aceptada";
    }
    const detailsCot = document.getElementById(
      "gestionar-cotizacion-vehiculo"
    ) as HTMLDetailsElement;
    if (detailsCot) {
      detailsCot.open = true;
      detailsCot.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
});
function initGestionarCotizacionVehiculo(): void {
  const form = document.querySelector(
    "#gestionar-cotizacion-vehiculo .form-wrapper"
  ) as HTMLElement;
  if (!form) return;

  const btnActualizar = form.querySelector("button") as HTMLButtonElement;
  btnActualizar.addEventListener("click", async (e) => {
    e.preventDefault();

    const id = (
      form.querySelector("input[name='cotizacion_id']") as HTMLInputElement
    ).value;
    const estado = (
      form.querySelector(
        "select[name='cotizacion_estado']"
      ) as HTMLSelectElement
    ).value;

    mostrarNotif("Actualizando estado...", "loading");
    try {
      const token = await getCsrfToken();
      const res = await fetch(`/admin/solicitudes/vehiculos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": token,
        },
        credentials: "same-origin",
        body: JSON.stringify({ estado }),
      });
      const data = await res.json();
      if (!res.ok) {
        mostrarNotif(data.error || "Error al actualizar estado", "error");
        return;
      }
      mostrarNotif(`Cotización ${id} actualizada a ${estado}`, "success");
      cargarSolicitudesVehiculos(); // refrescar tabla
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      mostrarNotif("Error de conexión", "error");
    }
  });
}
document.addEventListener("click", async (e) => {
  const btn = (e.target as HTMLElement).closest("button");
  if (!btn) return;

  // --- Enviar correo ---
  if (btn.dataset.tipo === "enviar-correo") {
    e.preventDefault();

    const id = (
      document.querySelector("input[name='cotizacion_id']") as HTMLInputElement
    ).value;
    const factura = (
      document.querySelector(
        "input[name='cotizacion_factura']"
      ) as HTMLInputElement
    ).value;
    const estado = (
      document.querySelector(
        "select[name='cotizacion_estado']"
      ) as HTMLSelectElement
    ).value;

    if (!id) {
      mostrarNotif("No se encontró la cotización seleccionada", "error");
      return;
    }

    mostrarNotif("Enviando correo...", "loading");
    try {
      const token = await getCsrfToken();
      const res = await fetch(`/admin/solicitudes/vehiculos/${id}/correo`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": token,
        },
        body: JSON.stringify({ estado, numero_factura: factura }),
      });
      const data = await res.json();
      if (!res.ok) {
        mostrarNotif(data.error || "Error al enviar correo", "error");
        return;
      }
      mostrarNotif(
        `Correo enviado para factura ${factura} (${estado})`,
        "success"
      );
    } catch (err) {
      console.error("Error al enviar correo:", err);
      mostrarNotif("Error de conexión", "error");
    }
  }
});
document.addEventListener("click", async (e) => {
  const btn = (e.target as HTMLElement).closest("button");
  if (!btn) return;

  if (btn.dataset.tipo === "logout") {
    e.preventDefault();
    try {
      const token = await getCsrfToken();
      const res = await fetch("/admin/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "CSRF-Token": token,
        },
      });
      const data = await res.json();
      if (res.ok) {
        mostrarNotif("Sesión cerrada correctamente", "success");
        window.location.href = "/admin/adlog1n";
      } else {
        mostrarNotif(data.error || "Error al cerrar sesión", "error");
      }
    } catch (err) {
      console.error("Error en logout:", err);
      mostrarNotif("Error de conexión", "error");
    }
  }
});
// Vistas de panel admin

function showSection(key: string): void {
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.add("hidden");
  });
  const target = document.getElementById(`section-${key}`);
  if (target) target.classList.remove("hidden");
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
function initPanelNavigation(): void {
  const toggleBtn = document.querySelector(".toggle-sidebar") as HTMLElement;
  const sidebar = document.querySelector(".sidebar") as HTMLElement;

  document.querySelectorAll(".sidebar-nav a").forEach((a) => {
    const key = a.getAttribute("data-nav");
    if (!key) return;
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

function initHomeActions(): void {
  document.querySelectorAll("#section-home .action-btn").forEach((btn) => {
    const key = btn.getAttribute("data-nav");
    if (!key) return;
    btn.addEventListener("click", () => {
      showSection(key);
      const sidebar = document.querySelector(".sidebar");
      const toggleBtn = document.querySelector(".toggle-sidebar");
      if (
        window.matchMedia("(max-width: 768px)").matches &&
        sidebar &&
        toggleBtn
      ) {
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
document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname.replace(/\/$/, "");
  if (path.includes("admondashb0ard")) {
    const rol = await getCurrentUserRole();
    hideUsuariosIfNotAdmin(rol);
    initPanelNavigation();
    initSidebarToggle();
    initHomeActions();
    initAgregarUsuario();
  }
});
document.addEventListener("DOMContentLoaded", async () => {
  const token = await getCsrfToken();
  document.querySelectorAll("input[name='_csrf']").forEach((input) => {
    (input as HTMLInputElement).value = token;
  });
});
