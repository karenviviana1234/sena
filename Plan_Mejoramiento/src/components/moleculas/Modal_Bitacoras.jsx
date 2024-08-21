import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  Alert,} from "react-native";
  import { Picker } from '@react-native-picker/picker'
  import DocumentPicker from "react-native-document-picker";
  import DateTimePicker from "@react-native-community/datetimepicker";
  import axiosClient from "../../axiosClient";

const ModalBitacoras = ({ visible, onClose }) => {
  const [fecha, setFecha] = useState(new Date());
  const [bitacora, setBitacora] = useState("");
  const [seguimiento, setSeguimiento] = useState("");
  const [pdf, setPdf] = useState(null);
  const [instructor, setInstructor] = useState("");
  const [instructores, setInstructores] = useState([]);
  const [seguimientos, setSeguimientos] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchInstructores = async () => {
      try {
        const response = await axiosClient.get("/personas/Instructores");
        setInstructores(response.data);
        if (response.data.length > 0) {
          setInstructor(response.data[0].id_persona);
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };

    const fetchSeguimientos = async () => {
      try {
        const response = await axiosClient.get("/seguimientos/listar"); // Ajusta la ruta de la API
        setSeguimientos(response.data);
        if (response.data.length > 0) {
          setSeguimiento(response.data[0].id_seguimiento); 
        }
      } catch (error) {
        console.error("Error fetching seguimientos:", error);
      }
    };

    fetchInstructores();
    fetchSeguimientos();
  }, []);

  const handlePickPDF = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setPdf(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User cancelled document picker");
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

  const handleSubmit = async () => {

    if (!bitacora || !seguimiento || !instructor || !pdf) {
      Alert.alert('Todos los campos son obligatorios')
      return;
    }

    const formData = new FormData();
    formData.append("fecha", fecha.toISOString().split("T")[0]); // Asegúrate de enviar la fecha en el formato correcto
    formData.append("bitacora", bitacora);
    formData.append("seguimiento", seguimiento);
    formData.append("instructor", instructor);

    if (pdf) {
      formData.append("bitacoraPdf", {
        uri: pdf.uri,
        type: pdf.type,
        name: pdf.name,
      });
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
        Alert.alert("Bitácora registrada", "Bitácora registrada exitosamente.");
      } else {
        Alert.alert(
          "Error",
          `No se pudo registrar la bitácora: ${response.data.message}`
        );
      }
    } catch (error) {
      Alert.alert("Error", `Ocurrió un error: ${error.message}`);
    }

    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
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
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Bitácora"
            placeholderTextColor="grey"
            value={bitacora}
            onChangeText={setBitacora}
            color="black"
          />
          
          <View style={styles.pickerContainer}>
            {seguimientos.length > 0 ? (
              <Picker
                selectedValue={seguimiento}
                style={styles.picker}
                onValueChange={(itemValue) => setSeguimiento(itemValue)}
              >
                {seguimientos.map((seg) => (
                  <Picker.Item
                    key={seg.id_seguimiento}
                    label={seg.seguimiento}
                    value={seg.id_seguimiento}
                  />
                ))}
              </Picker>
            ) : (
              <Text style={styles.noSeguimientosText}>No hay seguimientos</Text>
            )}
          </View>

          <TouchableOpacity style={styles.pdfButton} onPress={handlePickPDF}>
            <Text style={styles.pdfButtonText}>
              {pdf ? pdf.name : "Seleccionar PDF"}
            </Text>
          </TouchableOpacity>

          <View style={styles.pickerContainer}>
            {instructores.length > 0 ? (
              <Picker
                selectedValue={instructor}
                style={styles.picker}
                onValueChange={(itemValue) => setInstructor(itemValue)}
              >
                {instructores.map((inst) => (
                  <Picker.Item
                    key={inst.id_persona}
                    label={inst.nombres}
                    value={inst.id_persona}
                  />
                ))}
              </Picker>
            ) : (
              <Text style={styles.noInstructorsText}>No hay instructores</Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Registrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 26,
    color: "orange",
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "orange",
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 16,
    color: "black",
  },
  pdfButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    height: 50,
    justifyContent: "center",
  },
  pdfButtonText: {
    color: "white",
    fontSize: 16,
  },
  pickerContainer: {
    width: "100%",
    borderColor: "orange",
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "black",
  },
  noInstructorsText: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
  seguimientoLabel: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
  },
  noSeguimientosText: {
    fontSize: 16,
    color: "grey",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "grey",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ModalBitacoras;
