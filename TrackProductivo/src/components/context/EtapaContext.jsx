import React, { createContext, useState } from 'react'
import axiosClient from '../../configs/axiosClient.jsx'

const AsignacionContext = createContext()

export const AsignacionesProvider = ({ children }) => {

    const [asignaciones, setAsignaciones] = useState([])
    const [asignacion, setAsignacion] = useState([])
    const [idAsignacion, setAsignacionId] = useState([])

    const getAsignaciones = () => {
        try {
            axiosClient.get('/asignacion/listar').then((response) => {
                console.log(response.data)
                setAsignaciones(response.data)
            })
        } catch (error) {
            console.log('Error del servidor' + error);
        }
    }

    const getAsignacion = (id_asignacion) => {
        try {
            axiosClient.get(`/asignacion/buscar/${id_asignacion}`).then((response) => {
                console.log(response.data)
                setAsignacion(response.data)
            })
        } catch (error) {
            console.log('Error' + error) ;
        }
    }
  return (
    <AsignacionContext.Provider
        value={{
            asignaciones,
            asignacion,
            idAsignacion,
            setAsignaciones,
            setAsignacion,
            setAsignacionId,
            getAsignaciones,
            getAsignacion
        }}
    >
        {children}
    </AsignacionContext.Provider>
  )
}

export default AsignacionContext
