import React, { useEffect, useState } from "react";
import { Chip } from "@nextui-org/react";
import v from "../../styles/Variables.jsx";
import PDFUploader from "../molecules/Pdf.jsx";
import axiosClient from "../../configs/axiosClient.jsx";

function ComponentSeguimiento({
  initialData,
  mode,
  handleSubmit,
  onClose,
  actionLabel,
}) {
  const [fecha, setFecha] = useState("");
  const [seguimiento, setSeguimiento] = useState("");
  const [bitacoraPdf, setPdf] = useState(null); // Asegúrate de que el estado pdf inicie como null
  const [idPersona, setIdPersona] = useState("");
  const [seguimientoData, setSeguimientoData] = useState(seguimiento || "");

  useEffect(() => {
    // Aquí puedes cargar o manipular la data del seguimiento
    if (seguimiento) {
      setSeguimientoData(seguimiento);
    }
  }, [seguimiento]);

  const handleInputChange = (event) => {
    setSeguimientoData(event.target.value);
  };
  
  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10);
    setFecha(currentDate);

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIdPersona(user.id_persona);
    }
  }, []);

  const handleSubmitBitacoras = async () => {
    const formData = new FormData();
    formData.append("fecha", fecha);
    formData.append("bitacora", "1"); // Número de bitácora fijo
    formData.append("seguimiento", 1);
    formData.append("instructor", idPersona);

    if (bitacoraPdf) {
      formData.append("bitacoraPdf", bitacoraPdf); // Incluye el PDF si existe
    } else {
      console.warn("No se ha seleccionado ningún archivo PDF.");
    }

    console.log("Enviando datos:", {
      fecha,
      bitacora: "1", // Debe ser una cadena, no un número
      seguimiento: 1,
      instructor: idPersona,
      bitacoraPdf,
    });

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
        alert("Bitacora registrada correctamente");
        if (handleSubmit) handleSubmit();
      } else {
        alert("Error al registrar la bitacora.");
      }
    } catch (error) {
      console.error("Error del servidor:", error);
      alert("Error del servidor: " + error.message);
    }
  };

  const handlePdfSubmit = (file) => {
    console.log("Archivo PDF recibido:", file);
    setPdf(file); // Aquí deberías guardar el archivo, no solo la URL
  };

  return (
    <div className="flex justify-between gap-20">
      <div className="w-1/2 pl-4">
        <h1 className="font-semibold mb-5 text-2xl">Bitacoras:</h1>
        <div className="flex flex-col gap-6">
          <div className="border shadow-medium rounded-2xl p-6">
            <h2 className="font-semibold text-2xl">
              Bitacora 1:
              <Chip
                endContent={<v.aprobado size={24} />}
                variant="flat"
                color="success"
                className="pr-4 mx-3"
              >
                Aprobado
              </Chip>
            </h2>
            <p className="text-gray-500 text-lg">{fecha}</p>
            <PDFUploader onFileSelect={handlePdfSubmit} />
            <button
              onClick={handleSubmitBitacoras}
              className="px-2 py-1 ml-4 mt-4 bg-[#70B22D] text-white rounded-lg"
            >
              <v.enviar className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-1/2">
        <h1 className="font-semibold mb-5 text-2xl">Actividades:</h1>
        <div className="border shadow-medium rounded-2xl p-6">
          <div>
            <h2 className="font-semibold text-2xl">Magda Lorena:</h2>
            <span className="text-lg text-gray-500 align-text-top">
              Administrativo
            </span>
          </div>
          <p className="text-lg">Corregir Bitacora 4</p>
          <div className="flex justify-end gap-5">
            <p className="text-lg text-gray-500">20-12-2023</p>
            <a href="#" className="text-lg">
              Ver más
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComponentSeguimiento;
