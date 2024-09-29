import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
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
<<<<<<< HEAD
    Pagination,
    Chip
=======
    Pagination
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
} from "@nextui-org/react";
import { SearchIcon } from "../NextIU/atoms/searchicons.jsx";
import ButtonActualizar from "../atoms/ButtonActualizar.jsx";
import FormMatriculas from './FormMatriculas.jsx';
import FormAprendices from './FormAprendices.jsx';
<<<<<<< HEAD
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import ButtonDesactivar from '../atoms/ButtonDesactivar.jsx';

=======
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

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
    const [file, setFile] = useState(null);
<<<<<<< HEAD
    const fileInputRef = useRef(null); 
=======
    const fileInputRef = useRef(null); // Use ref for file input
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

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
<<<<<<< HEAD
        // Restablecer el estado de matrículas antes de la nueva carga
        setMatriculas([]);
        
=======
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
        if (selectedFicha) {
            try {
                const response = await axiosClient.get(`/matriculas/listar/${selectedFicha}`);
                if (response.data.length > 0) {
                    setMatriculas(response.data);
                } else {
<<<<<<< HEAD
=======
                    setMatriculas([]);
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
                    Swal.fire({
                        title: 'Sin Matrículas',
                        text: 'No hay matrículas registradas para la ficha seleccionada.',
                        icon: 'info',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                console.error('Error fetching matriculas:', error);
<<<<<<< HEAD
            }
        }
    }, [selectedFicha]);
    
=======
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al obtener las matrículas.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    }, [selectedFicha]);

>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
    useEffect(() => {
        fetchMatriculas();
    }, [selectedFicha, page, rowsPerPage, fetchMatriculas]);

<<<<<<< HEAD
    const handleDesactivar = async (id_matricula) => {
        // Mostrar una alerta de confirmación
        const result = await Swal.fire({
          title: "¿Estás seguro?",
          text: "¿Quieres eliminar esta matrícula? Si lo haces, se borrarán todos los registros asociados, incluida la etapa productiva y los seguimientos si existen.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, Eliminar",
          cancelButtonText: "No, cancelar",
          reverseButtons: true,
          customClass: {
            confirmButton: "bg-[#90d12c] text-white hover:bg-green-600 border-green-500",
            cancelButton: "bg-[#f31260] text-white hover:bg-red-600 border-red-500",
          },
        });
      
        // Si el usuario confirma, proceder con la desactivación
        if (result.isConfirmed) {
          try {
            const response = await axiosClient.delete(`/matriculas/cancelada/${id_matricula}`);
            Swal.fire("Eliminada", response.data.message, "success");
      
            // Actualizar el estado para eliminar el instructor desactivado
            setMatriculas((prevMatriculas) =>
              prevMatriculas.filter((matricula) => matricula.id_matricula !== id_matricula)
            );
          } catch (error) {
            console.error("Error Eliminando la Matricula:", error);
            Swal.fire("Error", "No se pudo Eliminar la matricula", "error");
          }
        }
      };
      
    

    const fetchFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);  // Asegúrate de que 'file' es el nombre esperado en el backend.

=======
    const fetchFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);  // Asegúrate de que 'file' es el nombre esperado en el backend.
    
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
        try {
            const response = await axiosClient.post('/excel/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setFile(response.data);

            Swal.fire({
                title: 'Importación exitosa',
                text: 'Los datos se han importado correctamente.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

        } catch (error) {
            console.error("Error al cargar archivo:", error);
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar el archivo. Intenta de nuevo más tarde.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };
<<<<<<< HEAD

=======
    
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            fetchFile(selectedFile);  // Llama a la función fetchFile pasando el archivo seleccionado
        }
    };
<<<<<<< HEAD


=======
    
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

    const handleClickImportarExcel = () => {
        fileInputRef.current.click(); // Triggers file input click
    };


    const handleOpenModal = (formType, data = null) => {
        if (formType === 'formMatriculas') {
            setBodyContent(<FormMatriculas initialData={data} fichaSeleccionada={selectedFicha} onSuccess={handleUpdateData} />);
        } else if (formType === 'formAprendices') {
            setBodyContent(<FormAprendices />);
        }
        setIsModalOpen(true);
    };

    const handleUpdateData = useCallback(() => {
        fetchMatriculas();
    }, [fetchMatriculas]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

<<<<<<< HEAD
    const handleTabChange = (key) => {
        setSelectedFicha(key);
    };

=======
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
    const filteredItems = useMemo(() => {
        if (!filterValue) return matriculas;
        return matriculas.filter(matricula =>
            matricula.nombre_aprendiz.toLowerCase().includes(filterValue.toLowerCase())
        );
    }, [matriculas, filterValue]);

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

    const renderCell = useCallback(
        (item, columnKey) => {
<<<<<<< HEAD
            const cellValue = item[columnKey];
=======
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
            switch (columnKey) {
                case "acciones":
                    return (
                        <div className="flex justify-around items-center">
                            <ButtonActualizar onClick={() => handleOpenModal("formMatriculas", item)} />
<<<<<<< HEAD
                            <ButtonDesactivar onClick={() => handleDesactivar(item.id_matricula)}/>
                        </div>
                    );
                    case "estado":
                        return (
                            <Chip
                                className="text-[#3c3c3c]"
                                variant="flat"
                                style={{ backgroundColor: getColorForFicha(cellValue) || "rgba(240, 240, 240, 0.8)" }} // Color claro por defecto
                            >
                                {cellValue}
                            </Chip>
                        );
=======
                        </div>
                    );
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
                default:
                    return item[columnKey];
            }
        },
        [handleOpenModal]
    );

<<<<<<< HEAD
    const hashCode = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    const intToColor = (int) => {
        const r = (int >> 16) & 0xFF;
        const g = (int >> 8) & 0xFF;
        const b = int & 0xFF;

        // Convertir a un color claro
        const lightR = Math.min(255, r + 100); // Aumenta el rojo
        const lightG = Math.min(255, g + 100); // Aumenta el verde
        const lightB = Math.min(255, b + 100); // Aumenta el azul

        return `rgba(${lightR}, ${lightG}, ${lightB}, 0.5)`; // Opacidad del 50%
    };
    
    const getColorForFicha = (fichaNumber) => {
        const hash = hashCode(fichaNumber.toString());
        return intToColor(hash);
    };

=======
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
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
<<<<<<< HEAD
=======
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
                    <div>
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
                        <Button className="bg-[#92d22e] text-white" onClick={handleClickImportarExcel}>
                            Importar Excel
                        </Button>
                        <Input
                            ref={fileInputRef}
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="hidden"
                            id="fileInput"
                            type="file"
                        />
<<<<<<< HEAD
=======
                    </div>
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

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
<<<<<<< HEAD
            <Tabs
                        selectedKey={selectedFicha} // Establece la ficha seleccionada
                        onSelectionChange={handleTabChange} // Maneja el cambio de tab
                        className='ml-3'
                    >
                        {fichas.map((ficha) => (
                            <Tab key={ficha.codigo} value={ficha.codigo}>
                                {ficha.codigo}
                            </Tab>
                        ))}
                    </Tabs>
=======
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
        </div>
    );

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
<<<<<<< HEAD
                            <p>No hay matrículas registradas en esta ficha.</p>
=======
                            <p>No hay matrículas disponibles.</p>
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
                        </div>
                    )
                ) : (
                    <div className="text-center mt-6">
                        <p>Seleccione una ficha para ver las matrículas.</p>
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
<<<<<<< HEAD
    );    
=======
    );
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
}

export default TableMatriculas;
