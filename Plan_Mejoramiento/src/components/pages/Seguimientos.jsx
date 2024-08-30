import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Layout from "../Template/Layout";
import axiosClient from "../../axiosClient";
import Modal_Global from "../moleculas/Modal_Global"; // Importa el Modal_Global
import BotonRegistrar from "../atomos/BotonRegistrar";
import FormNovedad from "../moleculas/FormNovedad";
import { usePersonas } from "../../Context/ContextPersonas.jsx";
import { useEffect, useState } from "react";

const Seguimientos = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSeguimiento, setSelectedSeguimiento] = useState(null);
  const [bitacoras, setBitacoras] = useState([]);
  const [seguimientos, setSeguimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {rol} = usePersonas();

  useEffect(() => {
    const obtenerSeguimientos = async () => {
      try {
        const response = await axiosClient.get(`/seguimientos/listarA`);
        setSeguimientos(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    obtenerSeguimientos();
  }, []);

  const handleOpenModal = (id_seguimiento, type) => {
    setSelectedSeguimiento(id_seguimiento);
    setModalVisible(true);
    const bitacorasFiltradas = bitacoras.filter(
      (bitacora) => bitacora.id_seguimiento === id_seguimiento
    );
    setBitacoras(bitacorasFiltradas);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <Layout title={"Seguimientos"}>
        <View style={styles.container}>
          <Text>Cargando...</Text>
        </View>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title={"Seguimientos"}>
        <View style={styles.container}>
          <Text>Error al cargar los seguimientos: {error}</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout title={"Seguimientos"}>
      <View style={styles.container}>
        {rol !== "Aprendiz" && (
          <BotonRegistrar
            titulo="Subir Novedad"
            onPress={() => setModalVisible(true)} // Abre el Modal_Global
          />
        )}
        <FlatList
          data={seguimientos}
          keyExtractor={(item) =>
            item.id_seguimiento
              ? item.id_seguimiento.toString()
              : Math.random().toString()
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>Aprendiz: {item.nombres}</Text>
              <Text style={styles.itemText}>Código: {item.codigo}</Text>
              <Text style={styles.itemText}>Empresa: {item.razon_social}</Text>
              <View style={styles.buttonContainer}>
                {["seguimiento1", "seguimiento2", "seguimiento3"].map(
                  (seguimiento) => (
                    <TouchableOpacity
                      key={seguimiento}
                      style={styles.button}
                      onPress={() =>
                        handleOpenModal(item[seguimiento], seguimiento)
                      }
                    >
                      <Text style={styles.buttonText}>
                        {new Date(item[seguimiento]).toLocaleDateString(
                          "es-ES"
                        )}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          )}
        />
        <Modal_Global
          visible={modalVisible}
          onClose={handleCloseModal} // Cierra el Modal_Global
        >
          <FormNovedad></FormNovedad>
        </Modal_Global>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "orange",
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  item: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  itemText: {
    fontSize: 18,
    marginBottom: 4,
  },
});

export default Seguimientos;
