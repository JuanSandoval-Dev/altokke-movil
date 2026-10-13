import {
  BarraNavegacionSuperior,
  BotonPrincipal,
  CampoTextoHookForm,
  ContenedorPantalla,
  EncabezadoPagina,
  IndicadorPasos,
} from "@/components/ui";
import { useRegistroPasajero } from "@/context/RegistroPasajeroContext";
import { paletaColores } from "@/paletaColores";
import { buscarDNI } from "@/utils/apiDNI";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import * as yup from "yup";

const esquemaPaso2 = yup.object({
  dni: yup.string().length(8, "El DNI debe tener 8 dígitos").required("Requerido"),
  nombres: yup.string().required("Requerido"),
  apellidos: yup.string().required("Requerido"),
  telefono: yup.string().required("Requerido").min(9, "Debe tener 9 dígitos"),
});

export default function PasajeroIdentidadScreen() {
  const { datosPersonales, setDatosPersonales } = useRegistroPasajero();
  const [loadingDni, setLoadingDni] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(esquemaPaso2),
    defaultValues: {
      dni: datosPersonales.dni || "",
      nombres: datosPersonales.nombres || "",
      apellidos: datosPersonales.apellidos || "",
      telefono: datosPersonales.telefono || "",
    },
  });

  const dniActual = useWatch({ control, name: "dni" });

  // Cuando el usuario escribe los 8 digitos del DNI consulto la API automaticamente
  useEffect(() => {
    if (dniActual && dniActual.length === 8) {
      consultarAPI(dniActual);
    } else if (dniActual && dniActual.length < 8) {
      // Limpio los nombres si borra digitos del DNI
      setValue("nombres", "");
      setValue("apellidos", "");
    }
  }, [dniActual]);

  const consultarAPI = async (numeroDni: string) => {
    setLoadingDni(true);
    try {
      const datos = await buscarDNI(numeroDni);
      // Relleno nombres y apellidos con lo que devolvio la API
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

  const onSubmit = (data: any) => {
    // Guardo los datos de identidad y avanzo al paso de preferencias
    setDatosPersonales({ ...datosPersonales, ...data });
    router.push("/registro-pasajero/preferencias");
  };

  const onError = () => {
    Alert.alert(
      "Datos requeridos",
      "Por favor ingresa un número de DNI válido y tu teléfono para continuar."
    );
  };

  return (
    <ContenedorPantalla estiloContenedorContenido={styles.scrollContent}>
      <BarraNavegacionSuperior titulo="Altokke" />

      <EncabezadoPagina
        titulo="Validación de "
        tituloDestacado="identidad"
        descripcion="Para la seguridad de nuestra comunidad, requerimos tu documento de identidad."
      />

      <IndicadorPasos pasoActual={2} totalPasos={3} />

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
      </View>

      <View style={styles.buttonContainer}>
        <BotonPrincipal
          titulo="Siguiente"
          onPress={handleSubmit(onSubmit, onError)}
          disabled={loadingDni}
        />
      </View>
    </ContenedorPantalla>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40, flexGrow: 1 },
  formContainer: { gap: 16, marginBottom: 30, marginTop: 20 },
  buttonContainer: { marginBottom: 20, marginTop: "auto" },
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
