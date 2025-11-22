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
document.addEventListener("DOMContentLoaded", () => {
  cargarModelos();
  cargarDepartamentos();
});
// Validaciones en frontend
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
  if (nombre.length > 20) return "El nombre de la organización no puede superar 20 caracteres";
  return null;
}

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
  const vehiculoForm = document.querySelector("form.vehiculo-form") as HTMLFormElement | null;
  const eventoForm = document.querySelector("form.evento-form") as HTMLFormElement | null;

  // --- Vehículos ---
  if (vehiculoForm) {
    vehiculoForm.addEventListener("submit", async (e: Event) => {
      e.preventDefault();
      const formData = new FormData(vehiculoForm);
      const data: Record<string, string> = {};
      formData.forEach((value, key) => (data[key] = value.toString()));
      
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
        const res = await fetch("/api/cotizacion/vehiculo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (res.ok && result.id) {
          mostrarNotif(result.message ?? "¡Éxito!", "success");
          vehiculoForm.reset();
        } else {
          mostrarNotif("Error: " + (result.error ?? "Error desconocido"), "error");
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
        const res = await fetch("/api/cotizacion/evento", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (res.ok && result.id) {
          mostrarNotif(result.message ?? "¡Éxito!", "success");
          eventoForm.reset();
        } else {
          mostrarNotif("Error: " + (result.error ?? "Error desconocido"), "error");
        }
      } catch (err) {
        console.error(err);
        mostrarNotif("Error de conexión", "error");
      }
    });
  }
});
