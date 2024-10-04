import React, { useState, useEffect } from 'react';
import { Button } from "@nextui-org/react";
import axiosClient from '../../../configs/axiosClient';
import Swal from 'sweetalert2';
import { Select, SelectItem } from "@nextui-org/react";

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

    const [municipios, setMunicipios] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [matriculas, setMatriculas] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false); // Estado para manejar edición

    const optionsAlternativa = [
        { value: 'contrato_de_aprendizaje', label: 'Contrato de Aprendizaje' },
        { value: 'proyecto_productivo', label: 'Proyecto Productivo' },
        { value: 'pasantias', label: 'Pasantías' },
        { value: 'monitoria', label: 'Monitoría' }
    ];

    // Establecer el estado de edición según si hay datos iniciales
    useEffect(() => {
        if (initialData && initialData.id_productiva) {
            setIsEditing(true);
        }
    }, [initialData]);

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
        const loadEmpresas = async () => {
            if (formData.municipio) {
                try {
                    const response = await axiosClient.get(`/empresas/listarEmpresaMunicipio/${formData.municipio}`);
                    setEmpresas(response.data);
                } catch (error) {
                    console.error("Error al cargar empresas:", error);
                    setEmpresas([]);
                }
            }
        };
        loadEmpresas();
    }, [formData.municipio]);

    useEffect(() => {
        const loadMatriculas = async () => {
            try {
                const response = await axiosClient.get(`/matriculas/lista`);
                setMatriculas(response.data);
            } catch (error) {
                console.error("Error al cargar matricula:", error);
                setMatriculas([]);
            }
        };
        loadMatriculas();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFiles({
            ...files,
            [name]: files[0]
        });
    };

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
            if (isEditing && initialData?.id_productiva) {
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
        <div>
            <h1 className="text-xl font-bold mb-4">
                {isEditing ? "Actualizar Etapa Productiva" : "Registrar Etapa Productiva"}
            </h1>
            <form method="post" onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="ml-5 align-items-center">
                    {errorMessage && <div className="text-red-500">{errorMessage}</div>}

                    <div className="py-2">
                        <select
                            className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500"
                            name="matricula"
                            value={formData.matricula}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Seleccionar Matricula</option>
                            {matriculas.map((matricula) => (
                                <option key={`${matricula.id_matricula}-${matricula.ficha}`} value={matricula.ficha}>
                                    {matricula.ficha}
                                </option>
                            ))}
                        </select>
                        {/* <Select 
                        className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500"
                        name="matricula"
                        value={formData.matricula}
                        onChange={handleInputChange}
                        required
                    >
                        <SelectItem  value="">Seleccionar Matricula</SelectItem >
                        {matriculas.map((matricula) => (
                            <SelectItem key={matricula.correo} value={matricula.correo}>
                                {matricula.correo}
                            </SelectItem>
                        ))}
                    </Select> */}
                    </div>

                    <div className="py-2">
                        <select
                            className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500"
                            name="municipio"
                            value={formData.municipio}
                            onChange={handleInputChange}
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
                        <select
                            className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500"
                            name="alternativa"
                            value={formData.alternativa}
                            onChange={(e) => handleInputChange(e)}
                        >
                            <option value="">Seleccione una alternativa</option>
                            {optionsAlternativa.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="py-2">
                        <label className="block mb-2">Subir Acuerdo</label>
                        <input
                            className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500"
                            type="file"
                            name="acuerdo"
                            onChange={handleFileChange}
                            accept=".pdf"
                        />
                    </div>

                    <div className="py-2">
                        <label className="block mb-2">Subir ARL</label>
                        <input
                            className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500"
                            type="file"
                            name="arl"
                            onChange={handleFileChange}
                            accept=".pdf"
                        />
                    </div>

                    <div className="py-2">
                        <label className="block mb-2">Subir Consulta</label>
                        <input
                            className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-gray-500"

                            type="file"
                            name="consulta"
                            onChange={handleFileChange}
                            accept=".pdf"
                        />
                    </div>
                    <div className="flex justify-end gap-5 mt-5">
                        <Button className="bg-[#0d324c] text-white" type="submit" color="success">
                            {isEditing ? "Actualizar" : "Registrar"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FormProductiva;
