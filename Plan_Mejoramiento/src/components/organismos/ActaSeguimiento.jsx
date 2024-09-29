import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ActaSeguimiento = ({ handleSubmit, id_seguimiento, onIdSend }) => {
  const [seguimiento, setSeguimiento] = useState([]);
  const [estadoActaVisible, setEstadoActaVisible] = useState(false);
  const [fecha, setFecha] = useState("");
  const [seguimientoPdf, setSeguimientoPdf] = useState(null);
  const [idPersona, setIdPersona] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [estado, setEstado] = useState(null);
  const [pdfName, setPdfName] = useState(null);

  const seguimientoNumeros = {
    1: 1,
    2: 2,
    3: 3,
  };

  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10);
    setFecha(currentDate);
    
    const getUserData = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user");
        if (userJson) {
          const user = JSON.parse(userJson);
          if (user && user.id_persona) {
            setIdPersona(user.id_persona);
            console.log("ID de persona asignado:", user.id_persona);
          } else {
            console.warn("No se encontró un 'id_persona' válido en el usuario.");
          }
        } else {
          console.warn("No se encontró un valor válido para 'user' en AsyncStorage.");
          setIdPersona(null);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    getUserData();

    if (onIdSend && id_seguimiento) {
      onIdSend(id_seguimiento);
    }
  }, [id_seguimiento, onIdSend]);

  useEffect(() => {
    if (id_seguimiento) {
      axios.get(`/seguimientos/listarEstado/${id_seguimiento}`)
        .then(response => {
          setEstado(response.data.estado);
          setPdfName(response.data.pdf);
        })
        .catch(error => {
          console.error('Error al obtener el estado del seguimiento:', error);
        });
    }
  }, [id_seguimiento]);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserRole(user.cargo);
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
      }
    };

    getUserRole();
  }, []);

  const handleActaPdfSubmit = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setSeguimientoPdf(res[0]);
      setEstadoActaVisible(true);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        console.error(err);
      }
    }
  };

  const handleSubmitActa = async () => {
    if (!seguimientoPdf) {
      Alert.alert("Error", "Debes cargar un archivo PDF para poder enviarlo");
      return;
    }

    if (pdfName) {
      const result = await new Promise((resolve) => {
        Alert.alert(
          "¿Estás seguro?",
          "Ya existe un PDF cargado, ¿quieres reemplazarlo?",
          [
            { text: "Cancelar", onPress: () => resolve(false), style: "cancel" },
            { text: "Sí, reemplazar", onPress: () => resolve(true) }
          ]
        );
      });

      if (!result) {
        return;
      }
    }

    if (!id_seguimiento) {
      console.error("ID de seguimiento no definido");
      Alert.alert("Error", "ID de seguimiento no definido");
      return;
    }

    const formData = new FormData();
    if (seguimientoPdf) {
      formData.append("seguimientoPdf", {
        uri: seguimientoPdf.uri,
        type: seguimientoPdf.type,
        name: seguimientoPdf.name,
      });
    }

    try {
      const response = await axios.post(
        `/seguimientos/cargarPDF/${id_seguimiento}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Éxito", "Acta enviada correctamente");
        if (handleSubmit) handleSubmit();
      } else {
        Alert.alert("Error", "Error al enviar el Acta.");
      }
    } catch (error) {
      console.error("Error del servidor:", error);
      Alert.alert("Error del servidor", error.message);
    }
  };

  const handleAprobar = async (id_seguimiento) => {
    try {
      const result = await new Promise((resolve) => {
        Alert.alert(
          "¿Estás seguro?",
          "¿Quieres aprobar esta Acta?",
          [
            { text: "No, cancelar", onPress: () => resolve(false), style: "cancel" },
            { text: "Sí, Aprobar", onPress: () => resolve(true) }
          ]
        );
      });

      if (!result) {
        return;
      }

      if (!id_seguimiento) {
        console.error("ID de seguimiento no proporcionado");
        Alert.alert("Error", "El ID de seguimiento no está definido.");
        return;
      }

      const response = await axios.put(`/seguimientos/aprobar/${id_seguimiento}`);

      if (response.status === 200) {
        Alert.alert("Aprobado", "El acta ha sido aprobada correctamente");

        setSeguimiento((prevSeguimiento) =>
          prevSeguimiento.filter((seguimiento) => seguimiento.id_seguimiento !== id_seguimiento)
        );
      } else {
        throw new Error("Error inesperado durante la aprobación.");
      }
    } catch (error) {
      console.error("Error al aprobar el acta:", error);
      Alert.alert("Error", "No se pudo aprobar el acta. Intenta nuevamente.");
    }
  };

  const handleNoAprobar = async (id_seguimiento) => {
    // Similar to handleAprobar, but with different text and endpoint
  };

  const downloadFile = async (id_seguimiento) => {
    Alert.alert("Información", "La funcionalidad de descarga no está disponible en esta versión móvil.");
  };

  const estadoConfig = {
    aprobado: {
      color: "green",
      icon: "check-circle",
    },
    noAprobado: {
      color: "red",
      icon: "close-circle",
    },
    solicitud: {
      color: "orange",
      icon: "alert-circle",
    },
  };

  const { color, icon } = estadoConfig[estado] || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acta:</Text>
      <View style={styles.card}>
        <Text style={styles.subtitle}>
          Acta N° {seguimientoNumeros[id_seguimiento] || 1}:
        </Text>

        {pdfName && (
          <Text style={styles.pdfName}>{pdfName}</Text>
        )}

        <View style={styles.buttonContainer}>
          {estado !== 'aprobado' && (userRole !== 'Administrativo' && userRole !== 'Aprendiz' && userRole !== 'Coordinador') && (
            <TouchableOpacity style={styles.button} onPress={handleActaPdfSubmit}>
              <Text style={styles.buttonText}>Subir PDF</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={() => downloadFile(id_seguimiento)}>
            <Text style={styles.buttonText}>Descargar</Text>
          </TouchableOpacity>
          {(userRole !== 'Instructor' && userRole !== 'Aprendiz') && (
            <TouchableOpacity style={styles.button} onPress={() => handleAprobar(id_seguimiento)}>
              <Text style={styles.buttonText}>Aprobar</Text>
            </TouchableOpacity>
          )}
          {(userRole !== 'Instructor' && userRole !== 'Aprendiz') && (
            <TouchableOpacity style={styles.button} onPress={() => handleNoAprobar(id_seguimiento)}>
              <Text style={styles.buttonText}>No Aprobar</Text>
            </TouchableOpacity>
          )}
          {estado !== 'aprobado' && (userRole !== 'Administrativo' && userRole !== 'Aprendiz' && userRole !== 'Coordinador') && (
            <TouchableOpacity style={styles.button} onPress={handleSubmitActa}>
              <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
          )}
        </View>

        {pdfName && estado && (
          <View style={styles.statusContainer}>
            <Icon name={icon} size={20} color={color} />
            <Text style={[styles.statusText, { color }]}>{estado}</Text>
          </View>
        )}

        {pdfName && fecha && (
          <Text style={styles.dateText}>{fecha}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'white',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  pdfName: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 4,
    margin: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 16,
    right: 16,
  },
  statusText: {
    marginLeft: 4,
    fontSize: 14,
  },
  dateText: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    fontSize: 12,
    color: 'gray',
  },
});

export default ActaSeguimiento;