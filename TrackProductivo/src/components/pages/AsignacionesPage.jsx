import React, { useContext, useEffect, useState } from 'react'
import AsignacionModal from '../templates/AsignacionTemplete.jsx';
import AccionesModal from '../molecules/Modal.jsx'
import Swal from 'sweetalert2';
import axiosClient from '../../configs/axiosClient.jsx';
import AsignacionContext from '../../context/AsignacionContext.jsx';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    Pagination,
} from "@nextui-org/react";
import { PlusIcon } from "../NextIU/PlusIcon.jsx";
import { SearchIcon } from "../NextIU/SearchIcon.jsx";
import { ChevronDownIcon } from "../NextIU/ChevronDownIcon.jsx";
import ButtonDesactivar from "../atoms/ButtonDesactivar.jsx";
import ButtonActualizar from "../atoms/ButtonActualizar.jsx";

export default function AsignacionPage() {
    const statusColorMap = {
        activo: "success",
        inactivo: "danger",
    };
    function Ejemplo({ asignaciones }) {
        const [filterValue, setFilterValue] = useState("");
        const [statusFilter, setStatusFilter] = useState("todos");
        const [rowsPerPage, setRowsPerPage] = useState(5);
        const [sortDescriptor, setSortDescriptor] = useState({
            column: "fecha",
            direction: "ascending",
        });
        const [page, setPage] = useState(1);

        const statusOptions = [
            { name: "Todos", uid: "todos" },
            { name: "Activo", uid: "activo" },
            { name: "Inactivo", uid: "inactivo" }
        ];

        const hasSearchFilter = Boolean(filterValue);

        const filteredItems = React.useMemo(() => {
            let filteredAsignaciones = asignaciones;

            if (hasSearchFilter) {
                filteredAsignaciones = filteredAsignaciones.filter(
                    (asignacion) =>
                        String(asignacion.id_asignacion)
                            .toLowerCase()
                            .includes(filterValue.toLowerCase()) ||
                        asignacion.toLowerCase().includes(filterValue.toLowerCase())
                );
            }

            if (statusFilter !== "todos") {
                filteredAsignaciones = filteredAsignaciones.filter(
                    (asignacion) => asignacion.estado === statusFilter
                );
            }

            return filteredAsignaciones;
        }, [asignaciones, filterValue, statusFilter]);

        const pages = Math.ceil(filteredItems.length / rowsPerPage);

        const items = React.useMemo(() => {
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;

            return filteredItems.slice(start, end);
        }, [page, filteredItems, rowsPerPage]);

        const sortedItems = React.useMemo(() => {
            return [...items].sort((a, b) => {
                const first = a[sortDescriptor.column];
                const second = b[sortDescriptor.column];
                const cmp = first < second ? -1 : first > second ? 1 : 0;

                return sortDescriptor.direction === "descending" ? -cmp : cmp;
            });
        }, [sortDescriptor, items]);

        const renderCell = React.useCallback((asignacion, columnKey) => {
            const cellValue = asignacion[columnKey];

            switch (columnKey) {
                case "estado":
                    return (
                        <Chip
                            className="capitalize"
                            color={statusColorMap[asignacion.estado]}
                            size="sm"
                            variant="flat"
                        >
                            {cellValue}
                        </Chip>
                    );
                case "actions":
                    if (asignacion.nombre !== "terminado" && asignacion.estado !== "terminado") {
                        return (
                            <div className="relative flex justify-end items-center gap-2">
                                <Dropdown>
                                    <div className="flex items-center gap-2">
                                        <ButtonActualizar
                                            onClick={() => handleToggle('update', setAsignacionId(asignacion))} />
                                        <ButtonDesactivar
                                            onClick={() => peticionDesactivar(asignacion.id_asignacion)}
                                            estado={asignacion.estado}
                                        />
                                    </div>
                                </Dropdown>
                            </div>
                        );
                    } else {
                        return null;
                    }
                default:
                    return cellValue;
            }
        }, []);

        const onNextPage = React.useCallback(() => {
            if (page < pages) {
                setPage(page + 1);
            }
        }, [page, pages]);

        const onPreviousPage = React.useCallback(() => {
            if (page > 1) {
                setPage(page - 1);
            }
        }, [page]);

        const onRowsPerPageChange = React.useCallback((e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
        }, []);

        const onSearchChange = React.useCallback((value) => {
            if (value) {
                setFilterValue(value);
                setPage(1);
            } else {
                setFilterValue("");
            }
        }, []);

        const onStatusFilter = React.useCallback((key) => {
            const selectedStatus = Array.from(key).pop();
            setStatusFilter(selectedStatus);
        }, []);

        const onClear = React.useCallback(() => {
            setFilterValue("");
            setPage(1);
        }, []);

        const topContent = React.useMemo(() => {
            return (
                <>
                    <div className="flex flex-col mt-3">
                        <div className="flex justify-between gap-3 items-end">
                            <Input
                                isClearable
                                className="w-full sm:max-w-[44%] bg-[#f4f4f5] rounded"
                                placeholder="Buscar..."
                                startContent={<SearchIcon />}
                                value={filterValue}
                                onClear={() => onClear()}
                                onValueChange={onSearchChange}
                            />
                            <div className="flex gap-3">
                                <Dropdown>
                                    <DropdownTrigger className="hidden sm:flex mr-2 text-black bg-[#f4f4f5]">
                                        <Button endContent={<ChevronDownIcon className="text-small text-slate-700" />} variant="flat">
                                            Estado
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        disallowEmptySelection
                                        aria-label="Menu de acciones"
                                        aria-labelledby="Acciones"
                                        closeOnSelect={false}
                                        selectedKeys={statusFilter}
                                        selectionMode="multiple"
                                        onSelectionChange={onStatusFilter}
                                    >
                                        {statusOptions.map((status) => (
                                            <DropdownItem key={status.uid} className="capitalize w-55">
                                                {status.name}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                                <Button className="z-1 text-white bg-[#006000]" style={{ position: 'relative' }} endContent={<PlusIcon />} onClick={() => {
                                    setModalAccionesVisible(true); // Muestra el modal de acciones
                                }}>
                                    Registrar
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center z-10 mr-40 mt-2">
                            <span className="text-white text-small">Total {asignaciones.length} Resultados</span>
                            <label className="flex items-center text-white text-small">
                                Columnas por página:
                                <select
                                    className="bg-transparent outline-none text-white text-small"
                                    onChange={onRowsPerPageChange}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </>
            );
        }, [
            filterValue,
            onRowsPerPageChange,
            onSearchChange,
            onClear,
            hasSearchFilter,
        ]);

        const bottomContent = React.useMemo(() => {
            return (
                <div className="py-2 px-2 flex justify-between items-center m-3">
                    <Pagination
                        showControls
                        initialPage={1}
                        color="success"
                        page={page}
                        total={pages}
                        onChange={setPage}
                    />
                    <div className="hidden sm:flex w-[40%] justify-end gap-2">
                        <Button
                            isDisabled={pages === 1}
                            size="md"
                            variant="ghost"
                            className="text-slate-50"
                            onPress={onPreviousPage}
                        >
                            Anterior
                        </Button>
                        <Button
                            isDisabled={pages === 1}
                            size="md"
                            className="text-slate-50 mr-58"
                            variant="ghost"
                            onPress={onNextPage}
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            );
        }, [items.length, page, pages, hasSearchFilter]);

        return (
            <div className="m-12">
                <div className="mb-4">
                </div>
                <Table
                    aria-label="Tabla"
                    className="min-w-full border p-10 rounded-lg border-gray-300 shadow-md transition-shadow duration-300 hover:shadow-lg"
                    isHeaderSticky
                    bottomContent={bottomContent}
                    bottomContentPlacement="outside"
                    classNames={{
                        wrapper: "max-h-[100%] max-w-[100%]",
                    }}
                    sortDescriptor={sortDescriptor}
                    topContent={topContent}
                    topContentPlacement="outside"
                >
                    <TableHeader columns={data}>
                        {(column) => (
                            <TableColumn
                                key={column.uid}
                                align={column.uid === "actions" ? "center" : "start"}
                                allowsSorting={column.sortable}
                            >
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody emptyContent={"No hay asignaciones registradas"} items={sortedItems}>
                        {(item) => (
                            <TableRow key={item.id_asignacion}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        );
    }
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAcciones, setModalAcciones] = useState(false);
    const [mode, setMode] = useState('create');
    const [initialData, setInitialData] = useState(null);
    const [mensaje, setMensaje] = useState('')
    const [asignaciones, setAsignaciones] = useState([]);
    const { idAsignacion, setAsignacionId } = useContext(AsignacionContext)

    const [sidebarAbierto, setSidebarAbierto] = useState(false);

    const toggleSidebar = () => {
        setSidebarAbierto(!sidebarAbierto);
    };

    useEffect(() => {
        peticionGet()
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '';
        }
        return date.toISOString().split('T')[0];
    };

    const peticionGet = async () => {
        try {
            const response = await axiosClient.get('/asignacion/listar');
            const formattedData = response.data.map((item) => ({
                ...item,
                fecha_inicio: formatDate(item.fecha_inicio),
                fecha_fin: formatDate(item.fecha_fin),
            }));
            setAsignaciones(formattedData);
        } catch (error) {
            alert('Error en el servidor')
        }
    };

    useEffect(() => {
        peticionGet();
    }, []);

    const data = [
        {
            uid: 'id_asignacion',
            name: 'Id',
            sortable: true,
        },
        {
            uid: 'fecha_inicio',
            name: 'Fecha Inicio',
            sortable: true,
            render: (row) => row.fecha_inicio,
        },
        {
            uid: 'fecha_fin',
            name: 'Fecha Fin',
            sortable: true,
            render: (row) => row.fecha_fin,
        },
        {
            uid: 'instructor',
            name: 'Instructor',
            sortable: true
        },
        {
            uid: 'id_productiva',
            name: 'Productiva',
            sortable: true
        },
        {
            uid: 'estado',
            name: 'Estado',
            sortable: true
        },
        {
            uid: 'actions',
            name: "Acciones",
            sortable: true
        }
    ];


    const peticionDesactivar = async (id_asignacion) => {
        try {
            const response = await axiosClient.put(`/estadoProgramacion/${id_asignacion}`, null);
            if (response.status === 200) {
                const nuevoEstado = response.data.message;

                Swal.fire({
                    title: "¿Estás seguro?",
                    text: "¡Esto podrá afectar a tus Asignaciones!",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#006000",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Sí, estoy seguro!"
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: "¡Actualizado!",
                            text: `${nuevoEstado}`,
                            icon: "success"
                        });
                        peticionGet();
                    } else {
                        Swal.fire({
                            title: "Cancelado",
                            text: "La operación ha sido cancelada",
                            icon: "info"
                        });
                    }
                });
            } else {
                throw new Error('Error, el mensaje recibido no tiene el formato esperado');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                if (errorMessage === "No se puede cambiar el estado de la programación porque el lote asociado está inactivo") {
                    mostrarAlertaError(errorMessage);
                } else if (errorMessage === "No se puede cambiar el estado de la programación porque la actividad asociada está inactiva") {
                    mostrarAlertaError(errorMessage);
                } else if (errorMessage === "No se puede cambiar el estado de la programación porque el usuario asociado está inactivo") {
                    mostrarAlertaError(errorMessage);
                } else {
                    mostrarAlertaError("Error al cambiar el estado de la programación");
                }
            } else {
                mostrarAlertaError("Error del servidor. Por favor, inténtelo de nuevo más tarde.");
            }
        }
    };

    const mostrarAlertaError = (mensaje) => {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Error",
            text: mensaje,
            showConfirmButton: false,
            timer: 2000
        });
    };

    const handleSubmit = async (formData, e) => {
        e.preventDefault()
        try {
            if (mode === 'create') {
                await axiosClient.post('/asignacion/registrar', formData).then((response) => {
                    if (response.status === 200) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Asignacion registrada con éxito",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        peticionGet()
                    }
                })
            } else if (mode === 'update') {
                await axiosClient.put(`/asignacion/actualizar/${idAsignacion.id_asignacion}`, formData).then((response) => {
                    if (response.status === 200) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Se actualizó la asignación con éxito",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        peticionGet();
                    } else {
                        throw new Error('Error al actualizar')
                    }
                })
            }
            setModalOpen(false);
        } catch (error) {
            console.log('Error en la solicitud: ', error.message);
            alert('Se produjo un error: ' + error.message);
        }
    }

    const handleToggle = (mode, initialData) => {
        setInitialData(initialData)
        setModalOpen(true)
        setMode(mode)
    }
    const [modalAccionesVisible, setModalAccionesVisible] = useState(false);

    return (

        <>

            <div>
                <div className='w-full max-w-[90%] ml-28 items-center p-10'>
                    <AccionesModal
                        isOpen={modalAccionesVisible}
                        onClose={() => setModalAccionesVisible(false)}
                        label={mensaje}
                    />
                    <AsignacionModal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        title={mode === 'create' ? 'Registrar Asignaciones' : 'Actualizar Asignaciones'}
                        actionLabel={mode === 'create' ? 'Registrar' : 'Actualizar'}
                        initialData={initialData}
                        handleSubmit={handleSubmit}
                        mode={mode}
                    />
                    <Ejemplo
                        data={data}
                        asignaciones={asignaciones}
                    />
                </div>
            </div>
        </>
    )
}
