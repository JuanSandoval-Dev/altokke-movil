import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View, FlatList } from "react-native";
import { paletaColores } from "@/paletaColores";

export interface PropsSelectorOpciones {
  placeholder: string;
  nombreIcono: keyof typeof Ionicons.glyphMap;
  value: string;
  opciones: string[];
  alSeleccionar: (value: string) => void;
}

export function SelectorOpciones({
  placeholder,
  nombreIcono,
  value,
  opciones,
  alSeleccionar,
}: PropsSelectorOpciones) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Pressable style={estilos.contenedor} onPress={() => setModalVisible(true)}>
        <Ionicons name={nombreIcono} size={21} color={paletaColores.textoSecundario} />
        <Text style={[estilos.texto, !value && estilos.placeholder]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={21} color={paletaColores.textoSecundario} />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={estilos.superposicionModal} onPress={() => setModalVisible(false)}>
          <View style={estilos.contenidoModal}>
            <View style={estilos.cabeceraModal}>
              <Text style={estilos.tituloModal}>{placeholder}</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={paletaColores.texto} />
              </Pressable>
            </View>
            <FlatList
              data={opciones}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={estilos.itemOpcion}
                  onPress={() => {
                    alSeleccionar(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[estilos.textoOpcion, value === item && estilos.textoOpcionSeleccionada]}>
                    {item}
                  </Text>
                  {value === item && (
                    <Ionicons name="checkmark" size={20} color={paletaColores.boton} />
                  )}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    width: "100%",
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: paletaColores.borde,
    borderRadius: 14,
    backgroundColor: paletaColores.input,
  },
  texto: {
    flex: 1,
    fontSize: 16,
    color: paletaColores.texto,
  },
  placeholder: {
    color: paletaColores.textoSecundario,
  },
  superposicionModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  contenidoModal: {
    backgroundColor: paletaColores.fondo,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "50%",
    borderWidth: 1,
    borderColor: paletaColores.borde,
  },
  cabeceraModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  tituloModal: {
    fontSize: 18,
    fontWeight: "bold",
    color: paletaColores.texto,
  },
  itemOpcion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: paletaColores.borde,
  },
  textoOpcion: {
    fontSize: 16,
    color: paletaColores.texto,
  },
  textoOpcionSeleccionada: {
    color: paletaColores.verde,
    fontWeight: "bold",
  },
});
