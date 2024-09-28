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
    { key: 'dia', label: 'Día' },
    { key: 'horas', label: 'Horas' },
    { key: 'hora_inicio', label: 'Hora de Inicio' },
    { key: 'hora_fin', label: 'Hora de Fin' },
    { key: 'ficha', label: 'Ficha' },
    { key: 'nombre_amb', label: 'Ambiente' },
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
            contentName="horarios"
            updateComponent={ActualizarHorario}
            refreshData={refreshData} 
            desactivarEndpoint="/horarios/desactivar/" 
            idField="id_horario"
          />
        </div>
      </main>
    </>
  );

};


export default TableHorariosPage