import React, { useState } from 'react';
import GlobalTable from '../../components/componets_globals/GlobalTable';
import RegistroHorario from './FormHorario';
import ActualizarHorario from './ActualizarHorarios';


function TableHorariosPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRegisterSuccess = () => {
    setRefreshTrigger((prev) => !prev);
  };

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };


  const columns = [
    'dia',
    'horas',
    'hora_inicio',
    'hora_fin',
    'ficha',
    'nombre_amb',
    'estado',
  ];

  return (
    <>
      <main className='w-full p-3 h-screen'>
        <div className='my-5 flex flex-col py-5'>
          <RegistroHorario onRegisterSuccess={handleRegisterSuccess} />
          <GlobalTable
            columns={columns}
            dataEndpoint="/horarios/listar"
            refreshTrigger={refreshTrigger}
            updateComponent={ActualizarHorario}
            refreshData={refreshData} 
          />
        </div>
      </main>
    </>
  );

};


export default TableHorariosPage