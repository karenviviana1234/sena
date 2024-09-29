import React from "react";
<<<<<<< HEAD
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import TableEmpresas from "../organisms/TableEmpresa";
import TableEtapaPractica from "../organisms/TablePractica";
import AsignacionPage from "../pages/AsignacionPage";

function EtapaPracticaPage() {
    return (
        <>
            <div className="flex min-h-screen flex-col m-10">
                <Tabs aria-label="Options">
                    <Tab key="instructor" title="Empresas">
                        <TableEmpresas />
                    </Tab>
                    <Tab title="Etapa Practica">
                        <TableEtapaPractica />
                    </Tab>
                    <Tab title="Asignaciones">
                        <AsignacionPage />
                    </Tab>
                </Tabs>
            </div>
        </>
    );
}

export default EtapaPracticaPage;
=======
import TableEtapaPractica from "../organisms/TablePractica";

export default function EtapaPracticaPage() {
  return (
    <div className="flex min-h-screen flex-col m-10">
      <TableEtapaPractica />
    </div>
  );
}
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
