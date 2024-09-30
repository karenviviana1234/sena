import React, { useState, useEffect } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import axiosClient from "../../../configs/axiosClient";
import Swal from "sweetalert2";

function FormActividades({ selectedInstructor, actividadSeleccionada, onClose }) {
  const [instructor, setInstructor] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [horario, setHorario] = useState("");
  const [tipo, setTipo] = useState("Seguimiento");
  const [solicitud, setSolicitud] = useState("Aprobado");

  useEffect(() => {
    if (actividadSeleccionada) {
      setFechaInicio(actividadSeleccionada.fecha_inicio || "");
      setFechaFin(actividadSeleccionada.fecha_fin || "");
      setHorario(actividadSeleccionada.horario || "");
      setTipo(actividadSeleccionada.tipo || "Formacion");
      setSolicitud(actividadSeleccionada.solicitud || "Solicitado");
    }
  }, [actividadSeleccionada]);

  const [horarios, setHorarios] = useState([]);
  const [errors, setErrors] = useState({
    fechaInicio: "",
    fechaFin: "",
  });

  const tipos = ["Formacion", "Seguimiento", "Administrativo"];
  const solicitudes = ["Solicitado", "Aprobado", "No Aprobado"];

  useEffect(() => {
    if (selectedInstructor) {
      setInstructor(selectedInstructor.nombres);
    }
  }, [selectedInstructor]);

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await axiosClient.get("/horarios/listar");
        setHorarios(response.data);
      } catch (error) {
        console.error("Error al obtener horarios", error);
      }
    };

    fetchHorarios();
  }, []);

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

    if (!fechaInicio || !fechaFin || !horario || !tipo || !solicitud) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos antes de enviar.',
      });
      return; // Detiene el envío si faltan campos por completar
    }

    if (!validateDates()) {
      return; // Detener el envío si la validación de fechas falla
    }

    const dataToSend = {
      instructor: selectedInstructor.id_persona,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      horario: parseInt(horario, 10) || null,
      tipo: tipos.indexOf(tipo) + 1,
      solicitud: solicitudes.indexOf(solicitud) + 1,
    };

    try {
      const response = await axiosClient.post("/actividades/registrar", dataToSend);
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Actividad registrada correctamente',
        });
        onClose(); // Cerrar el modal tras el éxito
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar la actividad. Por favor, inténtalo de nuevo.',
        });
      }
    } catch (error) {
      console.error("Error del servidor:", error);

      // Verifica si el error tiene una respuesta del servidor y muestra un mensaje más específico
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'Error del servidor',
          text: `Error: ${error.response.data.message || 'Ocurrió un problema al procesar tu solicitud.'}`,
        });
      } else {
        // Error sin respuesta del servidor (problemas de conexión, timeout, etc.)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo conectar con el servidor. Verifica tu conexión a internet y vuelve a intentarlo.',
        });
      }
    }
  };

  // Encuentra el horario seleccionado por ID
  const selectedHorario = horarios.find(h => h.id_horario.toString() === horario);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Formulario de Actividades</h2>
      <form onSubmit={handleSubmit}>
        <Input readOnly label="Instructor" value={instructor} />

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

        <div className="flex flex-col">
          <Select
            name="horario"
            placeholder="Selecciona el horario"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
          >
            {horarios.map((hora) => (
              <SelectItem
                key={hora.id_horario}
                value={hora.id_horario.toString()}
              >
                {`${hora.id_horario} - ${hora.dia} - ${hora.ficha} - (${hora.hora_inicio} a ${hora.hora_fin})`}
              </SelectItem>
            ))}
          </Select>
          <Input
            className="mt-4"
            label="Horario Seleccionado"
            value={
              selectedHorario
                ? `${selectedHorario.id_horario} - ${selectedHorario.dia} - ${selectedHorario.ficha} - (${selectedHorario.hora_inicio} a ${selectedHorario.hora_fin})`
                : ""
            }
            readOnly
            color={horario ? "success" : "default"}
          />
        </div>

        <div className="flex justify-end gap-5 mt-5">
          <Button type="submit" className="bg-[#92d22e] text-white" color="success">
            Registrar
          </Button>
        </div>
      </form>
    </div>
  );
}

export default FormActividades;
