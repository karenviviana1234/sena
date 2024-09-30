import React, { useState, useEffect } from "react";
import { Input, Button } from "@nextui-org/react";
import axiosClient from "../../../configs/axiosClient";
import Swal from 'sweetalert2'; // Importar SweetAlert2

const FormNovedades = ({ onSubmit, onClose, actionLabel, mode, initialData }) => {
  const [descripcion, setDescripcion] = useState(initialData?.descripcion || "");
  const [fecha, setFecha] = useState(initialData?.fecha || "");
  const [foto, setFoto] = useState(null);
  const [instructor, setInstructor] = useState(initialData?.instructor || "");
  const [seguimientos, setSeguimientos] = useState([]);
  const [selectedSeguimiento, setSelectedSeguimiento] = useState(initialData?.id_seguimiento || "");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (mode === 'update' && initialData.id_novedad) {
          await loadInitialData();
        }
        const response = await axiosClient.get("/seguimientos/listar");
        setSeguimientos(response.data);
      } catch (error) {
        console.error("Error al cargar datos", error);
        setErrorMessage("Error al cargar datos. Intenta de nuevo más tarde.");
      }
    };

    fetchInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const response = await axiosClient.get(`/novedad/listarN/${initialData.id_novedad}`);
      const novedad = response.data;

      setFecha(new Date(novedad.fecha));
      setDescripcion(novedad.descripcion);
      setInstructor(novedad.instructor);
      setSelectedSeguimiento(novedad.id_seguimiento);

      if (novedad.foto) {
        setFoto(novedad.foto);
      }
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
      setErrorMessage("Error al cargar datos iniciales. Intenta de nuevo más tarde.");
    }
  };

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

      // Mostrar alerta de éxito con SweetAlert2
      await Swal.fire({
        icon: 'success',
        title: 'Registro exitoso!',
        text: 'La novedad se ha guardado correctamente.',
        confirmButtonText: 'Aceptar'
      });

      if (onSubmit) {
        onSubmit(); // Asegúrate de que onSubmit sea una función
      }
      if (onClose) {
        onClose(); // Asegúrate de que onClose sea una función
      }
    } catch (error) {
      console.error("Error del servidor:", error);
      setErrorMessage("Error del servidor: " + error.message);
      // Mostrar alerta de error con SweetAlert2
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al guardar la novedad. Intenta de nuevo.',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const formattedFecha = typeof fecha === 'string' ? fecha : new Date(fecha).toISOString().split('T')[0];

  return (
    <form method="post" onSubmit={handleSubmit}>
      <h1 className="text-xl font-bold mb-4">
        Registro de Novedades
      </h1>
      <div className="ml-5 align-items-center">
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}

        <div className="py-2">
          <Input
            type="date"
            label="Fecha"
            value={formattedFecha}
            onChange={(e) => setFecha(e.target.value)}
            readOnly={mode === 'update'}
            className="w-96 my-4"
          />
        </div>

        <div className="py-2">
          {mode === 'update' && foto && (
            <img src={foto instanceof File ? URL.createObjectURL(foto) : foto} alt="Foto actual" style={{ maxWidth: '100%', maxHeight: '200px' }} />
          )}
          <Input
            type="file"
            className="w-96 mb-4"
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

        <div className="py-2">
          <Input
            type="text"
            label="Descripción"
            id="descripcion"
            name="descripcion"
            classNames="w-96"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        <div>
          <select
            className="my-4 h-14 rounded-xl bg-[#f4f4f5] p-2 w-96"
            onChange={(e) => setSelectedSeguimiento(e.target.value)}
            value={selectedSeguimiento}
            required
            id="id_seguimiento"
            name="id_seguimiento"
          >
            <option value="">Selecciona un seguimiento</option>
            {seguimientos.map((seguimiento) => (
              <option key={seguimiento.id_seguimiento} value={seguimiento.id_seguimiento}>
                {seguimiento.descripcion || seguimiento.id_seguimiento}
              </option>
            ))}
          </select>
        </div>

        <div className="py-2">
          <Input
            type="text"
            label="Instructor"
            className="mb-4 w-96"
            id="instructor"
            name="instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-5 mt-5">
          <Button type="submit" className="bg-[#0d324c] text-white">
            {(mode === 'update' ? 'Actualizar' : 'Registrar')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormNovedades;