import {
  BarraNavegacionSuperior,
  BotonPrincipal,
  CampoTextoHookForm,
  ContenedorPantalla,
  EncabezadoPagina,
  IndicadorPasos,
  PiePaginaAutenticacion,
  MedidorPasswordSeguro,
} from "@/components/ui";
import { useRegistroPasajero } from "@/context/RegistroPasajeroContext";
import { supabase } from "@/lib/supabase";
import { paletaColores } from "@/paletaColores";
import { buscarDNI } from "@/utils/apiDNI";
import { esquemaRegistroPasajero } from "@/utils/validaciones";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

export default function PasajeroRegistroScreen() {
  const { datosPersonales, setDatosPersonales } = useRegistroPasajero();
  const [loadingDni, setLoadingDni] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(esquemaRegistroPasajero),
    defaultValues: {
      dni: datosPersonales.dni || "",
      nombres: datosPersonales.nombres || "",
      apellidos: datosPersonales.apellidos || "",
      telefono: datosPersonales.telefono || "",
      correo: datosPersonales.correo || "",
      contrasena: datosPersonales.contrasena || "",
    },
  });

  const dniActual = useWatch({ control, name: "dni" });
  const contrasenaActual = useWatch({ control, name: "contrasena" }) || "";

  // Consulto la API de DNI cuando el usuario termina de escribir los 8 digitos
  useEffect(() => {
    if (dniActual && dniActual.length === 8) {
      consultarAPI(dniActual);
    } else if (dniActual && dniActual.length < 8) {
      // Limpio los nombres si borro digitos del DNI
      setValue("nombres", "");
      setValue("apellidos", "");
    }
  }, [dniActual]);

  const consultarAPI = async (numeroDni: string) => {
    setLoadingDni(true);
    try {
      const datos = await buscarDNI(numeroDni);
      setValue("nombres", datos.nombres);
      setValue("apellidos", datos.apellidos);
    } catch (error: any) {
      Alert.alert(
        "Validación fallida",
        error?.message || "No se pudo validar el DNI. Por favor, verifica el número e inténtalo nuevamente."
      );
    } finally {
      setLoadingDni(false);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);

    // Registro el nuevo pasajero en Supabase Auth guardando sus datos en metadata
    const { error } = await supabase.auth.signUp({
      email: data.correo.trim(),
      password: data.contrasena,
      options: {
        data: {
          nombre: data.nombres,
          apellidos: data.apellidos,
          telefono: data.telefono,
          dni: data.dni,
          rol: "pasajero",
        },
      },
    });

    setLoading(false);

    if (error) {
      Alert.alert(
        "Error al crear cuenta",
        error.message || "Ocurrió un problema al registrar la cuenta. Inténtalo más tarde."
      );
      return;
    }

    // Guardo los datos en memoria para el paso de preferencias
    setDatosPersonales({ ...datosPersonales, ...data });

    // Envio el correo codificado en la URL hacia la pantalla de verificacion OTP
    router.push(
      `/registro-pasajero/verificacion?email=${encodeURIComponent(data.correo.trim())}`
    );
  };

  const onError = () => {
    Alert.alert(
      "Campos incompletos",
      "Por favor completa correctamente todos los campos para continuar."
    );
  };

  return (
    <ContenedorPantalla estiloContenedorContenido={styles.scrollContent}>
      <BarraNavegacionSuperior titulo="Altokke" />

      <EncabezadoPagina
        titulo="Crea tu cuenta "
        tituloDestacado="de pasajero"
        descripcion="Ingresa tus datos personales y de acceso para comenzar."
      />

      <IndicadorPasos pasoActual={1} totalPasos={3} />

      <View style={styles.formContainer}>
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={28} color={paletaColores.boton} />
          <Text style={styles.infoText}>
            Tu identidad será validada mediante conexión cifrada con el Registro Nacional de Identificación y Estado Civil (RENIEC).
          </Text>
        </View>

        <View style={styles.dniContainer}>
          <View style={{ flex: 1 }}>
            <CampoTextoHookForm
              control={control}
              name="dni"
              nombreIcono="card-outline"
              placeholder="Número de DNI"
              keyboardType="numeric"
              maxLength={8}
            />
          </View>
          {loadingDni && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator color={paletaColores.boton} />
            </View>
          )}
        </View>

        <CampoTextoHookForm
          control={control}
          name="nombres"
          nombreIcono="person-outline"
          placeholder="Nombres completos"
          editable={false}
          style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
        />

        <CampoTextoHookForm
          control={control}
          name="apellidos"
          nombreIcono="people-outline"
          placeholder="Apellidos completos"
          editable={false}
          style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
        />

        <CampoTextoHookForm
          control={control}
          name="telefono"
          nombreIcono="call-outline"
          placeholder="Teléfono celular (ej. 987654321)"
          keyboardType="phone-pad"
        />

        <CampoTextoHookForm
          control={control}
          name="correo"
          nombreIcono="mail-outline"
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <CampoTextoHookForm
            control={control}
            name="contrasena"
            nombreIcono="lock-closed-outline"
            placeholder="Contraseña"
            esPassword
            autoCapitalize="none"
          />
          <MedidorPasswordSeguro contrasena={contrasenaActual} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <BotonPrincipal
          titulo={loading ? "Creando cuenta..." : "Siguiente"}
          onPress={handleSubmit(onSubmit, onError)}
          disabled={loading || loadingDni}
        />
      </View>

      <PiePaginaAutenticacion
        textoPregunta="¿Ya tienes cuenta?"
        textoEnlace="Iniciar sesión"
        ruta={"/login"}
        mostrarBorde={false}
      />
    </ContenedorPantalla>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40, flexGrow: 1 },
  formContainer: { gap: 16, marginBottom: 30, marginTop: 20 },
  passwordContainer: { gap: 4 },
  buttonContainer: { marginBottom: 20 },
  dniContainer: { flexDirection: "row", alignItems: "center" },
  loaderContainer: { position: "absolute", right: 15, top: 15 },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "rgba(53, 233, 130, 0.1)",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    gap: 12,
    marginTop: -5,
    marginBottom: 5,
  },
  infoText: { color: paletaColores.texto, flex: 1, fontSize: 15, lineHeight: 22 },
});

