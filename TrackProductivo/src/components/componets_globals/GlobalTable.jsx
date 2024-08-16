import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
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

  const fetchData = async () => {
    try {
      const response = await axiosClient.get(dataEndpoint);
      setData(response.data);

      setTotalPages(Math.ceil(response.data.length / rowsPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataEndpoint]);

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
  const paginatedData = data.slice(start, end);

  const handleUpdateClick = (item) => {
    setSelectedItem(item);
    setIsUpdateModalOpen(true);
  };

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
      <Table aria-label="Example table with pagination">
        <TableHeader>
          {columns.map((column, index) => (
            <TableColumn key={index}>{column}</TableColumn>
          ))}
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item, index) => (
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
      )}
    </div>
  );
};

export default GlobalTable;
