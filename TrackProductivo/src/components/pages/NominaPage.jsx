import React from "react";
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
