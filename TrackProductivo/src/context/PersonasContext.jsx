import React, { createContext, useState, useCallback } from 'react';
import axiosClient from '../configs/axiosClient';

const PersonasContext = createContext();

export const PersonasProvider = ({ children }) => {
    const [personas, setPersonas] = useState([]);
    const [persona, setPersona] = useState([]);
    const [idPersona, setPersonaId] = useState([]);

    const getPersonas = useCallback(() => {
        try {
            axiosClient.get('/personas/listarA').then((response) => {
                console.log(response.data);
                setPersonas(response.data);
            });
        } catch (error) {
            console.log('Error del servidor: ' + error);
        }
    }, []);

    const getPersona = useCallback((id_persona) => {
        try {
            axiosClient.get(`/personas/buscar/${id_persona}`).then((response) => {
                console.log(response.data);
                setPersona(response.data);
            });
        } catch (error) {
            console.log('Error: ' + error);
        }
    }, []);

    const registrarInstructor = async (data) => {
        try {
            const response = await axiosClient.post('/personas/registrarI', data);
            console.log(response.data);
        } catch (error) {
            console.log('Error al registrar instructor: ' + error);
        }
    };

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
                getPersona,
                registrarInstructor
            }}
        >
            {children}
        </PersonasContext.Provider>
    );
};

export default PersonasContext;
