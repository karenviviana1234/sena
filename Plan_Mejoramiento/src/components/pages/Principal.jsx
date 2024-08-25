import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Layout from '../Template/Layout';
import ModalBitacoras from '../moleculas/Modal_Bitacoras';
import Icon from 'react-native-vector-icons/FontAwesome'; // Asegúrate de que esta biblioteca esté correctamente vinculada

const Principal = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <Layout style={styles.text} title="Seguimientos">
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
            <Icon name="upload" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Subir Bitácora</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.text}>No se que meter aqui</Text>
        </View>
        <ModalBitacoras
          visible={modalVisible}
          onClose={handleCloseModal}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', 
  },
  buttonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  button: {
    backgroundColor: '#28a745', // Color verde
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2, // Para sombra en Android
    shadowColor: '#000', // Para sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  icon: {
    marginRight: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20, // Espacio debajo del texto
  },
});

export default Principal;
