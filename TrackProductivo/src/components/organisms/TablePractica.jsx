import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@nextui-org/react";
import ModalProductiva from './ModalRegisterEtapa';
import axiosClient from '../../configs/axiosClient';

function TableProductiva() {
    const [productivas, setProductivas] = useState([]);
    const [selectedProductiva, setSelectedProductiva] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchProductivas();
    }, []);

    const fetchProductivas = async () => {
        try {
            const response = await axiosClient.get('/productiva/listar');
            setProductivas(response.data);
        } catch (error) {
            console.error('Error fetching productivas:', error);
        }
    };

    const handleOpenModal = (productiva) => {
        setSelectedProductiva(productiva);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProductiva(null);
    };

    const handleSaveProductiva = async (productiva) => {
        if (selectedProductiva) {
            await axiosClient.put(`/productiva/actualizar/${selectedProductiva.id_productiva}`, productiva);
        } else {
            await axiosClient.post('/productiva/registrar', productiva);
        }
        fetchProductivas();
        handleCloseModal();
    };

    const handleRenunciarProductiva = async (productId) => {
        const confirmacion = window.confirm(`¿Estás seguro de querer renunciar la productiva ${productId}?`);
        if (confirmacion) {
            await axiosClient.put(`/productiva/renunciar/${productId}`);
            fetchProductivas();
        }
    };

    const handleTerminarProductiva = async (productId) => {
        const confirmacion = window.confirm(`¿Estás seguro de querer terminar la productiva ${productId}?`);
        if (confirmacion) {
            await axiosClient.put(`/productiva/terminar/${productId}`);
            fetchProductivas();
        }
    };

    const columns = [
        { key: "matricula", label: "Matrícula" },
        { key: "empresa", label: "Empresa" },
        { key: "fecha_inicio", label: "Fecha de inicio" },
        { key: "fecha_fin", label: "Fecha de fin" },
        { key: "alternativa", label: "Alternativa" },
        { key: "aprendiz", label: "Aprendiz" },
        { key: "instructor", label: "Instructor" },
        { key: "estado", label: "Estado" },
        { key: "acciones", label: "Acciones" },
    ];

    return (
        <>
            <div>
                <Table aria-label="Productivas">
                    <TableHeader>
                        {columns.map((column) => (
                            <TableColumn key={column.key}>{column.label}</TableColumn>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {productivas.map((productiva) => (
                            <TableRow key={productiva.id_productiva}>
                                <TableCell>{productiva.matricula}</TableCell>
                                <TableCell>{productiva.empresa}</TableCell>
                                <TableCell>{productiva.fecha_inicio}</TableCell>
                                <TableCell>{productiva.fecha_fin}</TableCell>
                                <TableCell>{productiva.alternativa}</TableCell>
                                <TableCell>{productiva.aprendiz}</TableCell>
                                <TableCell>{productiva.instructor}</TableCell>
                                <TableCell>{productiva.estado}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpenModal(productiva)} size="sm" color="primary">
                                        Editar
                                    </Button>
                                    {' '}
                                    {(productiva.estado === 1) && (
                                        <>
                                            <Button onClick={() => handleRenunciarProductiva(productiva.id_productiva)} size="sm" color="danger">
                                                Renunciar
                                            </Button>
                                            <Button onClick={() => handleTerminarProductiva(productiva.id_productiva)} size="sm" color="success">
                                                Terminar
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <ModalProductiva
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                productiva={selectedProductiva}
                onSave={handleSaveProductiva}
            />
        </>
    );
}

export default TableProductiva;
