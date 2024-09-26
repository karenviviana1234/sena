import React from 'react';
import { Tabs, Tab } from "@nextui-org/react";
import TableFichas from "../organisms/TableFichas";
import TableHorarios from "../organisms/TableHorario";

function FichasPage() {
  return ( 
    <>
    <div className="flex min-h-screen flex-col m-10">
        <Tabs aria-label="Options">
            <Tab key="fichas" title="fichas">
              <TableFichas />
            </Tab>
            <Tab key="horarios" title="horarios">
              <TableHorarios />
            </Tab>
        </Tabs>
    </div>
  </>
 );
}


export default FichasPage