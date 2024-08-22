import React from 'react';
import ExcelUploader from '../molecules/Excel.jsx';
import { Chip } from "@nextui-org/react";
import v from '../../styles/Variables.jsx';

function ComponentSeguimiento({ initialData, mode, handleSubmit, onClose, actionLabel }) {
  return (
    <div className='flex justify-between gap-20'>
      <div className='w-1/2 pl-4'>
        <h1 className='font-semibold mb-5 text-xl'>Bitacoras:</h1>
        <div className="flex flex-col gap-4">
          <div className='border shadow-medium rounded-2xl p-3'>
            <h2 className='font-semibold text-lg'>Bitacora 1:
              <Chip
                endContent={<v.aprobado size={18} />}
                variant="flat"
                color="success"
                className='pr-3 mx-2'
              >Aprobado</Chip></h2>
            <p className='text-gray-500'>20-12-2024</p>
            <ExcelUploader />
          </div>
        </div>
      </div>
      <div className='w-1/2 '>
        <h1 className='font-semibold mb-5 text-xl'>Actividades:</h1>
        <div className='border shadow-medium rounded-2xl p-3'>
            <div>
                <h2 className='font-semibold text-lg'>Magda Lorena:</h2>
                <span className='text-sm text-gray-500 align-text-top'>Administrativo</span>
            </div>
            <p>Corregir Bitacora 4</p>
            <div className='flex justify-end gap-5'>
            <p className='text-gray-500'>20-12-2023</p>
            <a href="#">Ver más</a>
            </div>
        </div>
      </div>
    </div>
  );
}

export default ComponentSeguimiento;
