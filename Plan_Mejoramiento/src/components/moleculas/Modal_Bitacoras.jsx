import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Modal, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker'; // Asegúrate de instalar este paquete
import DateTimePicker from '@react-native-community/datetimepicker';

const ModalBitacoras = ({ visible, onClose }) => {
  const [fecha, setFecha] = useState(new Date());
  const [bitacora, setBitacora] = useState('');
  const [seguimiento, setSeguimiento] = useState('');
  const [pdf, setPdf] = useState(null);
  const [instructor, setInstructor] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handlePickPDF = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setPdf(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    const currentDate = selectedDate || fecha;
    setFecha(currentDate);
  };

  const handleSubmit = () => {
    // Aquí puedes manejar el envío de los datos
    Alert.alert('Bitácora registrada', `Fecha: ${fecha.toDateString()}\nBitácora: ${bitacora}\nSeguimiento: ${seguimiento}\nInstructor: ${instructor}\nPDF: ${pdf ? pdf.name : 'No seleccionado'}`);
    onClose(); // Cierra el modal después de enviar
  };

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Registrar Bitácora</Text>
          
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inputText}>{fecha.toDateString()}</Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={fecha}
              mode='date'
              display='default'
              onChange={handleDateChange}
            />
          )}
          
          <TextInput
            style={styles.input}
            placeholder='Bitácora'
            value={bitacora}
            onChangeText={setBitacora}
          />
          <TextInput
            style={styles.input}
            placeholder='Seguimiento'
            value={seguimiento}
            onChangeText={setSeguimiento}
          />
          <TouchableOpacity
            style={styles.pdfButton}
            onPress={handlePickPDF}
          >
            <Text style={styles.pdfButtonText}>{pdf ? pdf.name : 'Seleccionar PDF'}</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder='Instructor'
            value={instructor}
            onChangeText={setInstructor}
          />
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
    justifyContent: 'center', // Center the content vertically
  },
  inputText: {
    fontSize: 16,
    color: 'black',
  },
  pdfButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%', // Mismo ancho que los inputs
    height: 50, // Mismo tamaño que los inputs
    justifyContent: 'center', // Centrar el texto verticalmente
  },
  pdfButtonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#28a745', 
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: 'red', 
    padding: 10,
    borderRadius: 5,
    flex: 1, 
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ModalBitacoras;
