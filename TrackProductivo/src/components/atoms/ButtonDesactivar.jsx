import React from "react";
import { Tooltip } from "@nextui-org/react";
import v from '../../styles/Variables'

const ButtonDesactivar = ({ estado, onClick }) => {
  const handleClick = () => {
    onClick();
  };

  // Determinar el contenido del tooltip y el ícono según el estado
  let tooltipContent = "";
  let tooltipColor = "";
  let iconComponent = null;

  if (estado === "activo") {
    tooltipContent = "Activar";
    tooltipColor = "danger";
    iconComponent = <v.aprobado className="text-success" />; // Ícono para desactivar
  } else {
    tooltipContent = "Desactivar";
    iconComponent = <v.noAprobado className="text-danger" />; // Ícono para activar
  }

  return (
    <Tooltip color={tooltipColor} content={tooltipContent}>
      <span
        className="py-2 font-semibold text-white rounded w-10 flex justify-center items-center cursor-pointer"
        onClick={handleClick}
      >
        {iconComponent}
      </span>
    </Tooltip>
  );
};

export default ButtonDesactivar;