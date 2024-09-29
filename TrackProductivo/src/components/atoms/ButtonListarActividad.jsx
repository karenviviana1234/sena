import React from 'react'
import Icons from '../../styles/Variables';
import { Tooltip } from '@nextui-org/react';


const ButtonListarActividad = ({onClick, ref}) => {
    return (
<<<<<<< HEAD
        <Tooltip content="Actividades">
=======
        <Tooltip content="Listar actividades">
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
            <button ref={ref} className="font-bold py-2 px-4 rounded" onClick={onClick}>
                <Icons.ListarActividad className='w-5 h-5' />
            </button>
        </Tooltip>
    );
}

export default ButtonListarActividad