import React, { useState } from 'react';
import RegistroFicha from './FormFichas';
import GlobalTable from '../../components/componets_globals/GlobalTable';
import ActualizarFicha from './ActualizarFichas';


function TableFichasPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handleRegisterSuccess = () => {
    setRefreshTrigger(prev => !prev);
  };

  const columns = [
    'codigo',
    'estado',
    'inicio_ficha',
    'fin_lectiva',
    'fin_ficha',
    'nombre_programa',
    'sede',
  
  ];


  return (
    <>
      <main className='w-full p-3 h-screen'>
        <div className='my-5 flex flex-col py-5'>
          <RegistroFicha onRegisterSuccess={handleRegisterSuccess} />
          <GlobalTable
            columns={columns}
            dataEndpoint="/fichas/listar"
            refreshTrigger={refreshTrigger}
            updateComponent={ActualizarFicha} 
         
          />
        </div>

      </main>
    </>
  );
};


export default TableFichasPage