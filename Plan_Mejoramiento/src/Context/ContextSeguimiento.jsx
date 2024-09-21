import React, { createContext, useState, useCallback } from 'react';
import axiosClient from '../configs/axiosClient';

const SeguimientosContext = createContext();

export const SeguimientosProvider = ({ children }) => {
    const [seguimientos, setSeguimientos] = useState([]);
    const [seguimiento, setSeguimiento] = useState([]);
    const [idSeguimiento, setSeguimientoId] = useState([]);

    const getSeguimientos = useCallback(() => {
        try {
            axiosClient.get('/seguimientos/listarA').then((response) => {
                console.log(response.data);
                setSeguimientos(response.data);
            });
        } catch (error) {
            console.log('Error del servidor' + error);
        }
    }, []); 

    const getSeguimiento = useCallback((id_seguimiento) => {
        try {
            axiosClient.get(`/buscar${id_seguimiento}`).then((response) => {
                console.log(response.data);
                setSeguimiento(response.data);
            });
        } catch (error) {
            console.log('Error' + error);
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
                getSeguimiento
            }}
        >
            {children}
        </SeguimientosContext.Provider>
    );
};

export default SeguimientosContext;
