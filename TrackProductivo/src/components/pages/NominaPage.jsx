import React from "react";
<<<<<<< HEAD
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
=======
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import TableAprendices from "../organisms/TableAprendices";
import TableInstructores from "../organisms/TableInstructores";
>>>>>>> 9e2bcc2848340c7e97565f9908d2bd0216959937

export default function NominaPage() {
    return (
        <div className="flex min-h-screen flex-col m-10">
            <Tabs aria-label="Options">
                <Tab key="aprendiz" title="Aprendices">
                    <TableAprendices />
                </Tab>
                <Tab key="instructor" title="Instructores">
                    <TableInstructores />
                </Tab>
            </Tabs>
        </div>
    );
}
