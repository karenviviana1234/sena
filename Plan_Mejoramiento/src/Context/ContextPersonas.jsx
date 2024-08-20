import React, { createContext, useContext, useState } from 'react';
import axiosClient from '../axiosClient';


const ContextPersonas = createContext(); // Aquí creamos el contexto

export const usePersonas = () => useContext(ContextPersonas); // Custom hook para usar el contexto

export const PersonasProvider = ({ children }) => {
    const [personas, SetPersonas] = useState([]);
    const [persona, SetPersona] = useState({});
    const [id_persona, SetId_persona] = useState(null);
    const [rol, SetRol] = useState(null); //

    const getPersonas = async () => {
        try {
            const response = await axiosClient.get('/personas/listar');
            console.log(response.data);
            SetPersonas(response.data);
        } catch (error) {
            console.log('Error del servidor' + error);
        }
    };

    const getPersona = async (id_persona) => {
        try {
            const response = await axiosClient.get(`/personas/buscar/${id_persona}`);
            console.log(response.data);
            SetPersona(response.data);
            SetRol(response.data.rol)
        } catch (error) {
            console.log('Error del servidor' + error);
        }
    };

    return (
        <ContextPersonas.Provider
            value={{
                personas,
                persona,
                id_persona,
                rol,
                SetPersonas,
                SetPersona,
                SetId_persona,
                getPersonas,
                getPersona,
                SetRol
            }}
        >
            {children}
        </ContextPersonas.Provider>
    );
};

export default ContextPersonas;
