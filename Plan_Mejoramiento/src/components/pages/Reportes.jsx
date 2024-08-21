import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import Layout from "../Template/Layout";
import axiosClient from "../../axiosClient";

const Reportes = () => {
  const [seguimientos, setSeguimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerSeguimientos = async () => {
      try {
        const response = await axiosClient.get(`/seguimientos/listar`);
        console.log(response.data);

        setSeguimientos(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    obtenerSeguimientos();
  }, []);

  const handleButtonPress = (id, seguimientoType) => {
    // Lógica para manejar el botón, por ejemplo, navegar a una vista de detalle
    console.log(`Botón de ${seguimientoType} presionado para ID: ${id}`);
  };

  if (loading) {
    return (
      <Layout title={"Reportes"}>
        <View style={styles.container}>
          <Text>Cargando...</Text>
        </View>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title={"Reportes"}>
        <View style={styles.container}>
          <Text>Error al cargar los seguimientos: {error}</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout title={"Reportes"}>
      <View style={styles.container}>
        <FlatList
          data={seguimientos}
          keyExtractor={(item) => item.id_seguimiento.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>Fecha: {formatDate(item.fecha)}</Text>
              <Text style={styles.itemText}>Seguimiento: {item.seguimiento}</Text>
              <Text style={styles.itemText}>Estado: {item.estado === 1 ? "Activo" : "Inactivo"}</Text>
              <Text style={styles.itemText}>PDF: {item.pdf}</Text>
              <Text style={styles.itemText}>Productiva: {item.productiva}</Text>
              <Text style={styles.itemText}>Instructor: {item.instructor}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleButtonPress(item.id_seguimiento, 'Seguimiento 1')}
                >
                  <Text style={styles.buttonText}>Seguimiento 1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleButtonPress(item.id_seguimiento, 'Seguimiento 2')}
                >
                  <Text style={styles.buttonText}>Seguimiento 2</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleButtonPress(item.id_seguimiento, 'Seguimiento 3')}
                >
                  <Text style={styles.buttonText}>Seguimiento 3</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </Layout>
  );
};

// Función para formatear la fecha
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row', // Pone los botones en fila
    justifyContent: 'space-between', // Espacia los botones uniformemente
    marginTop: 10, // Espacio encima de los botones
  },
  button: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1, // Hace que los botones ocupen el mismo espacio
    marginHorizontal: 5, // Espacio entre los botones
  },
  buttonText: {
    color: '#fff', // Color del texto del botón
    fontSize: 16,
    textAlign: 'center', // Centra el texto en el botón
  },
  item: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4, // Espacio entre cada línea de texto
  },
});

export default Reportes;
