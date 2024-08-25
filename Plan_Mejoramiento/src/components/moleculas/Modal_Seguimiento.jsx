import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const Modal_Seguimiento = ({ visible, onClose }) => {
  const [bitacoras, setBitacoras] = useState([
    { id_bitacora: 1, pdf: null },
    { id_bitacora: 2, pdf: null },
    { id_bitacora: 3, pdf: null },
    { id_bitacora: 4, pdf: null },
    { id_bitacora: 5, pdf: null },
    { id_bitacora: 6, pdf: null },
    { id_bitacora: 7, pdf: null },
    { id_bitacora: 8, pdf: null },
    { id_bitacora: 9, pdf: null },
    { id_bitacora: 10, pdf: null },
    { id_bitacora: 11, pdf: null },
    { id_bitacora: 12, pdf: null }
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  const handlePickPDF = async (id_bitacora) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      const updatedBitacoras = bitacoras.map(bitacora =>
        bitacora.id_bitacora === id_bitacora ? { ...bitacora, pdf: res[0] } : bitacora
      );
      setBitacoras(updatedBitacoras);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        throw err;
      }
    }
  };

  const handleSubmit = () => {
    const allBitacorasFilled = bitacoras.every(bitacora => bitacora.pdf !== null);
    
    if (!allBitacorasFilled) {
      Alert.alert('Error', 'Debe subir un PDF para cada bitácora.');
      return;
    }

    // Lógica para enviar las bitácoras
    // ...

    Alert.alert('Éxito', 'Bitácoras subidas correctamente.');
    onClose();
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < bitacoras.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedBitacoras = bitacoras.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Subir Bitácoras</Text>

          {paginatedBitacoras.map((bitacora) => (
            <View key={bitacora.id_bitacora} style={styles.bitacoraContainer}>
              <Text style={styles.bitacoraLabel}>Bitácora {bitacora.id_bitacora}</Text>
              <TouchableOpacity
                style={styles.pdfButton}
                onPress={() => handlePickPDF(bitacora.id_bitacora)}
              >
                <Text style={styles.pdfButtonText}>
                  {bitacora.pdf ? bitacora.pdf.name : 'Seleccionar PDF'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={styles.paginationButton}
              onPress={handlePreviousPage}
              disabled={currentPage === 0}
            >
              <Text style={styles.paginationButtonText}>Anterior</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.paginationButton}
              onPress={handleNextPage}
              disabled={(currentPage + 1) * itemsPerPage >= bitacoras.length}
            >
              <Text style={styles.paginationButtonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Registrar</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bitacoraContainer: {
    width: '100%',
    marginBottom: 15,
  },
  bitacoraLabel: {
    fontSize: 18,
    marginBottom: 5,
  },
  pdfButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfButtonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  paginationButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  paginationButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Modal_Seguimiento;
