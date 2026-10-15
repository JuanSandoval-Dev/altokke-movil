import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";

export interface ResultadoAvatar {
  ok: boolean;
  url?: string;
  error?: string;
}

export interface InfoFotoSeleccionada {
  uri: string;
  base64?: string;
}

/**
 * Abre el selector de imágenes de Expo para elegir y recortar una foto de perfil en formato cuadrado (1:1).
 * Retorna la URI local y la representación base64 para envío rápido y confiable.
 */
export async function seleccionarFotoGaleria(): Promise<InfoFotoSeleccionada | null> {
  const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permiso.granted) {
    throw new Error("Se requiere permiso para acceder a la galería de fotos.");
  }

  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
    base64: true,
  });

  if (resultado.canceled || !resultado.assets?.[0]?.uri) {
    return null;
  }

  return {
    uri: resultado.assets[0].uri,
    base64: resultado.assets[0].base64 || undefined,
  };
}

/**
 * Envía una imagen local a la Edge Function `upload-avatar` de Supabase,
 * donde se valida el contenido con Sightengine y se guarda en Supabase Storage y DB.
 * Soporta tanto base64 como FormData para máxima compatibilidad.
 */
export async function subirFotoAvatar(
  uriOrInfo: string | InfoFotoSeleccionada,
  userId: string,
  base64Param?: string
): Promise<ResultadoAvatar> {
  try {
    const uri = typeof uriOrInfo === "string" ? uriOrInfo : uriOrInfo.uri;
    const base64 = typeof uriOrInfo === "string" ? base64Param : (uriOrInfo.base64 || base64Param);

    let bodyPayload: any;

    const nombreArchivo = uri.split("/").pop() || `avatar_${Date.now()}.jpg`;
    const extension = nombreArchivo.split(".").pop()?.toLowerCase();
    const mimeType = extension === "png" ? "image/png" : "image/jpeg";

    if (base64) {
      bodyPayload = {
        userId,
        base64,
        mimeType,
      };
    } else {
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: nombreArchivo,
        type: mimeType,
      } as any);
      formData.append("userId", userId);
      bodyPayload = formData;
    }

    const { data, error } = await supabase.functions.invoke("upload-avatar", {
      body: bodyPayload,
    });

    if (error) {
      let mensajeError = error.message || "Fallo en la subida o imagen rechazada.";
      try {
        if (error.context && typeof error.context.json === "function") {
          const cuerpo = await error.context.json();
          if (cuerpo?.error) {
            mensajeError = cuerpo.error;
          }
        }
      } catch {
        // En caso de que el context no contenga JSON
      }
      return { ok: false, error: mensajeError };
    }

    if (data?.error) {
      return { ok: false, error: data.error };
    }

    return { ok: true, url: data?.url };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || "Ocurrió un error inesperado al procesar la foto de perfil.",
    };
  }
}

/**
 * Función combinada para seleccionar y subir la foto directamente a la Edge Function
 * utilizando el userId real del usuario que ha iniciado sesión.
 */
export async function seleccionarYSubirFoto(userId: string): Promise<ResultadoAvatar | null> {
  const foto = await seleccionarFotoGaleria();
  if (!foto) return null;

  return await subirFotoAvatar(foto, userId);
}
