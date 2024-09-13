import React, { useEffect, useState } from 'react';
import axiosClient from '../../configs/axiosClient';
import ButtonActualizar from '../atoms/ButtonActualizar';
import FormNovedades from './FormNovedades';

function Novedad({ id_seguimiento }) {
    const [novedades, setNovedades] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNovedad, setSelectedNovedad] = useState(null);

    useEffect(() => {
        const fetchNovedades = async () => {
            if (!id_seguimiento) return;

            try {
                const response = await axiosClient.get(`/novedad/listar/${id_seguimiento}`);
                setNovedades(response.data || []);
            } catch (error) {
                console.error('Error al obtener las novedades:', error);
            }
        };

        fetchNovedades();
    }, [id_seguimiento]);

    const handleActualizarClick = (novedad) => {
        setSelectedNovedad(novedad);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedNovedad(null);
    };

    const handleSubmit = async () => {
        // Aquí puedes agregar la lógica para manejar la actualización exitosa
        console.log('Novedad actualizada:', selectedNovedad);
        handleCloseModal();
        // Puedes refrescar las novedades aquí si es necesario
    };

    return (
        <>
            {novedades.map((novedad) => (
                <div key={novedad.id_novedad} className="flex-1 border shadow-medium rounded-2xl p-4 mb-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="font-semibold text-lg">{novedad.instructor}</h2>
                            <span className="text-gray-500 text-sm">Seguimiento: {novedad.seguimiento}</span>
                        </div>
                        <ButtonActualizar onClick={() => handleActualizarClick(novedad)} />
                    </div>
                    <p className="text-sm mt-2">{novedad.descripcion}</p>
                    {novedad.foto && (
                        <img src={novedad.foto} alt={`Foto de ${novedad.instructor}`} className="mt-2 rounded w-full max-h-40 object-cover" />
                    )}
                    <div className="flex justify-end items-center gap-4 mt-2 text-xs">
                        <span>{new Date(novedad.fecha).toLocaleDateString()}</span>
                    </div>
                </div>
            ))}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                        <FormNovedades
                            initialData={selectedNovedad}
                            onClose={handleCloseModal}
                            onSubmit={handleSubmit}
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
