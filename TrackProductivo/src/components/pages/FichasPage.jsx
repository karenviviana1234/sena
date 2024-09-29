<<<<<<< HEAD
import React from 'react';
import { Tabs, Tab } from "@nextui-org/react";
import TableFichas from "../organisms/TableFichas";
import TableHorarios from "../organisms/TableHorario";

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
        </Tabs>
    </div>
  </>
 );
}


=======
import TableFichas from '../organisms/Ficha/TableFicha'
function FichasPage() {
  return (
    <>

    <>
    <main className='w-full p-3'>
        <TableFichas/>
      </main>
    </>
    <div>FichasPage</div></>
  )
}

>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
export default FichasPage