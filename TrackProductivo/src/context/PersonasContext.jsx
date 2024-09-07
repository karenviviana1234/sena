import React, { createContext, useState, useCallback, useEffect } from 'react';
import axiosClient from '../configs/axiosClient';
import PropTypes from 'prop-types';

const PersonasContext = createContext();

export const PersonasProvider = ({ children }) => {
    const [personas, setPersonas] = useState([]);
    const [persona, setPersona] = useState(null);
    const [idPersona, setPersonaId] = useState(null);

    const getPersonas = useCallback(() => {
        axiosClient.get('/personas/listarA')
            .then((response) => {
                console.log(response.data);
                setPersonas(response.data);
            })
            .catch((error) => {
                console.log('Error del servidor: ', error);
            });
    }, []);

    const getPersona = useCallback((id_persona) => {
        if (!id_persona) return; // Validación básica
        axiosClient.get(`/personas/buscar/${id_persona}`)
            .then((response) => {
                console.log(response.data);
                setPersona(response.data);
            })
            .catch((error) => {
                console.log('Error al buscar persona: ', error);
            });
    }, []);

    const registrarInstructor = async (data) => {
        try {
            const response = await axiosClient.post('/personas/registrarI', data);
            console.log('Instructor registrado:', response.data);
            // Actualizar la lista de personas después de un registro exitoso
            getPersonas();
        } catch (error) {
            console.log('Error al registrar instructor: ', error);
        }
    };

    useEffect(() => {
        getPersonas();
    }, []); // Cargar personas cuando el componente monta

    return (
        <PersonasContext.Provider value={{
            personas,
            persona,
            idPersona,
            setPersonas,
            setPersona,
            setPersonaId,
            getPersonas,
            getPersona,
            registrarInstructor
        }}>
            {children}
        </PersonasContext.Provider>
    );
};


PersonasProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default PersonasContext;
