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
import { PlusIcon } from "../NextIU/atoms/plusicons";
import { VerticalDotsIcon } from "../NextIU/atoms/verticalicons";
import { SearchIcon } from "../NextIU/atoms/searchicons";
import { ChevronDownIcon } from "../NextIU/atoms/icons";
import { columns, users, statusOptions } from "../NextIU/molecules/data";
import { capitalize } from "../NextIU/atoms/utils";
import ModalNominas from "../templates/ModalNominas";
import AccionesModal from "../molecules/AccionesModal";

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
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState(new Set(["all"]));
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

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter.size && !statusFilter.has("all")) {
      filteredUsers = filteredUsers.filter((user) =>
        statusFilter.has(user.status),
      );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter]);

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
          startContent={<SearchIcon />}
        />
       {/*  <Dropdown>
          <DropdownTrigger>
            <Button endContent={<ChevronDownIcon />}>Status</Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Status Menu"
            selectionMode="multiple"
            selectedKeys={statusFilter}
            onSelectionChange={setStatusFilter}
          >
            {statusOptions.map((option) => (
              <DropdownItem key={option.uid}>
                {capitalize(option.name)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown> */}
      </div>
    );
  }, [filterValue, onSearchChange, statusFilter]);

  return (
    <div className="m-12">
      <h2 className="font-semibold text-xl mb-5">Seguimientos Asignados:</h2>
      <Table
        aria-label="Example table with custom content"
        className="min-w-full"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
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
