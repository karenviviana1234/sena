import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import axiosClient from '../../configs/axiosClient.jsx';
import PersonasContext from '../../context/PersonasContext.jsx';
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
import { PlusIcon } from "../NextIU/atoms/PlusIcons.jsx";
import { SearchIcon } from "../NextIU/atoms/SearchIcons.jsx";
import { ChevronDownIcon } from "../NextIU/atoms/CheveronIcons.jsx";
import ButtonDesactivar from "../atoms/ButtonDesactivar.jsx";
import ButtonActualizar from "../atoms/ButtonActualizar.jsx";

function PersonasPage() {
    const { personas, getPersonas } = useContext(PersonasContext);

    const statusColorMap = {
        activo: "success",
        inactivo: "danger",
        todos: "primary",
    };

    const [filterValue, setFilterValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("todos");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "identificacion",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);

    useEffect(() => {
        getPersonas(); 
    }, [getPersonas]);

    const statusOptions = [
        { name: "Todos", uid: "todos" },
        { name: "Activo", uid: "activo" },
        { name: "Inactivo", uid: "inactivo" },
    ];

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = useMemo(() => {
        let filteredPersonas = personas;

        if (hasSearchFilter) {
            filteredPersonas = filteredPersonas.filter(persona =>
                persona.nombres.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        if (statusFilter !== "todos") {
            filteredPersonas = filteredPersonas.filter(persona =>
                persona.estado === statusFilter
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

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case "estado":
                return (
                    <Chip className="capitalize" color={statusColorMap[item.estado]} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <ButtonActualizar onClick={() => handleToggle('update', item)} />
                        <ButtonDesactivar
                            onClick={() => peticionDesactivar(item.id)}
                            estado={item.estado}
                        />
                    </div>
                );
            case "nombres":
                return (
                    <User
                        name={cellValue}
                        description={item.correo}
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
    }, [statusColorMap]);

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
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex mr-2 text-black bg-[#f4f4f5]">
                                <Button endContent={<ChevronDownIcon className="cursor-pointer text-small text-slate-700" />} variant="flat">
                                    Estado
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Menu de acciones"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="single"
                                onSelectionChange={onStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize w-55">
                                        {status.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button className="z-1 mr-30 text-white bg-[#90d12c] cursor-pointer" style={{ position: 'relative' }} endContent={<PlusIcon />} onClick={() => handleToggle('create')}>
                            Registrar
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
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [filterValue, statusFilter, personas.length, onRowsPerPageChange, onClear, onSearchChange, onStatusFilter]);

    const peticionDesactivar = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esta acción no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, desactivar'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClient.patch(`/personas/${id}`, { estado: 'inactivo' })
                    .then(response => {
                        Swal.fire(
                            'Desactivado!',
                            'La persona ha sido desactivada.',
                            'success'
                        );
                        getPersonas(); // Actualiza la lista de personas
                    })
                    .catch(error => {
                        Swal.fire(
                            'Error!',
                            'Hubo un problema al desactivar la persona.',
                            'error'
                        );
                    });
            }
        });
    };

    return (
        <div className="overflow-hidden flex-1 min-h-screen bg-dark p-2 m-20">
            <div className="flex flex-col">
                {topContent}
                <Table aria-label="Tabla de Personas" css={{ height: "auto", minWidth: "100%" }}>
                    <TableHeader>
                        <TableColumn>Identificación</TableColumn>
                        <TableColumn>Nombres</TableColumn>
                        <TableColumn>Estado</TableColumn>
                        <TableColumn>Acciones</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {sortedItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.identificacion}</TableCell>
                                <TableCell>{renderCell(item, "nombres")}</TableCell>
                                <TableCell>{renderCell(item, "estado")}</TableCell>
                                <TableCell>{renderCell(item, "actions")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex justify-between mt-4">
                    <Pagination
                        total={pages}
                        page={page}
                        initialPage={1}
                        onChange={(newPage) => setPage(newPage)}
                    />
                </div>
            </div>
        </div>
    );
}

export default PersonasPage;
