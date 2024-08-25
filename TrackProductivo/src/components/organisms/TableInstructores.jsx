import React, { useEffect, useState, useMemo, useCallback } from 'react';
import FormUsuarios from './FormUsuarios.jsx';
import ModalAcciones from './ModalAcciones.jsx';
import Swal from 'sweetalert2';
import axiosClient from '../../configs/axiosClient.jsx';
import FormVinculaciones from './FormVinculaciones.jsx';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    User,
    Pagination
} from "@nextui-org/react";
import { SearchIcon } from "../NextIU/atoms/searchicons.jsx";
import ButtonActualizar from "../atoms/ButtonActualizar.jsx";

function TableInstructores() {
    const [personas, setPersonas] = useState([]);
    const [filterValue, setFilterValue] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "identificacion",
        direction: "ascending",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bodyContent, setBodyContent] = useState(null);
    const [page, setPage] = useState(1);

    const handleOpenModal = (formType, data = null) => {
        if (formType === 'formUsuarios') {
            setBodyContent(<FormUsuarios initialData={data} />);
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
                const response = await axiosClient.get('/personas/listarI');
                console.log('Datos recibidos:', response.data);
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
    }, [personas, filterValue]);

    const pages = useMemo(() => Math.ceil(filteredItems.length / rowsPerPage), [filteredItems.length, rowsPerPage]);

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

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "acciones":
                return (
                    <div className="flex justify-around items-center">
                        <ButtonActualizar onClick={() => handleOpenModal('formUsuarios', item)} />
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
    }, []);

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
                                onClick={() => handleOpenModal("formUsuarios")}
                                className="bg-[#90d12c] text-white mr-10"
                            >
                                Registrar
                            </Button>
                            <Button
                                onClick={() => handleOpenModal("formVinculaciones")}
                                className="bg-[#5a851b] text-white"
                            >
                                Vincular
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-2 mb-5">
                    <span className="text-default-400 text-small mt-2">
                        Total {personas.length} usuarios
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
    }, [filterValue, personas.length, onRowsPerPageChange, onClear, onSearchChange]);

    const columns = [
        { key: "id_persona", label: "ID" },
        { key: "identificacion", label: "Identificación" },
        { key: "nombres", label: "Nombres" },
        { key: "correo", label: "Correo" },
        { key: "telefono", label: "Teléfono" },
        { key: "rol", label: "Rol" },
        { key: "acciones", label: "Acciones" },
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
                            <TableRow key={item.id_persona}>
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
            <div>
                <ModalAcciones
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    bodyContent={bodyContent}
                />
            </div>
        </div>
    );
}

export default TableInstructores;
