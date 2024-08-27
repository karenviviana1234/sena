import React, { useState } from 'react';
import v from "../../styles/Variables.jsx" 

const PDFUploader = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

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
  };

  const downloadFile = () => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url); // Limpiar el objeto URL después de la descarga
  };

  return (
    <div>
      <p className="my-2 text-gray-700">{fileName}</p>
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

      {file && (
        <div className="mt-4 ml-40">
          <button
            onClick={downloadFile}
            className="px-2 py-1 bg-[#98e326] text-white rounded-lg"
          >
            <v.descargar className='w-5 h-5' />
          </button>
          <button
            className="px-2 py-1 ml-4 bg-[#70B22D] text-white rounded-lg"
          >
            <v.enviar className='w-5 h-5' />
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFUploader;
