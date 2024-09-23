import React from 'react';

import GlobalTable from '../../componets_globals/GlobalTable';


function TableHorariosPage() {
  const columns = [

    'dia',
    'horas',
    'hora_inicio',
    'hora_fin',
    'ficha',
    'nombre_amb',
    'estado'

  ];



  return (
    <>
      <main className='w-full p-3 h-screen'>
        <div className='my-5 flex flex-col py-5'>

          <GlobalTable 
            columns={columns} 
            dataEndpoint="/horarios/listar" 
            //updateComponent={Update} 

          />
        </div>

      </main>
    </>
  );
};


export default TableHorariosPage