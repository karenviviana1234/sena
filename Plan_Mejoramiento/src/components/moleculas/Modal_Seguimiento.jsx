import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import ActaSeguimiento from '../organismos/ActaSeguimiento.jsx';
import Bitacoras from '../pages/Bitacoras.jsx';
import SeguimientosContext from '../../Context/ContextSeguimiento.jsx';
import axiosClient from '../../axiosClient'; 

const ModalSeguimiento = ({ visible, onClose }) => {
  const { getSeguimiento } = useContext(SeguimientosContext);
  const [idSeguimiento, setIdSeguimiento] = useState(null);
  const [bitacoras, setBitacoras] = useState([]); 
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchIdFromStorage = async () => {
      const id = await AsyncStorage.getItem('idSeguimiento');
      if (id) {
        setIdSeguimiento(id);
        try {
          const response = await axiosClient.get(`/bitacoras/bitacorasSeguimiento/${id}`);
          setBitacoras(response.data);
          setError(null); // Resetear el error si la solicitud es exitosa
        } catch (err) {
          // setError(`Error al obtener el seguimiento: ${err.message}`);
          setBitacoras([]); // Limpiar las bitácoras en caso de error
        }
      }
    };

    if (visible) { // Solo cargar datos si el modal está visible
      fetchIdFromStorage();
    } else {
      // Reiniciar el estado cuando el modal se cierra
      setIdSeguimiento(null);
      setBitacoras([]);
      setError(null); // Reiniciar el error
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <ScrollView style={styles.contentContainer}>
            <Text style={styles.title}>Seguimiento {idSeguimiento}</Text>
            <View style={styles.sectionContainer}>
              <ActaSeguimiento id_seguimiento={idSeguimiento} />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.subTitle}>Bitácoras</Text>
              {error ? (
                <Text style={styles.errorText}>{error}</Text> // Mostrar el mensaje de error
              ) : bitacoras.length > 0 ? (
                bitacoras.map((bitacora) => (
                  <View key={bitacora.id_bitacora} style={styles.bitacoraItem}>
                    <Text>Bitácora: {bitacora.bitacora}</Text>
                    <Text>Estado: {bitacora.estado}</Text>
                    <Text>Fecha: {new Date(bitacora.fecha).toLocaleDateString()}</Text>
                    <Text>Instructor: {bitacora.instructor}</Text>
                    <Text>PDF: {bitacora.pdf}</Text>
                    <Text>Seguimiento: {bitacora.seguimiento}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noBitacorasText}>No hay bitácoras disponibles.</Text>
              )}
            </View>
            <View style={styles.sectionContainer}>
              <Bitacoras id_seguimiento={idSeguimiento} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF0000',
    borderRadius: 50,
    padding: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 32,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  bitacoraItem: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  noBitacorasText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ModalSeguimiento;
