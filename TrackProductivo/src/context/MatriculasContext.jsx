import React, { createContext, useState } from 'react';
import axiosClient from '../configs/axiosClient';

const MatriculasContext = createContext();

export const MatriculasProvider = ({ children }) => {
    const [matriculas, setMatriculas] = useState([]);
    const [matricula, setMatricula] = useState(null); // Cambiado a null
    const [idMatricula, setMatriculaId] = useState(null); // Cambiado a null

    const getMatriculas = async () => {
        try {
            const response = await axiosClient.get('/matriculas/listar');
            console.log(response.data);
            setMatriculas(response.data);
        } catch (error) {
            console.log('Error del servidor: ' + error);
        }
    };

    

    const getMatricula = async (id) => {
        try {
            const response = await axiosClient.get(`/matriculas/buscar/${id}`);
            console.log(response.data);
            setMatricula(response.data);
        } catch (error) {
            console.log('Error: ' + error);
        }
    };

    return (
        <MatriculasContext.Provider
            value={{
                matriculas,
                matricula,
                idMatricula,
                setMatriculas,
                setMatricula,
                setMatriculaId,
                getMatriculas,
                getMatricula,
            }}
        >
            {children}
        </MatriculasContext.Provider>
    );
};

export default MatriculasContext;