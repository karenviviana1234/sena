import React, { useEffect, useState, useMemo, useCallback } from 'react';
import ModalAcciones from './ModalAcciones.jsx';
import Swal from 'sweetalert2';
import axiosClient from '../../configs/axiosClient.jsx';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Pagination
} from "@nextui-org/react";
import { SearchIcon } from "../NextIU/atoms/searchicons.jsx";
import ButtonActualizar from "../atoms/ButtonActualizar.jsx";
import FormMatriculas from './FormMatriculas.jsx';
import FormAprendices from './FormAprendices.jsx';

function TableMatriculas() {
    const [selectedFicha, setSelectedFicha] = useState('');
    const [filterValue, setFilterValue] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "identificacion",
        direction: "ascending",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bodyContent, setBodyContent] = useState(null);
    const [page, setPage] = useState(1);
    const [fichas, setFichas] = useState([]);
    const [matriculas, setMatriculas] = useState([]);

    // Fetch para obtener las fichas
    useEffect(() => {
        const fetchFichas = async () => {
            try {
                const response = await axiosClient.get('/fichas/listarC');
                if (response.data.length > 0) {
                    setFichas(response.data);
                } else {
                    Swal.fire({
                        title: 'Sin Fichas',
                        text: 'No hay fichas registradas.',
                        icon: 'info',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                console.error('Error fetching fichas:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al obtener las fichas.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchFichas();
    }, []);

    // Fetch para obtener las matriculas de la ficha seleccionada
    const fetchMatriculas = useCallback(async () => {
        if (selectedFicha) {
            try {
                const response = await axiosClient.get(`/matriculas/listar/${selectedFicha}`);
                if (response.data.length > 0) {
                    setMatriculas(response.data);
                } else {
                    setMatriculas([]);
                    Swal.fire({
                        title: 'Sin Matrículas',
                        text: 'No hay matrículas registradas para la ficha seleccionada.',
                        icon: 'info',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                console.error('Error fetching matriculas:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al obtener las matrículas.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    }, [selectedFicha]);

    useEffect(() => {
        fetchMatriculas();
    }, [selectedFicha, page, rowsPerPage, fetchMatriculas]);

    // Abre el modal con el formulario para registrar matrícula
    const handleOpenModal = (formType, data = null) => {
        if (formType === 'formMatriculas') {
            setBodyContent(<FormMatriculas initialData={data} fichaSeleccionada={selectedFicha} onSuccess={handleUpdateData}/>);
        } else if (formType === 'formAprendices') {
            setBodyContent(<FormAprendices />);
        }
        setIsModalOpen(true);
    };

    const handleUpdateData = useCallback(() => {
        fetchMatriculas();
    }, [fetchMatriculas]);

    // Cierra el modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Filtrado de matriculas
    const filteredItems = useMemo(() => {
        if (!filterValue) return matriculas;
        return matriculas.filter(matricula =>
            matricula.nombre_aprendiz.toLowerCase().includes(filterValue.toLowerCase())
        );
    }, [matriculas, filterValue]);

    // Paginación
    const pages = useMemo(() => Math.ceil(filteredItems.length / rowsPerPage), [filteredItems.length, rowsPerPage]);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    // Ordenación
    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    // Renderizado de celda
    const renderCell = useCallback(
        (item, columnKey) => {
            switch (columnKey) {
                case "acciones":
                    return (
                        <div className="flex justify-around items-center">
                            <ButtonActualizar onClick={() => handleOpenModal("formMatriculas", item)}/>
                        </div>
                    );
                default:
                    return item[columnKey];
            }
        },
        [handleOpenModal]
    );

    // Contenido superior del componente
    const topContent = (
        <div className="flex flex-col mt-3">
            <div className="flex justify-between gap-3 items-end">
                <Input
                    isClearable
                    className="w-full sm:max-w-[44%] bg-[#f4f4f5] rounded"
                    placeholder="Buscar..."
                    startContent={<SearchIcon />}
                    value={filterValue}
                    onClear={() => setFilterValue('')}
                    onValueChange={setFilterValue}
                />
                <div className="flex items-center gap-3">
                    <select
                        id="Ficha"
                        name="Ficha"
                        value={selectedFicha}
                        onChange={(e) => setSelectedFicha(e.target.value)}
                        required
                        className="h-10 rounded-xl bg-[#f4f4f5] p-2"
                    >
                        <option value="">Seleccionar Ficha</option>
                        {fichas.length > 0 ? (
                            fichas.map((ficha) => (
                                <option key={ficha.codigo} value={ficha.codigo}>
                                    {ficha.codigo}
                                </option>
                            ))
                        ) : (
                            <option disabled>Cargando fichas...</option>
                        )}
                    </select>
                    <Button
                        onClick={() => handleOpenModal("formMatriculas")}
                        className="bg-[#90d12c] text-white"
                    >
                        Matricular
                    </Button>
                    <Button
                        onClick={() => handleOpenModal("formAprendices")}
                        className="bg-[#3f5819] text-white"
                    >
                        Registrar Aprendiz
                    </Button>
                </div>
            </div>
            <div className="flex items-center justify-between mt-2 mb-5">
                <span className="text-default-400 text-small mt-2">
                    Total {matriculas.length} matriculas
                </span>
                <label className="flex items-center text-default-400 text-small">
                    Rows per page:
                    <select
                        className="bg-transparent outline-none text-default-400 text-small"
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
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

    // Columnas de la tabla
    const columns = [
        { key: "ficha", label: "Ficha" },
        { key: "nombre_aprendiz", label: "Aprendiz" },
        { key: "estado", label: "Estado" },
        { key: "pendiente_tecnicos", label: "Pendientes Técnicos" },
        { key: "pendiente_transversales", label: "Pendientes Transversales" },
        { key: "pendiente_ingles", label: "Pendientes Inglés" },
        { key: "acciones", label: "Acciones" },
    ];

    return (
        <>
            <div>
                {topContent}
                {selectedFicha ? (
                    matriculas.length > 0 ? (
                        <Table
                            aria-label="Matriculas Table"
                            css={{ minWidth: "100%", height: "auto" }}
                            className="p-4"
                        >
                            <TableHeader>
                                {columns.map((column) => (
                                    <TableColumn key={column.key}>{column.label}</TableColumn>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {sortedItems.map((matricula) => (
                                    <TableRow key={matricula.id_matricula}>
                                        {columns.map((column) => (
                                            <TableCell key={column.key}>
                                                {renderCell(matricula, column.key)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center mt-6">
                            <p>No hay matrículas disponibles.</p>
                        </div>
                    )
                ) : (
                    <div className="text-center mt-6">
                        <p>Seleccione una ficha para ver las matriculas.</p>
                    </div>
                )}
                {pages > 1 && (
                    <Pagination
                        total={pages}
                        initialPage={page}
                        onPageChange={(page) => setPage(page)}
                        className="mt-4"
                    />
                )}
            </div>
            <ModalAcciones
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                bodyContent={bodyContent}
            />
        </>
    );
}

export default TableMatriculas;
