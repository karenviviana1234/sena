import React, { createContext } from 'react'
import { SeguimientosProvider } from './SeguimientosContext'
import { PersonasProvider } from './PersonasContext'
import { NovedadesProvider } from './NovedadContext'
import { AsignacionProvider } from './AsignacionesContext'


export const GlobalContext = createContext()

const GlobalProvider = ({ children }) => {

    const globalContextValue = {}

    return (
        <GlobalContext.Provider value={globalContextValue}>
            <NovedadesProvider>
                <AsignacionProvider>
                    <SeguimientosProvider>
                        <PersonasProvider>
                            {children}
                        </PersonasProvider>
                    </SeguimientosProvider>
                </AsignacionProvider>
            </NovedadesProvider>
        </GlobalContext.Provider>
    )
}

export default GlobalProvider
