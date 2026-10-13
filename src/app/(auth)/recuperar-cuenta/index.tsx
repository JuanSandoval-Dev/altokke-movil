import {
  BotonPrincipal,
  CampoTexto,
  ContenedorPantalla,
  EncabezadoLogo,
  EncabezadoPagina,
} from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { paletaColores } from "@/paletaColores";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

export default function RecuperarPasswordScreen() {
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinuar = async () => {
    if (!correo.trim()) {
      Alert.alert(
        "Campo incompleto",
        "Por favor, ingresa tu correo electrónico para continuar.",
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.trim())) {
      Alert.alert(
        "Correo inválido",
        "Por favor, ingresa un correo electrónico válido.",
      );
      return;
    }

    setLoading(true);

    // Pido a Supabase el envio del codigo OTP para restablecer la contraseña
    const { error } = await supabase.auth.resetPasswordForEmail(correo.trim());

    setLoading(false);

    if (error) {
      Alert.alert(
        "Error al enviar código",
        error.message || "No se pudo enviar el código. Revisa que el correo esté registrado e inténtalo nuevamente."
      );
      return;
    }

    // Envie el correo como parametro para que el @ pase sin errores en la URL
    router.push(
      `/recuperar-cuenta/verificar-codigo?email=${encodeURIComponent(correo.trim())}`,
    );
  };

  return (
    <ContenedorPantalla estiloContenedorContenido={styles.scrollContent}>
      <View style={styles.content}>
        <EncabezadoLogo />

        <EncabezadoPagina
          titulo={"Recuperar\ncuenta"}
          tituloDestacado=""
          descripcion="Ingresa tu correo o teléfono para recuperar tu acceso."
        />

        <View style={styles.inputContainer}>
          <CampoTexto
            nombreIcono="mail-outline"
            placeholder="Correo electrónico o teléfono"
            keyboardType="email-address"
            autoCapitalize="none"
            value={correo}
            onChangeText={setCorreo}
          />
        </View>

        <BotonPrincipal
          titulo={loading ? "Enviando código..." : "Continuar"}
          onPress={handleContinuar}
          disabled={loading}
          estilo={styles.button}
        />

        <Link href={"/login"} style={styles.secondaryLink}>
          Usa otra forma de recuperación
        </Link>
      </View>

      <View style={styles.footer}>
        <Link href={"/login"} style={styles.secondaryLink}>
          Volver al inicio
        </Link>
      </View>
    </ContenedorPantalla>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  inputContainer: {
    marginTop: 30,
    marginBottom: 40,
  },
  button: {
    marginBottom: 30,
  },
  secondaryLink: {
    color: paletaColores.verde,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  footer: {
    paddingBottom: 40,
    alignItems: "center",
    marginTop: "auto",
  },
});
