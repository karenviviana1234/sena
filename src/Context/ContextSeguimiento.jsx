import React, { createContext, useState, useCallback } from 'react';
import axiosClient from '../axiosClient';

const SeguimientosContext = createContext();

// Proveedor del contexto
export const SeguimientosProvider = ({ children }) => {
    const [seguimientos, setSeguimientos] = useState([]);
    const [seguimiento, setSeguimiento] = useState([]);
    const [idSeguimiento, setSeguimientoId] = useState(null);

    // Función para obtener todos los seguimientos
    const getSeguimientos = useCallback(async () => {
        try {
            const response = await axiosClient.get('/seguimientos/listarA');
            console.log(response.data);
            setSeguimientos(response.data);
        } catch (error) {
            console.log('Error del servidor: ' + error);
        }
    }, []);

    // Función para obtener un seguimiento por ID
    const getSeguimiento = useCallback(async (id_seguimiento) => {
        try {
            const response = await axiosClient.get(`/buscar${id_seguimiento}`);
            console.log(response.data);
            setSeguimiento(response.data);
        } catch (error) {
            console.log('Error: ' + error);
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
