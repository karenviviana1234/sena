import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from "react-native-vector-icons/FontAwesome";

const ComponentSeguimiento = () => {
  const bitacoras = [
    { title: 'Bitácora 9', status: 'Completado', date: '01-03-2024', file: 'bitacora9.pdf', color: '#4CAF50' },
    { title: 'Bitácora 10', status: 'No aprobado', date: '01-03-2024', file: 'bitacora10.pdf', color: '#F44336' },
    { title: 'Bitácora 11', status: 'Completado', date: '01-03-2024', file: 'bitacora11.pdf', color: '#4CAF50' },
    { title: 'Bitácora 12', status: 'Solicitud', date: '01-03-2024', file: '', color: '#FFC107' },
  ];

  const actividades = [
    { title: 'Corregir Bitácora 1' },
    { title: 'Corregir Bitácora 1' },
    { title: 'Corregir Bitácora 1' },
  ];

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.mainTitle}>Seguimiento 3</Text>
        <View style={styles.downloadContainer}>
          <Text style={styles.downloadText}>actaseguimiento3.pdf</Text>
          <Icon name="download" size={24} color="green" />
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
                {bitacora.file ? (
                  <TouchableOpacity>
                    <Text style={styles.fileLink}>{bitacora.file}</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.uploadContainer}>
                    <Text style={styles.uploadText}>Cargar Archivo</Text>
                    <Icon name="upload" size={24} color="green" />
                    <Icon name="check-circle" size={24} color="green" />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 24,
  },
  downloadText: {
    fontSize: 16,
    color: '#333',
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
  fileLink: {
    fontSize: 14,
    color: '#007bff',
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
