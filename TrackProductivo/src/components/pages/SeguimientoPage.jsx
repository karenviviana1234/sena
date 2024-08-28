import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import ComponentSeguimiento from '../organisms/ComponentSeguimiento.jsx';
import ModalAcciones from '../organisms/ModalAcciones.jsx';
import Swal from 'sweetalert2';
import axiosClient from '../../configs/axiosClient.jsx';
import SeguimientosContext from '../../context/SeguimientosContext.jsx';
import { format } from 'date-fns';
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
    User,
} from "@nextui-org/react";
import { PlusIcon } from "../NextIU/atoms/plusicons.jsx"
import { SearchIcon } from "../NextIU/atoms/searchicons.jsx";
import { ChevronDownIcon } from "../NextIU/atoms/CheveronIcons.jsx";
import ButtonDesactivar from "../atoms/ButtonDesactivar.jsx";
import ButtonActualizar from "../atoms/ButtonActualizar.jsx";


function SeguimientoPage() {
    const { seguimientos, getSeguimientos } = useContext(SeguimientosContext);

    const statusColorMap = {
        activo: "success",
        inactivo: "danger",
        todos: "primary",
    };

    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [statusFilter, setStatusFilter] = useState("todos");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "identificacion",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAcciones, setModalAcciones] = useState(false);
    const [mode, setMode] = useState('create');
    const [initialData, setInitialData] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    useEffect(() => {
        getSeguimientos();
    }, [getSeguimientos]);


    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = useMemo(() => {
        let filteredSeguimientos = seguimientos;

        if (hasSearchFilter) {
            filteredSeguimientos = filteredSeguimientos.filter(seg =>
                seg.nombres.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredSeguimientos;
    }, [seguimientos, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const [programColorMap, setProgramColorMap] = useState({});

    const generateRandomColor = useCallback(() => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const a = 0.3; // Ajusta el nivel de transparencia
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }, []);

    const getProgramColor = useCallback((sigla) => {
        if (!programColorMap[sigla]) {
            setProgramColorMap(prevMap => ({
                ...prevMap,
                [sigla]: generateRandomColor(),
            }));
        }
        return programColorMap[sigla];
    }, [programColorMap, generateRandomColor]);

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "seguimiento1":
            case "seguimiento2":
            case "seguimiento3":
                const formattedDate = format(new Date(cellValue), 'dd-MM-yyyy');
                return (
                    <Button
                        size="sm"
                        className="bg-[#ffa808] text-white"
                        onClick={() => handleOpenModal(formattedDate)}
                    >
                        {formattedDate}
                    </Button>
                );
            case "sigla":
                return (
                    <Chip
                        style={{ backgroundColor: getProgramColor(item.sigla) }}
                        className='text-[#3c3c3c]'
                        variant="flat"
                    >
                        {cellValue}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <ButtonActualizar onClick={() => handleToggle('update', item)} />
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem onClick={() => handleToggle('view', item)}>View</DropdownItem>
                                <DropdownItem onClick={() => handleToggle('edit', item)}>Edit</DropdownItem>
                                <DropdownItem onClick={() => peticionDesactivar(item.id)}>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );

            case "nombres":
                return (
                    <User
                        name={cellValue}
                        description="Aquí va el correo"
                        avatarSrc="https://via.placeholder.com/150"
                        bordered
                        as="button"
                        size="sm"
                        color="primary"
                    />
                );
            default:
                return cellValue;
        }
    }, [statusColorMap, getProgramColor]);

    const handleButtonClick = (date) => {
        console.log("Handling button click, setting date:", date);
        setSelectedDate(date);
        setModalAcciones(true); // Asegúrate de que esto está abriendo el modal correctamente
    };


    const handleToggle = (mode, data = null) => {
        console.log("Toggling modal, mode:", mode, "data:", data);
        setMode(mode);
        setInitialData(data);
        setModalOpen(prev => !prev);
    };


    const onNextPage = useCallback(() => {
        if (page < pages) {
            setPage(prevPage => prevPage + 1);
        }
    }, [page, pages]);

    const onPreviousPage = useCallback(() => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
        }
    }, [page]);

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

    const onStatusFilter = (selectedKeys) => {
        setStatusFilter(selectedKeys[0]);
    };

    const topContent = useMemo(() => {
        return (
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
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-white text-small">Total {seguimientos.length} Resultados</span>
                    <label className="flex items-center text-white mr-30 text-small">
                        Columnas por página:
                        <select
                            className="bg-transparent outline-none text-white text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [filterValue, statusFilter, seguimientos.length, onRowsPerPageChange, onClear, onSearchChange, onStatusFilter, page, pages]);

    const columns = [
        { key: "identificacion", label: "Identificacion" },
        { key: "nombres", label: "Nombres" },
        { key: "codigo", label: "Ficha" },
        { key: "sigla", label: "Programa" },
        { key: "razon_social", label: "Empresa" },
        { key: "seguimiento1", label: "Seguimiento 1" },
        { key: "seguimiento2", label: "Seguimiento 2" },
        { key: "seguimiento3", label: "Seguimiento 3" },
    ];

    return (
        <div className="overflow-hidden flex-1 min-h-screen bg-dark p-2 m-20">
            <div className="flex flex-col">
                {topContent}
                <Table aria-label="Tabla de Seguimientos" css={{ height: "auto", minWidth: "100%" }}>
                    <TableHeader>
                        {columns.map((column) => (
                            <TableColumn key={column.key}>{column.label}</TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {sortedItems.map((item, index) => (
                            <TableRow key={item.identificacion || index}>
                                {columns.map((column) => (
                                    <TableCell key={column.key}>
                                        {renderCell(item, column.key)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex justify-between mt-4">
                    <Button disabled={page === 1} onClick={onPreviousPage}>
                        Anterior
                    </Button>
                    <Button disabled={page === pages} onClick={onNextPage}>
                        Siguiente
                    </Button>
                </div>
            </div>
            <div>
                <ModalAcciones
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title="Seguimiento 1"
                    size="6xl"  // Aumenta el tamaño del modal
                    bodyContent={<ComponentSeguimiento />}
                    footerActions={[
                        {
                            label: "Cerrar",
                            color: "danger",
                            onPress: handleCloseModal,
                        },
                        {
                            label: "Acción",
                            color: "primary",
                            onPress: () => console.log("Acción realizada"),
                        },
                    ]}
                />
            </div>
        </div>
    );
}

export default SeguimientoPage;
