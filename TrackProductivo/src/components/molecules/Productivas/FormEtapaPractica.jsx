import React, { useState, useEffect } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import Swal from "sweetalert2";
import axiosClient from "../../../configs/axiosClient";
import { parseISO, format } from 'date-fns'; 


function FormProductiva({ initialData, onSuccess }) {
    const [formData, setFormData] = useState({
        matricula: "",
        empresa: "",
        fecha_inicio: "",
        fecha_fin: "",
        alternativa: "Selecciona",
        estado: "Selecciona",
        acuerdoFile: null,
        arlFile: null,
        consultaFile: null,
    });
    const [matriculas, setMatriculas] = useState([]);
    const [empresas, setEmpresas] = useState([]);;
    const [isEditing, setIsEditing] = useState(false);
    const [idPractica, setIdPractica] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchMatriculas = async () => {
            try {
                const response = await axiosClient.get("/matriculas/lista");
                setMatriculas(response.data);
            } catch (error) {
                console.error("Error al obtener Matriculas", error);
            }
        };

        const fetchEmpresas = async () => {
            try {
                const response = await axiosClient.get("/empresas/listar");
                setEmpresas(response.data);
            } catch (error) {
                console.error("Error al obtener Empresas", error);
            }
        };

        fetchMatriculas();
        fetchEmpresas();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                matricula: initialData.matricula || "",
                empresa: initialData.empresa || "",
                fecha_inicio: initialData.fecha_inicio ? format(parseISO(initialData.fecha_inicio), 'yyyy-MM-dd') : "",
                fecha_fin: initialData.fecha_fin ? format(parseISO(initialData.fecha_fin), 'yyyy-MM-dd') : "",
                alternativa: initialData.alternativa || "Selecciona",
                estado: initialData.estado || "Selecciona",
                acuerdoFile: null,
                arlFile: null,
                consultaFile: null,
            });
            setIdPractica(initialData.id_productiva);
            setIsEditing(true);
        } else {
            setIsEditing(false);
            setFormData({
                matricula: "",
                empresa: "",
                fecha_inicio: "",
                fecha_fin: "",
                alternativa: "Selecciona",
                estado: "Selecciona",
                acuerdoFile: null,
                arlFile: null,
                consultaFile: null,
            });
        }
    }, [initialData]);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        if (file) {
            setFormData((prevData) => ({
                ...prevData,
                [name]: file,
            }));
        } else {
            Swal.fire("Error", "Por favor, selecciona un archivo válido", "error");
        }
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("matricula", formData.matricula);
        formDataToSend.append("empresa", formData.empresa);
        formDataToSend.append("fecha_inicio", formData.fecha_inicio);
        formDataToSend.append("fecha_fin", formData.fecha_fin);
        formDataToSend.append("alternativa", formData.alternativa);
        formDataToSend.append("estado", formData.estado);

        // Adjuntar los archivos con los nombres correctos
        if (formData.acuerdoFile) {
            formDataToSend.append("acuerdoFile", formData.acuerdoFile);
        }
        if (formData.arlFile) {
            formDataToSend.append("arlFile", formData.arlFile);
        }
        if (formData.consultaFile) {
            formDataToSend.append("consultaFile", formData.consultaFile);
        }

        // Log para verificar los datos que se envían
        for (const pair of formDataToSend.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
        }

        try {
            const response = isEditing
                ? await axiosClient.put(`/productiva/actualizar/${initialData.id_productiva}`, formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                : await axiosClient.post("/productiva/registrar", formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

            Swal.fire("Éxito", `Etapa Productiva ${isEditing ? "actualizada" : "registrada"} correctamente`, "success");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(`Error al ${isEditing ? "actualizar" : "registrar"} Etapa Productiva:`, error.response?.data || error.message);
            Swal.fire("Error", `No se pudo ${isEditing ? "actualizar" : "registrar"} la Etapa Productiva`, "error");
        }
    };



    return (
        <div>
            <h1 className="text-xl font-bold mb-4">
                {isEditing ? "Actualizar Etapa Productiva" : "Registro de Etapas Productivas"}
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col" encType="multipart/form-data">
                {!isEditing && (
                    <select
                        id="matricula"
                        name="matricula"
                        value={formData.matricula}
                        onChange={(event) =>
                            setFormData((prevData) => ({ ...prevData, matricula: event.target.value }))
                        }
                        placeholder="Seleccione una Matricula de un Aprendiz"
                        required
                        className={`mb-4 h-[52px] rounded-xl bg-[#f4f4f5] p-2 ${errors.matricula ? "border-red-500" : ""
                            }`}
                        size="lg"
                    >
                        <option value="">Selecciona un Aprendiz</option>
                        {matriculas.map((matricula) => (
                            <option key={matricula.id_matricula} value={matricula.id_matricula}>
                                {matricula.nombre_aprendiz}
                            </option>
                        ))}
                    </select>
                )}



                <select
                    id="empresa"
                    name="empresa"
                    value={formData.empresa}
                    onChange={(event) => setFormData((prevData) => ({ ...prevData, empresa: event.target.value }))}
                    placeholder="Seleccione una Empresa"
                    required
                    className={`mb-4 h-[52px] rounded-xl bg-[#f4f4f5] p-2 ${errors.empresa ? "border-red-500" : ""}`}
                    size="lg"
                >
                    <option value="">Selecciona una Empresa</option>
                    {empresas.map((empresa) => (
                        <option key={empresa.id_empresa} value={empresa.id_empresa}>
                            {empresa.razon_social}
                        </option>
                    ))}
                </select>

                <Input
                    id="fecha_inicio"
                    type="date"
                    label="Fecha de Inicio"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleInputChange}
                    className="w-96 mb-5"
                    size="md"
                    required
                />
                <Input
                    id="fecha_fin"
                    type="date"
                    label="Fecha de Fin"
                    name="fecha_fin"
                    value={formData.fecha_fin}
                    onChange={handleInputChange}
                    required
                    className="w-96 mb-5"
                    size="md"
                />
                <select
                    id="alternativa"
                    className={`mb-4 h-[52px] rounded-xl bg-[#f4f4f5] p-2 ${errors.alternativa ? "border-red-500" : ""}`}
                    name="alternativa"
                    value={formData.alternativa}
                    onChange={handleInputChange}
                    required
                >
                    <option value="Selecciona">Selecciona una alternativa</option>
                    <option value="Contrato de Aprendizaje">Contrato de Aprendizaje</option>
                    <option value="Proyecto Productivo">Proyecto Productivo</option>
                    <option value="Pasantías">Pasantías</option>
                    <option value="Monitoria">Monitoria</option>
                </select>

                {isEditing && (
                    <select
                        id="estado"
                        className={`mb-4 h-[52px] rounded-xl bg-[#f4f4f5] p-2 ${errors.estado ? "border-red-500" : ""}`}
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="Selecciona">Selecciona un estado</option>
                        <option value="Inicio">Inicio</option>
                        <option value="Terminado">Terminado</option>
                        <option value="Renuncia">Renuncia</option>
                    </select>
                )}


                <Input
                    type="file"
                    label="Acuerdo"
                    onChange={handleFileChange}
                    className="mb-5"
                    name="acuerdoFile"
                />
                <Input
                    type="file"
                    label="ARL"
                    onChange={handleFileChange}
                    className="mb-5"
                    name="arlFile"
                />
                <Input
                    type="file"
                    label="Consulta"
                    onChange={handleFileChange}
                    className="mb-5"
                    name="consultaFile"
                />
                <div className="flex justify-end gap-5 mt-5">
                    <Button className="bg-[#0d324c] text-white" type="submit">
                        {isEditing ? "Actualizar" : "Registrar"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default FormProductiva;
