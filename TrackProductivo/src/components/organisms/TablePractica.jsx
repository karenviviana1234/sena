import React, { useCallback, useEffect, useMemo, useState } from "react";
import ModalAcciones from "../molecules/ComponentsGlobals/ModalAcciones.jsx";
import Swal from "sweetalert2";
import axiosClient from "../../configs/axiosClient.jsx";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Pagination,
    Chip,
} from "@nextui-org/react";
import ButtonActualizar from "../atoms/ButtonActualizar.jsx";
import ButtonDesactivar from "../atoms/ButtonDesactivar.jsx";
import FormAsignacion from "../molecules/Asignaciones/FormAsignacion.jsx";
import { SearchIcon } from "../NextIU/atoms/searchicons.jsx";
import ButtonEditarAsignacionI from "../atoms/ButtonEditarAsignacionI.jsx";
import ButtonAsignarI from "../atoms/ButtonAsignarInstructor.jsx";
import FormActualizarAsignacion from "../molecules/Asignaciones/FormEditAsignacion.jsx";
import { format } from 'date-fns';
import ButtonDescargar from "../atoms/ButtonDescargar.jsx";
import ButtonDescargarProductiva from "../atoms/ButtonDescargarProductiva.jsx";

function TableProductiva() {
    const [modalOpen, setModalOpen] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [productivas, setProductivas] = useState([]);
    const [modalContent, setModalContent] = useState(null);
    const [filterValue, setFilterValue] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "id_productiva",
        direction: "ascending",
    });

    const fetchData = async () => {
        try {
            const response = await axiosClient.get("/productiva/listar");
            setProductivas(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCloseModal = () => {
        setModalOpen(false);
        setInitialData(null);
        setModalContent(null);
    };

    const handleOpenModal = (formType, data = null, id_productiva) => {
        setModalOpen(true);
        setInitialData(data);

        // Si es para registrar una nueva asignación
        if (formType === 'asignacion') {
            setModalContent(
                <FormAsignacion
                    initialData={null}  // Sin datos iniciales para registrar
                    onSuccess={handleUpdateData}
                    id_productiva={id_productiva}  // Solo enviar id_productiva para registro
                />
            );
        }

        // Si es para actualizar una asignación existente
        if (formType === 'actualizar_asignacion') {
            setModalContent(
                <FormActualizarAsignacion
                    initialData={data}  // Pasamos los datos existentes para actualizar
                    onSuccess={handleUpdateData}
                    id_productiva={id_productiva}  // Enviar tanto id_productiva como id_asignacion
                    id_asignacion={data.id_asignacion}
                />
            );
        }
    };

    const handleUpdateData = useCallback(() => {
        fetchData();
    }, [fetchData]);

    const handleFormSubmit = async (formData) => {
        try {
            if (formData.id_asignacion) {
                // Si tiene id_asignacion, actualizamos
                const response = await axiosClient.put(`/actualizar/${formData.id_asignacion}`, formData);
                console.log('Updated successfully:', response.data);
            } else {
                // Si no tiene id_asignacion, registramos
                const response = await axiosClient.post('/registrar', { ...formData, id_productiva: formData.id_productiva });
                console.log('Created successfully:', response.data);
            }
            handleCloseModal();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const handleEditAsignacion = (data) => {
        handleOpenModal('actualizar_asignacion', {
            ...data,
            id_asignacion: data.id_asignacion,
        }, data.id_productiva);  // Pasamos también el id_productiva
    };


    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = useMemo(() => {
        let filteredproductivas = productivas;

        if (hasSearchFilter) {
            filteredproductivas = filteredproductivas.filter((seg) =>
                seg.aprendiz_nombre.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredproductivas;
    }, [productivas, filterValue]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    // Get paginated items
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    // Sort items based on the sort descriptor
    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const getColorForEstado = (estado) => {
        switch (estado) {
            case "Inicio":
                return "rgba(173, 216, 230, 0.8)"; // Azul claro
            case "Renuncia":
                return "rgba(255, 182, 193, 0.8)"; // Rojo claro
            case "Terminado":
                return "rgba(144, 238, 144, 0.8)"; // Verde claro
            default:
                return null; // Color por defecto si no coincide
        }
    };

    const renderCell = (productiva, columnKey) => {
        const cellValue = productiva[columnKey];
        switch (columnKey) {
            case "acciones":
                return (
                    <div className="flex justify-around items-center">
                        <ButtonActualizar />
                        <ButtonDesactivar
                            onClick={() => handleDesactivar(productiva.id_asignacion)}
                        />
                    </div>
                );
            case "instructor_nombre":
                return (
                    <div className="flex items-center">
                        <span>{cellValue}</span>
                        {cellValue ? (
                            <ButtonEditarAsignacionI
                                onClick={() => handleEditAsignacion(productiva)}
                            />
                        ) : (
                            <ButtonAsignarI
                                onClick={() =>
                                    handleOpenModal("asignacion", null, productiva.id_productiva)
                                }
                            />
                        )}
                    </div>
                );

            case "fecha_inicio":
            case "fecha_fin":
                return cellValue ? format(new Date(cellValue), 'dd-MM-yyyy') : 'N/A'; // Formatea la fecha

            case "acuerdo":
            case "arl":
            case "consulta":
                return (
                    <div className="flex justify-center items-center">
                        <ButtonDescargarProductiva />
                    </div>
                );

            case "estado": // Caso para la columna "estado"
                return (
                    <Chip
                        className="text-[#3c3c3c]"
                        variant="flat"
                        style={{ backgroundColor: getColorForEstado(cellValue) || "rgba(240, 240, 240, 0.8)" }} // Color claro por defecto
                    >
                        {cellValue}
                    </Chip>
                );


            default:
                return cellValue;
        }
    };

    const handleDesactivar = async (id_asignacion) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Quieres eliminar esta asignación?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No, cancelar",
            reverseButtons: true,
            customClass: {
                confirmButton: "bg-[#90d12c] text-white hover:bg-green-600 border-green-500",
                cancelButton: "bg-[#f31260] text-white hover:bg-red-600 border-red-500",
            },
        });

        if (result.isConfirmed) {
            try {
                const response = await axiosClient.delete(`/eliminar/${id_asignacion}`);
                Swal.fire("Eliminada", response.data.message, "success");

                // Remove deleted asignación from the state
                setProductivas((prevProductivas) =>
                    prevProductivas.filter((productiva) => productiva.id_asignacion !== id_asignacion)
                );
            } catch (error) {
                console.error("Error deleting asignación:", error);
                Swal.fire("Error", "No se pudo eliminar la asignación", "error");
            }
        }
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

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col mt-3">
                <div className="flex flex-col mt-3">
                    <div className="flex justify-between gap-3 items-end">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[44%] bg-[#f4f4f5] rounded"
                            placeholder="Buscar..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onClear={onClear}
                            onValueChange={onSearchChange}
                        />
                        <div>
                            <Button
                                className="bg-[#0d324c] text-white"
                            >
                                Registrar Etapa Productiva
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-2 mb-5">
                    <span className="text-default-400 text-small mt-2">
                        Total {productivas.length} usuarios
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
            </div>
        );
    }, [
        filterValue,
        productivas.length,
        onRowsPerPageChange,
        onClear,
        onSearchChange,
    ]);


    const columns = [
        { key: "id_productiva", label: "ID" },
        { key: "aprendiz_nombre", label: "Aprendiz" },
        { key: "instructor_nombre", label: "Instructor" },
        { key: "empresa_nombre", label: "Empresa" },
        { key: "fecha_inicio", label: "Fecha de Inicio" },
        { key: "fecha_fin", label: "Fecha de Fin" },
        { key: "alternativa", label: "Alternativa" },
        { key: "estado", label: "Estado" },
        { key: "acuerdo", label: "Acuerdo" },
        { key: "arl", label: "ARL" },
        { key: "consulta", label: "Consulta" },
        { key: "acciones", label: "Acciones" },
    ];

    return (
        <div className="overflow-hidden flex-1 bg-dark p-2">
            <div className="flex flex-col">
                {topContent}
                <Table
                    aria-labelledby="Tabla de productivas"
                    className="text-left"
                    striped
                >
                    <TableHeader>
                        {columns.map((column) => (
                            <TableColumn key={column.key} style={{ width: '250px' }}>
                                {column.label}
                            </TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {sortedItems.map((item) => (
                            <TableRow key={item.id_asignacion}>
                                {columns.map((column) => (
                                    <TableCell key={column.key} style={{ width: '250px' }}>
                                        {renderCell(item, column.key)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex justify-start mt-4">
                    <Pagination
                        total={pages}
                        initialPage={page}
                        onChange={(page) => setPage(page)}
                        color="success"
                        aria-label="Paginación de la tabla"
                        showControls
                    />
                </div>
            </div>
            <ModalAcciones
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={initialData ? "Actualizar Asignación" : "Registrar Asignación"}
                bodyContent={modalContent}
            />
        </div>
    );
}

export default TableProductiva;
