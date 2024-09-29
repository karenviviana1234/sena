import React, { useEffect, useState } from "react";
import ActaSeguimiento from '../molecules/ActaSeguimiento.jsx'
import Bitacoras from "../molecules/Bitacoras.jsx";

function ComponentSeguimiento({id_seguimiento}) {
  const seguimientoNumeros = {
    1: 1,
    2: 2,
    3: 3,
  };
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">
        Seguimiento {seguimientoNumeros[id_seguimiento] || 1}{" "}
        {/* Mostrar el número de seguimiento */}
      </h1>
      {/* Sección para enviar acta */}
      <ActaSeguimiento id_seguimiento={id_seguimiento}/>

      {/* Sección para registrar bitácoras y actividades */}
     <div>
      
     <Bitacoras id_seguimiento={id_seguimiento} />

     </div>
        

    </div>
  );
}

export default ComponentSeguimiento;  