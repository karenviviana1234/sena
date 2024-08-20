import React from 'react'

function Actividades() {
    return (
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
    )
}

export default Actividades