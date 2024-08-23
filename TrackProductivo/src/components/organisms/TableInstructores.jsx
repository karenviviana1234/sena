import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import FormUsuarios from './FormUsuarios.jsx';
import ModalAcciones from './ModalAcciones.jsx';
import Swal from 'sweetalert2';
import axiosClient from '../../configs/axiosClient.jsx';
import FormVinculaciones from './FormVinculaciones.jsx';
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
    Link,
} from "@nextui-org/react";
import { PlusIcon } from "../NextIU/atoms/plusicons.jsx";
import { SearchIcon } from "../NextIU/atoms/searchicons.jsx";
import { ChevronDownIcon } from "../NextIU/atoms/CheveronIcons.jsx";
import ButtonDesactivar from "../atoms/ButtonDesactivar.jsx";
import ButtonActualizar from "../atoms/ButtonActualizar.jsx";

function TableInstructores() {
    const [personas, setPersonas] = useState([]);

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
    /* Se define una constante para manejar el contenido dinamico */
    const [bodyContent, setBodyContent] = useState(null);

    /* Se llaman las vistas que se quieren mostrar al dar clic dentro del modal */
    const handleOpenModal = (formType) => {
        if (formType === 'formUsuarios') {
            setBodyContent(<FormUsuarios />);
        } else if (formType === 'formVinculaciones') {
            setBodyContent(<FormVinculaciones />);
        }
        setIsModalOpen(true);
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get('/personas/listarI'); // Ajusta la ruta del endpoint
                setPersonas(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = useMemo(() => {
        let filteredPersonas = personas;

        if (hasSearchFilter) {
            filteredPersonas = filteredPersonas.filter(seg =>
                seg.nombres.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredPersonas;
    }, [personas, filterValue, statusFilter]);

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
            /* case "seguimiento1":
            case "seguimiento2":
            case "seguimiento3":
                const formattedDate = format(new Date(cellValue), 'dd-MM-yyyy');
                return (
                    <Button
                        size="sm"
                        className="bg-[#90d12c] text-white"
                        onClick={() => handleOpenModal(formattedDate)}
                    >
                        {formattedDate}
                    </Button>
                ); */
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
                    <div>
                    <Button onClick={() => handleOpenModal('formUsuarios')} className='bg-[#90d12c] text-white mr-10'>
                        Registrar 
                    </Button>
                    <Button onClick={() => handleOpenModal('formVinculaciones')} className='bg-[#5a851b] text-white'>
                        Vincular 
                    </Button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-white text-small">Total {personas.length} Resultados</span>
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
    }, [filterValue, statusFilter, personas.length, onRowsPerPageChange, onClear, onSearchChange, onStatusFilter, page, pages]);

    const columns = [
        { key: "id_persona", label: "ID" },
        { key: "identificacion", label: "Identificacion" },
        { key: "nombres", label: "Nombres" },
        { key: "correo", label: "Correo" },
        { key: "telefono", label: "Telefono" },
    ];




    return (
        <div className="overflow-hidden flex-1  bg-dark p-2">
            <div className="flex flex-col">
                {topContent}
                <Table aria-label="Tabla de Personas" css={{ height: "auto", minWidth: "100%" }}>
                    <TableHeader>
                        {columns.map((column) => (
                            <TableColumn key={column.key}>{column.label}</TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {sortedItems.map((item) => (
                            <TableRow key={item.id}>
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
                    title="Registro de Instructores"
                    bodyContent={bodyContent}
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

export default TableInstructores;
