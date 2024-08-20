import React from 'react'
import Bitacoras from '../molecules/Bitacoras.jsx'
import Actividades from '../molecules/Actividades.jsx'

function ModalNominas () {
  return (
      <div className='flex justify-between gap-20'>
          <div className='w-1/2 pl-4'>
          <h1 className='font-semibold mb-5 text-xl'>Bitacoras:</h1>
              <Bitacoras />
          </div>
          <div className='w-1/2 '>
              <h1 className='font-semibold mb-5 text-xl'>Actividades:</h1>
              <Actividades/>
              <br />
              <Actividades/>
              <br />
              <Actividades/>
              <br />
              <Actividades/>
          </div>
      </div>
  )
}

export default ModalNominas
