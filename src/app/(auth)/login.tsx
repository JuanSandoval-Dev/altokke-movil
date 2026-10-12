import {
  BotonPrincipal,
  CampoTexto,
  ContenedorPantalla,
  EncabezadoLogo,
  EncabezadoPagina,
  PiePaginaAutenticacion,
} from "@/components/ui";
import { BotonRedesSociales } from "@/components/ui/BotonRedesSociales";
import { useAuth } from "@/context/AuthContext";
import { paletaColores } from "@/paletaColores";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [correoError, setCorreoError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = () => {
    setCorreoError(false);
    if (!correo.trim() || !contrasena.trim()) {
      Alert.alert(
        "Campos incompletos",
        "Por favor, ingresa tu correo y contraseña para continuar.",
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.trim())) {
      setCorreoError(true);
      return;
    }

    setLoading(true);
    // Simulo una entrada rapida a la app
    setTimeout(() => {
      setLoading(false);
      login("pasajero");
      router.replace("/mapa");
    }, 400);
  };

  const handleGoogleLogin = () => {
    // Entro directo como pasajero para probar la pantalla
    login("pasajero");
    router.replace("/mapa");
  };

  return (
    <ContenedorPantalla estiloContenedorContenido={styles.scrollContent}>
      <EncabezadoLogo />

      <View style={styles.headerContainer}>
        <EncabezadoPagina
          titulo={"Iniciar sesión\nen "}
          tituloDestacado="Altokke"
          descripcion={"Accede a tu cuenta y sigue\nmoviendo tu ciudad."}
        />
      </View>

      <View style={styles.formContainer}>
        <CampoTexto
          nombreIcono="mail-outline"
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
          error={correoError}
        />

        <CampoTexto
          nombreIcono="lock-closed-outline"
          placeholder="Contraseña"
          esPassword
          value={contrasena}
          onChangeText={setContrasena}
        />

        <Link href={"/recuperar-cuenta"} style={styles.forgotPassword}>
          ¿Olvidaste tu contraseña?
        </Link>

        <BotonPrincipal
          titulo={loading ? "Entrando..." : "Entrar"}
          onPress={handleLogin}
          disabled={loading}
        />
      </View>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>O continúa con</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.socialButtonsContainer}>
        <BotonRedesSociales
          titulo="Continuar con Google"
          nombreIcono="logo-google"
          colorIcono="#EA4335"
          onPress={handleGoogleLogin}
        />
      </View>

      <View style={styles.footerContainer}>
        <PiePaginaAutenticacion
          textoPregunta="¿No tienes una cuenta?"
          textoEnlace="Crear cuenta"
          ruta={"/crear-cuenta"}
          mostrarBorde={false}
        />
      </View>

      <Text style={styles.disclaimerText}>
        Al iniciar sesión, aceptas nuestros{"\n"}
        Términos de servicio y Política de privacidad.
      </Text>
    </ContenedorPantalla>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  formContainer: {
    gap: 16,
    marginBottom: 24,
  },
  forgotPassword: {
    color: paletaColores.verde,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "right",
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: paletaColores.borde,
  },
  dividerText: {
    color: paletaColores.textoSecundario,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  footerContainer: {
    marginTop: "auto",
    marginBottom: 24,
  },
  disclaimerText: {
    color: paletaColores.textoSecundario,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
