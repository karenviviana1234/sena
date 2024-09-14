import React, { useEffect, useState, useContext } from 'react';
import { ModalFooter, Button } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import AsignacionContext from '../../context/AsignacionesContext';

const FormAsignacion = ({ onSubmit, onClose, actionLabel, mode, initialData }) => {
  const [productiva, setProductiva] = useState([]);
  const [actividad, setActividad] = useState([]);
  const [selectedProductiva, setSelectedProductiva] = useState('');
  const [selectedActividad, setSelectedActividad] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { id_asignacion } = useContext(AsignacionContext);
//dff
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
      id_asignacion: mode === 'update' ? initialData.id_asignacion : undefined // Agrega esto
  };

  try {
      if (mode === 'update') {
          await axiosClient.put(`/actualizar/${initialData.id_asignacion}`, dataToSend);
      } else {
          await axiosClient.post('/registrar', dataToSend);
      }
      // Limpiar los campos después de la operación
      setSelectedProductiva('');
      setSelectedActividad('');
      onSubmit();
      onClose();
  } catch (error) {
      // Manejo de errores...
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
            <option value="">Seleccionar Productiva</option>
            {productiva.map((prod) => (
              <option key={prod.id_productiva} value={prod.id_productiva}>
                {prod.id_productiva}
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
            <option value="">Seleccionar Actividad</option>
            {actividad.map((activi) => (
              <option key={activi.id_actividad} value={activi.id_actividad}>
                {activi.id_actividad}
              </option>
            ))}
          </select>
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

export default FormAsignacion;