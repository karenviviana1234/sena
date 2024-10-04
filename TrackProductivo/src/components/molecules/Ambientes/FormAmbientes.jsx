import React, { useState, useEffect } from 'react';
import { Button, Input } from "@nextui-org/react";
import axiosClient from '../../../configs/axiosClient';

const FormAmbientes = ({ onSubmit, onClose, actionLabel, mode, initialData }) => {
    const [formData, setFormData] = useState({
        id_ambiente: initialData?.id_ambiente || '',
        nombre_amb: initialData?.nombre_amb || '',
        municipio: initialData?.municipio || '',
        sede: initialData?.sede || '',
    });

    const optionsSede = [
        { value: 'yamboro', label: 'Yamboro' },
        { value: 'centro', label: 'Centro' }
    ];

    const [municipios, setMunicipios] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const loadMunicipios = async () => {
            try {
                const response = await axiosClient.get('/municipios/listar');
                setMunicipios(response.data);
            } catch (error) {
                console.error("Error al cargar municipios:", error);
                setMunicipios([]);
            }
        };

        loadMunicipios();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                id_ambiente: initialData.id_ambiente || '',
                nombre_amb: initialData.nombre_amb || '',
                municipio: initialData.municipio || '',
                sede: initialData.sede || '',
            });
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error("Error al enviar formulario:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                {mode === 'update' && (
                    <div className="py-2">
                        <Input
                            label="ID Ambiente"
                            name="id_ambiente"
                            type="text"
                            value={formData.id_ambiente}
                            disabled
                        />
                    </div>
                )}
                <div className="py-2">
                    <Input
                        label="Nombre del Ambiente"
                        placeholder="Nombre"
                        name="nombre_amb"
                        type="text"
                        value={formData.nombre_amb}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="py-2">
                    <label>Municipio</label>
                    <select
                        name="municipio"
                        value={formData.municipio}
                        onChange={handleInputChange}
                        required
                        className="pl-2 pr-4 py-2 w-full h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                        <option value="">Seleccionar Municipio</option>
                        {municipios.map((municipio) => (
                            <option key={municipio.id_municipio} value={municipio.id_municipio}>
                                {municipio.nombre_mpio}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="py-2">
                    <label>Sede</label>
                    <select
                        name="sede"
                        value={formData.sede}
                        onChange={handleInputChange}
                        className="pl-2 pr-4 py-2 w-full h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                        <option value="">Seleccionar Sede</option>
                        {optionsSede.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                
                    <Button color="primary" type="submit">
                        {actionLabel}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default FormAmbientes;