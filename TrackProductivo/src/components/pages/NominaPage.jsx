import React from "react";
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
  User,
  Pagination,
  Modal,
} from "@nextui-org/react";
import v from '../../styles/Variables'
import { columns, users } from "../NextIU/molecules/data";
import AccionesModal from "../molecules/Modal";

const statusColorMap = {
  Activo: "success",
  Proceso: "warning",
  Inactivo: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "name",
  "role",
  "age",
  "team",
  "seguimiento1",
  "seguimiento2",
  "seguimiento3",
];

export default function App() {
  const [filterValue, setFilterValue] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const [modalVisible, setModalVisible] = React.useState(false); // Estado para manejar la visibilidad del modal
  const [selectedCellValue, setSelectedCellValue] = React.useState(""); // Estado para almacenar el valor de la celda
  const [modalAccionesVisible, setModalAccionesVisible] = React.useState(false); // Estado para manejar la visibilidad del modal de acciones

  const pages = Math.ceil(users.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);

  // Define headerColumns y filteredItems usando los datos de ejemplo directamente
  const headerColumns = React.useMemo(() => INITIAL_VISIBLE_COLUMNS.map(columnKey => ({
    uid: columnKey,
    name: columnKey.charAt(0).toUpperCase() + columnKey.slice(1),
    sortable: true,
  })), []);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [users, filterValue]);

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

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "full", size: "sm", src: user.avatar }}
            classNames={{
              description: "text-default-500",
            }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={statusColorMap[user.status]}
            size="sm"
            variant="dot"
          >
            {cellValue}
          </Chip>
        );
      case "seguimiento1":
      case "seguimiento2":
      case "seguimiento3":
        return (
          <Button
            size="sm"
            className="text-white bg-[#84CC16]"
            onClick={() => {
              setModalAccionesVisible(true); // Muestra el modal de acciones
            }}
          >
            {cellValue}
          </Button>
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
          startContent={<v.buscar />}
          className="w-[650px]"
        />
        <span className="text-base text-default-600">
          Total de usuarios: {users.length}
        </span>
      </div>
    );
  }, [filterValue, onSearchChange]);

  return (
    <div className="m-12">
      <h2 className="font-semibold text-xl mb-5">Seguimientos:</h2>
      <div className="mb-4">
      </div>
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
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal para seguimiento */}
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <Modal.Header>
          <p>Seguimiento</p>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedCellValue}</p>
        </Modal.Body>
      </Modal>

      {/* Modal de acciones (puedes personalizar el contenido) */}
      <AccionesModal
        isOpen={modalAccionesVisible}
        onClose={() => setModalAccionesVisible(false)}
      />
    </div>
  );
}

