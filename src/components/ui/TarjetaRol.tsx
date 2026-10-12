import { paletaColores } from "@/paletaColores";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export interface PropsTarjetaRol {
  titulo: string;
  subtitulo: string;
  nombreIcono: keyof typeof Ionicons.glyphMap;
  seleccionado: boolean;
  onPress: () => void;
}

export function TarjetaRol({
  titulo,
  subtitulo,
  nombreIcono,
  seleccionado,
  onPress,
}: PropsTarjetaRol) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        estilos.tarjeta,
        seleccionado ? estilos.tarjetaSeleccionada : estilos.tarjetaNoSeleccionada,
        pressed && estilos.tarjetaPresionada,
      ]}
    >
      <View
        style={[
          estilos.contenedorIcono,
          seleccionado
            ? estilos.contenedorIconoSeleccionado
            : estilos.contenedorIconoNoSeleccionado,
        ]}
      >
        <Ionicons
          name={nombreIcono}
          size={32}
          color={seleccionado ? paletaColores.textoOscuro : paletaColores.textoSecundario}
        />
      </View>
      <View style={estilos.contenedorTexto}>
        <Text style={estilos.titulo}>{titulo}</Text>
        <Text style={estilos.subtitulo}>{subtitulo}</Text>
      </View>
      <View style={estilos.contenedorCheck}>
        {seleccionado ? (
          <Ionicons
            name="checkmark-circle"
            size={32}
            color={paletaColores.boton}
          />
        ) : (
          <Ionicons
            name="ellipse-outline"
            size={32}
            color={paletaColores.textoSecundario}
          />
        )}
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  tarjetaPresionada: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  tarjetaSeleccionada: {
    borderColor: paletaColores.boton,
    backgroundColor: paletaColores.tarjeta,
  },
  tarjetaNoSeleccionada: {
    borderColor: paletaColores.borde,
    backgroundColor: paletaColores.superficie,
  },
  contenedorIcono: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  contenedorIconoSeleccionado: {
    backgroundColor: paletaColores.boton,
  },
  contenedorIconoNoSeleccionado: {
    backgroundColor: paletaColores.fondo,
  },
  contenedorTexto: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
  },
  titulo: {
    color: paletaColores.texto,
    fontSize: 20, // Increased for accessibility
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitulo: {
    color: paletaColores.textoSecundario,
    fontSize: 16, // Increased for accessibility
    lineHeight: 22,
  },
  contenedorCheck: {
    justifyContent: "center",
    alignItems: "center",
  },
});
