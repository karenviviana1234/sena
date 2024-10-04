import React, { useEffect, useState } from 'react';
import Grafica from '../molecules/Estadisticas/Grafica';
import axiosClient from '../../configs/axiosClient';
import GraficaBar from '../molecules/Estadisticas/GraficaBar';
import BasicLineChart from '../molecules/Estadisticas/GraficaLine';

function HomePage() {
  const [personas, setPersonas] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axiosClient.get("/personas/listar"); // Ajusta la ruta del endpoint
      setPersonas(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='m-10'>
      <div className='flex justify-between gap-10'>
        <div className='bg-gradient-to-b from-lime-300 to-[#0c8652] mb-10 w-2/3 h-28 rounded-lg p-5'>
          <h1 className='text-white text-2xl font-semibold mb-3'>Bienvenido a TrackProductivo</h1>
          <p className='text-white'>Eficiencia en Cada Paso: Monitorea, Evalúa, Mejora.</p>
        </div>
        <div className='bg-gradient-to-b from-lime-300 to-[#0c8652] mb-10 w-96 h-28 rounded-lg pt-5 text-center'>
          <h1 className='text-white text-2xl font-semibold '>Más de {personas.total} personas</h1>
          <p className='text-white text-lg'>usan nuestro sistema</p>
        </div>
      </div>
      <div className='flex justify-between'>
        <div className='w-1/2 mr-4'>
          <div className='bg-slate-200 h-72 rounded-lg p-5 text-center mb-4'>
            <h1 className='text-gray-700 text-2xl font-semibold'>Matriculas</h1>
            <Grafica />
          </div>
          <div className='bg-slate-200 h-[120px] rounded-lg text-center flex justify-center items-center'>
            <h1 className='text-gray-700 text-2xl p-10 font-semibold ml-28'>Bitacoras</h1>
            <BasicLineChart />
          </div>
        </div>
        <div className='bg-slate-200 w-1/2 h-3/4 rounded-lg p-5 text-center'>
          <h1 className='text-gray-700 text-2xl font-semibold'>Etapas Productivas</h1>
          <GraficaBar />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
