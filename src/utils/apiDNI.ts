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
      const msg = (data?.message || "").toLowerCase();
      if (msg.includes("not found") || msg.includes("no encontrado")) {
        throw new Error("No se encontraron datos registrados para este número de DNI.");
      }
      if (msg.includes("unauthorized") || msg.includes("token") || msg.includes("forbidden")) {
        throw new Error("El servicio de validación RENIEC está temporalmente no disponible.");
      }
      throw new Error("No se pudo validar el DNI. Por favor verifica el número e inténtalo nuevamente.");
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
    const errorMsg = (error?.message || "").toLowerCase();
    if (errorMsg.includes("network request failed") || errorMsg.includes("fetch")) {
      throw new Error("Error de conexión. Verifica tu acceso a internet e inténtalo de nuevo.");
    }
    throw error;
  }
}
