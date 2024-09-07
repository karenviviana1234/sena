import React, { useState, useEffect } from "react";
import { Input } from "@nextui-org/react";
import axiosClient from "../../configs/axiosClient";

function FormNovedades() {  // Recibe onClose como prop
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [foto, setFoto] = useState("");
  const [instructor, setInstructor] = useState("");
  const [seguimientos, setSeguimientos] = useState([]);
  const [selectedSeguimiento, setSelectedSeguimiento] = useState("");
  const [modalOpen, setModalOpen] = useState(false);



  useEffect(() => {
    const fetchSeguimiento = async () => {
      try {
        const response = await axiosClient.get("/seguimientos/listarA");

        const data = response.data[0]; // Acceder al primer elemento del array recibido

        const seguimientoList = [
          { id_seguimiento: 1, seguimiento: data.seguimiento1 },
          { id_seguimiento: 2, seguimiento: data.seguimiento2 },
          { id_seguimiento: 3, seguimiento: data.seguimiento3 },
        ];

        setSeguimientos(seguimientoList);
      } catch (error) {
        console.error("Error al obtener seguimientos", error);
      }
      setModalOpen(true);

    };

    fetchSeguimiento();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear un objeto FormData
    const formData = new FormData();
    formData.append("descripcion", descripcion);
    formData.append("fecha", fecha);
    formData.append("foto", foto); // Asegúrate de que 'foto' tenga un archivo
    formData.append("instructor", instructor);
    formData.append("seguimiento", selectedSeguimiento);

    try {
      const response = await axiosClient.post("/novedad/registrar", formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Especifica el tipo de contenido
        },
      });
      if (response.status === 200) {
        alert("Novedad registrada correctamente");
        handleCloseModal(); // Cierra el modal después de registrar
      } else {
        alert("Error al registrar la novedad");
      }
    } catch (error) {
      console.error("Error del servidor:", error);
      alert("Error del servidor: " + error.message);
    }
  };

  const handleCloseModal = async () => {
    setModalOpen(false);
  };
  const today = new Date().toISOString().split('T')[0];

  return (
    <form method="post" onSubmit={handleSubmit} onClose={handleCloseModal}
    >
      <div className="ml-5 align-items-center">
        <div className="flex flex-col">
          <Input
            name="fecha"
            type="date"
            label="Fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            min={today}
          />
        </div>
        <div className='py-2'>
          <Input
            type="text"
            label="Descripción"
            className="max-w-xs"
            id='descripcion'
            name="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        <div className='py-2'>
          <Input
            type="file"
            label="Foto"
            className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            id='foto'
            name="foto"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setFoto(file); // Asegúrate de que se esté guardando el archivo correctamente
              }
            }}
          />
        </div>

        <select
          className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          value={selectedSeguimiento}
          onChange={(e) => setSelectedSeguimiento(e.target.value)}
          required
        >
          <option>Selecciona un seguimiento</option>
          {seguimientos.map((seguimiento) => (
            <option key={seguimiento.id_seguimiento} value={seguimiento.id_seguimiento}>
              {seguimiento.seguimiento}
            </option>
          ))}
        </select>
        <div className='py-2'>
          <Input
            type="text"
            label="Instructor"
            className="max-w-xs"
            id='instructor'
            name="instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            required
          />
        </div>
        <div className="py-2">
          <button
            type="submit"
            className="bg-[#5a851b] hover:bg-[#4c7016] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
          >
            Registrar
          </button>
        </div>
      </div>
    </form>
  );
}

export default FormNovedades;