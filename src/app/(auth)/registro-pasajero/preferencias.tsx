import {
  BarraNavegacionSuperior,
  BotonPrincipal,
  EncabezadoPagina,
} from "@/components/ui";
import { useRegistroPasajero } from "@/context/RegistroPasajeroContext";
import { paletaColores } from "@/paletaColores";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface OpcionPreferenciaProps {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  descripcion: string;
  value: boolean;
  alCambiar: (valor: boolean) => void;
}

function OpcionPreferencia({
  icono,
  titulo,
  descripcion,
  value,
  alCambiar,
}: OpcionPreferenciaProps) {
  return (
    <Pressable
      style={[styles.opcionCard, value && { borderColor: paletaColores.boton }]}
      onPress={() => alCambiar(!value)}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={icono}
          size={24}
          color={value ? paletaColores.boton : paletaColores.textoSecundario}
        />
      </View>
      <View style={styles.opcionTextos}>
        <Text style={styles.opcionTitulo}>{titulo}</Text>
        <Text style={styles.opcionDescripcion}>{descripcion}</Text>
      </View>
      <Ionicons
        name={value ? "checkmark-circle" : "ellipse-outline"}
        size={28}
        color={value ? paletaColores.boton : paletaColores.borde}
      />
    </Pressable>
  );
}

