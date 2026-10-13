import {
  BarraNavegacionSuperior,
  BotonPrincipal,
  CampoCodigoVerificacion,
  ContenedorPantalla,
  EncabezadoPagina,
  IndicadorPasos,
} from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { paletaColores } from "@/paletaColores";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function PasajeroVerificacionScreen() {
  // Tomo el correo que vino como parametro en la URL
  const { email } = useLocalSearchParams<{ email: string }>();

  const [codigo, setCodigo] = useState("");
  const [timer, setTimer] = useState(58);
  const [loading, setLoading] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  // Contador de segundos para volver a pedir el codigo
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerificar = async () => {
    if (codigo.length < 6) {
      Alert.alert(
        "Código incompleto",
        "Por favor, ingresa el código completo de 6 dígitos."
      );
      return;
    }

    setLoading(true);

    // Valido el codigo OTP de 6 digitos del registro con Supabase
    const { error } = await supabase.auth.verifyOtp({
      email: email || "",
      token: codigo.trim(),
      type: "signup",
    });

    setLoading(false);

    if (error) {
      Alert.alert(
        "Código incorrecto",
        "El código es inválido o ha expirado. Por favor, solicita uno nuevo."
      );
      return;
    }

    // Paso a la pantalla de preferencias tras validar el codigo
    router.push("/registro-pasajero/preferencias");
  };

  const handleReenviar = async () => {
    if (timer > 0 || reenviando) return;
    if (!email) {
      Alert.alert("Error", "No se encontró el correo electrónico para reenviar el código.");
      return;
    }

    setReenviando(true);

    // Vuelvo a pedir a Supabase el codigo OTP para este correo
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    setReenviando(false);

    if (error) {
      Alert.alert(
        "Error al reenviar",
        error.message || "No se pudo reenviar el código. Inténtalo más tarde."
      );
      return;
    }

    Alert.alert("Código reenviado", "Se envió un nuevo código de verificación a tu correo.");
    setTimer(58);
  };

  return (
    <ContenedorPantalla estiloContenedorContenido={styles.scrollContent}>
      <BarraNavegacionSuperior titulo="Altokke" />

      <EncabezadoPagina
        titulo="Verifica tu "
        tituloDestacado="correo"
        descripcion={`Ingresa el código de 6 dígitos que envié a:\n${email || "tu correo electrónico"}`}
      />

      <IndicadorPasos pasoActual={2} totalPasos={3} />

      <View style={styles.formContainer}>
        <CampoCodigoVerificacion numeroDigitos={6} onChangeText={setCodigo} />

        <View style={styles.timerContainer}>
          <Ionicons
            name="time-outline"
            size={16}
            color={paletaColores.textoSecundario}
          />
          <Text style={styles.timerText}>
            {timer > 0
              ? `Reenviar código en 00:${timer.toString().padStart(2, "0")}`
              : "Puedes reenviar el código"}
          </Text>
        </View>

        <BotonPrincipal
          titulo={loading ? "Verificando..." : "Confirmar código"}
          onPress={handleVerificar}
          disabled={loading}
          estilo={styles.verifyButton}
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>¿No recibiste el código? </Text>
          <Pressable onPress={handleReenviar} disabled={timer > 0 || reenviando}>
            <Text
              style={[
                styles.resendLink,
                (timer > 0 || reenviando) && { opacity: 0.5 },
              ]}
            >
              {reenviando ? "Reenviando..." : "Reenviar"}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footerContainer}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.footerText}>Atrás</Text>
        </Pressable>
      </View>
    </ContenedorPantalla>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  formContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 30,
    gap: 6,
  },
  timerText: {
    color: paletaColores.textoSecundario,
    fontSize: 16,
  },
  verifyButton: {
    marginTop: 10,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  resendText: {
    color: paletaColores.textoSecundario,
    fontSize: 16,
  },
  resendLink: {
    color: paletaColores.verde,
    fontSize: 16,
    fontWeight: "600",
  },
  footerContainer: {
    marginTop: "auto",
    alignItems: "center",
    paddingVertical: 16,
  },
  footerText: {
    color: paletaColores.textoSecundario,
    fontSize: 16,
    fontWeight: "500",
  },
});
