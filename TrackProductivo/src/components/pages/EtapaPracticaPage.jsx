import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import TableEmpresas from "../organisms/TableEmpresa";
import TableEtapaPractica from "../organisms/TablePractica";
function EtapaPracticaPage() {
    return ( 
        <>
        <div className="flex min-h-screen flex-col m-10">
            <Tabs aria-label="Options">
                <Tab key="aprendiz" title="EtapaPractica">
                    <TableEtapaPractica />
                </Tab>
                <Tab key="instructor" title="Empresa">
                    <TableEmpresas />
                </Tab>
            </Tabs>
        </div>
      </>
     );
}

export default EtapaPracticaPage;