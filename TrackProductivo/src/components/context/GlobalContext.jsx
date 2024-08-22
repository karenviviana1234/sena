import React, { createContext } from 'react'
import { AsignacionesProvider } from './EtapaContext'


export const GlobalContext = createContext()

const GlobalProvider = ({ children }) => {

    const globalContextValue = {}

    return (
        <GlobalContext.Provider value={globalContextValue}>

            <AsignacionesProvider>

                {children}
            </AsignacionesProvider>

        </GlobalContext.Provider>
    )
}

export default GlobalProvider
