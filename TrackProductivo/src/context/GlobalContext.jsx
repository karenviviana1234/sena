import React, { createContext } from 'react'
import { SeguimientosProvider } from './SeguimientosContext'
import { PersonasProvider } from './PersonasContext'
import { NovedadesProvider } from './NovedadContext'
import { AsignacionProvider } from './AsignacionesContext'
import { MatriculasProvider } from './MatriculasContext'


export const GlobalContext = createContext()

const GlobalProvider = ({ children }) => {

    const globalContextValue = {}

    return (
        <GlobalContext.Provider value={globalContextValue}>
            <NovedadesProvider>
                <AsignacionProvider>
                    <MatriculasProvider>
                        <SeguimientosProvider>
                            <PersonasProvider>

                                {children}
                            </PersonasProvider>
                        </SeguimientosProvider>
                    </MatriculasProvider>
                </AsignacionProvider>
            </NovedadesProvider>
        </GlobalContext.Provider>
    )
}

export default GlobalProvider
