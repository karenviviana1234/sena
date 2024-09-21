import React, { useEffect, useState } from 'react';
import axiosClient from '../../configs/axiosClient';
import ModalAcciones from './ModalAcciones';
import FormNovedades from './FormNovedades';
import ButtonRegistrarActividad from '../atoms/ButtonRegistrarActividad';
import ButtonDesactivar from '../atoms/ButtonDesactivar';


const Novedades = ({ id_seguimiento }) => {
    const [novedades, setNovedades] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bodyContent, setBodyContent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedNovedad, setSelectedNovedad] = useState(null);
    const [seguimientos, setSeguimientos] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('');

    const [selectedSeguimiento, setSelectedSeguimiento] = useState(''); // Seguimiento seleccionado

    const handleOpenModal = (formType, novedad = null) => {
        if (formType === 'formNovedades') {
            setBodyContent(
                <FormNovedades
                    initialData={novedad}
                    id_seguimiento={selectedSeguimiento}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                    mode={'create'}
                    actionLabel={'Registrar Novedad'}
                />
            );
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedNovedad(null);
    };

    const handleSubmit = async () => {
        // Aquí puedes manejar el registro o actualización de la novedad
        console.log('Novedad guardada:', selectedNovedad);
        fetchData(); // Refrescar las novedades después de la acción
        handleCloseModal();
    };

    useEffect(() => {
        fetchData(); // Cargar todas las novedades al cargar el componente
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axiosClient.get(`/novedad/listarN`); // Obtener todas las novedades
            setNovedades(response.data || []);
        } catch (error) {
            console.error('Error al obtener las novedades:', error);
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleSeguimientoChange = (event) => {
        setSelectedSeguimiento(event.target.value);
    };

    const filteredNovedades = selectedSeguimiento
        ? novedades.filter((novedad) => novedad.seguimiento === selectedSeguimiento)
        : novedades;

    const desactivarNovedad = async (id_novedad) => {
        try {
            const response = await axiosClient.delete(`/novedad/eliminar/${id_novedad}`);
            if (response.status === 200) {
                // Eliminar la novedad de la lista local
                setNovedades(novedades.filter((novedad) => novedad.id_novedad !== id_novedad));
                alert('La novedad ha sido eliminada exitosamente.');
            } else {
                alert('Hubo un problema al eliminar la novedad.');
            }
        } catch (error) {
            alert('Error al intentar eliminar la novedad.');
            console.log(error);
        }
    };



    return (
        <div className="container mx-auto px-4 py-8">
            
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Lista de Novedades</h3>
                <ButtonRegistrarActividad
                    onClick={() => handleOpenModal('formNovedades')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                />
            </div>

            {/* Filtro por seguimiento */}
            <div className="mb-6">
                <select
                    id="seguimiento"
                    name="seguimiento"
                    className="w-full pl-2 pr-10 py-2 text-sm border-2 rounded-lg border-gray-200 hover:border-gray-400 shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => setSelectedSeguimiento(e.target.value)}
                    value={selectedSeguimiento}
                >
                    <option value="">Todos los seguimientos</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
            </div>
            

            <div className="space-y-6">
                {filteredNovedades.map((novedad) => (
                    <div key={novedad.id_novedad} className="bg-white shadow-md rounded-lg p-4 relative">
                        <h4 className="text-xl font-semibold mb-2">{novedad.instructor}</h4>
                        <p className="text-sm text-gray-600">Descripción: {novedad.descripcion}</p>
                        <p className="text-sm text-gray-600">Seguimiento: {novedad.seguimiento}</p>
                        {novedad.foto && (
                            <img
                                src={novedad.foto}
                                alt={`Foto de ${novedad.instructor}`}
                                className="mt-2 rounded w-full max-h-40 object-cover"
                            />
                        )}
                        <p className="text-sm text-gray-600 mt-2">Fecha: {new Date(novedad.fecha).toLocaleDateString()}</p>
                        <div className="absolute top-2 right-2">
                            <ButtonDesactivar onClick={() => desactivarNovedad(novedad.id_novedad)} />
                        </div>
                    </div>
                ))}
            </div>

            <ModalAcciones isOpen={isModalOpen} onClose={handleCloseModal} bodyContent={bodyContent} />
        </div>
    );
};

export default Novedades;