import { paletaColores } from "@/paletaColores";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

export interface PropsBotonPrincipal {
  titulo: string;
  onPress?: () => void;
  alPresionar?: () => void;
  estilo?: StyleProp<ViewStyle>;
  cargando?: boolean;
  disabled?: boolean;
}

export function BotonPrincipal({ 
  titulo, 
  onPress, 
  alPresionar,
  estilo,
  cargando,
  disabled
}: PropsBotonPrincipal) {
  const funcionAccion = onPress || alPresionar;

  return (
    <Pressable
      style={({ pressed }) => [
        estilos.boton,
        estilo,
        (disabled || cargando) && estilos.disabled,
        pressed && !disabled && !cargando && { backgroundColor: paletaColores.botonPresionado },
        pressed && estilos.presionado,
      ]}
      disabled={disabled || cargando}
      onPress={funcionAccion}
    >
      {cargando ? (
        <ActivityIndicator color={paletaColores.textoOscuro} />
      ) : (
        <View style={estilos.contenido}>
          <Text style={estilos.texto}>{titulo}</Text>
          <Ionicons 
            name="arrow-forward" 
            size={26} 
            color={paletaColores.textoOscuro} 
          />
        </View>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    width: "100%",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: paletaColores.boton,
    borderRadius: 16,
    marginTop: 3,
  },
  texto: { 
    fontSize: 19, 
    lineHeight: 24, 
    fontWeight: "700", 
    color: paletaColores.textoOscuro, 
  },
  disabled: {
    backgroundColor: "#A0A0A0",
  },
  presionado: { 
    transform: [{ scale: 0.98 }] 
  },
  contenido: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
});

export default BotonPrincipal;
