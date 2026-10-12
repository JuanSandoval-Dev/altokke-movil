// Consulto a api.apiperu.dev por POST para traer los datos de la persona con su DNI
export async function buscarDNI(dni: string) {
  const token = process.env.EXPO_PUBLIC_DNI_API_TOKEN?.trim();

  if (!token) {
    throw new Error("Servicio de validación no disponible temporalmente.");
  }

  try {
    const url = "https://api.apiperu.dev/dni";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ dni: dni.trim() }),
    });

    const data = await response.json();

    if (!response.ok || !data.success || !data.data) {
      throw new Error(data.message || "No se encontraron datos para este DNI.");
    }

    const { nombres, apellido_paterno, apellido_materno } = data.data;
    // Junto los apellidos paterno y materno para el formulario
    const apellidos = [apellido_paterno, apellido_materno]
      .filter(Boolean)
      .join(" ");

    return {
      nombres: nombres?.trim() || "",
      apellidos: apellidos?.trim() || "",
    };
  } catch (error: any) {
    throw error;
  }
}
