import { EncabezadoLogo, PiePaginaAutenticacion } from "@/components/ui";
import { paletaColores } from "@/paletaColores";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("window");

export default function PantallaBienvenida() {
  return (
    <SafeAreaView style={styles.pantalla}>
      <View style={styles.contenido}>
        <View style={styles.topSection}>
          <EncabezadoLogo />

          <View style={styles.headerContainer}>
            <Text style={styles.titulo}>
              Tu mototaxi,{"\n"}
              <Text style={styles.tituloDestacado}>cuando lo necesites.</Text>
            </Text>
            <Text style={styles.descripcion}>
              Pide un viaje en Bagua de forma{"\n"}rápida y sencilla.
            </Text>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/img-central.png")}
            style={styles.ilustracion}
            contentFit="contain"
            transition={500}
          />
        </View>

        <View style={styles.bottomSection}>
          <Pressable
            style={({ pressed }) => [
              styles.premiumButtonWrapper,
              pressed && styles.premiumButtonPressed,
            ]}
            onPress={() => router.push("/crear-cuenta")}
          >
            <LinearGradient
              colors={["#00E085", "#0F9D58"]}
              style={styles.premiumButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.premiumButtonText}>Continuar</Text>
              <Ionicons name="arrow-forward" size={24} color="#0B0E0D" />
            </LinearGradient>
          </Pressable>

          <View style={styles.footerWrap}>
            <PiePaginaAutenticacion
              textoPregunta="¿Tienes una cuenta?"
              ruta={"/login"}
              textoEnlace="Iniciar sesión"
              mostrarBorde={false}
            />
          </View>

          <View style={styles.rolesContainer}>
            <View style={styles.linea} />
            <View style={styles.rolesContenido}>
              <Ionicons
                name="people-outline"
                size={22}
                color={paletaColores.textoSecundario}
              />
              <Text style={styles.indicadorRoles}>
                Pasajero o conductor en el siguiente paso
              </Text>
            </View>
            <View style={styles.linea} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: paletaColores.fondo,
  },
  contenido: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 24,
    paddingTop: 16,
  },
  topSection: {
    gap: 20,
  },
  headerContainer: {
    gap: 12,
  },
  titulo: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "600",
    color: paletaColores.texto,
    letterSpacing: -0.5,
  },
  tituloDestacado: {
    fontWeight: "800",
    color: paletaColores.verde,
  },
  descripcion: {
    fontSize: 18,
    lineHeight: 26,
    color: paletaColores.textoSecundario,
    fontWeight: "400",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
    maxHeight: height * 0.5,
  },
  ilustracion: {
    width: width, 
    height: "115%",
    alignSelf: "center",
  },
  bottomSection: {
    gap: 20,
  },
  premiumButtonWrapper: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    shadowColor: "#00E085",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  premiumButtonPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.15,
  },
  premiumButtonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    gap: 12,
  },
  premiumButtonText: {
    fontSize: 19,
    fontWeight: "700",
    color: "#0B0E0D",
    letterSpacing: 0.2,
  },
  footerWrap: {
    alignItems: "center",
    marginTop: -4,
  },
  rolesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  linea: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  rolesContenido: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  indicadorRoles: {
    fontSize: 15,
    color: paletaColores.textoSecundario,
    fontWeight: "500",
  },
});
