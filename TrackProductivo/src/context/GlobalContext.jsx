import React, { createContext } from 'react'
import { SeguimientosProvider } from './SeguimientosContext'
import { PersonasProvider } from './PersonasContext'


export const GlobalContext = createContext()

const GlobalProvider = ({ children }) => {

    const globalContextValue = {}

    return (
        <GlobalContext.Provider value={globalContextValue}>
                <SeguimientosProvider>
                    <PersonasProvider>

                        {children}
                    </PersonasProvider>
                </SeguimientosProvider>
        </GlobalContext.Provider>
    )
}

export default GlobalProvider
