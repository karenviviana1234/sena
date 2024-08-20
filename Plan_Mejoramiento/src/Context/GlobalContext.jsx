import React, { createContext } from 'react';
import { PersonasProvider } from './ContextPersonas';

export const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
    const globalContextValue = {};

    return (
        <GlobalContext.Provider value={globalContextValue}>
            <PersonasProvider>
                {children}
            </PersonasProvider>
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;

