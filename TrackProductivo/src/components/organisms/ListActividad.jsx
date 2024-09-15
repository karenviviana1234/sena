import React, { useEffect, useState } from 'react';
import axiosClient from '../../configs/axiosClient';
import ButtonActualizar from '../atoms/ButtonActualizar';
import ModalAcciones from './ModalAcciones';
import FormActividades from './FormActividades';

const ListActividad = ({ selectedInstructor }) => {  // Asegúrate de que recibes props correctamente
  const [instructor, setInstructor] = useState("");
  const [actividades, setActividades] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);

  // Al cargar el componente, establece el nombre del instructor seleccionado
  useEffect(() => {
    if (selectedInstructor) {
      setInstructor(selectedInstructor.id_persona);
      fetchData(selectedInstructor.id_persona);  // Llama a fetchData con el ID del instructor
    }
  }, [selectedInstructor]);
  console.log("instructor llegado",selectedInstructor);
  

  // Función para obtener actividades filtradas por instructor
  const fetchData = async (id_persona) => {
    try {
      const response = await axiosClient.get(`/actividades/listar/${id_persona}`);  // Ajusta la URL con el ID
      setActividades(response.data);
    } catch (error) {
      console.log("Error al listar las actividades", error);
    }
  };

  // Función para formatear la fecha
  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Función para abrir el modal y seleccionar la actividad
  const handleActualizarClick = (actividad) => {
    setActividadSeleccionada(actividad);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-xl font-bold mb-4">Lista de Actividades</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actividades.map((actividad) => (
          <div 
            key={actividad.id_actividad} 
            className="bg-white shadow-md rounded-lg p-4 relative"
          >
            <h4 className="text-lg font-semibold mb-2">Actividad: {actividad.id_actividad}</h4>
            <div className="absolute top-2 right-2">
              <ButtonActualizar onClick={() => handleOpenModal('formActividades', item)} />
            </div>
            <p className="text-sm text-gray-600">
              <strong>Estado: </strong>{actividad.estado}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Fecha de inicio: </strong>{formatFecha(actividad.fecha_inicio)}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Fecha de fin: </strong>{formatFecha(actividad.fecha_fin)}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Instructor: </strong>{actividad.instructor}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Horario: </strong>{actividad.horario}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Tipo: </strong>{actividad.tipo}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Solicitud: </strong>{actividad.solicitud}
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <ModalAcciones onClose={() => setShowModal(false)}>
          <FormActividades actividad={actividadSeleccionada} />
        </ModalAcciones>
      )}
    </div>
  );
};

export default ListActividad;
