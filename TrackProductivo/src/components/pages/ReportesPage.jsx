import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Chip,
  Pagination,
  Modal,
} from "@nextui-org/react";
import AccionesModal from "../molecules/AccionesModal";

const statusColorMap = {
  Activo: "success",
  Proceso: "warning",
  Inactivo: "danger",
};

const columns = [
  { name: "Identificacion", uid: "identificacion", sortable: true },
  { name: "Nombres", uid: "nombres", sortable: true },
  { name: "Código", uid: "codigo", sortable: true },
  { name: "Razón Social", uid: "razon_social", sortable: true },
  { name: "Fecha", uid: "fecha" },
];

export default function App() {
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "identificacion",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCellValue, setSelectedCellValue] = useState("");
  const [modalAccionesVisible, setModalAccionesVisible] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/seguimientos/listar") // URL de tu API
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3000/personas/listar") // URL de tu API
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);


  const pages = Math.ceil(data.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...data];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.nombres.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [data, filterValue]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "nombres":
        return cellValue;
      case "razon_social":
        return cellValue;
      case "fecha":
        return (
          <Button
            size="sm"
            className="text-white bg-[#84CC16]"
            onClick={() => {
              setSelectedCellValue(cellValue);
              setModalVisible(true);
            }}
          >
            {cellValue}
          </Button>
        );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={statusColorMap[cellValue]}
            size="sm"
            variant="dot"
          >
            {cellValue}
          </Chip>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <Input
          isClearable
          placeholder="Search..."
          value={filterValue}
          onClear={() => setFilterValue('')}
          onValueChange={onSearchChange}
          className="w-[650px]"
        />
        <span className="text-base text-default-600">
          Total de usuarios: {data.length}
        </span>
      </div>
    );
  }, [filterValue, onSearchChange]);

  return (
    <div className="m-12">
      <h2 className="font-semibold text-xl mb-5">Seguimientos:</h2>
      <Table
        aria-label="Example table with custom content"
        className="min-w-full"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        topContent={topContent}
        bottomContent={
          <Pagination
            showControls
            initialPage={1}
            page={page}
            total={pages}
            onChange={setPage}
          />
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={sortedItems}>
          {(item) => (
            <TableRow key={item.identificacion}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <Modal.Header>
          <p>Seguimiento</p>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedCellValue}</p>
        </Modal.Body>
      </Modal>

      <AccionesModal
        isOpen={modalAccionesVisible}
        onClose={() => setModalAccionesVisible(false)}
      />
    </div>
  );
}
