import React from 'react'
import Bitacoras from '../NextIU/molecules/Bitacoras.jsx'

function ModalNominas () {
  return (
      <div className='flex justify-between gap-20'>
          <div className='w-1/2 pl-4'>
          <h1 className='font-semibold mb-5'>Bitacoras:</h1>
              <Bitacoras />
          </div>
          <div className='w-1/2'>
              <h1 className='font-semibold mb-5'>Actividades:</h1>
              <div className='border shadow-medium rounded-2xl p-3'>
                  <h2>Magda Lorena:</h2>
                  <p>Corregir Bitacora 4</p>
              </div>
          </div>
      </div>
  )
}

export default ModalNominas
