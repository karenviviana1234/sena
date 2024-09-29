import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import Layout from "../Template/Layout";
import Modal_Global from "../moleculas/Modal_Global";
import BotonRegistrar from "../atomos/BotonRegistrar";
import { usePersonas } from "../../Context/ContextPersonas.jsx";
import FormNovedad from "../moleculas/FormNovedad.jsx";
import ComponentSeguimiento from "../moleculas/ComponentSeguimiento.jsx";
import SeguimientosContext from "../../Context/ContextSeguimiento.jsx";

const Seguimientos = () => {
  const { rol } = usePersonas();
  const { seguimientos, getSeguimientos, getSeguimiento } = useContext(SeguimientosContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedSeguimiento, setSelectedSeguimiento] = useState(null);
  const [bitacoras, setBitacoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerSeguimientos = async () => {
      try {
        await getSeguimientos();
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener seguimientos:", error);
        setError("error al obtneer los seguimientos",error.message);
        setLoading(false);
      }
    };
    obtenerSeguimientos();
  }, [getSeguimientos]);

  const handleOpenModal = async (id_seguimiento, componentName) => {
    console.log("handleOpenModal llamado con id_seguimiento:", id_seguimiento);
    console.log("Componente seleccionado:", componentName);
  
    setSelectedComponent(componentName);
    setModalVisible(true);
  
    if (componentName === "ComponentSeguimiento") {
      setSelectedSeguimiento(id_seguimiento);
      
      console.log("ComponenteSeguimiento seleccionado con id_seguimiento:", id_seguimiento);
  
      try {
        const seguimiento = await getSeguimiento(id_seguimiento);
        if (seguimiento) {
          setBitacoras(seguimiento.bitacoras || []);
          setSelectedSeguimiento(seguimiento); // Pasar el objeto completo
        }
      } catch (error) {
        console.error("Error al obtener el seguimiento:", error);
      }
    }
  };
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedComponent(null);
    setSelectedSeguimiento(null);
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

  const componentsMap = {
    ComponentSeguimiento: (
      <ComponentSeguimiento seguimiento={selectedSeguimiento} />
    ),
    FormNovedad: <FormNovedad />,
  };
  

  return (
    <Layout title={"Seguimientos"}>
      <View style={styles.container}>
        {rol !== "Aprendiz" && (
          <BotonRegistrar
            titulo="Subir Novedad"
            onPress={() => handleOpenModal(null, "FormNovedad")}
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
                        handleOpenModal(item[seguimiento], "ComponentSeguimiento")
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
        <Modal_Global visible={modalVisible} onClose={handleCloseModal}>
          {componentsMap[selectedComponent] || <Text>No se ha seleccionado ningún componente</Text>}
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
