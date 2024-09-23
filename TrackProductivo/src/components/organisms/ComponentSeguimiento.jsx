import React, { useEffect, useState } from "react";
import ButtonActualizar from "../atoms/ButtonActualizar.jsx";
import ActaSeguimiento from "../molecules/ActaSeguimiento.jsx";
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
      <Bitacoras id_seguimiento={id_seguimiento}/>
     </div>
        {/* Sección para actividades */}
        <div className="flex-1 min-w-[300px]  p-4">
          <h1 className="font-semibold mb-4 text-xl">Novedades:</h1>
          <div className="border shadow-medium rounded-2xl p-4">
            <div className="flex justify-between">
              <div>
                <h2 className="font-semibold text-lg">Magda Lorena:</h2>
                <span className="text-gray-500 text-sm">Administrativo</span>
              </div>
              <ButtonActualizar />
            </div>
            <p className=" text-sm mt-2">Corregir Bitacora 4</p>
            <div className="flex justify-end items-center gap-4 mt-2">
              <p className="text-gray-500 text-sm">20-12-2023</p>
            </div>
          </div>
        </div>     
    </div>
  );
}

export default ComponentSeguimiento;  