import React, { useState } from 'react';
import GlobalTable from '../componets_globals/GlobalTable';
import RegistroEmpresa from './FormEmpresa';
import UpdateEmpresa from './ActualizarEmpresa';

function TableEmpresas() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRegisterSuccess = () => {
    setRefreshTrigger(prev => !prev);
  };
  const columns = [
    'jefe_inmediato',
    'telefono',
    'direccion',
    'correo',
    'razon_social',
    'nombre_mpio',
    'departamento',
    'estado',
  ];



  return (
    <>
      <main className='w-full p-3 h-screen'>
        <div className='my-5 flex flex-col py-5'>
          <RegistroEmpresa onRegisterSuccess={handleRegisterSuccess}/>
          <GlobalTable 
            columns={columns} 
            dataEndpoint="/empresas/listar" 
            refreshTrigger={refreshTrigger}
            updateComponent={UpdateEmpresa} 
        
          />
        </div>

      </main>
    </>
  );
};


export default TableEmpresas