import React, { useEffect, useState } from 'react'
import PDFUploader from './Pdf';
import ButtonEnviar from '../atoms/ButtonEnviar';
import { Chip } from '@nextui-org/react';
import Icons from '../../styles/Variables';
import axiosClient from "../../configs/axiosClient.jsx";
import ButtonDescargar from '../atoms/ButtonDescargar.jsx';


function ActaSeguimiento({ handleSubmit, id_seguimiento, onIdSend }) {
  const [estadoActaVisible, setEstadoActaVisible] = useState(false);
  const [fecha, setFecha] = useState("");
  const [seguimientoPdf, setSeguimientoPdf] = useState(null);
  const [idPersona, setIdPersona] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [file, setFile] = useState(null);




  const seguimientoNumeros = {
    1: 1,
    2: 2,
    3: 3,
  };

  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10);
    setFecha(currentDate);
    const userJson = localStorage.getItem("user");
    if (userJson && userJson !== "undefined" && userJson !== "null" && userJson !== "") {
      try {
        const user = JSON.parse(userJson);
        if (user && user.id_persona) {
          setIdPersona(user.id_persona);
          console.log("ID de persona asignado:", user.id_persona);
        } else {
          console.warn("No se encontró un 'id_persona' válido en el usuario.");
        }
      } catch (error) {
        console.error("Error al parsear el JSON del usuario:", error);
      }
    } else {
      console.warn("No se encontró un valor válido para 'user' en localStorage.");
      setIdPersona(null);
    }

    if (onIdSend && id_seguimiento) {
      onIdSend(id_seguimiento);
    }
  }, [id_seguimiento, onIdSend]);

  /* Estado para definir elementos de los diferentes roles */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.cargo);
      } catch (error) {
        console.error("Error al parsear el JSON del usuario:", error);
      }
    }
  }, []);

  // Función para manejar la carga del archivo de acta
  const handleActaPdfSubmit = (file) => {
    setSeguimientoPdf(file);
    setEstadoActaVisible(true);
  };

  // Función para enviar el acta
  const handleSubmitActa = async () => {
    if (!id_seguimiento) {
      console.error("ID de seguimiento no definido");
      alert("ID de seguimiento no definido");
      return;
    }
    const formData = new FormData();
    if (seguimientoPdf) {
      formData.append("seguimientoPdf", seguimientoPdf);
    }

    try {
      const response = await axiosClient.post(
        `/seguimientos/cargarPDF/${id_seguimiento}`, // Usa id_seguimiento aquí
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Acta enviada correctamente");
        if (handleSubmit) handleSubmit();
      } else {
        alert("Error al enviar el Acta.");
      }
    } catch (error) {
      console.error("Error del servidor:", error);
      alert("Error del servidor: " + error.message);
    }
  };

  const downloadFile = () => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <h1 className="font-semibold text-xl">Acta:</h1>
      <div className="border shadow-medium rounded-2xl p-4 flex flex-col gap-4 relative h-32">
        <h2 className="font-semibold text-lg absolute top-4 left-4">
          Acta N° {seguimientoNumeros[id_seguimiento] || 1}{" "}:
        </h2>
        <div className="flex justify-center items-center h-full">
          {(userRole !== 'Aprendiz') && (
            <PDFUploader onFileSelect={handleActaPdfSubmit} />
          )}
          <ButtonDescargar onClick={downloadFile} />
          {(userRole !== 'Aprendiz') && (
          <ButtonEnviar onClick={handleSubmitActa} />
          )}
        </div>
        {estadoActaVisible && (
          <div className="absolute top-4 left-4 flex items-center gap-2 ml-24">
            <Chip
              endContent={<Icons.solicitud size={20} />}
              variant="flat"
              color="warning"
            >
              Solicitud
            </Chip>
          </div>
        )}
        {estadoActaVisible && (
          <p className="absolute bottom-4 right-4 text-gray-500 text-sm">
            {fecha}
          </p>
        )}
      </div>
    </>
  )
}

export default ActaSeguimiento