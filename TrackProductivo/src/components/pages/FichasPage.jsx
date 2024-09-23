import React from 'react';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import TableHorariosPage from '../organisms/Horarios/TableHorarios';
import TableFichasPage from '../organisms/Ficha/TableFicha';


function FichasPage() {
  return ( 
    <>
    <div className="flex min-h-screen flex-col m-10">
        <Tabs aria-label="Options">
            <Tab key="fichas" title="fichas">
              <TableFichasPage />
            </Tab>
            <Tab key="horarios" title="horarios">
              <TableHorariosPage />
            </Tab>
        </Tabs>
    </div>
  </>
  );
}


export default FichasPage