export default function PasajeroPreferenciasScreen() {
  const [notificaciones, setNotificaciones] = useState(true);
  const [ubicacion, setUbicacion] = useState(true);
  const [promociones, setPromociones] = useState(false);
  const [terminos, setTerminos] = useState(false);
  
  const { datosPersonales, clearRegistro } = useRegistroPasajero();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const opciones: OpcionPreferenciaProps[] = [
    {
      icono: "notifications-outline",
      titulo: "Permitir notificaciones",
      descripcion: "Recibe actualizaciones de tus viajes, alertas y más.",
      value: notificaciones,
      alCambiar: setNotificaciones,
    },
    {
      icono: "location-outline",
      titulo: "Compartir ubicación durante el viaje",
      descripcion: "Mejora tu seguridad al compartir tu ubicación en tiempo real.",
      value: ubicacion,
      alCambiar: setUbicacion,
    },
    {
      icono: "gift-outline",
      titulo: "Promociones y novedades",
      descripcion: "Recibe ofertas, descuentos y noticias de Altokke.",
      value: promociones,
      alCambiar: setPromociones,
    }
  ];

  return (
    <SafeAreaView style={styles.pantalla}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BarraNavegacionSuperior
          titulo="Altokke"
          componenteDerecho={
            <View style={styles.stepContainer}>
              <Text style={styles.stepText}>Paso 3 de 3</Text>
              <View style={styles.miniStepIndicator}>
                <View style={[styles.miniStep, styles.stepCompleted]} />
                <View style={[styles.miniStep, styles.stepCompleted]} />
                <View style={[styles.miniStep, styles.activeStep]} />
              </View>
            </View>
          }
        />

        <View style={styles.pageHeaderContainer}>
          <EncabezadoPagina
            titulo="Preferencias"
            tituloDestacado={"\n" + "y seguridad"}
            descripcion="Ajusta tu experiencia antes de empezar."
          />
        </View>

        <View style={styles.opcionesContainer}>
          {opciones.map((opcion, i) => (
            <OpcionPreferencia key={i} {...opcion} />
          ))}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="shield-checkmark" size={28} color={paletaColores.fondo} />
          </View>
          <View style={styles.infoTextos}>
            <Text style={styles.infoTitulo}>Tu información será protegida</Text>
            <Text style={styles.infoDescripcion}>
              Cuidamos tus datos y los usamos solo para brindarte un mejor servicio.
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.checkboxContainer}
          onPress={() => setTerminos(!terminos)}
        >
          <Ionicons
            name={terminos ? "checkbox" : "square-outline"}
            size={28}
            color={terminos ? paletaColores.boton : paletaColores.textoSecundario}
          />
          <Text style={styles.checkboxText}>
            Acepto los <Text style={styles.linkText}>términos y condiciones</Text> y la <Text style={styles.linkText}>política de privacidad</Text>.
          </Text>
        </Pressable>

        <BotonPrincipal
          titulo={loading ? "Creando cuenta..." : "Crear cuenta"}
          disabled={!terminos || loading}
          onPress={async () => {
            if (!terminos) {
              Alert.alert("Acción requerida", "Debes aceptar los términos y condiciones para continuar.");
              return;
            }

            if (
              !datosPersonales.nombres ||
              !datosPersonales.apellidos ||
              !datosPersonales.telefono ||
              !datosPersonales.dni
            ) {
              Alert.alert(
                "Datos incompletos",
                "Faltan datos obligatorios. Por favor regresa a los pasos anteriores y completa tu información."
              );
              return;
            }

            setLoading(true);

            // Si el usuario ingreso correo y contrasena, ejecuto el registro con signUp
            if (datosPersonales.correo && datosPersonales.contrasena) {
              // Cierro cualquier sesion previa residual para que el registro sea limpio
              await supabase.auth.signOut();

              const { data: signUpData, error } = await supabase.auth.signUp({
                email: datosPersonales.correo.trim(),
                password: datosPersonales.contrasena,
                options: {
                  data: {
                    nombre: datosPersonales.nombres,
                    apellidos: datosPersonales.apellidos,
                    telefono: datosPersonales.telefono,
                    dni: datosPersonales.dni,
                    notificaciones,
                    ubicacion,
                    promociones,
                    rol: "pasajero",
                  },
                },
              });

              setLoading(false);

              if (error) {
                console.log("Error en signUp de Supabase:", error.message);
                Alert.alert(
                  "Error de registro",
                  error.message || "No se pudo crear la cuenta. Inténtalo nuevamente más tarde."
                );
                return;
              }

              console.log("Usuario registrado con éxito en Supabase:", signUpData.user?.email);

              Alert.alert(
                "¡Bienvenido a Altokke!",
                "Tu cuenta ha sido creada exitosamente. Ya puedes iniciar sesión."
              );
              clearRegistro();
              router.replace("/login");
            } else {
              // Si no ingreso contrasena es porque inicio sesion con Google OAuth
              const { data: sessionData } = await supabase.auth.getSession();
              if (sessionData?.session) {
                const { error } = await supabase.auth.updateUser({
                  data: {
                    nombre: datosPersonales.nombres,
                    apellidos: datosPersonales.apellidos,
                    telefono: datosPersonales.telefono,
                    dni: datosPersonales.dni,
                    notificaciones,
                    ubicacion,
                    promociones,
                    rol: "pasajero",
                  },
                });

                setLoading(false);

                if (error) {
                  Alert.alert("Error de registro", "No se pudo actualizar la cuenta.");
                } else {
                  login("pasajero");
                  clearRegistro();
                  router.replace("/mapa");
                }
              } else {
                setLoading(false);
                Alert.alert("Datos incompletos", "Falta correo o contraseña.");
              }
            }
          }}
          estilo={styles.botonCrear}
        />

        <View style={styles.separadorContainer}>
          <Pressable
            onPress={() => router.back()}
            style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
          >
            <View style={styles.linea} />
            <Text style={styles.textoSeparador}>Atrás</Text>
            <View style={styles.linea} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: paletaColores.fondo },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },
  stepContainer: { alignItems: "flex-end", width: 80 },
  stepText: { fontSize: 15, color: paletaColores.texto, marginBottom: 6, fontWeight: "500" },
  miniStepIndicator: { flexDirection: "row", gap: 4 },
  miniStep: { height: 4, width: 20, borderRadius: 2 },
  stepCompleted: { backgroundColor: paletaColores.boton, opacity: 0.3 },
  activeStep: { backgroundColor: paletaColores.boton },
  pageHeaderContainer: { marginBottom: 24 },
  opcionesContainer: { gap: 16, marginBottom: 24 },
  opcionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: paletaColores.borde,
    borderRadius: 16,
    backgroundColor: paletaColores.fondo,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: paletaColores.input,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  opcionTextos: { flex: 1, paddingRight: 12 },
  opcionTitulo: { fontSize: 17, fontWeight: "700", color: paletaColores.texto, marginBottom: 6 },
  opcionDescripcion: { fontSize: 15, color: paletaColores.textoSecundario, lineHeight: 22 },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#003623",
    borderRadius: 16,
    marginBottom: 24,
  },
  infoIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: paletaColores.boton,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  infoTextos: { flex: 1 },
  infoTitulo: { fontSize: 17, fontWeight: "700", color: paletaColores.texto, marginBottom: 6 },
  infoDescripcion: { fontSize: 15, color: paletaColores.textoSecundario, lineHeight: 22 },
  checkboxContainer: { flexDirection: "row", alignItems: "flex-start", marginBottom: 24 },
  checkboxText: { flex: 1, marginLeft: 12, fontSize: 16, color: paletaColores.texto, lineHeight: 24 },
  linkText: { color: paletaColores.verde, textDecorationLine: "underline" },
  botonCrear: { marginBottom: 24 },
  separadorContainer: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  linea: { flex: 1, height: 1, backgroundColor: paletaColores.borde },
  textoSeparador: { fontSize: 16, color: paletaColores.verde, fontWeight: "600", marginHorizontal: 16 },
});
