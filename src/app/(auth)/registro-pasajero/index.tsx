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
import { esquemaPaso1 } from "@/utils/validaciones";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { Alert, StyleSheet, View } from "react-native";

export default function PasajeroDatosPersonalesScreen() {
  const { datosPersonales, setDatosPersonales } = useRegistroPasajero();

  const {
    control,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(esquemaPaso1),
    defaultValues: {
      correo: datosPersonales.correo || "",
      contrasena: datosPersonales.contrasena || "",
    },
  });

  const contrasenaActual = useWatch({ control, name: "contrasena" }) || "";

  const onSubmit = (data: any) => {
    // Guardo correo y contrasena en memoria y paso a la validacion de identidad
    setDatosPersonales({ ...datosPersonales, ...data });
    router.push("/registro-pasajero/verificacion");
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
        descripcion="Ingresa tus datos de acceso para comenzar."
      />

      <IndicadorPasos pasoActual={1} totalPasos={3} />

      <View style={styles.formContainer}>
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
          titulo="Siguiente"
          onPress={handleSubmit(onSubmit, onError)}
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
});

