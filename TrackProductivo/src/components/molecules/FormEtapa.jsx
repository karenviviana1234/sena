import React, { useEffect, useState, useContext } from 'react';
import { ModalFooter, Button, Select } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { DatePicker } from "@nextui-org/react";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import EtapaContext from '../context/EtapaContext';

const FormEtapa = ({ mode, initialData, handleSubmit, onClose, actionLabel }) => {

  
  const [estadoOp, setEstadoOp] = useState('');
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [productiva, setproductiva] = useState([]);
  const [instructor, setinstructor] = useState([]);
  const [estado, setEstado] = useState([]);
 
  const { idEtapa } = useContext(EtapaContext);

  useEffect(() => {
    const enumData = [
      { value: 'activo', label: 'Activo' },
      { value: 'inactivo', label: 'Inactivo' },
      { value: 'proceso', label: 'Proceso' },
      { value: 'terminado', label: 'Terminado' },
    ];
    setEstado(enumData);
  }, []);

  useEffect(() => {
    axiosClient.get('/productiva/listar').then((response) => {
      const productivaFilter = response.data.filter((productiva) => productiva.estado === 'activo');
      setproductiva(productivaFilter);
    });
  }, []);

  useEffect(() => {
    if (mode === 'update' && idEtapa) {
        const formattedFechaInicio = idEtapa.fecha_inicio ? parseDate(idEtapa.fecha_inicio) : null;
        const formattedFechaFin = idEtapa.fecha_fin ? parseDate(idEtapa.fecha_fin) : null;

        setFechaInicio(formattedFechaInicio);
        setFechaFin(formattedFechaFin);
        setSelectedInstructor(idEtapa.fk_identificacion); // Verifica que fk_identificacion sea un valor primitivo
        setSelectedProductiva(idEtapa.productiva); // Verifica que productiva sea un valor primitivo
        setSelectedEstadoOp(idEtapa.estado); // Verifica que estado sea un valor primitivo
    }
}, [mode, idEtapa]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
        const formData = {
            fecha_inicio: fechaInicio ? fechaInicio.toString() : '',
            fecha_fin: fechaFin ? fechaFin.toString() : '',
            productiva: selectedProductiva,
            instructor: selectedInstructor,
            estado: selectedEstadoOp,
        };
        handleSubmit(formData, e);
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('Hay un error en el sistema: ' + error.message);
    }
};

  return (
    <form method="post" onSubmit={handleFormSubmit}>
      <div className="ml-5 align-items-center">
        <div className="py-2">
          <DatePicker
            label="Fecha inicial"
            minValue={today(getLocalTimeZone())}
            value={fechaInicio}
            onChange={(date) => setFechaInicio(date)}
            required
          />
        </div>
        <div className="py-2">
          <DatePicker
            label="Fecha final"
            minValue={today(getLocalTimeZone())}
            value={fechaFin}
            onChange={(date) => setFechaFin(date)}
            required
          />
        </div>

        <div className="py-2">
          <select
            className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            id="instructor"
            name="instructor"
            value={instructor}
            onChange={(e) => setinstructor(e.target.value)}
            required
          >
            <option value="" disabled hidden>
              Seleccionar instructor
            </option>
            {instructor.map((acti) => (
              <option key={acti.id_vinculacion} value={acti.id_vinculacion}>
                {acti.id_vinculacion}
              </option>
            ))}
          </select>
        </div>

        <div className="py-2">
          <select
            className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            id="productiva"
            name="productiva"
            value={productiva}
            onChange={(e) => setproductiva(e.target.value)}
            required
          >
            <option value="" disabled hidden>
              Seleccionar Productiva
            </option>
            {productiva.map((productiva) => (
              <option key={productiva.id_productiva} value={productiva.id_productiva}>
                {productiva.id_productiva}
              </option>
            ))}
          </select>
        </div>

        <div className="py-2">
          <select
            label="Estado"
            className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            value={estadoOp}
            onChange={(e) => setEstadoOp(e.target.value)}
            required
          >
            <option value="" disabled hidden>
              Seleccionar estado
            </option>
            {estado.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Close
          </Button>
          <Button type="submit" className="text-white bg-[#006000]">
            {actionLabel}
          </Button>
        </ModalFooter>
      </div>
    </form>
  );
};

export default FormEtapa;