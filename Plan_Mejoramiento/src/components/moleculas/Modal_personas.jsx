import { StyleSheet, Text, TextInput, View, TouchableOpacity, Modal } from 'react-native';
import React from 'react';

const PersonasModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Perfil</Text>
          <TextInput
            style={styles.input}
            placeholder='Identificación'
          />
          <TextInput
            style={styles.input}
            placeholder='Nombre'
          />
            <TextInput
              style={styles.input}
              placeholder='Correo'
              keyboardType='email-address'
            />
          <TextInput
            style={styles.input}
            placeholder='Teléfono'
            keyboardType='phone-pad'
          />
          <TextInput
            style={styles.input}
            placeholder='Password'
            keyboardType='password'
          />
          <TextInput
            style={styles.input}
            placeholder='Rol'
            keyboardType='password'
          />
          <TextInput
            style={styles.input}
            placeholder='Cargo'

          />
          <TextInput
            style={styles.input}
            placeholder='Municipio'
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => {
                // Lógica para actualizar
              }}
            >
              <Text style={styles.updateButtonText}>Actualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background color with opacity
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 26,
    color: 'orange',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: '#28a745', 
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'red', 
    padding: 10,
    borderRadius: 5,
    flex: 1, 
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default PersonasModal;
