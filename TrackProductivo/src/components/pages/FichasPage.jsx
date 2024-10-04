import React from 'react';
import { Tabs, Tab } from "@nextui-org/react";
import TableFichas from "../organisms/TableFichas";
import TableHorarios from "../organisms/TableHorario";
import TableAmbiente from '../organisms/TableAmbiente';

function FichasPage() {
  return ( 
    <>
    <div className="flex min-h-screen flex-col m-10">
        <Tabs aria-label="Options">
            <Tab key="fichas" title="Fichas">
              <TableFichas />
            </Tab>
            <Tab key="horarios" title="Horarios">
              <TableHorarios />
            </Tab>
            <Tab key="ambientes" title="Ambientes">
              <TableAmbiente />
            </Tab>
        </Tabs>
    </div>
  </>
 );
}


export default FichasPage