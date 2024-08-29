import React, { useState } from "react";
import ButtonDescargar from "../atoms/ButtonDescargar.jsx";

const PDFUploader = ({ onFileSelect }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    // Verificar que el archivo es un PDF
    if (uploadedFile.type !== "application/pdf") {
      alert("Solo se permiten archivos PDF");
      return;
    }

    setFile(uploadedFile); // Guardar el archivo en el estado
    setFileName(uploadedFile.name); // Guardar el nombre del archivo
    onFileSelect(uploadedFile); // Pasar el archivo al componente padre
  };

  const downloadFile = () => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url); // Limpiar el objeto URL después de la descarga
  };

  return (
    <div className="flex items-center gap-4">
      {file ? (
        <span className="text-base text-gray-400">Archivo Cargado</span>
      ) : (
        <label className="relative inline-block cursor-pointer">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <span className="inline-block px-4 py-2 border shadow-lg rounded-xl">
            Seleccionar archivo PDF
          </span>
        </label>
      )}

      {file && (
        <ButtonDescargar onClick={downloadFile}/>
      )}
    </div>
  );
};

export default PDFUploader;
