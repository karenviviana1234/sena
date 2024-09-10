import React, { useState, useEffect } from "react";
import { Input, Button } from "@nextui-org/react";
import axiosClient from "../../configs/axiosClient";

const FormNovedades = ({ onSubmit, onClose, actionLabel, mode, initialData }) => {
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "");
  const [fecha, setFecha] = useState(initialData?.fecha || "");
  const [foto, setFoto] = useState(null);
  const [instructor, setInstructor] = useState(initialData?.instructor || "");
  const [seguimientos, setSeguimientos] = useState([]);
  const [selectedSeguimiento, setSelectedSeguimiento] = useState(initialData?.id_seguimiento || "");
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    const fetchSeguimiento = async () => {
      try {
        const response = await axiosClient.get("/seguimientos/listarA");
        setSeguimientos(response.data);
      } catch (error) {
        console.error("Error al obtener seguimientos", error);
        setErrorMessage("Error al cargar seguimientos. Intenta de nuevo más tarde.");
      }
    };

    fetchSeguimiento();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData();
    formData.append("descripcion", descripcion);
    formData.append("fecha", fecha);
    formData.append("instructor", instructor);
    formData.append("seguimiento", selectedSeguimiento);

    if (foto) {
      formData.append("foto", foto);
    }

    try {
      if (mode === 'update' && initialData?.id_novedad) {
        await axiosClient.put(`/novedad/actualizar/${initialData.id_novedad}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axiosClient.post("/novedad/registrar", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error del servidor:", error);
      setErrorMessage("Error del servidor: " + error.message);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };
  
  // Al obtener los datos, transforma la fecha
  const fetchNovedades = async () => {
    try {
      const response = await axiosClient.get(`/novedad/listar/${id_seguimiento}`);
      if (response.data) {
        const novedades = response.data.map(novedad => ({
          ...novedad,
          fecha: formatDate(novedad.fecha)
        }));
        setNovedades(novedades);
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };
  

  return (
    <form method="post" onSubmit={handleSubmit}>
      <div className="ml-5 align-items-center">
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}

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
        <div className="py-2">
          <Input
            type="text"
            label="Descripción"
            className="max-w-xs"
            id="descripcion"
            name="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        <div className="py-2">
          <Input
            type="file"
            label="Foto"
            className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            id="foto"
            name="foto"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setFoto(file);
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
          <option value="">Selecciona un seguimiento</option>
          {seguimientos.map((seguimiento) => (
            <option key={seguimiento.id_seguimiento} value={seguimiento.id_seguimiento}>
              {seguimiento.seguimiento}
            </option>
          ))}
        </select>

        <div className="py-2">
          <Input
            type="text"
            label="Instructor"
            className="max-w-xs"
            id="instructor"
            name="instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-5 mt-5">
          <Button type="button" color="danger" onClick={onClose}>
            Cerrar
          </Button>
          <Button type="submit" color="success">
            {actionLabel || (mode === 'update' ? 'Actualizar' : 'Registrar')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormNovedades;
