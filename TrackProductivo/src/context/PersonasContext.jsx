import React, { createContext, useState, useCallback } from 'react';
import axiosClient from '../configs/axiosClient';

const PersonasContext = createContext();

export const PersonasProvider = ({ children }) => {
    const [personas, setPersonas] = useState([]);
    const [persona, setPersona] = useState([]);
    const [idPersona, setPersonaId] = useState([]);

    const getPersonas = useCallback(() => {
        try {
            axiosClient.get('/personas/listar').then((response) => {
                console.log(response.data);
                setPersona(response.data);
            });
        } catch (error) {
            console.log('Error del servidor' + error);
        }
    }, []); // Dependencias vacías para que la función no cambie

    // Memoriza la función para evitar cambios innecesarios de referencia
    const getPersona = useCallback((id_persona) => {
        try {
            axiosClient.get(`/buscar${id_persona}`).then((response) => {
                console.log(response.data);
                setPersona(response.data);
            });
        } catch (error) {
            console.log('Error' + error);
        }
    }, []); // Dependencias vacías para que la función no cambie

    return (
        <PersonasContext.Provider
            value={{
                personas,
                persona,
                idPersona,
                setPersonas,
                setPersona,
                setPersonaId,
                getPersonas,
                getPersona
            }}
        >
            {children}
        </PersonasContext.Provider>
    );
};

export default PersonasContext;
