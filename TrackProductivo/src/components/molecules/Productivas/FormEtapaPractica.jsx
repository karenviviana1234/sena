import React, { useState, useEffect } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import Swal from "sweetalert2";
import axiosClient from "../../../configs/axiosClient";

function FormProductiva({ initialData, onSuccess }) {
    const [formData, setFormData] = useState({
        matricula: "",
        empresa: "",
        fecha_inicio: "",
        fecha_fin: "",
        alternativa: "Selecciona",
        acuerdoFile: null,
        arlFile: null,
        consultaFile: null,
    });
    const [matriculas, setMatriculas] = useState([]);
    const [empresas, setEmpresas] = useState([]);
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
                fecha_inicio: initialData.fecha_inicio || "",
                fecha_fin: initialData.fecha_fin || "",
                alternativa: initialData.alternativa || "Selecciona",
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
        setFormData((prevData) => ({
            ...prevData,
            [name]: files[0],
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formDataToSend = new FormData();
        for (const key in formData) {
            if (formData[key] !== null && formData[key] !== "") {
                formDataToSend.append(key, formData[key]);
            }
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
                <Select
                    id="matricula"
                    name="matricula"
                    value={formData.matricula}
                    onChange={(value) => setFormData((prevData) => ({ ...prevData, matricula: value }))}
                    placeholder="Seleccione una Matricula de un Aprendiz"
                    required
                    className="w-96 mb-5"
                    size="lg"
                >
                    <SelectItem value="">Selecciona un Aprendiz</SelectItem>
                    {matriculas.map((matricula) => (
                        <SelectItem key={matricula.id_matricula} value={matricula.id_matricula}>
                            {matricula.nombre_aprendiz}
                        </SelectItem>
                    ))}
                </Select>

                <Select
                    id="empresa"
                    name="empresa"
                    value={formData.empresa}
                    onChange={(value) => setFormData((prevData) => ({ ...prevData, empresa: value }))}
                    placeholder="Seleccione una Empresa"
                    required
                    className="w-96 mb-5"
                    size="lg"
                >
                    <SelectItem value="">Selecciona una Empresa</SelectItem>
                    {empresas.map((empresa) => (
                        <SelectItem key={empresa.id_empresa} value={empresa.id_empresa}>
                            {empresa.razon_social}
                        </SelectItem>
                    ))}
                </Select>

                <Input
                    type="date"
                    label="Fecha de Inicio"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleInputChange}
                    className="w-96 mb-5"
                    size="md"
                />
                <Input
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

                <Input
                    type="file"
                    label="Acuerdo"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="mb-5"
                    name="acuerdoFile"
                />
                <Input
                    type="file"
                    label="ARL"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="mb-5"
                    name="arlFile"
                />
                <Input
                    type="file"
                    label="Consulta"
                    accept="application/pdf"
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
