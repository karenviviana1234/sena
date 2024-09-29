import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import FormAsignacion from '../organisms/FormAsignacion.jsx';
<<<<<<< HEAD
=======
import FormActividades from '../organisms/FormActividades.jsx';
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
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
<<<<<<< HEAD
    Input,
    Pagination,
} from "@nextui-org/react";
import { PlusIcon } from "../NextIU/atoms/plusicons.jsx";
import ButtonActualizar from "../atoms/ButtonActualizar.jsx";
import { SearchIcon } from '../NextIU/atoms/searchicons.jsx';
import ButtonDesactivar from "../atoms/ButtonDesactivar.jsx";

=======
    Chip,
    Input,
} from "@nextui-org/react";
import { PlusIcon } from "../NextIU/atoms/plusicons.jsx";
import ButtonDesactivar from "../atoms/ButtonDesactivar.jsx";
import ButtonActualizar from "../atoms/ButtonActualizar.jsx";
import { SearchIcon } from '../NextIU/atoms/searchicons.jsx';
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

export default function AsignacionPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [asignaciones, setAsignaciones] = useState([]);
    const { idAsignacion, setAsignacionId } = useContext(AsignacionContext);
    const [modalContent, setModalContent] = useState(null);
    const [filterValue, setFilterValue] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(5);
<<<<<<< HEAD
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "ID",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
=======


