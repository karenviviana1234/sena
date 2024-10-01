import React, { useState, useEffect } from 'react';
import { Button } from "@nextui-org/react";
import axiosClient from '../../../configs/axiosClient';
import Swal from 'sweetalert2';

const FormProductiva = ({ onSubmit, onClose, actionLabel, mode, initialData }) => {
    const [formData, setFormData] = useState({
        matricula: initialData?.matricula || '',
        empresa: initialData?.empresa || '',
        fecha_inicio: initialData?.fecha_inicio || '',
        fecha_fin: initialData?.fecha_fin || '',
        alternativa: initialData?.alternativa || '',
        instructor: initialData?.instructor || '',
        municipio: ''
    });

    const [files, setFiles] = useState({
        acuerdo: null,
        arl: null,
        consulta: null
    });

    const optionsAlternativa = [
        { value: 'contrato_de_aprendizaje', label: 'Contrato de Aprendizaje' },
        { value: 'proyecto_productivo', label: 'Proyecto Productivo' },
        { value: 'pasantias', label: 'Pasantías' },
        { value: 'monitoria', label: 'Monitoría' }
    ];

    const [municipios, setMunicipios] = useState([]);  // Municipios obtenidos de la API
    const [empresas, setEmpresas] = useState([]);      // Empresas del municipio seleccionado
    const [errorMessage, setErrorMessage] = useState('');

    // Función para cargar los municipios al montar el componente
    useEffect(() => {
        const loadMunicipios = async () => {
            try {
                const response = await axiosClient.get('/municipios/listar');
                setMunicipios(response.data);  // Asigna la lista de municipios
            } catch (error) {
                console.error("Error al cargar municipios:", error);
                setMunicipios([]);
            }
        };

        loadMunicipios();
    }, []);

    // Actualiza el estado de los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Maneja el cambio de archivos
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFiles({
            ...files,
            [name]: files[0]
        });
    };

    // Maneja la selección de un municipio y carga las empresas asociadas
    const handleMunicipioChange = async (e) => {
        const municipioId = e.target.value;
        setFormData({ ...formData, municipio: municipioId });

        try {
            const response = await axiosClient.get(`/empresas/listarEmpresaMunicipio/${municipioId}`);
            setEmpresas(response.data);  // Asigna las empresas del municipio
        } catch (error) {
            console.error("Error al cargar empresas:", error);
            setEmpresas([]);
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const dataToSend = new FormData();
        dataToSend.append('matricula', formData.matricula);
        dataToSend.append('empresa', formData.empresa);
        dataToSend.append('fecha_inicio', formData.fecha_inicio);
        dataToSend.append('fecha_fin', formData.fecha_fin);
        dataToSend.append('alternativa', formData.alternativa);
        dataToSend.append('instructor', formData.instructor);
        dataToSend.append('municipio', formData.municipio);

        if (files.acuerdo) dataToSend.append('acuerdo', files.acuerdo);
        if (files.arl) dataToSend.append('arl', files.arl);
        if (files.consulta) dataToSend.append('consulta', files.consulta);

        try {
            if (mode === 'update' && initialData?.id_productiva) {
                await axiosClient.put(`/productiva/actualizar/${initialData.id_productiva}`, dataToSend);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Etapa productiva actualizada correctamente',
                });
            } else {
                await axiosClient.post('/productiva/registrar', dataToSend);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Etapa productiva registrada correctamente',
                });
            }
            onSubmit();
            onClose();
        } catch (error) {
            console.error(error);
            setErrorMessage("Error al procesar la solicitud. Intenta de nuevo.");
        }
    };

    return (
        <form method="post" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="ml-5 align-items-center">
                {errorMessage && <div className="text-red-500">{errorMessage}</div>}

                <div className="py-2">
                    <input
                        type="text"
                        className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500"
                        name="matricula"
                        placeholder="Matrícula"
                        value={formData.matricula}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Select para Municipio */}
                <div className="py-2">
                    <select
                        className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500"
                        name="municipio"
                        value={formData.municipio}
                        onChange={handleMunicipioChange}
                        required
                    >
                        <option value="">Seleccionar Municipio</option>
                        {municipios.map((municipio) => (
                            <option key={municipio.id_municipio} value={municipio.id_municipio}>
                                {municipio.nombre_mpio}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Select para Empresa */}
                <div className="py-2">
                    <select
                        className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Seleccionar Empresa</option>
                        {empresas.map((empresa) => (
                            <option key={empresa.id_empresa} value={empresa.id_empresa}>
                                {empresa.razon_social}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Otros campos */}
                <div className="py-2">
                    <input
                        type="date"
                        className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500"
                        name="fecha_inicio"
                        value={formData.fecha_inicio}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="py-2">
                    <input
                        type="date"
                        className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500"
                        name="fecha_fin"
                        value={formData.fecha_fin}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="py-2">
                    <label className="block mb-2">Alternativa</label>
                    <select
                        className="pl-2 pr-4 py-2 w-11/12 h-10 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500"
                        name="alternativa"
                        value={formData.alternativa}
                        onChange={(e) => handleInputChange(e)}
                    >
                        <option value="">Seleccione una opción</option>
                        {optionsAlternativa.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="py-2">
                    <input
                        type="text"
                        className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500"
                        name="instructor"
                        placeholder="Instructor"
                        value={formData.instructor}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Archivos */}
                <div className="py-2">
                    <label className="block mb-2">Subir Acuerdo</label>
                    <input
                        type="file"
                        name="acuerdo"
                        onChange={handleFileChange}
                        accept=".pdf"
                    />
                </div>

                <div className="py-2">
                    <label className="block mb-2">Subir ARL</label>
                    <input
                        type="file"
                        name="arl"
                        onChange={handleFileChange}
                        accept=".pdf"
                    />
                </div>

                <div className="py-2">
                    <label className="block mb-2">Subir Consulta</label>
                    <input
                        type="file"
                        name="consulta"
                        onChange={handleFileChange}
                        accept=".pdf"
                    />
                </div>

                {/* Botón de enviar */}
                <div className="flex justify-center mt-4">
                    <Button flat color="primary" auto type="submit">
                        {actionLabel}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default FormProductiva;
