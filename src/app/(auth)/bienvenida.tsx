import {
  BotonPrincipal,
  EncabezadoLogo,
  EncabezadoPagina,
  PiePaginaAutenticacion,
} from "@/components/ui";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PantallaBienvenida() {
  return (
    <LinearGradient
      colors={["#05150E", "#0A2217", "#06150E", "#040D08"]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={styles.pantalla}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topSection}>
            <EncabezadoLogo
              sinMargenSuperior
              estilo={styles.encabezadoLogoAjuste}
            />

            <View style={styles.headerContainer}>
              <EncabezadoPagina
                titulo={"Tu mototaxi,\n"}
                tituloDestacado="cuando lo necesites."
                descripcion="Pide tu viaje de forma rápida, segura y sencilla."
              />
            </View>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={require("@/assets/images/imagen-central-v2.png")}
              style={styles.ilustracion}
              contentFit="contain"
              transition={300}
              accessibilityRole="image"
              accessibilityLabel="Ilustración de mototaxi"
            />
          </View>

          <View style={styles.bottomSection}>
            <BotonPrincipal
              titulo="Continuar"
              onPress={() => router.push("/crear-cuenta")}
            />

            <View style={styles.footerWrap}>
              <PiePaginaAutenticacion
                textoPregunta="¿Ya tienes cuenta?"
                ruta="/login"
                textoEnlace="Iniciar sesión"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 24,
    paddingTop: 8,
  },
  topSection: {
    gap: 6,
  },
  encabezadoLogoAjuste: {
    width: "auto",
    marginBottom: 0,
    marginTop: 8,
  },
  headerContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  imageContainer: {
    flex: 1,
    minHeight: 220,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 14,
  },
  ilustracion: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
    transform: [{ scale: 1.18 }],
  },
  bottomSection: {
    gap: 20,
    paddingTop: 4,
  },
  footerWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: 2,
  },
});
