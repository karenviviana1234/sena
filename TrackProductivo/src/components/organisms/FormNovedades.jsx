import React, { useState, useEffect } from "react";
import { Input } from "@nextui-org/react";
import axiosClient from "../../configs/axiosClient";

function FormNovedades() {
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
const [foto, setFoto] = useState("");
const [instructor, setInstructor] = useState("");
  const [seguimientos, setSeguimientos] = useState([]);
  const [selectedSeguimiento, setSelectedSeguimiento] = useState("");

useEffect(() => {
  const fetchSeguimiento = async () => {
    try {
      const response = await axiosClient.get("/seguimientos/listarA");
      console.log("Datos recibidos:", response.data);
      
      const data = response.data[0]; // Acceder al primer elemento del array recibido

      // Asegúrate de que las claves coinciden con los datos recibidos
      const seguimientoList = [
        { id_seguimiento: 1, seguimiento: data.seguimiento1 },
        { id_seguimiento: 2, seguimiento: data.seguimiento2 },
        { id_seguimiento: 3, seguimiento: data.seguimiento3 },
      ];
      
      console.log("Seguimiento transformado:", seguimientoList);
      setSeguimientos(seguimientoList);
    } catch (error) {
      console.error("Error al obtener seguimientos", error);
    }
  };

  fetchSeguimiento();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      descripcion,
      fecha,
      foto,
      instructor,
      seguimiento: selectedSeguimiento,
    };

    console.log("Datos a enviar:", dataToSend);

    try {
      const response = await axiosClient.post("/novedad/registrar", dataToSend);
      if (response.status === 200) {
        alert("Novedad registrada correctamente");
      } else {
        alert("Error al registrar la novedad");
      }
    } catch (error) {
      console.error("Error del servidor:", error);
      alert("Error del servidor: " + error.message);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form method="post" onSubmit={handleSubmit}>
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
            onChange={(e) => setFoto(e.target.files[0])}
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
            label="Insstructor"
            className="max-w-xs"
            id='instructor'
            name="instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            required
          />
        </div>
        <div className="py-2">
          <button type="submit" className="btn btn-primary">
            Registrar
          </button>
        </div>
      </div>
    </form>
  );
}

export default FormNovedades;
