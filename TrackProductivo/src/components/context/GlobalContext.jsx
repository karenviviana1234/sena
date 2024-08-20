import React, { createContext } from 'react'

import { UsuarioProvider } from './UsuariosContext'


export const GlobalContext = createContext()

const GlobalProvider = ({ children }) => {

    const globalContextValue = {}

    return (
        <GlobalContext.Provider value={globalContextValue}>

            <UsuarioProvider>

                {children}
            </UsuarioProvider>

        </GlobalContext.Provider>
    )
}

export default GlobalProvider