>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

    useEffect(() => {
        peticionGet();
    }, []);

    const handleOpenModal = (formType, data = null) => {
        if (formType === 'asignacion') {
            setModalContent(
<<<<<<< HEAD
                <FormAsignacion
                    initialData={data}
                    onSubmit={handleFormAsignacionSubmit}
                    onClose={handleCloseModal}
                    mode={data ? 'update' : 'create'}
                />
            );
=======
                <FormAsignacion 
                    initialData={data} 
                    onSubmit={handleFormAsignacionSubmit} 
                    onClose={handleCloseModal} 
                    mode={data ? 'update' : 'create'} // Enviar el modo correcto
                />
            );
        } else if (formType === 'actividades') {
            setModalContent(<FormActividades />);
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
        }
        setModalOpen(true);
    };

    const handleCloseModal = async () => {
        setModalOpen(false);
        setInitialData(null);
        setModalContent(null);
<<<<<<< HEAD
        await peticionGet();
=======
        await peticionGet(); 
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
    };

    const handleFormAsignacionSubmit = async (formData) => {
        try {
<<<<<<< HEAD
            // Verifica que id_asignacion esté presente en formData antes de realizar la operación
            if (formData.id_asignacion) {
                const response = await axiosClient.put(`/actualizar/${formData.id_asignacion}`, formData);
                console.log('Respuesta del servidor:', response.data);
            } else {
=======
            if (formData.id_asignacion) {
                // Actualizar asignación
                const response = await axiosClient.put(`/actualizar/${formData.id_asignacion}`, formData);
                console.log('Respuesta del servidor:', response.data);
            } else {
                // Registrar nueva asignación
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
                const response = await axiosClient.post('/registrar', formData);
                console.log('Respuesta del servidor:', response.data);
            }
            handleCloseModal();
        } catch (error) {
<<<<<<< HEAD
            console.error(error);
        }
    };
    
    const handleToggle = (initialData) => {
        if (initialData) {
            setInitialData(initialData);
            setAsignacionId(initialData.id_asignacion); // Asegúrate que este ID exista
            handleOpenModal('asignacion', initialData);
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
=======
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
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

<<<<<<< HEAD
=======

>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
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
<<<<<<< HEAD
        }
    };

    const handleDesactivar = async (id_asignacion) => {
        // Mostrar una alerta de confirmación
        const result = await Swal.fire({
          title: "¿Estás seguro?",
          text: "¿Quieres eliminar esta asignacion?",
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
      
        // Si el usuario confirma, proceder con la desactivación
        if (result.isConfirmed) {
          try {
            const response = await axiosClient.delete(`/eliminar/${id_asignacion}`);
            Swal.fire("Eliminada", response.data.message, "success");
      
            // Actualizar el estado para eliminar el instructor desactivado
            setAsignaciones((prevAsignaciones) =>
                prevAsignaciones.filter((asignacion) => asignacion.id_asignacion !== id_asignacion)
            );
          } catch (error) {
            console.error("Error eliminando la asignacion:", error);
            Swal.fire("Error", "No se pudo eliminar la asignacion", "error");
          }
        }
      };
      

    const hasSearchFilter = Boolean(filterValue);
    const filteredItems = useMemo(() => {
        let filteredAsignaciones = asignaciones;

        if (hasSearchFilter) {
            filteredAsignaciones = filteredAsignaciones.filter(seg =>
                seg.nombre_instructor.toLowerCase().includes(filterValue.toLowerCase())
=======
            alert('Error en el servidor');
        }
    };

    const filteredItems = useMemo(() => {
        let filteredAsignaciones = asignaciones;

        if (filterValue) {
            filteredAsignaciones = filteredAsignaciones.filter(seg =>
                seg.nombres.toLowerCase().includes(filterValue.toLowerCase())
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
            );
        }

        return filteredAsignaciones;
    }, [asignaciones, filterValue]);

<<<<<<< HEAD
=======

>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '';
        }
        return date.toISOString().split('T')[0];
    };

<<<<<<< HEAD
    const pages = useMemo(() => Math.ceil(filteredItems.length / rowsPerPage), [
        filteredItems.length,
        rowsPerPage,
    ]);

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

=======
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
    const renderCell = (asignacion, columnKey) => {
        const cellValue = asignacion[columnKey];
        switch (columnKey) {
            case "actions":
                return (
<<<<<<< HEAD
                    <div className='flex justify-around items-center'>
                        <ButtonActualizar onClick={() => handleToggle(asignacion)} />
                        <ButtonDesactivar
                onClick={() => handleDesactivar(asignacion.id_asignacion)}
              />
=======
                    <div>
                        <ButtonActualizar onClick={() => handleToggle(asignacion)} />
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
                    </div>
                );
            default:
                return cellValue;
        }
    };

    const columns = [
        { key: "id_asignacion", label: "ID" },
<<<<<<< HEAD
        { key: "nombre_aprendiz", label: "Aprendiz" },
        { key: "nombre_instructor", label: "Instructor" },
        { key: "rango_fechas", label: "Fechas" },
        { key: "horario", label: "Hora y Día" },
        { key: "actions", label: "Acciones" },
    ];

    const topContent = useMemo(() => {
        return (
            <div className="my-10">
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
                <div className="flex items-center justify-between">
                    <span className="text-default-400 text-small">
=======
        { key: "productiva", label: "Etapa Productiva" },
        { key: "actividad", label: "Actividad" },
        { key: "actions", label: "Acciones" },
    ];

    return (
        <div className="m-20">
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
                <Button onClick={() => handleOpenModal('asignacion')} className="bg-[#90d12c] text-white ml-60" >
                    Registrar Asignación
                </Button>
                <Button onClick={() => handleOpenModal('actividades')} className="bg-[#5a851b] text-white" >
                    Registrar Actividad
                </Button>
            </div>
            </div>
            <div className="flex items-center justify-between mt-2 mb-5">
                    <span className="text-default-400 text-small mt-2">
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
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
<<<<<<< HEAD
            </div>
        );
    }, [
        filterValue,
        asignaciones.length,
        onRowsPerPageChange,
        onClear,
        onSearchChange,
    ]);

    return (
        <div>
            {topContent}
            <Table
                aria-labelledby="Tabla de Asignaciones"
                css={{ height: "auto", minWidth: "100%" }}
=======

            <Table
                aria-label="Tabla"
                isHeaderSticky
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
                sortDescriptor={{ column: "fecha", direction: "ascending" }}
            >
                <TableHeader>
                    {columns.map((column) => (
                        <TableColumn key={column.key}>{column.label}</TableColumn>
                    ))}
                </TableHeader>
<<<<<<< HEAD
                <TableBody emptyContent={"No hay asignaciones registradas"} items={sortedItems}>
=======
                <TableBody emptyContent={"No hay asignaciones registradas"} items={asignaciones}>
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
                    {(item) => (
                        <TableRow key={item.id_asignacion}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
<<<<<<< HEAD
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
=======

>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
            <ModalAcciones
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={initialData ? "Actualizar Asignación" : "Registrar Asignación"}
                bodyContent={modalContent}
            />
        </div>
    );
}
<<<<<<< HEAD

=======
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
