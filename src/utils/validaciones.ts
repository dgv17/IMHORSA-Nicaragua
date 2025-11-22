export function validarTelefono(telefono: string): string | null {
  const regex = /^\d{4}-\d{4}$/;
  const repetido = /^(\d)\1{7}$/;
  if (!regex.test(telefono)) return "Formato de teléfono inválido (8888-8888)";
  const sinGuion = telefono.replace("-", "");
  if (repetido.test(sinGuion))
    return "Teléfono no puede repetir el mismo dígito 8 veces";
  return null;
}

export function validarCedula(cedula: string): string | null {
  const regex = /^\d{3}-\d{6}-\d{4}[A-Za-z]$/;
  if (!regex.test(cedula))
    return "Formato de cédula inválido (001-000000-0000A)";
  if (cedula.length !== 16) return "La cédula debe tener 16 caracteres incluyendo guiones";
  return null;
}

export function dividirNombreCompleto(nombreCompleto: string) {
  const partes = nombreCompleto.trim().split(/\s+/);
  const primer_nombre = partes[0] || "";
  const segundo_nombre = partes.length > 3 ? partes[1] : null;
  const primer_apellido = partes.length > 1 ? partes[partes.length - 2] : "";
  const segundo_apellido = partes.length > 2 ? partes[partes.length - 1] : null;
  return { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido };
}
