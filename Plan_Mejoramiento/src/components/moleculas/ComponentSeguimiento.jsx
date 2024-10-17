import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import SeguimientosContext from '../../Context/ContextSeguimiento.jsx';
import axiosClient from '../../axiosClient.js';
import RNFS from 'react-native-fs';

const ComponentSeguimiento = ({ id_seguimiento, numero }) => {
  const { getSeguimiento } = useContext(SeguimientosContext);
  const [seguimientoData, setSeguimientoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeguimientoData = async () => {
      setLoading(true);
      try {
        const response = await getSeguimiento(id_seguimiento);
        setSeguimientoData(response);
      } catch (err) {
        console.error('Error al cargar seguimiento:', err);
        Alert.alert('Error', 'Ocurrió un error al cargar el seguimiento');
      } finally {
        setLoading(false);
      }
    };

    fetchSeguimientoData();
  }, [id_seguimiento, getSeguimiento]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const downloadFile = async (id_seguimiento) => {
    console.log("ID de seguimiento:", id_seguimiento);
    try {
      const response = await axiosClient.get(`/seguimientos/descargarPdf/${id_seguimiento}`, {
        responseType: 'arraybuffer',
      });

      // Verificar que la respuesta contiene datos
      if (response.data) {
        // Crear un nombre para el archivo
        const filePath = `${RNFS.DocumentDirectoryPath}/acta_seguimiento_${id_seguimiento}.pdf`;

        // Convertir el arraybuffer a base64
        const base64Data = arrayBufferToBase64(response.data);

        // Escribir el archivo en el sistema de archivos
        await RNFS.writeFile(filePath, base64Data, 'base64');

        // Opcional: Puedes mostrar una alerta al usuario
        Alert.alert('Éxito', 'El archivo se ha descargado correctamente.', [{ text: 'OK' }]);
      } else {
        throw new Error("No se recibió ningún dato.");
      }
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      Alert.alert("Error", "No se pudo descargar el archivo.");
    }
  };

  if (loading) {
    return <Text>Cargando datos del seguimiento...</Text>;
  }

  if (!seguimientoData) {
    return <Text>No se encontró información del seguimiento.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Seguimiento {numero}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bitácoras</Text>
        {seguimientoData.bitacoras.map((bitacora) => (
          <View key={bitacora.id} style={styles.documentItem}>
            <Text style={styles.documentTitle}>{bitacora.titulo}</Text>
            <Text>Estado: {bitacora.estado}</Text>
            <Text>Fecha: {bitacora.fecha}</Text>
            <View style={styles.actionContainer}>
              <TouchableOpacity onPress={() => downloadFile(id_seguimiento)}>
                <Icon name="download" size={20} color="#2196F3" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acta</Text>
        <View style={styles.documentItem}>
          <Text style={styles.documentTitle}>{seguimientoData.acta.titulo}</Text>
          <Text>Estado: {seguimientoData.acta.estado}</Text>
          <Text>Fecha: {seguimientoData.acta.fecha}</Text>
          <View style={styles.actionContainer}>
            <TouchableOpacity onPress={() => downloadFile(id_seguimiento)}>
              <Icon name="download" size={20} color="#2196F3" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  documentItem: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
});

export default ComponentSeguimiento;
