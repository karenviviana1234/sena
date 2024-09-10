import React, { useEffect, useState } from 'react';
import axiosClient from '../../configs/axiosClient';
import ButtonActualizar from '../atoms/ButtonActualizar';

function Novedad({ id_seguimiento }) {
    const [novedades, setNovedades] = useState([]);

    useEffect(() => {
        if (id_seguimiento) {
            axiosClient.get(`/novedad/listar/${id_seguimiento}`)
                .then((response) => {
                    console.log('Respuesta de la API:', response.data); // Verifica la respuesta de la API aquí

                    if (response.data) {
                        setNovedades(response.data);
                        console.log('Novedades actualizadas:', response.data); // Verifica el estado después de actualizar
                    } else {
                        console.error('La respuesta es undefined o vacía.');
                    }
                })
                .catch((error) => {
                    console.error('Error al obtener los datos:', error);
                });
        }
    }, [id_seguimiento]);


    return (
        <>
            {novedades.map((novedad) => (
                <div key={novedad.id_novedad} className="border shadow-medium rounded-2xl p-4 mb-4">
                    <div className="flex justify-between">
                        <div>
                            <h2 className="font-semibold text-lg">{novedad.instructor}:</h2>
                            <span className="text-gray-500 text-sm">Seguimiento: {novedad.seguimiento}</span>
                        </div>
                        <ButtonActualizar />
                    </div>
                    <p className="text-sm mt-2">{novedad.descripcion}</p>
                    {novedad.foto && <img src={novedad.foto} alt="Foto de la novedad" className="mt-2 rounded" />}
                    <div className="flex justify-end items-center gap-4 mt-2">
                        <p className="text-gray-500 text-sm">{new Date(novedad.fecha).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}
        </>
    );
}

export default Novedad;