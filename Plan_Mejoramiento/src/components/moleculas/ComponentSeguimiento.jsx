import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import axiosClient from "../../axiosClient.js";
import PDFUploader from "../Template/Pdf.jsx";

const ComponentSeguimiento = ({ 
  initialData = {}, 
  mode, 
  handleSubmit, 
  onClose, 
  actionLabel, 
  id_seguimiento, 
  onIdSend 
}) => {
  const [fecha, setFecha] = useState(initialData.fecha || "");
  const [bitacora, setBitacora] = useState(initialData.bitacora || '');
  const [seguimientoPdf, setSeguimientoPdf] = useState(null);
  const [bitacoraPdf, setBitacoraPdf] = useState(null);
  const [idPersona, setIdPersona] = useState("");
  const [estadoActaVisible, setEstadoActaVisible] = useState(false);
  const [estadoBitacoraVisible, setEstadoBitacoraVisible] = useState(false);
  const [bitacorasPdfs, setBitacorasPdfs] = useState([]);
  const [modalBitacora, setModalBitacora] = useState(false);
  const [findBitacora, setFindBitacora] = useState([]);

  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10);
    setFecha(currentDate);

    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user) {
          setIdPersona(user.id_persona);
        }
      } catch (error) {
        console.error("Error al parsear el usuario desde localStorage:", error);
      }
    }

    if (onIdSend) {
      onIdSend(id_seguimiento);
    }
  }, [id_seguimiento, onIdSend]);

  useEffect(() => {
    axiosClient.get(`/bitacoras/bitacorasSeguimiento/${1}`).then((response) => {
      console.log(response.data);
      setBitacorasPdfs(response.data);
    });
  }, []);

  const handleActaPdfSubmit = (file) => {
    setSeguimientoPdf(file);
    setEstadoActaVisible(true);
  };

  const handleBitacoraPdfSubmit = (file) => {
    setBitacoraPdf(file);
    setEstadoBitacoraVisible(true);
  };

  const handleSubmitActa = async () => {
    if (!id_seguimiento) {
      console.error("ID de seguimiento no definido");
      Alert.alert("Error", "ID de seguimiento no definido");
      return;
    }

    const formData = new FormData();
    if (seguimientoPdf) {
      formData.append("seguimientoPdf", seguimientoPdf);
    }

    try {
      const response = await axiosClient.post(
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

  const handleSubmitBitacoras = async () => {
    const formData = new FormData();
    formData.append("fecha", fecha);
    formData.append("bitacora", bitacora);
    formData.append("seguimiento", 1);
    formData.append("instructor", idPersona);

    if (bitacoraPdf) {
      formData.append("bitacoraPdf", bitacoraPdf);
    } else {
      console.warn("No se ha seleccionado ningún archivo PDF.");
    }

    try {
      const response = await axiosClient.post(
        "/bitacoras/registrar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Éxito", "Bitacora registrada correctamente");
        if (handleSubmit) handleSubmit();
      } else {
        Alert.alert("Error", "Error al registrar la bitacora.");
      }
    } catch (error) {
      console.error("Error del servidor:", error);
      Alert.alert("Error del servidor", error.message);
    }
  };

  const handleBuscar = (id) => {
    axiosClient.get(`/bitacoras/buscar/${id}`).then((response) => {
      console.log('Bitacora a editar', response.data);
      setFindBitacora(response.data);
    });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Seguimiento {id_seguimiento || 1}
      </Text>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16 }}>Acta:</Text>
      <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Acta N° 1:</Text>
        <PDFUploader onFileSelect={handleActaPdfSubmit} />
        <Button title="Enviar Acta" onPress={handleSubmitActa} />
        {estadoActaVisible && (
          <Text style={{ color: '#FFA500', marginTop: 8 }}>Solicitud pendiente: {fecha}</Text>
        )}
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16 }}>Registrar Bitácora:</Text>
      <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Bitácora 1:</Text>
        <TextInput 
          placeholder="Código de la bitácora"
          value={bitacora}
          onChangeText={setBitacora}
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16 }}
        />
        <PDFUploader onFileSelect={handleBitacoraPdfSubmit} />
        <Button title="Registrar Bitácora" onPress={handleSubmitBitacoras} />
        {estadoBitacoraVisible && (
          <Text style={{ color: '#FFA500', marginTop: 8 }}>Solicitud pendiente: {fecha}</Text>
        )}
      </View>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16 }}>Bitacoras asociadas al seguimiento:</Text>
      {bitacorasPdfs.map((bita) => (
        <View key={bita.id_bitacora} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginRight: 16 }}>Bitácora {bita.bitacora}:</Text>
          <Text style={{ fontSize: 16, marginRight: 16 }}>{bita.pdf}</Text>
          <TouchableOpacity onPress={() => [handleBuscar(bita.id_bitacora), setModalBitacora(true)]}>
            <Text style={{ color: '#6fb12d', fontWeight: 'bold' }}>Editar</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Modal isVisible={modalBitacora} onBackdropPress={() => setModalBitacora(false)}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Actualizar Bitácora</Text>
          {findBitacora.map((bita) => (
            <View key={bita.id_bitacora} style={{ marginVertical: 8 }}>
              <TextInput 
                value={bita.fecha} 
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16 }} 
              />
              <TextInput 
                value={bita.pdf} 
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16 }} 
              />
              <TextInput 
                value={bita.instructor} 
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16 }} 
              />
            </View>
          ))}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button title="Cerrar" onPress={() => setModalBitacora(false)} />
            <Button title="Actualizar" onPress={() => setModalBitacora(false)} color="#2196F3" />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ComponentSeguimiento;
