import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Layout from "../Template/Layout";
import Modal_Global from "../moleculas/Modal_Global";
import BotonRegistrar from "../atomos/BotonRegistrar";
import FormNovedad from "../moleculas/FormNovedad";
import { usePersonas } from "../../Context/ContextPersonas.jsx";
import { useEffect, useState } from "react";
import axiosClient from "../../axiosClient.js";
import ComponentSeguimiento from "../moleculas/ComponentSeguimiento.jsx";

const Seguimientos = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null); // Estado para controlar el componente que se renderiza
  const [selectedSeguimiento, setSelectedSeguimiento] = useState(null);
  const [bitacoras, setBitacoras] = useState([]);
  const [seguimientos, setSeguimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { rol } = usePersonas();

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

  const handleOpenModal = (id_seguimiento, component) => {
    setSelectedSeguimiento(id_seguimiento);
    setSelectedComponent(component);
    setModalVisible(true);

    if (component === ComponentSeguimiento) {
      const bitacorasFiltradas = bitacoras.filter(
        (bitacora) => bitacora.id_seguimiento === id_seguimiento
      );
      setBitacoras(bitacorasFiltradas);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedComponent(null); // Resetea el componente seleccionado al cerrar el modal
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
            onPress={() => handleOpenModal(null, FormNovedad)} // Abre el Modal_Global con FormNovedad
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
                        handleOpenModal(item[seguimiento], ComponentSeguimiento) // Abre el Modal_Global con ComponentSeguimiento
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
          onClose={handleCloseModal}
        >
          {selectedComponent === ComponentSeguimiento && (
            <ComponentSeguimiento seguimiento={selectedSeguimiento} />
          )}
          {selectedComponent === FormNovedad && <FormNovedad />}
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
