import React from 'react'
import ExcelUploader from '../../organisms/Form'

function Bitacoras() {
    return (
        <div /* className='flex justify-between' */>
            <div className="flex flex-col gap-4"> 
                <div className='border shadow-medium rounded-2xl p-3'>
                    <h2>Bitacora 1:</h2>
                    <p>Estado: Solicitud</p>
                    <ExcelUploader />
                </div>
                <div className='border shadow-medium rounded-2xl p-3'>
                    <h2>Bitacora 2:</h2>
                    <p>Estado: Solicitud</p>
                    <ExcelUploader />
                </div>
          
            <div className='border shadow-medium rounded-2xl p-3'>
                    <h2>Bitacora 3:</h2>
                    <p>Estado: Solicitud</p>
                    <ExcelUploader />
                </div>
                <div className='border shadow-medium rounded-2xl p-3'>
                    <h2>Bitacora 4:</h2>
                    <p>Estado: Solicitud</p>
                    <ExcelUploader />
                </div>
                </div>
            </div>
    )
}

export default Bitacoras