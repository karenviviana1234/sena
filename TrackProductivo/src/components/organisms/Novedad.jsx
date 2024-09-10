import React, { useEffect, useState } from 'react';
import axiosClient from '../../configs/axiosClient';
import ButtonActualizar from '../atoms/ButtonActualizar';
import { Modal } from '@nextui-org/react';
import ModalActualizar from '../molecules/ModalActualizar';

function Novedad({ id_seguimiento }) {
    const [novedades, setNovedades] = useState([]);
    const [isMainModalOpen, setIsMainModalOpen] = useState(false); // Estado para el modal principal
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Estado para el modal de actualización
    const [selectedNovedad, setSelectedNovedad] = useState(null); // Estado para la novedad seleccionada

    useEffect(() => {
        if (id_seguimiento) {
            axiosClient.get(`/novedad/listar/${id_seguimiento}`)
                .then((response) => {
                    if (response.data) {
                        setNovedades(response.data);
                    } else {
                        console.error('La respuesta es undefined o vacía.');
                    }
                })
                .catch((error) => {
                    console.error('Error al obtener los datos:', error);
                });
        }
    }, [id_seguimiento]);

    const handleOpenMainModal = (novedad) => {
        setSelectedNovedad(novedad);
        setIsMainModalOpen(true);
    };

    const handleOpenUpdateModal = () => {
        setIsUpdateModalOpen(true);
    };

    const handleCloseMainModal = () => {
        setIsMainModalOpen(false);
        setSelectedNovedad(null);
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
    };

    return (
        <>
            {novedades.map((novedad) => (
                <div key={novedad.id_novedad} className="border shadow-medium rounded-2xl p-4 mb-4">
                    <div className="flex justify-between">
                        <div>
                            <h2 className="font-semibold text-lg">{novedad.instructor}:</h2>
                            <span className="text-gray-500 text-sm">Seguimiento: {novedad.seguimiento}</span>
                        </div>
                        <ButtonActualizar onClick={() => handleOpenMainModal(novedad)} />
                    </div>
                    <p className="text-sm mt-2">{novedad.descripcion}</p>
                    {novedad.foto && <img src={novedad.foto} alt="Foto de la novedad" className="mt-2 rounded" />}
                    <div className="flex justify-end items-center gap-4 mt-2">
                        <p className="text-gray-500 text-sm">{new Date(novedad.fecha).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}

            {/* Modal Principal */}
            {isMainModalOpen && (
                <Modal onClose={handleCloseMainModal}>
                    <h2 className="font-semibold text-lg">{selectedNovedad?.instructor}</h2>
                    <p>{selectedNovedad?.descripcion}</p>
                    {selectedNovedad?.foto && <img src={selectedNovedad.foto} alt="Foto de la novedad" className="rounded mt-2" />}
                    <ButtonActualizar onClick={handleOpenUpdateModal} />

                    {/* Modal de Actualización */}
                    {isUpdateModalOpen && (
                        <ModalActualizar onClose={handleCloseUpdateModal} novedad={selectedNovedad} />
                    )}
                </Modal>
            )}
        </>
    );
}

export default Novedad;
