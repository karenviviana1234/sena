import React, { useEffect, useState, useContext } from 'react';
import { ModalFooter, Button, Select } from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import { DatePicker } from "@nextui-org/react";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import EtapaContext from '../context/EtapaContext';  // Importar el contexto

const FormEtapa = ({ mode, initialData, handleSubmit, onClose, actionLabel }) => {
    // Separating the states for lists and selected values
    const [selectedEstadoOp, setSelectedEstadoOp] = useState('');
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [productivaList, setProductivaList] = useState([]);
    const [selectedProductiva, setSelectedProductiva] = useState('');
    const [instructorList, setInstructorList] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState('');
    const [estadoOptions, setEstadoOptions] = useState([]);

    setSelectedInstructor(idEtapa.instructor); // Asegúrate de que fk_identificacion es un valor primitivo
    setSelectedProductiva(idEtapa.productiva);
    // Acceder a los valores del contexto
    const { idEtapa } = useContext(EtapaContext);

    useEffect(() => {
        const enumData = [
            { value: 'activo', label: 'Activo' },
            { value: 'inactivo', label: 'Inactivo' },

        ];
        setEstadoOptions(enumData);
    }, []);

    useEffect(() => {
        axiosClient.get('/productiva/listar').then((response) => {
            const productivaFilter = response.data.filter((productiva) => productiva.estado === 'activo');
            setProductivaList(productivaFilter);
        });
    }, []);

    useEffect(() => {
        if (mode === 'update' && idEtapa) {
            const formattedFechaInicio = idEtapa.fecha_inicio ? parseDate(idEtapa.fecha_inicio) : null;
            const formattedFechaFin = idEtapa.fecha_fin ? parseDate(idEtapa.fecha_fin) : null;

            setFechaInicio(formattedFechaInicio);
            setFechaFin(formattedFechaFin);
            setSelectedInstructor(idEtapa.fk_identificacion);
            setSelectedProductiva(idEtapa.productiva);
            setSelectedEstadoOp(idEtapa.estado);
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
            alert('Hay un error en el sistema ' + error);
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
                        value={selectedInstructor}
                        onChange={(e) => setSelectedInstructor(e.target.value)}
                        required
                    >
                        <option value="" disabled hidden>
                            Seleccionar instructor
                        </option>
                        {instructorList.map((instructor) => (
                            <option key={instructor.id_vinculacion} value={instructor.id_vinculacion}>
                                {instructor.id_vinculacion}
                            </option>
                        ))}

                    </select>
                </div>

                <div className="py-2">
                    <select
                        className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        id="productiva"
                        name="productiva"
                        value={selectedProductiva}
                        onChange={(e) => setSelectedProductiva(e.target.value)}
                        required
                    >
                        <option value="" disabled hidden>
                            Seleccionar Productiva
                        </option>
                        {productivaList.map((productiva) => (
                            <option key={productiva.id_productiva} value={productiva.id_productiva}>
                                {productiva.id_productiva}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="py-2">
                    <select
                        className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        label="Estado"
                        value={selectedEstadoOp}
                        onChange={(e) => setSelectedEstadoOp(e.target.value)}
                        required
                    >
                        <option value="" disabled hidden>
                            Seleccionar estado
                        </option>
                        {estadoOptions.map((item) => (
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
