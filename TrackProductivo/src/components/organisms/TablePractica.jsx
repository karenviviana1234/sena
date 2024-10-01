import React, { useState, useContext, useMemo } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Modal, Input } from "@nextui-org/react";
import FormEtapaPractica from '../molecules/Productivas/FormEtapaPractica';
import useEtapaPractica from '../../context/useEtapaPractica';
import PersonasContext from '../../context/PersonasContext';
import ButtonActualizar from '../atoms/ButtonActualizar';
import ModalAcciones from '../molecules/ComponentsGlobals/ModalAcciones';

function TablePractica() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [initialData, setInitialData] = useState(null);

    const {
        etapas,
        isOpenModalRegistro,
        setIsOpenModalRegistro,
        isOpenModalEditar,
        setIsOpenModalEditar,
        handleSubmitRegistro,
        handleSubmitEditar,
        selectedEtapa,
        setSelectedEtapa,
    } = useEtapaPractica();

    const { aprendices } = useContext(PersonasContext);

    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const handleOpenModal = (formType, data = null) => {
        if (formType === 'productiva') {
            setModalContent(
                <FormEtapaPractica
                    initialData={data}
                    onSubmit={handleFormPracticaSubmit}
                    onClose={handleCloseModal}
                    mode={data ? 'update' : 'create'}
                />
            );
        }
        setModalOpen(true);
    };

    const handleCloseModal = async () => {
        setModalOpen(false);
        setInitialData(null);
        setModalContent(null);
        await peticionGet();
    };

    const handleFormPracticaSubmit = async (formData) => {
        try {
            // Verifica que id_asignacion esté presente en formData antes de realizar la operación
            if (formData.id_productiva) {
                const response = await axiosClient.put(`/productiva/actualizar/${formData.id_productiva}`, formData);
                console.log('Respuesta del servidor:', response.data);
            } else {
                const response = await axiosClient.post('/productiva/registrar', formData);
                console.log('Respuesta del servidor:', response.data);
            }
            handleCloseModal();
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggle = (initialData) => {
        if (initialData) {
            setInitialData(initialData);
            setInitialData(initialData.id_productiva); // Asegúrate que este ID exista
            handleOpenModal('productiva', initialData);
        }
    };

    const handleEditEtapa = (etapa) => {
        setSelectedEtapa(etapa);
        setIsOpenModalEditar(true);
    };

    const renderActions = (etapa) => (
        <div className="flex gap-2">
            <ButtonActualizar onClick={() => handleToggle(etapa)}>Editar</ButtonActualizar>
        </div>
    );
    
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEtapas = useMemo(() => {
        if (!searchTerm.trim()) return etapas;

        return etapas.filter(etapa => {
            const aprendizName = aprendices.find(a => a.id === etapa.aprendiz_id)?.nombres || 'No asignado';
            const etapaId = etapa.id_productiva;

            return (
                aprendizName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                etapaId.toString().includes(searchTerm)
            );
        });
    }, [etapas, searchTerm]);

    return (
        <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Etapas Prácticas</h2>
                <div className="flex gap-2">
                    <Input
                        placeholder="Buscar por aprendiz o ID"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                    />
                </div>
            </div>

            <Button 
            className="bg-[#0d324c] text-white font-bold py-2 px-4 rounded-xl mb-4" 
            onClick={() => handleOpenModal('productiva')}>Registrar nueva etapa</Button>

{/*             <Modal open={isOpenModalRegistro} onClose={() => setIsOpenModalRegistro(false)} className="max-w-md" >
                <FormEtapaPractica
                    open={isOpenModalRegistro}
                    onClose={() => setIsOpenModalRegistro(false)}
                    onSubmit={handleSubmitRegistro}
                />
            </Modal>

            <Modal open={isOpenModalEditar} onClose={() => setIsOpenModalEditar(false)} className="max-w-md">
                <FormEtapaPractica
                    open={isOpenModalEditar}
                    onClose={() => setIsOpenModalEditar(false)}
                    onSubmit={handleSubmitEditar}
                    initialValues={selectedEtapa}
                />
            </Modal> */}

            <Table aria-label="Table with dynamic content height" className="w-full">
                <TableHeader className="bg-gray-100">
                    <TableColumn>ID</TableColumn>
                    <TableColumn>Ficha</TableColumn>
                    <TableColumn>Empresa</TableColumn>
                    <TableColumn>Fecha Inicio</TableColumn>
                    <TableColumn>Fecha Fin</TableColumn>
                    <TableColumn>Estado</TableColumn>
                    <TableColumn>Aprendiz</TableColumn>
                    <TableColumn>Instructor</TableColumn>
                    <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody items={filteredEtapas}>
                    {(item) => (
                        <TableRow key={item.id_productiva}>
                            <TableCell>{item.id_productiva}</TableCell>
                            <TableCell>{item.ficha}</TableCell>
                            <TableCell>{item.empresa?.razon_social || 'Sin empresa'}</TableCell>
                            <TableCell>{formatDate(item.fecha_inicio)}</TableCell>
                            <TableCell>{formatDate(item.fecha_fin)}</TableCell>
                            <TableCell>{item.estado}</TableCell>
                            <TableCell>
                                {item.aprendiz_id ? (
                                    aprendices.find(a => a.id === item.aprendiz_id)?.ficha || 'No asignada'
                                ) : (
                                    'No asignado'
                                )}
                            </TableCell>
                            <TableCell>{item.instructor?.nombres || 'Sin instructor'}</TableCell>
                            <TableCell>{renderActions(item)}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <ModalAcciones
                isOpen={modalOpen}
                onClose={handleCloseModal}
                title={initialData ? "Actualizar Productiva" : "Registrar Productiva"}
                bodyContent={modalContent}
            />
        </div>
    );
}

export default TablePractica;