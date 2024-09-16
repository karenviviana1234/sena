import React, { useState, useEffect } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import axiosClient from "../../configs/axiosClient";

function FormActividades({ selectedInstructor, actividadSeleccionada, onClose }) {
  const [instructor, setInstructor] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [horario, setHorario] = useState("");
  const [tipo, setTipo] = useState("Formacion");
  const [solicitud, setSolicitud] = useState("Solicitado");

  useEffect(() => {
    if (actividadSeleccionada) {
      // Si hay una actividad seleccionada, rellena el formulario con los datos
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

  // Al cargar el componente, establece el nombre del instructor seleccionado
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

    if (!validateDates()) {
      return; // Detener el envío si la validación falla
    }

    const dataToSend = {
      instructor: selectedInstructor.id_persona, // El ID del instructor seleccionado
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      horario: parseInt(horario, 10) || null,
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
        {/* Mostrar el nombre del instructor en lugar de un Select */}
        <Input
          readOnly
          label="Instructor"
          value={instructor}
        />

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
              min={fechaInicio || today} // Ajustar mínimo a la fecha de inicio o a hoy si no se ha seleccionado
              helperText={errors.fechaFin}
              helperColor={errors.fechaFin ? "danger" : "default"}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
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
                  {hora.id_horario}
                </SelectItem>
              ))}
            </Select>
            <Input
              className="mt-4"
              label="Horario Seleccionado"
              value={
                horario
                  ? horarios.find((h) => h.id_horario.toString() === horario)
                      ?.id_horario || ""
                  : ""
              }
              readOnly
              color={horario ? "success" : "default"}
            />
          </div>

          {/*             <Select
          <div className="flex flex-col">
              name="productiva"
              placeholder="Selecciona la productiva"
              value={productiva}
              onChange={(e) => setProductiva(e.target.value)}
            >
              {productivas.map((prod) => (
                <SelectItem
                  key={prod.id_productiva}
                  value={prod.id_productiva.toString()}
                >
                  {prod.id_productiva}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Productiva Seleccionada"
              className="mt-4"
              value={
                productiva
                  ? productivas.find(
                      (p) => p.id_productiva.toString() === productiva
                    )?.id_productiva || ""
                  : ""
              }
              readOnly
              color={productiva ? "success" : "default"}
            />
          </div> */}
        </div>

{/*         <div className="grid grid-cols-2 gap-4 mb-4">
          <Select
            name="tipo"
            placeholder="Selecciona el tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            {tipos.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo}
              </SelectItem>
            ))}
          </Select>

          <Select
            name="solicitud"
            placeholder="Selecciona el estado de solicitud"
            value={solicitud}
            onChange={(e) => setSolicitud(e.target.value)}
          >
            {solicitudes.map((solicitud) => (
              <SelectItem key={solicitud} value={solicitud}>
                {solicitud}
              </SelectItem>
            ))}
          </Select>
        </div> */}

        <div className="flex justify-end gap-5 mt-5">
          <Button type="button" color="danger" onClick={onClose}>
            Cerrar
          </Button>
          <Button type="submit" color="success" onClick={onClose}>
            Registrar
          </Button>
        </div>
      </form>
    </div>
  );
}

export default FormActividades;