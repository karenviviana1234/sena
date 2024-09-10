import React, { useEffect, useState } from 'react';
import axiosClient from '../../configs/axiosClient';
import ButtonActualizar from '../atoms/ButtonActualizar';
import FormNovedades from './FormNovedades'; // Asegúrate de importar tu componente del formulario

function Novedad({ id_seguimiento }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [novedadSeleccionada, setNovedadSeleccionada] = useState(null);
    const [novedades, setNovedades] = useState([]);

    useEffect(() => {
        const fetchNovedades = async () => {
            try {
                const response = await axiosClient.get(`/novedad/listar/${id_seguimiento}`);  
                console.log('Respuesta de la API:', response.data);   
                if (response.data) {
                    const novedades = response.data.map(novedad => ({
                        ...novedad,
                        fecha: new Date(novedad.fecha).toISOString().split('T')[0]
                    }));
                    setNovedades(novedades);
                    console.log('Novedades actualizadas:', novedades); 
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        if (id_seguimiento) {
            fetchNovedades();
        }
    }, [id_seguimiento]);

    const handleActualizarClick = (novedad) => {
        setNovedadSeleccionada(novedad);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setNovedadSeleccionada(null); // Limpiar la novedad seleccionada cuando se cierre el modal
    };

    return (
        <>
            {novedades.map((novedad) => (
                <div key={novedad.id_novedad} className="flex-1 border shadow-medium rounded-2xl p-4 mb-4">
                    <div className="flex justify-between">
                        <div>
                            <h2 className="font-semibold text-lg">{novedad.instructor}:</h2>
                            <span className="text-gray-500 text-sm">Seguimiento: {novedad.seguimiento}</span>
                        </div>
                        <ButtonActualizar onClick={() => handleActualizarClick(novedad)} />
                    </div>
                    <p className="text-sm mt-2">{novedad.descripcion}</p>
                    {novedad.foto && <img src={novedad.foto} alt="Foto de la novedad" className="mt-2 rounded" />}
                    <div className="flex justify-end items-center gap-4 mt-2">
                        <p className="text-gray-500 text-sm">{new Date(novedad.fecha).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <FormNovedades
                            initialData={novedadSeleccionada}
                            onClose={handleCloseModal}
                            mode="update"
                            actionLabel="Actualizar Novedad"
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default Novedad;
