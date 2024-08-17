import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import Layout from "../Template/Layout";
import PersonasModal from "../moleculas/Modal_personas";
import Icon from "react-native-vector-icons/FontAwesome"; 

const Perfil = () => {
  const [modalVisible, setModalVisible] = useState(false);

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

        <View style={styles.infoContainer}>
          <Icon name="id-card" size={24} color="black" />
          <Text style={styles.text}>Identificación: 123456</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="user" size={24} color="black" />
          <Text style={styles.text}>Nombre: Alejo</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="phone" size={24} color="black" />
          <Text style={styles.text}>Teléfono: 22171237</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="envelope" size={24} color="black" />
          <Text style={styles.text}>Correo: manomano@gmail.com</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>
        <Image
          style={styles.logo}
          source={require("../../../public/logo_sigueme.png")}
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
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    marginLeft: 10, // Agrega espacio entre el ícono y el texto
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
