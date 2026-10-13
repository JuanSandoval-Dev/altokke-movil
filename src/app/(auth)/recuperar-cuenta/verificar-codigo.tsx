import {
  BotonPrincipal,
  CampoCodigoVerificacion,
  ContenedorPantalla,
  EncabezadoLogo,
} from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { paletaColores } from "@/paletaColores";
import { Ionicons } from "@expo/vector-icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function VerificacionCodigoScreen() {
  // Saco el correo que llego como parametro en la URL
  const { email } = useLocalSearchParams<{ email: string }>();

  const [codigo, setCodigo] = useState("");
  const [timer, setTimer] = useState(58);
  const [loading, setLoading] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    // Limpio el intervalo para no dejar nada colgado
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerificar = async () => {
    if (codigo.length < 6) {
      Alert.alert(
        "Código incompleto",
        "Por favor, ingresa el código completo de 6 dígitos.",
      );
      return;
    }

    setLoading(true);

    // Valido el codigo OTP de recuperacion en Supabase
    const { error } = await supabase.auth.verifyOtp({
      email: email || "",
      token: codigo.trim(),
      type: "recovery",
    });

    setLoading(false);

    if (error) {
      Alert.alert(
        "Código incorrecto",
        "El código OTP es inválido o ha expirado. Por favor, solicita uno nuevo."
      );
      return;
    }

    // Paso a la pantalla donde se define la nueva contraseña
    router.push("/recuperar-cuenta/nueva-contrasena");
  };

  const handleReenviar = async () => {
    if (timer > 0 || reenviando) return;
    if (!email) {
      Alert.alert("Error", "No se encontró el correo electrónico para reenviar el código.");
      return;
    }

    setReenviando(true);

    // Vuelvo a pedir el envio del codigo de recuperacion a Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email);

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
      <View style={styles.container}>
        <EncabezadoLogo />
        <Text style={styles.title}>Verificar cuenta</Text>
        <Text style={styles.subtitle}>
          Se ha enviado un código de 6 dígitos a{"\n"}
          {email || "tu correo electrónico"}
        </Text>
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
          titulo={loading ? "Verificando..." : "Verificar"}
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
        <View style={styles.footerContainer}>
          <Link href={"/login"} asChild>
            <Pressable>
              <Text style={styles.footerText}>Volver al inicio</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ContenedorPantalla>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: paletaColores.fondo,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
    color: paletaColores.texto,
    marginTop: 20,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: paletaColores.texto,
    marginBottom: 10,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 40,
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
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 40,
    marginTop: 40,
  },
  footerText: {
    color: paletaColores.textoSecundario,
    fontSize: 16,
    fontWeight: "500",
  },
});
