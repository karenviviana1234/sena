import React from 'react';
import ExcelUploader from '../molecules/Excel.jsx';
import { Chip } from "@nextui-org/react";
import v from '../../styles/Variables.jsx';

function ComponentSeguimiento({ initialData, mode, handleSubmit, onClose, actionLabel }) {
  return (
    <div className='flex justify-between gap-20'>
    <div className='w-1/2 pl-4'>
      <h1 className='font-semibold mb-5 text-2xl'>Bitacoras:</h1>
      <div className="flex flex-col gap-6">
        <div className='border shadow-medium rounded-2xl p-6'>
          <h2 className='font-semibold text-2xl'>Bitacora 1:
            <Chip
              endContent={<v.aprobado size={24} />}
              variant="flat"
              color="success"
              className='pr-4 mx-3'
            >
              Aprobado
            </Chip>
          </h2>
          <p className='text-gray-500 text-lg'>20-12-2024</p>
          <ExcelUploader />
        </div>
      </div>
    </div>
    <div className='w-1/2'>
      <h1 className='font-semibold mb-5 text-2xl'>Actividades:</h1>
      <div className='border shadow-medium rounded-2xl p-6'>
        <div>
          <h2 className='font-semibold text-2xl'>Magda Lorena:</h2>
          <span className='text-lg text-gray-500 align-text-top'>Administrativo</span>
        </div>
        <p className='text-lg'>Corregir Bitacora 4</p>
        <div className='flex justify-end gap-5'>
          <p className='text-lg text-gray-500'>20-12-2023</p>
          <a href="#" className='text-lg'>Ver más</a>
        </div>
      </div>
    </div>
  </div>
  );
}

export default ComponentSeguimiento;
