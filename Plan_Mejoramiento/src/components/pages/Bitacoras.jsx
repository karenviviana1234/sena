import React, { useEffect, useState } from 'react';
import { Text, FlatList, View, StyleSheet } from 'react-native';
import Layout from '../Template/Layout';
import axiosClient from '../../axiosClient';

const Bitacoras = () => {
  const [bitacoras, setBitacoras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBitacoras = async () => {
      try {
        const response = await axiosClient.get('/bitacoras/listar');
        console.log(response.data); 
        setBitacoras(response.data);
      } catch (error) {
        console.error('Error fetching bitacoras:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBitacoras();
  }, []);

  const renderBitacora = ({ item }) => {
    
    const formattedDate = new Date(item.fecha).toLocaleDateString();

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Fecha: {formattedDate}</Text>
        <Text style={styles.itemSubtitle}>Bitácora: {item.bitacora}</Text>
        <Text style={styles.itemSubtitle}>Instructor: {item.instructor}</Text>
        <Text style={styles.itemSubtitle}>Seguimiento: {item.seguimiento}</Text>
        {item.bitacoraPdf && <Text style={styles.itemLink}>PDF disponible</Text>}
      </View>
    );
  };

  return (
    <Layout title={'Bitacoras'}>
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
    </Layout>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
