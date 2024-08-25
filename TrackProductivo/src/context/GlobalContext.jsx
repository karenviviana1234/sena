import React, { createContext } from 'react'
import { SeguimientosProvider } from './SeguimientosContext'
import { PersonasProvider } from './PersonasContext'
import { AsignacionesProvider } from './AsignacionContext'


export const GlobalContext = createContext()

const GlobalProvider = ({ children }) => {

    const globalContextValue = {}

    return (
        <GlobalContext.Provider value={globalContextValue}>
            <AsignacionesProvider>
                <SeguimientosProvider>
                    <PersonasProvider>

                        {children}
                    </PersonasProvider>
                </SeguimientosProvider>
            </AsignacionesProvider>
        </GlobalContext.Provider>
    )
}

export default GlobalProvider
