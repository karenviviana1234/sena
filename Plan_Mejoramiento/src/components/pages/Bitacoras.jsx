import React, { useEffect, useState } from 'react';
import { Text, FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
import Layout from '../Template/Layout';
import axiosClient from '../../axiosClient';
import ModalBitacoras from '../moleculas/Modal_Bitacoras';
import Icon from 'react-native-vector-icons/FontAwesome';

const Bitacoras = () => {
  const [bitacoras, setBitacoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchBitacoras = async () => {
      try {
        const response = await axiosClient.get('/bitacoras/listar');
        setBitacoras(response.data);
      } catch (error) {
        console.error('Error fetching bitacoras:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBitacoras();
  }, []);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const renderBitacora = ({ item }) => {
    const formattedDate = new Date(item.fecha).toLocaleDateString();

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Fecha: {formattedDate}</Text>
        <Text style={styles.itemSubtitle}>Bitácora: {item.bitacora}</Text>
        <Text style={styles.itemSubtitle}>Instructor: {item.instructor}</Text>
        <Text style={styles.itemSubtitle}>Seguimiento: {item.seguimiento}</Text>
        {item.bitacoraPdf && (
          <TouchableOpacity>
            <Text style={styles.itemLink}>Ver PDF</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Layout title={'Bitácoras'}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleOpenModal}>
            <Icon name="upload" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Subir Bitácora</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <Text>Cargando bitácoras...</Text>
        ) : (
          <FlatList
            data={bitacoras}
            keyExtractor={(item) => item.id_bitacora.toString()}
            renderItem={renderBitacora}
            ListEmptyComponent={<Text>No hay bitácoras registradas.</Text>}
          />
        )}
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
    padding: 20,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginBottom: 15,
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
  itemContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: 16,
    color: 'grey',
  },
  itemLink: {
    fontSize: 16,
    color: 'blue',
    marginTop: 5,
  },
});

export default Bitacoras;
