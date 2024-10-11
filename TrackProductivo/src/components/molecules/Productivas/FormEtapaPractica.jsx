import React, { useState, useEffect } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import Swal from "sweetalert2";
import axiosClient from "../../../configs/axiosClient";

function FormProductiva({ initialData, onSuccess }) {
    const [matricula, setMatricula] = useState([]);
    const [empresa, setEmpresa] = useState([]);
    const [fecha_inicio, setFechaInicio] = useState("");
    const [fecha_fin, setFechaFin] = useState("");
    const [alternativa, setAlternativa] = useState("Selecciona");
    const [acuerdo, setAcuerdo] = useState(null);
    const [arl, setArl] = useState(null);
    const [consulta, setConsulta] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [idPractica, setIdPractica] = useState(null);
    const [errors, setErrors] = useState({});
    const [selectedMatricula, setSelectMatricula] = useState('');
    const [selectedEmpresa, setSelectEmpresa] = useState('');

    useEffect(() => {
        const fetchMatriculas = async () => {
            try {
                const response = await axiosClient.get("/matriculas/lista");
                setMatricula(response.data);
            } catch (error) {
                console.error("Error al obtener Matriculas", error);
            }
        };

        fetchMatriculas();
    }, []);

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const response = await axiosClient.get("/empresas/listar");
                setEmpresa(response.data);
            } catch (error) {
                console.error("Error al obtener Empresas", error);
            }
        };

        fetchEmpresas();
    }, []);

    useEffect(() => {
        if (initialData) {
            setSelectMatricula(initialData.matricula || "Selecciona");
            setSelectEmpresa(initialData.empresa || "Selecciona");
            setFechaInicio(initialData.fecha_inicio || "");
            setFechaFin(initialData.fecha_fin || "");
            setAlternativa(initialData.alternativa || "Selecciona");
            setIdPractica(initialData.id_productiva);
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    }, [initialData]);

    


    const handleFileChange = (e, setFile) => {
        const file = e.target.files[0];
        setFile(file);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Limpiar errores previos
        setErrors({});

        const formData = new FormData();
        formData.append('alternativa', alternativa);
        formData.append('fecha_inicio', fecha_inicio);
        formData.append('fecha_fin', fecha_fin);
        formData.append('matricula', selectedMatricula);
        formData.append('empresa', selectedEmpresa);

        // Añadir archivos al FormData
        if (acuerdo) formData.append('acuerdo', acuerdo);
        if (arl) formData.append('arl', arl);
        if (consulta) formData.append('consulta', consulta);

        try {
            if (isEditing) {
                await axiosClient.put(`/productiva/actualizar/${idPractica}`, formData);
                Swal.fire("Éxito", "Etapa Productiva actualizada correctamente", "success");
            } else {
                await axiosClient.post("/productiva/registrar", formData);
                Swal.fire("Éxito", "Etapa Productiva registrada correctamente", "success");
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error al registrar/actualizar Etapa Productiva:", error);
            Swal.fire("Error", "No se pudo registrar/actualizar el Etapa Productiva", "error");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            <Select
                id="matricula"
                name="matricula"
                value={selectedMatricula}
                onChange={(e) => setSelectMatricula(e.target.value)}
                placeholder="Seleccione una Matricula de un Aprendiz"
                required
                className="w-96 mb-5"
                size="lg"
            >
                <SelectItem value="">Selecciona un Aprendiz</SelectItem>
                {matricula.map((matricula) => (
                    <SelectItem key={matricula.id_matricula} value={matricula.id_matricula}>
                        {matricula.nombre_aprendiz}
                    </SelectItem>
                ))}
            </Select>
            <Select
                id="empresa"
                name="empresa"
                value={selectedEmpresa}
                onChange={(e) => setSelectEmpresa(e.target.value)}
                placeholder="Seleccione una Empresa"
                required
                className="w-96 mb-5"
                size="lg"
            >
                <SelectItem value="">Selecciona una Empresa</SelectItem>
                {empresa.map((empresa) => (
                    <SelectItem key={empresa.id_empresa} value={empresa.id_empresa}>
                        {empresa.razon_social}
                    </SelectItem>
                ))}
            </Select>
            <Input
                type="date"
                label="Fecha de Inicio"
                value={fecha_inicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-96 mb-5"
                size="md"
            />
            <Input
                type="date"
                label="Fecha de Fin"
                value={fecha_fin}
                onChange={(e) => setFechaFin(e.target.value)}
                required
                className="w-96 mb-5"
                size="md"
            />
            <select
                className={`mb-4 h-[52px] rounded-xl bg-[#f4f4f5] p-2 ${errors.alternativa ? 'border-red-500' : ''}`}
                value={alternativa}
                onChange={(e) => setAlternativa(e.target.value)}
                required
            >
                <option value="Selecciona">Selecciona una alternativa</option>
                <option value="Contrato de Aprendizaje">Contrato de Aprendizaje</option>
                <option value="Proyecto Productivo">Proyecto Productivo</option>
                <option value="Pasantías">Pasantías</option>
                <option value="Monitoria">Monitoria</option>
            </select>
            {errors.alternativa && <p className="text-red-500">{errors.alternativa}</p>}

            {/* Campos para subir archivos */}
            <Input
                type="file"
                label="Acuerdo"
                onChange={(e) => handleFileChange(e, setAcuerdo)}
                required
                className="w-96 mb-5"
                size="lg"
            />
            <Input
                type="file"
                label="ARL"
                onChange={(e) => handleFileChange(e, setArl)}
                required
                className="w-96 mb-5"
                size="lg"
            />
            <Input
                type="file"
                label="Consulta"
                onChange={(e) => handleFileChange(e, setConsulta)}
                required
                className="w-96 mb-5"
                size="lg"
            />

            <div className="flex justify-end gap-5 mt-5">
                <Button className="bg-[#0d324c] text-white" type="submit" color="success">
                    {isEditing ? "Actualizar" : "Registrar"}
                </Button>
            </div>
        </form>
    );
}

export default FormProductiva;
