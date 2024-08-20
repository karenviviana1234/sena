// ButtonActualizar.jsx
import React from 'react';
import {Tooltip} from "@nextui-org/react"

const ButtonActualizar = ({ onClick }) => {
  return (
    <Tooltip content="Editar">
    <button className="font-bold py-2 px-4 rounded" onClick={onClick}>
    Actualizar
    </button>
    </Tooltip>
  );
};

export default ButtonActualizar;
