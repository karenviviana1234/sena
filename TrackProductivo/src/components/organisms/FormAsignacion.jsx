import React, { useEffect, useState, useContext } from 'react';
import { ModalFooter, Button } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import AsignacionContext from '../../context/AsignacionesContext';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

const FormAsignacion = ({ onSubmit, onClose, actionLabel, mode, initialData }) => {
  const [productiva, setProductiva] = useState([]);
  const [actividad, setActividad] = useState([]);
  const [selectedProductiva, setSelectedProductiva] = useState('');
  const [selectedActividad, setSelectedActividad] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { id_asignacion } = useContext(AsignacionContext);

  useEffect(() => {
    const fetchProductiva = async () => {
      try {
        const response = await axiosClient.get('/productiva/listar');
        setProductiva(response.data);
      } catch (error) {
        console.error("Error al cargar productivas:", error);
        setErrorMessage("Error al cargar productivas. Intenta de nuevo más tarde.");
      }
    };

    const fetchActividad = async () => {
      try {
        const response = await axiosClient.get('/actividades/listar');
        setActividad(response.data.filter((actividad) => actividad.estado === 'Activo'));
      } catch (error) {
        console.error("Error al cargar actividades:", error);
        setErrorMessage("Error al cargar actividades. Intenta de nuevo más tarde.");
      }
    };

    fetchProductiva();
    fetchActividad();
  }, []);

  useEffect(() => {
    if (mode === 'update' && initialData) {
        setSelectedProductiva(initialData.productiva);
        setSelectedActividad(initialData.actividad);
    }
}, [mode, initialData]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage('');

  const dataToSend = {
      actividad: selectedActividad,
      productiva: selectedProductiva,
      id_asignacion: mode === 'update' ? initialData?.id_asignacion : undefined // Usar el operador de encadenamiento opcional
  };

  try {
      if (mode === 'update' && dataToSend.id_asignacion) {
          await axiosClient.put(`/actualizar/${dataToSend.id_asignacion}`, dataToSend);
          Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Asignación actualizada correctamente',
          });
      } else {
          await axiosClient.post('/registrar', dataToSend);
          Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Asignación registrada correctamente',
          });
      }
      // Limpiar los campos después de la operación
      setSelectedProductiva('');
      setSelectedActividad('');
      onSubmit();
      onClose();
  } catch (error) {
      console.error(error);
      setErrorMessage("Error al procesar la asignación. Intenta de nuevo.");
  }
};

  return (
    <form method="post" onSubmit={handleSubmit}>
      <div className="ml-5 align-items-center">
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}

        <div className="py-2">
          <select
            className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            id="productiva"
            name="productiva"
            value={selectedProductiva}
            onChange={(e) => setSelectedProductiva(e.target.value)}
            required
          >
            <option value="">Seleccionar Aprendiz</option>
            {productiva.map((prod) => (
              <option key={prod.id_productiva} value={prod.id_productiva}>
                {prod.aprendiz_nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="py-2">
          <select
            className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            id="actividad"
            name="actividad"
            value={selectedActividad}
            onChange={(e) => setSelectedActividad(e.target.value)}
            required
          >
            <option value="">Seleccionar Instructor y Horario</option>
            {actividad.map((actividades) => (
              <option key={actividades.id_actividad} value={actividades.id_actividad}>
                {`${actividades.instructor} - ${format(new Date(actividades.fecha_inicio), 'dd-MM-yyyy')} a ${format(new Date(actividades.fecha_fin), 'dd-MM-yyyy')} - ${actividades.horario_inicio} a ${actividades.horario_fin}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-5 mt-5">
          <Button className="bg-[#92d22e] text-white" type="submit" color="success">
            {actionLabel || (mode === 'update' ? 'Actualizar' : 'Registrar')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormAsignacion;