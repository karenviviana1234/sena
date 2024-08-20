import React from 'react'
import ExcelUploader from './Excel.jsx'
import { Chip } from "@nextui-org/react";
import v from '../../styles/Variables.jsx'

function Bitacoras() {
    return (
        <div /* className='flex justify-between' */>
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
                <div className='border shadow-medium rounded-2xl p-3'>
                    <h2 className='font-semibold text-lg'>Bitacora 2:
                        <Chip
                            endContent={<v.aprobado size={18} />}
                            variant="flat"
                            color="success"
                            className='pr-3 mx-2'
                        >Aprobado</Chip></h2>
                    <p className='text-gray-500'>20-12-2024</p>
                    <ExcelUploader />
                </div>

                <div className='border shadow-medium rounded-2xl p-3'>
                    <h2 className='font-semibold text-lg'>Bitacora 3:
                        <Chip
                            endContent={<v.noAprobado size={18} />}
                            variant="flat"
                            color="danger"
                            className='pr-3 mx-2'
                        >No Aprobado</Chip></h2>
                    <p className='text-gray-500'>20-12-2024</p>
                    <ExcelUploader />
                </div>
                <div className='border shadow-medium rounded-2xl p-3'>
                    <h2 className='font-semibold text-lg'>Bitacora 4:
                        <Chip
                            endContent={<v.solicitud size={18} />}
                            variant="flat"
                            color="warning"
                            className='pr-3 mx-2'
                        >Solicitud</Chip></h2>
                    <p className='text-gray-500'>20-12-2024</p>
                    <ExcelUploader />
                </div>
            </div>
        </div>
    )
}

export default Bitacoras






