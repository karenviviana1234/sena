import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import FormAsignacion from '../organisms/FormAsignacion.jsx';
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
    Input,
} from "@nextui-org/react";
import { PlusIcon } from "../NextIU/atoms/plusicons.jsx";
import ButtonActualizar from "../atoms/ButtonActualizar.jsx";
import { SearchIcon } from '../NextIU/atoms/searchicons.jsx';

export default function AsignacionPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [asignaciones, setAsignaciones] = useState([]);
    const { idAsignacion, setAsignacionId } = useContext(AsignacionContext);
    const [modalContent, setModalContent] = useState(null);
    const [filterValue, setFilterValue] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(5);

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
                    mode={data ? 'update' : 'create'}
                />
            );
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
                const response = await axiosClient.put(`/actualizar/${formData.id_asignacion}`, formData);
                console.log('Respuesta del servidor:', response.data);
            } else {
                const response = await axiosClient.post('/registrar', formData);
                console.log('Respuesta del servidor:', response.data);
            }
            handleCloseModal();
        } catch (error) {
        }
    };

    const handleToggle = (initialData) => {
        setInitialData(initialData);
        setAsignacionId(initialData.id_asignacion); 
        handleOpenModal('asignacion', initialData);
    };

    const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value) => {
        setFilterValue(value || "");
        setPage(1);
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

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

    const filteredItems = useMemo(() => {
        let filteredAsignaciones = asignaciones;

        if (filterValue) {
            filteredAsignaciones = filteredAsignaciones.filter(seg =>
                seg.nombres.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredAsignaciones;
    }, [asignaciones, filterValue]);

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
                    <div>
                        <ButtonActualizar onClick={() => handleToggle(asignacion)} />
                    </div>
                );
            default:
                return cellValue;
        }
    };

    // Añade aquí las nuevas columnas que deseas mostrar
    const columns = [
        { key: "id_asignacion", label: "ID" },
        { key: "nombre_aprendiz", label: "Aprendiz" },
        { key: "nombre_instructor", label: "Instructor" },
        { key: "rango_fechas", label: "Fechas" },
        { key: "horario", label: "Hora y Día" },
        { key: "actions", label: "Acciones" },
    ];

    return (
        <div className="m-10">
            <div className="flex flex-col mt-3">
                <div className="flex justify-between gap-3 items-end mb-4">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%] bg-[#f4f4f5] rounded"
                        placeholder="Buscar..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={onClear}
                        onValueChange={onSearchChange}
                    />
                    <Button onClick={() => handleOpenModal('asignacion')} className="bg-[#90d12c] text-white ml-60">
                        Registrar Asignación
                    </Button>
                </div>
            </div>
            <div className="flex items-center justify-between mt-2 mb-5">
                <span className="text-default-400 text-small mt-2">
                    Total {asignaciones.length} asignaciones
                </span>
                <label className="flex items-center text-default-400 text-small">
                    Rows per page:
                    <select
                        className="bg-transparent outline-none text-default-400 text-small"
                        onChange={onRowsPerPageChange}
                        value={rowsPerPage}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </label>
            </div>

            <Table
                aria-label="Tabla"
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
