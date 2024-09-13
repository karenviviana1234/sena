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
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import TableAprendices from "../organisms/TableAprendices";
import TableInstructores from "../organisms/TableInstructores";

export default function NominaPage() {
    return (
        <div className="flex min-h-screen flex-col m-10">
            <TableInstructores/>
        </div>
    );
}