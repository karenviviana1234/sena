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

  const { idAsignacion } = useContext(AsignacionContext);

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
      setSelectedProductiva(initialData.id_asignacion);
      setSelectedProductiva(initialData.productiva);
      setSelectedActividad(initialData.actividad);
    }
  }, [mode, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
  
    if (mode === 'update' && !idAsignacion) {
      setErrorMessage('ID de asignación no disponible.');
      return;
    }
  
    const dataToSend = {
      actividad: selectedActividad,
      productiva: selectedProductiva
    };
  
    try {
      if (mode === 'update') {
        await axiosClient.put(`/actualizar/${idAsignacion.id_asignacion}`, dataToSend);
      } else {
        await axiosClient.post('/registrar', dataToSend);
      }
      setSelectedProductiva('');
      setSelectedActividad('');
      onSubmit();
      onClose();
    } catch (error) {
      if (error.response) {
        console.error("Error del servidor:", error.response.data);
        setErrorMessage(`Error del servidor (${error.response.status}): ${error.response.data}`);
      } else if (error.request) {
        console.error("Error de solicitud:", error.request);
        setErrorMessage("Error de solicitud. Intenta de nuevo más tarde.");
      } else {
        console.error("Error:", error.message);
        setErrorMessage(`Error: ${error.message}`);
      }
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