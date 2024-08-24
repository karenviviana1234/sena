import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import Layout from "../Template/Layout";
import PersonasModal from "../moleculas/Modal_personas";
import Icon from "react-native-vector-icons/FontAwesome";
import axiosClient from "../../axiosClient";
import { usePersonas } from "../../Context/ContextPersonas";

const Perfil = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null); 
  const { id_persona } = usePersonas();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosClient.get(`/personas/buscar/${id_persona}`);
        console.log("Datos del usuario recibidos:", response.data); // Verifica los datos obtenidos
  
        // Si los datos vienen como un array, acceder al primer elemento
        if (Array.isArray(response.data) && response.data.length > 0) {
          setUserData(response.data[0]);
        } else {
          setUserData(response.data);
        }
  
        console.log("id persona", id_persona);
        
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error.response ? error.response.data : error.message);
      }
    };
  
    fetchUserData();
  }, [id_persona]);
  

  const handleEditProfile = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <Layout title={"Perfil"}>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil</Text>

        {userData ? (
          <>
            <View style={styles.infoContainer}>
              <Icon name="id-card" size={24} color="black" />
              <Text style={styles.text}>
                Identificación: {userData.identificacion}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <Icon name="user" size={24} color="black" />
              <Text style={styles.text}>Nombre: {userData.nombres}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Icon name="phone" size={24} color="black" />
              <Text style={styles.text}>Teléfono: {userData.telefono}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Icon name="envelope" size={24} color="black" />
              <Text style={styles.text}>Correo: {userData.correo}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Icon name="check-circle" size={24} color="black" />
              <Text style={styles.text}>Rol: {userData.rol}</Text>
            </View>
          </>
        ) : (
          <Text>Cargando datos del usuario...</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <Image
          style={styles.logo}
          source={require("../../../public/logo-sena-verde.png")}
        />

        <PersonasModal visible={modalVisible} onClose={handleCloseModal} />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    color: "black",
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    color: "black",
    fontSize: 20,
    marginLeft: 10, 
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    marginTop: 30,
    backgroundColor: "orange",
    width: 200,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
  },
  logo: {
    marginBottom: 5,
    marginTop: "40%",
    alignSelf: "center",
    width: 180,
    height: 180,
    borderRadius: 40,
  },
});

export default Perfil;
