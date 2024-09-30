import React, { useState, useEffect } from "react";
import { Button, User } from "@nextui-org/react";
import Swal from 'sweetalert2';
import axiosClient from "../../../configs/axiosClient";

function FormMatriculas({ initialData, fichaSeleccionada, onSuccess }) {
    const [aprendices, setAprendices] = useState([]);
    const [estado, setEstado] = useState("");
    const [aprendizSeleccionado, setAprendizSeleccionado] = useState("");
    const [idMatricula, setMatriculaId] = useState(null);
    const [pendientesTecnicos, setPendientesTecnicos] = useState(0);
    const [pendientesTransversales, setPendientesTransversales] = useState(0);
    const [pendienteIngles, setPendienteIngles] = useState(0);
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchAprendices = async () => {
            try {
                const response = await axiosClient.get("/matriculas/listarA");
                setAprendices(response.data);
            } catch (error) {
                console.error("Error al obtener Aprendices", error);
            }
        };

        fetchAprendices();
    }, []);

    useEffect(() => {
        if (initialData) {
            setMatriculaId(initialData.id_matricula);
            setEstado(initialData.estado || "Selecciona");
            setAprendizSeleccionado(initialData.id_persona || "");
            setPendientesTecnicos(initialData.pendientes_tecnicos ?? 0);
            setPendientesTransversales(initialData.pendientes_transversales ?? 0);
            setPendienteIngles(initialData.pendiente_ingles ?? 0);
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    }, [initialData]);

    const handleAprendizClick = (id_persona) => {
        setAprendizSeleccionado(id_persona); // Establece el ID del aprendiz seleccionado

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        if (estado === 'Selecciona') {
            setErrors({ estado: 'Por favor, selecciona un estado válido.' });
            return;
        }

        const formData = {
            estado,
            ficha: fichaSeleccionada,
            aprendiz: aprendizSeleccionado,
            pendientes_tecnicos: pendientesTecnicos,
            pendientes_transversales: pendientesTransversales,
            pendiente_ingles: pendienteIngles
        };

        console.log("FormData:", formData);

        try {
            if (isEditing) {
                await axiosClient.put(`/matriculas/actualizar/${idMatricula}`, formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Matrícula actualizada correctamente',
                });
            } else {
                await axiosClient.post('/matriculas/registrar', formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Matrícula registrada correctamente',
                });
            }
            if (onSuccess) onSuccess(); // Llamar a la función onSuccess después de una operación exitosa
        } catch (error) {
            console.error("Error del servidor:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor selecciona un estado',
            });
        }
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">
                {isEditing ? "Actualizar Matrícula" : "Registrar Matrícula"}
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col">
                {!isEditing && (
                    <h2 className="text-lg font-semibold">Selecciona un Estado</h2>
                )}
                <select
                    name="estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className={`my-4 h-14 rounded-xl bg-[#f4f4f5] p-2 ${errors.estado ? 'border-red-500' : ''}`}
                    style={{ width: '385px' }}
                >
                    <option value="Selecciona">Selecciona un Estado</option>
                    <option value="Induccion">Induccion</option>
                    <option value="Formacion">Formacion</option>
                    <option value="Condicionado">Condicionado</option>
                    <option value="Cancelado">Cancelado</option>
                    <option value="Retiro Voluntario">Retiro Voluntario</option>
                    <option value="Por Certificar">Por Certificar</option>
                    <option value="Certificado">Certificado</option>
                </select>

                {!isEditing && (
                    <h2 className="text-lg font-semibold">Selecciona un Aprendiz</h2>
                )}
                {aprendices.map((aprendiz) => (
                    <div
                        key={aprendiz.id_persona}
                        className={`flex items-center mt-2 p-2 rounded-lg cursor-pointer hover:bg-gray-200 
                                ${aprendizSeleccionado === aprendiz.id_persona ? 'border-2 border-green-500' : ''}`}
                        onClick={() => handleAprendizClick(aprendiz.id_persona, aprendiz.nombres)}
                    >
                        <User
                            avatarProps={{ radius: "lg" }}
                            description={aprendiz.correo}
                            name={aprendiz.nombres}
                        />
                    </div>
                ))}


                {isEditing && (
                    <>
                        <input
                            type="number"
                            name="pendientes_tecnicos"
                            value={pendientesTecnicos}
                            onChange={(e) => setPendientesTecnicos(e.target.value)}
                            placeholder="Pendientes Técnicos"
                            className={`mt-4 h-14 rounded-xl bg-[#f4f4f5] p-2 ${errors.pendientes_tecnicos ? 'border-red-500' : ''}`}
                        />
                        {errors.pendientes_tecnicos && <p className="text-red-500">{errors.pendientes_tecnicos}</p>}

                        <input
                            type="number"
                            name="pendientes_transversales"
                            value={pendientesTransversales}
                            onChange={(e) => setPendientesTransversales(e.target.value)}
                            placeholder="Pendientes Transversales"
                            className={`mt-4 h-14 rounded-xl bg-[#f4f4f5] p-2 ${errors.pendientes_transversales ? 'border-red-500' : ''}`}
                        />
                        {errors.pendientes_transversales && <p className="text-red-500">{errors.pendientes_transversales}</p>}

                        <input
                            type="number"
                            name="pendiente_ingles"
                            value={pendienteIngles}
                            onChange={(e) => setPendienteIngles(e.target.value)}
                            placeholder="Pendiente Inglés"
                            className={`mt-4 h-14 rounded-xl bg-[#f4f4f5] p-2 ${errors.pendiente_ingles ? 'border-red-500' : ''}`}
                        />
                        {errors.pendiente_ingles && <p className="text-red-500">{errors.pendiente_ingles}</p>}
                    </>
                )}

                <div className="flex justify-end gap-5 mt-5">
                    <Button className="bg-[#92d22e] text-white" type="submit" color="success">
                        {isEditing ? "Actualizar" : "Registrar"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default FormMatriculas;
