import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
<<<<<<< HEAD
  Pagination,
  Input
} from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';
import ButtonActualizar from '../atoms/ButtonActualizar';
import ButtonDesactivar from '../atoms/ButtonDesactivar';
import { SearchIcon } from '../NextIU/atoms/searchicons';
import Swal from 'sweetalert2';

const GlobalTable = ({ columns, dataEndpoint, updateComponent: UpdateComponent, refreshTrigger, contentName, idField, desactivarEndpoint }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
=======
  Pagination
} from "@nextui-org/react";
import axiosClient from '../../configs/axiosClient';

const GlobalTable = ({ columns, dataEndpoint, updateComponent: UpdateComponent, deleteComponent: DeleteComponent }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default number of rows per page
  const [selectedItem, setSelectedItem] = useState(null); // State to manage selected item for update
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State to manage update modal visibility
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State to manage delete modal visibility
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

  const fetchData = async () => {
    try {
      const response = await axiosClient.get(dataEndpoint);
      setData(response.data);
<<<<<<< HEAD
=======

>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
      setTotalPages(Math.ceil(response.data.length / rowsPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

<<<<<<< HEAD
  const handleDesactivar = async (itemId) => {
    // Mostrar una alerta de confirmación
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres eliminar este Componente?",
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
          const response = await axiosClient.post(`${desactivarEndpoint}${itemId}`);
          Swal.fire("Eliminado", response.data.message, "success");
          
          // Actualizar el estado para eliminar el elemento desactivado
          await fetchData(); // Forzar la recarga de datos
      } catch (error) {
          console.error("Error desactivando el elemento:", error);
          Swal.fire("Error", "No se pudo desactivar el elemento", "error");
      }
  }  
  };
  

  useEffect(() => {
    fetchData();
  }, [dataEndpoint, refreshTrigger]);
=======
  useEffect(() => {
    fetchData();
  }, [dataEndpoint]);
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

  useEffect(() => {
    setTotalPages(Math.ceil(data.length / rowsPerPage));
  }, [data, rowsPerPage]);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1); // Reset to first page whenever rows per page changes
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
<<<<<<< HEAD
  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const paginatedData = filteredData.slice(start, end);
=======
  const paginatedData = data.slice(start, end);
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

  const handleUpdateClick = (item) => {
    setSelectedItem(item);
    setIsUpdateModalOpen(true);
  };

<<<<<<< HEAD
  const renderCell = (item, column) => {
    return item[column.key]; // Utilizar key para obtener el valor
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="relative flex items-center justify-between gap-3 z-10">
          <Input
            isClearable
            className="w-full sm:max-w-[44%] bg-[#f4f4f5] rounded"
            placeholder="Buscar..."
            startContent={<SearchIcon />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4 my-2">
        <span className="text-default-400 text-small mt-2">
          Total {filteredData.length} {contentName}
        </span>
=======
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const refreshData = () => {
    fetchData();
  };

  const renderCell = (item, column) => {
    
        if (column === 'centro_sede') {
      return item.centro_sede?.nombre || '';
    }


    if (column === 'municipio') {
      return item.municipio ? item.municipio.nombre : '';
    }
    return item[column];
  };


  // const renderTableCell = (item, column) => {
  //   if (column === 'centro_sede') {
  //     return item.centro_sede?.nombre || '';
  //   }
  //   return item[column];
  // };

  return (
    <div>
      <div className="flex flex-col justify-between items-end mb-4 my-2">
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small ml-2"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>
      </div>
<<<<<<< HEAD

      <Table aria-label="Example table with pagination">
        <TableHeader>
          {columns.map((column, index) => (
            <TableColumn key={index}>{column.label}</TableColumn> // Usar label
=======
      <Table aria-label="Example table with pagination">
        <TableHeader>
          {columns.map((column, index) => (
            <TableColumn key={index}>{column}</TableColumn>
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
          ))}
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item, index) => (
<<<<<<< HEAD
            <TableRow key={item[idField]}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>{renderCell(item, column)}</TableCell> // Utilizar renderCell
              ))}
              <TableCell>
              <div className="flex justify-around items-center">
                <ButtonActualizar onClick={() => handleUpdateClick(item)} />
                <ButtonDesactivar onClick={() => handleDesactivar(item[idField])} />
                </div>
=======
            <TableRow key={index}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>{renderCell(item, column)}</TableCell>
              ))}
              <TableCell>
                <button
                  className="bg-transparent hover:bg-gray-300 text-gray-600 font-normal py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in-out mr-2"
                  onClick={() => handleUpdateClick(item)}
                >
                  Actualizar
                </button>
                <button
                  className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in-out"
                  onClick={() => handleDeleteClick(item)}
                >
                  Eliminar
                </button>
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
<<<<<<< HEAD
      
      <div className="flex justify-between mt-4">
        <Pagination
          total={totalPages}
          initialPage={page}
          onChange={(newPage) => {
            handlePageChange(newPage);
          }}
          color={page === 1 ? "default" : "success"} 
          aria-label="Paginación global"
          showControls
        />
      </div>

      {isUpdateModalOpen && selectedItem && (
        <UpdateComponent
          item={selectedItem}
          onClose={() => setIsUpdateModalOpen(false)}
          refreshData={() => {
            setIsUpdateModalOpen(false);
            fetchData();
          }}
        />
=======
      <div className="py-2 px-2 flex justify-between my-2 items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={totalPages}
          onChange={handlePageChange}
        />
      </div>
      {isUpdateModalOpen && selectedItem && (
        <UpdateComponent item={selectedItem} onClose={() => setIsUpdateModalOpen(false)} refreshData={refreshData} />
      )}
      {isDeleteModalOpen && selectedItem && (
        <DeleteComponent item={selectedItem} onClose={() => setIsDeleteModalOpen(false)} refreshData={refreshData} />
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
      )}
    </div>
  );
};

export default GlobalTable;
