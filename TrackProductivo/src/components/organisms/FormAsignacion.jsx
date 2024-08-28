import React, { useEffect, useState, useContext } from 'react';
import { ModalFooter, Button } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import AsignacionContext from '../../context/AsignacionContext';
import DatePicker from 'react-datepicker';


const FormAsignacion = ({ mode, initialData, handleSubmit, onClose, actionLabel }) => {
  const [estadoOp, setEstadoOp] = useState('');
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [productiva, setProductiva] = useState([]);
  const [instructor, setInstructor] = useState([]);
  const [estado, setEstado] = useState([]);
 
  const { idAsignacion } = useContext(AsignacionContext);

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
      const productivaFilter = response.data.filter((prod) => prod.estado === 'activo');
      setProductiva(productivaFilter);
    });
  }, []);

  useEffect(() => {
    if (mode === 'update' && idAsignacion) {
      const formattedFechaInicio = idAsignacion.fecha_inicio ? parseDate(idAsignacion.fecha_inicio) : null;
      const formattedFechaFin = idAsignacion.fecha_fin ? parseDate(idAsignacion.fecha_fin) : null;

      setFechaInicio(formattedFechaInicio);
      setFechaFin(formattedFechaFin);
      setInstructor(idAsignacion.fk_identificacion); // Asegúrate de que sea un valor primitivo
      setProductiva(idAsignacion.productiva); // Asegúrate de que sea un valor primitivo
      setEstadoOp(idAsignacion.estado); // Asegúrate de que sea un valor primitivo
    }
  }, [mode, idAsignacion]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        fecha_inicio: fechaInicio ? fechaInicio.toString() : '',
        fecha_fin: fechaFin ? fechaFin.toString() : '',
        productiva: productiva,
        instructor: instructor,
        estado: estadoOp,
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
            onChange={(e) => setInstructor(e.target.value)}
            required
          >
            <option value="" disabled hidden>
              Seleccionar instructor
            </option>
            {instructor.map((inst) => (
              <option key={inst.id_vinculacion} value={inst.id_vinculacion}>
                {inst.id_vinculacion}
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
            onChange={(e) => setProductiva(e.target.value)}
            required
          >
            <option value="" disabled hidden>
              Seleccionar Productiva
            </option>
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

export default FormAsignacion