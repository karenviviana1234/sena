import React, { createContext, useState, useCallback } from 'react';
import axiosClient from '../axiosClient';

const SeguimientosContext = createContext();

export const SeguimientosProvider = ({ children }) => {
    const [seguimientos, setSeguimientos] = useState([]);
    const [seguimiento, setSeguimiento] = useState(null);
    const [idSeguimiento, setSeguimientoId] = useState(null);

    const getSeguimientos = useCallback(async () => {
        try {
            const response = await axiosClient.get('/seguimientos/listarA');
            console.log(response.data);
            setSeguimientos(response.data);
        } catch (error) {
            console.error('Error del servidor: ' + error);
        }
    }, []);

    const getSeguimiento = useCallback(async (id_seguimiento) => {
        try {
            const response = await axiosClient.get(`/buscar/${id_seguimiento}`);
            console.log(response.data);
            setSeguimiento(response.data);
            setSeguimientoId(id_seguimiento); // Guardamos el ID del seguimiento
        } catch (error) {
            console.error('Error al obtener el seguimiento: ' + error);
        }
    }, []);

    return (
        <SeguimientosContext.Provider
            value={{
                seguimientos,
                seguimiento,
                idSeguimiento,
                setSeguimientos,
                setSeguimiento,
                setSeguimientoId,
                getSeguimientos,
                getSeguimiento,
            }}
        >
            {children}
        </SeguimientosContext.Provider>
    );
};

export default SeguimientosContext;