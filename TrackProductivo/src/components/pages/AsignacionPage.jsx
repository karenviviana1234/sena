import React, { useContext, useEffect, useState } from 'react';
import FormAsignacion from '../organisms/FormAsignacion.jsx';
import FormActividades from '../organisms/FormActividades.jsx';
import ModalAcciones from '../organisms/ModalAcciones.jsx';
import Swal from 'sweetalert2';
import axiosClient from '../../configs/axiosClient.jsx';
import AsignacionContext from '../../context/AsignacionesContext.jsx';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Chip,
} from "@nextui-org/react";
import { PlusIcon } from "../NextIU/atoms/plusicons.jsx";
import ButtonDesactivar from "../atoms/ButtonDesactivar.jsx";
import ButtonActualizar from "../atoms/ButtonActualizar.jsx";

export default function AsignacionPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [asignaciones, setAsignaciones] = useState([]);
    const { idAsignacion, setAsignacionId } = useContext(AsignacionContext);
    const [modalContent, setModalContent] = useState(null);

    useEffect(() => {
        peticionGet();
    }, []);

    const handleOpenModal = (formType, data = null) => {
        if (formType === 'asignacion') {
            setModalContent(
                <FormAsignacion 
                    initialData={data} 
                    onSubmit={handleFormAsignacionSubmit} 
                    onClose={handleCloseModal} 
                    mode={data ? 'update' : 'create'} // Enviar el modo correcto
                />
            );
        } else if (formType === 'actividades') {
            setModalContent(<FormActividades />);
        }
        setModalOpen(true);
    };

    const handleCloseModal = async () => {
        setModalOpen(false);
        setInitialData(null);
        setModalContent(null);
        await peticionGet(); 
    };

    const handleFormAsignacionSubmit = async (formData) => {
        try {
            if (formData.id_asignacion) {
                // Actualizar asignación
                const response = await axiosClient.put(`/actualizar/${formData.id_asignacion}`, formData);
                console.log('Respuesta del servidor:', response.data);
            } else {
                // Registrar nueva asignación
                const response = await axiosClient.post('/registrar', formData);
                console.log('Respuesta del servidor:', response.data);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error al registrar o actualizar la asignación:', error);
            alert('Ocurrió un error al registrar o actualizar la asignación.');
        }
    };

    const handleToggle = (initialData) => {
        setInitialData(initialData);
        handleOpenModal('asignacion', initialData);
    };

    const peticionGet = async () => {
        try {
            const response = await axiosClient.get('/listar');
            const formattedData = response.data.map((item) => ({
                ...item,
                fecha_inicio: formatDate(item.fecha_inicio),
                fecha_fin: formatDate(item.fecha_fin),
            }));
            setAsignaciones(formattedData);
        } catch (error) {
            alert('Error en el servidor');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '';
        }
        return date.toISOString().split('T')[0];
    };

    const renderCell = (asignacion, columnKey) => {
        const cellValue = asignacion[columnKey];
        switch (columnKey) {
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <ButtonActualizar onClick={() => handleToggle(asignacion)} />
                    </div>
                );
            default:
                return cellValue;
        }
    };

    const columns = [
        { key: "id_asignacion", label: "ID" },
        { key: "productiva", label: "Etapa Productiva" },
        { key: "actividad", label: "Actividad" },
        { key: "actions", label: "Acciones" },
    ];

    return (
        <div className="m-12">
            <div className="mb-4">
                <Button onClick={() => handleOpenModal('asignacion')} className="bg-[#90d12c] text-white" endContent={<PlusIcon />}>
                    Registrar Asignación
                </Button>
                <Button onClick={() => handleOpenModal('actividades')} className="bg-[#5a851b] text-white" endContent={<PlusIcon />}>
                    Añadir Actividades
                </Button>
            </div>

            <Table
                aria-label="Tabla"
                className="min-w-full border p-10 rounded-lg border-gray-300 shadow-md transition-shadow duration-300 hover:shadow-lg"
                isHeaderSticky
                sortDescriptor={{ column: "fecha", direction: "ascending" }}
            >
                <TableHeader>
                    {columns.map((column) => (
                        <TableColumn key={column.key}>{column.label}</TableColumn>
                    ))}
                </TableHeader>
                <TableBody emptyContent={"No hay asignaciones registradas"} items={asignaciones}>
                    {(item) => (
                        <TableRow key={item.id_asignacion}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <ModalAcciones
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={initialData ? "Actualizar Asignación" : "Registrar Asignación"}
                bodyContent={modalContent}
            />
        </div>
    );
}
