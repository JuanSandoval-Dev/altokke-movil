import { paletaColores } from "@/paletaColores";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

interface PropsBotonRedesSociales {
  titulo: string;
  nombreIcono: keyof typeof Ionicons.glyphMap;
  colorIcono: string;
  onPress?: () => void;
}

export function BotonRedesSociales({ titulo, nombreIcono, colorIcono, onPress }: PropsBotonRedesSociales) {
  return (
    <Pressable 
      style={({ pressed }) => [
        estilos.botonRedSocial,
        pressed && estilos.botonPresionado
      ]} 
      onPress={onPress}
    >
      <Ionicons name={nombreIcono} size={26} color={colorIcono} />
      <Text style={estilos.textoBotonRedSocial}>{titulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botonRedSocial: {
    flex: 1,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: paletaColores.borde,
    borderRadius: 14,
    backgroundColor: paletaColores.superficie,
  },
  botonPresionado: {
    opacity: 0.7,
    backgroundColor: paletaColores.tarjeta,
  },
  textoBotonRedSocial: {
    color: paletaColores.texto,
    fontSize: 17,
    fontWeight: "600",
  },
});
