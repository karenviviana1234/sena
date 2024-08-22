import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Users ,BookMarked,BookUser ,Building2 ,GraduationCap  ,  FolderSearch2, BookPlus, BookPlusIcon   } from "lucide-react";
import Sidebar, { SidebarItem, SidebarAccordion } from "./components/Sidebar";
import { LoginPage } from '../src/components/pages/LoginPage';
import { ProtectedRoute } from './configs/ProtectedRoute';
import { Navbar2 } from './components/Navbar';
import GlobalProvider from './context/GlobalContext';





// Lazy load the pages
// las rutas de todos los modulos [tengo que crear la vista y ubicarlas en el sliderbar]
//son los modulos de la base de datos pero vamos a dividir en secciones 

const NominaPage = lazy(() => import('./components/pages/NominaPage'));
const FichasPage = lazy(() => import('./components/pages/FichasPage'));
const MatriculasPage = lazy(() => import('./components/pages/MatriculasPage'));
const EmpresaPage = lazy(() => import('./components/pages/EmpresaPage'));
import ReportesPage from './components/pages/ReportesPage.jsx'
const EstadisticasPage = lazy(() => import('./components/pages/EstadisticasPage'));
const EtapaPracticaPage = lazy(() => import('./components/pages/EtapaPracticaPage'));
const BitacorasPage = lazy(() => import('./components/pages/BitacorasPage'));

export const App = () => {
  // las paginas de cada seccion son su respectiva ruta
  return (

    <BrowserRouter>
    <GlobalProvider>
      <Routes>
        

        <Route path="/nomina" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<div>Loading...</div>}>
                <NominaPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />
        
        <Route path="/fichas" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<div>Loading...</div>}>
                <FichasPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />

        <Route path="/matriculas" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<div>Loading...</div>}>
                <MatriculasPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />

        <Route path="/empresa" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<div>Loading...</div>}>
                <EmpresaPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />

        <Route path="/etapapractica" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<div>Loading...</div>}>
                <EtapaPracticaPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />

        <Route path="/reportes" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<div>Loading...</div>}>
              <ReportesPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />
  
       <Route path="/estadisticas" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<div>Loading...</div>}>
                <EstadisticasPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />
      <Route path="/bitacoras" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<div>Loading...</div>}>
                <BitacorasPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />



      </Routes>
      </GlobalProvider>
    </BrowserRouter>
  );
};

const WithSidebar = ({ children }) => (
  <div className="flex">
    <Sidebar>
      {/* estas son las secciones de el rol de Coordinador  */}
      <SidebarItem nav="/nomina" icon={<Users  size={20} />} text="Nomina" />
      <SidebarItem nav="/fichas" icon={<BookMarked  size={20} />} text="Fichas" />
      <SidebarItem nav="/matriculas" icon={<BookUser  size={20} />} text="Matriculas" />
      <SidebarItem nav="/empresa" icon={<Building2  size={20} />} text="Empresa" />
      <SidebarItem nav="/etapapractica" icon={<GraduationCap   size={20} />} text="Etapa Practica" />
      <SidebarItem nav="/bitacoras" icon={<BookPlus    size={20} />} text="Bitacoras" />

      <SidebarAccordion icon={<FolderSearch2  size={20} />} text="Seguimientos">
        <SidebarItem nav="/reportes" text="Reportes" /> 
        <SidebarItem nav="/estadisticas" text="Estadisticas" />
      </SidebarAccordion>
      {/* fin de secciones de el rol de Coordinador */}




    </Sidebar>
    <div className='w-full bg-white h-screen overflow-auto'>
      <Navbar2 />
      {children}
    </div>
  </div>
);