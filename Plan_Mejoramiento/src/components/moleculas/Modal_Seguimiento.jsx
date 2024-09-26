import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import ActaSeguimiento from '../organismos/ActaSeguimiento.jsx';
import Bitacoras from '../pages/Bitacoras.jsx';
import SeguimientosContext from '../../Context/ContextSeguimiento.jsx';

const ModalSeguimiento = ({ visible, onClose, id_seguimiento }) => {
  const seguimientoNumeros = {
    1: 1,
    2: 2,
    3: 3,
  };

  const { getSeguimiento, seguimiento } = useContext(SeguimientosContext);

  useEffect(() => {
    const fetchSeguimiento = async () => {
      try {
        await getSeguimiento(id_seguimiento);
      } catch (error) {
        console.error("Error al obtener el seguimiento:", error);
      }
    };
    fetchSeguimiento();
  }, [getSeguimiento, id_seguimiento]);

  if (!visible) {
    return null; // No renderiza el modal si no es visible
  }

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose} // Manejo del botón de cerrar modal en Android
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <ScrollView style={styles.contentContainer}>
            <Text style={styles.title}>Seguimiento {seguimientoNumeros[id_seguimiento]}</Text>
            <View style={styles.sectionContainer}>
              <ActaSeguimiento id_seguimiento={id_seguimiento} />
            </View>
            <View style={styles.sectionContainer}>
              <Bitacoras id_seguimiento={id_seguimiento} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro para el modal
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    position: 'relative',
    maxHeight: '80%', // Limitar la altura del modal
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
    textAlign: 'center', // Centrar el título
  },
  sectionContainer: {
    marginBottom: 32,
  },
});

export default ModalSeguimiento;