import React, { useState, useEffect } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import axiosClient from "../../configs/axiosClient";

function FormActividades({ selectedInstructor, onClose }) {
  const [instructor, setInstructor] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [horario, setHorario] = useState("");
  const [ficha, setFicha] = useState(""); // Ficha seleccionada
  const [tipo, setTipo] = useState("Formacion");
  const [solicitud, setSolicitud] = useState("Solicitado");

  const [fichas, setFichas] = useState([]); // Lista de fichas
  const [horarios, setHorarios] = useState([]); // Lista de horarios filtrados por ficha

  const [errors, setErrors] = useState({
    fechaInicio: "",
    fechaFin: "",
  });

  const tipos = ["Formacion", "Seguimiento", "Administrativo"];
  const solicitudes = ["Solicitado", "Aprobado", "No Aprobado"];

  // Cargar el nombre del instructor seleccionado
  useEffect(() => {
    if (selectedInstructor) {
      setInstructor(selectedInstructor.nombres);
    }
  }, [selectedInstructor]);

  // Obtener todas las fichas al cargar el componente
  useEffect(() => {
    const fetchFichas = async () => {
      try {
        const response = await axiosClient.get("/fichas/listar"); // Suponiendo que esta ruta obtiene las fichas
        setFichas(response.data);
      } catch (error) {
        console.error("Error al obtener fichas", error);
      }
    };

    fetchFichas();
  }, []);

  // Obtener horarios basados en la ficha seleccionada
  useEffect(() => {
    if (ficha) {
      const fetchHorarios = async () => {
        try {
          const response = await axiosClient.get(`/horarios/listar/${ficha}`); // Filtra por ficha
          setHorarios(response.data);
        } catch (error) {
          console.error("Error al obtener horarios", error);
        }
      };

      fetchHorarios();
    }
  }, [ficha]);

  const today = new Date().toISOString().split('T')[0];

  const validateDates = () => {
    let valid = true;
    let newErrors = { fechaInicio: "", fechaFin: "" };

    if (fechaInicio < today) {
      newErrors.fechaInicio = "La fecha de inicio debe ser hoy o una fecha futura.";
      valid = false;
    }

    if (fechaFin && fechaInicio && fechaFin < fechaInicio) {
      newErrors.fechaFin = "La fecha de fin no puede ser anterior a la fecha de inicio.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDates()) {
      return; // Detener el envío si la validación falla
    }

    const dataToSend = {
      instructor: selectedInstructor.id_persona, // El ID del instructor seleccionado
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      horario: parseInt(horario, 10) || null,
      ficha: parseInt(ficha, 10) || null, // Ficha seleccionada
      tipo: tipos.indexOf(tipo) + 1, // Convertir a número basado en el índice + 1
      solicitud: solicitudes.indexOf(solicitud) + 1, // Convertir a número basado en el índice + 1
    };

    try {
      const response = await axiosClient.post("/actividades/registrar", dataToSend);
      if (response.status === 200) {
        alert("Actividad registrada correctamente");
      } else {
        alert("Error al registrar la actividad");
      }
    } catch (error) {
      console.error("Error del servidor:", error);
      alert("Error del servidor: " + error.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Formulario de Actividades</h2>
      <form onSubmit={handleSubmit}>
        {/* Mostrar el nombre del instructor */}
        <Input
          readOnly
          label="Instructor"
          value={instructor}
        />

        {/* Selección de la ficha */}
        <Select
          name="ficha"
          label="Selecciona una ficha"
          placeholder="Selecciona la ficha"
          value={ficha}
          onChange={(e) => setFicha(e.target.value)}
        >
          {fichas.map((ficha) => (
            <SelectItem
              key={ficha.codigo}
              value={ficha.codigo.toString()}
            >
              {`Ficha ${ficha.codigo} - Programa ${ficha.programa}`}
            </SelectItem>
          ))}
        </Select>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4 mb-5 mt-5">
          <div className="flex flex-col">
            <Input
              name="fecha_inicio"
              type="date"
              label="Fecha de Inicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              min={today}
              helperText={errors.fechaInicio}
              helperColor={errors.fechaInicio ? "danger" : "default"}
            />
          </div>
          <div className="flex flex-col">
            <Input
              name="fecha_fin"
              type="date"
              label="Fecha de Fin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              min={fechaInicio || today}
              helperText={errors.fechaFin}
              helperColor={errors.fechaFin ? "danger" : "default"}
            />
          </div>
        </div>

        {/* Selección de horario basado en la ficha */}
        <Select
          name="horario"
          label="Selecciona el horario"
          placeholder="Selecciona el horario"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          disabled={!ficha} // Deshabilitar si no hay ficha seleccionada
        >
          {horarios.map((hora) => (
            <SelectItem
              key={hora.id_horario}
              value={hora.id_horario.toString()}
            >
              {`Horario ${hora.hora_inicio} - ${hora.hora_fin} (${hora.dia})`}
            </SelectItem>
          ))}
        </Select>

        <div className="flex justify-end gap-5 mt-5">
          <Button type="button" color="danger" onClick={onClose}>
            Cerrar
          </Button>
          <Button type="submit" color="success">
            Registrar
          </Button>
        </div>
      </form>
    </div>
  );
}

export default FormActividades;
