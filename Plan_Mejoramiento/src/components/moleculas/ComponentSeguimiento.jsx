import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import Icon from "react-native-vector-icons/FontAwesome";
import DocumentPicker from 'react-native-document-picker';
import { usePersonas } from '../../Context/ContextPersonas';

const ComponentSeguimiento = ({ seguimiento }) => {
  const { rol } = usePersonas();
  
  const bitacoras = [
    { title: 'Bitácora 9', status: 'Completado', date: '01-03-2024', file: 'bitacora9.pdf', color: '#4CAF50' },
    { title: 'Bitácora 10', status: 'No aprobado', date: '01-03-2024', file: 'bitacora10.pdf', color: '#F44336' },
    { title: 'Bitácora 11', status: 'Completado', date: '01-03-2024', file: 'bitacora11.pdf', color: '#4CAF50' },
    { title: 'Bitácora 12', status: 'Solicitud', date: '01-03-2024', file: '', color: '#FFC107' },
  ];

  const actividades = [
    { title: 'Corregir Bitácora 1' },
    { title: 'Corregir Bitácora 2' },
    { title: 'Corregir Bitácora 3' },
  ];

  const handleFileUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      console.log(res);
      // Aquí puedes manejar el archivo seleccionado (res)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.log('Unknown error: ', err);
      }
    }
  };

  const handleAccept = () => {
    Alert.alert('Acta aceptada');
  };

  const handleReject = () => {
    Alert.alert('Acta rechazada');
  };

  const handleEdit = () => {
    Alert.alert('Editar bitácora');
  };

  const handleDownload = (fileName) => {
    Alert.alert(`Descargar ${fileName}`);
    // Aquí puedes manejar la descarga del archivo
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.mainTitle}>Seguimiento {seguimiento?.id_seguimiento}</Text>
      <View style={styles.downloadContainer}>
        <Text style={styles.downloadText}>actaseguimiento{seguimiento?.id_seguimiento}.pdf</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => handleDownload(`actaseguimiento${seguimiento?.id_seguimiento}.pdf`)}>
            <Icon name="download" size={24} color="green" />
          </TouchableOpacity>
          {rol === 'Instructor' && (
            <TouchableOpacity onPress={handleFileUpload} style={styles.uploadButton}>
              <Icon name="upload" size={24} color="green" />
            </TouchableOpacity>
          )}
          
        </View>
          <View style={styles.buttonsActa}>
                    <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                    <Icon name="check" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
                    <Icon name="close" size={20} color="white" />
                  </TouchableOpacity>     
          </View>
      </View>

      <View style={styles.sectionsContainer}>
        {/* Bitácoras */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bitácoras</Text>
          {bitacoras.map((bitacora, index) => (
            <View key={index} style={styles.bitacoraContainer}>
              <View style={[styles.statusBadge, { backgroundColor: bitacora.color }]}>
                <Text style={styles.statusText}>{bitacora.status}</Text>
              </View>
              <Text style={styles.bitacoraTitle}>{bitacora.title}</Text>
              <Text style={styles.bitacoraDate}>{bitacora.date}</Text>
              <View style={styles.bitacoraActionsContainer}>
                {bitacora.file ? (
                  <View style={styles.fileActionsContainer}>
                    <TouchableOpacity onPress={() => handleDownload(bitacora.file)}>
                      <Icon name="download" size={24} color="green" />
                    </TouchableOpacity>
                    {rol !== 'Seguimiento' && (
                      <TouchableOpacity onPress={handleFileUpload} style={styles.uploadButton}>
                        <Icon name="upload" size={24} color="green" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                      <Icon name="edit" size={24} color="orange" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.uploadContainer}>
                    <Text style={styles.uploadText}>Cargar Archivo</Text>
                    <Icon name="upload" size={24} color="green" />
                  </View>
                )}
              </View>
              {rol === 'Seguimiento' && (
                <View style={styles.seguimientoButtonsContainer}>
                  <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                    <Icon name="check" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
                    <Icon name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Actividades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividades</Text>
          {actividades.map((actividad, index) => (
            <View key={index} style={styles.actividadContainer}>
              <Text style={styles.actividadTitle}>{actividad.title}</Text>
              <TouchableOpacity>
                <Text style={styles.verMasLink}>Ver más</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  downloadContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 24,
  },
  downloadText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonsActa: {
    display: 'flex',
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadButton: {
    marginLeft: 16,
  },
  sectionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bitacoraContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  bitacoraTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bitacoraDate: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  bitacoraActionsContainer: {
    marginBottom: 16,
  },
  fileActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  uploadText: {
    fontSize: 14,
    color: '#555',
  },
  seguimientoButtonsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actividadContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  actividadTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  verMasLink: {
    fontSize: 14,
    color: '#007bff',
  },
});

export default ComponentSeguimiento;
