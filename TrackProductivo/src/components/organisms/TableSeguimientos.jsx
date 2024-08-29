import React, { useEffect, useState, useMemo, useCallback } from 'react';
import ComponentSeguimiento from './ComponentSeguimiento.jsx';
import ModalAcciones from './ModalAcciones.jsx';
import axiosClient from '../../configs/axiosClient.jsx';
import FormNovedades from './FormNovedades.jsx';
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
import { SearchIcon } from "../NextIU/atoms/searchicons.jsx";
import ButtonActualizar from "../atoms/ButtonActualizar.jsx";

function TableSeguimientos() {
    const [seguimientos, setSeguimientos] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [selectedSeguimientoId, setSelectedSeguimientoId] = useState(null);
    const [bodyContent, setBodyContent] = useState(null);
    const [formType, setFormType] = useState("");  // Nuevo estado para determinar el tipo de formulario
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "identificacion",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to open the modal and set the selected ID
    const handleOpenModal = (id_seguimiento, type) => {
        setFormType(type);
        if (type === 'formNovedades') {
            setBodyContent(<FormNovedades />);
        } else if (type === 'componentSeguimiento') {
            setBodyContent(<ComponentSeguimiento idSeguimiento={id_seguimiento} />);
        }
        console.log("datos enviados", id_seguimiento )
        setSelectedSeguimientoId(id_seguimiento);
        setIsModalOpen(true);
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Fetch seguimientos from API
    const getSeguimientos = useCallback(async () => {
        try {
            const response = await axiosClient.get('/seguimientos/listarA');
            setSeguimientos(response.data);
        } catch (error) {
            console.error('Error al obtener los seguimientos:', error);
        }
    }, []);

    useEffect(() => {
        getSeguimientos();
    }, [getSeguimientos]);

    // Filter items based on the search input
    const filteredItems = useMemo(() => {
        let filteredSeguimientos = seguimientos;

        if (filterValue) {
            filteredSeguimientos = filteredSeguimientos.filter(seg =>
                seg.nombres.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredSeguimientos;
    }, [seguimientos, filterValue]);

    // Calculate pagination
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

    // Render cell based on column key
    const renderCell = useCallback((item, columnKey) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "seguimiento1":
            case "seguimiento2":
            case "seguimiento3":
                const formattedDate = format(new Date(cellValue), 'dd-MM-yyyy');
                const seguimientoIdKey = `id_${columnKey}`; // Determina el ID de seguimiento basado en la clave de la columna
                return (
                    <Button
                        className="bg-[#ffa808] text-white h-8 w-10 text-xs"
                        onClick={() => handleOpenModal(item[seguimientoIdKey], 'componentSeguimiento')} // Usa el ID de seguimiento correcto
                    >
                        {formattedDate}
                    </Button>
                );
            case "codigo":
                return (
                    <Chip
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
                                <ButtonActualizar onClick={() => console.log('Actualizar', item)} />
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem onClick={() => console.log('View', item)}>View</DropdownItem>
                                <DropdownItem onClick={() => console.log('Edit', item)}>Edit</DropdownItem>
                                <DropdownItem onClick={() => console.log('Delete', item)}>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            case "nombres":
                return (
                    <User
                        name={cellValue}
                        description={item.correo || "Sin correo"}
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
    }, [handleOpenModal]);

    // Pagination handlers
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

    // Top content (search and pagination controls)
    const topContent = useMemo(() => (
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
                <Button
                    onClick={() => handleOpenModal(null, 'formNovedades')}
                    className="bg-[#90d12c] text-white mr-10 "
                >
                    Registrar Novedades
                </Button>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-default-400 text-small my-5">
                    Total {seguimientos.length} seguimientos
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
    ), [filterValue, seguimientos.length, onRowsPerPageChange, onClear, onSearchChange]);

    // Columns definition
    const columns = [
        { key: "identificacion", label: "Identificación" },
        { key: "nombres", label: "Nombres" },
        { key: "codigo", label: "Ficha" },
        { key: "razon_social", label: "Empresa" },
        { key: "seguimiento1", label: "Seguimiento 1" },
        { key: "seguimiento2", label: "Seguimiento 2" },
        { key: "seguimiento3", label: "Seguimiento 3" },
        { key: "porcentajes", label: "Porcentajes" },
    ];

    return (
        <div className="overflow-hidden flex-1 bg-dark p-2">
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
                            <TableRow key={item.identificacion}>
                                {columns.map((column) => (
                                    <TableCell key={column.key}>
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

            {/* Modal */}
            {isModalOpen && (
                <ModalAcciones
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    bodyContent={bodyContent}
                />
            )}
        </div>
    );
}

export default TableSeguimientos;
