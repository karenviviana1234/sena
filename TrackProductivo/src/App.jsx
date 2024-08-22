import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Users, BookMarked, BookUser, Building2, GraduationCap, FolderSearch2, UserCheck ,BookText } from 'lucide-react';
import Sidebar, { SidebarItem, SidebarAccordion } from './components/Sidebar';
import { LoginPage } from '../src/components/pages/LoginPage';
import { Navbar2 } from './components/Navbar';
<<<<<<< HEAD
import GlobalProvider from './components/context/GlobalContext';




// Lazy load the pages
// las rutas de todos los modulos [tengo que crear la vista y ubicarlas en el sliderbar]
//son los modulos de la base de datos pero vamos a dividir en secciones 

import HomePage from './components/pages/HomePage';
const NominaPage = lazy(() => import('./components/pages/NominaPage'));
const FichasPage = lazy(() => import('./components/pages/FichasPage'));
const MatriculasPage = lazy(() => import('./components/pages/MatriculasPage'));
const EmpresaPage = lazy(() => import('./components/pages/EmpresaPage'));
 import { EtapaPracticaPage } from './components/pages/EtapaPracticaPage';
import Registro from './components/pages/RegistroPage';
const ReportesPage = lazy(() => import('./components/pages/ReportesPage'));
const EstadisticasPage = lazy(() => import('./components/pages/EstadisticasPage'));
const BitacorasPage = lazy(() => import('./components/pages/BitacorasPage'));
=======
import GlobalProvider from './context/GlobalContext';

// Importa las páginas directamente
import NominaPage  from './components/pages/NominaPage.jsx';
import FichasPage from './components/pages/FichasPage.jsx';
import MatriculasPage from './components/pages/MatriculasPage.jsx';
import EmpresaPage from './components/pages/EmpresaPage.jsx';
import SeguimientoPage from './components/pages/SeguimientoPage.jsx';
import EstadisticasPage from './components/pages/EstadisticasPage.jsx';
import EtapaPracticaPage from './components/pages/EtapaPracticaPage.jsx';
import HomePage from './components/pages/HomePage.jsx';
import ReportesPage from './components/pages/ReportesPage.jsx';
import AsignacionesPage from './components/pages/AsignacionesPage.jsx';
>>>>>>> 9e2bcc2848340c7e97565f9908d2bd0216959937

export const App = () => {
  return (

    <BrowserRouter>
<<<<<<< HEAD
    <GlobalProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<div>Loading...</div>}>
=======
      <GlobalProvider>
        <Routes>
          <Route path="/" element={
              <WithSidebar>
>>>>>>> 9e2bcc2848340c7e97565f9908d2bd0216959937
                <HomePage />
              </WithSidebar>
          } />

<<<<<<< HEAD


        <Route path="/nomina" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<div>Loading...</div>}>
=======
          <Route path="/nomina" element={
              <WithSidebar>
>>>>>>> 9e2bcc2848340c7e97565f9908d2bd0216959937
                <NominaPage />
              </WithSidebar>
          } />

          <Route path="/fichas" element={
              <WithSidebar>
                <FichasPage />
              </WithSidebar>
          } />

          <Route path="/matriculas" element={
              <WithSidebar>
                <MatriculasPage />
              </WithSidebar>
          } />
           <Route path="/asignaciones" element={
              <WithSidebar>
                <AsignacionesPage />
              </WithSidebar>
          } />

          <Route path="/empresa" element={
              <WithSidebar>
                <EmpresaPage />
              </WithSidebar>
          } />

          <Route path="/etapapractica" element={
              <WithSidebar>
                <EtapaPracticaPage />
              </WithSidebar>
          } />

          <Route path="/seguimiento" element={
              <WithSidebar>
                <SeguimientoPage />
              </WithSidebar>
          } />

          <Route path="/estadisticas" element={
              <WithSidebar>
                <EstadisticasPage />
              </WithSidebar>
          } />

<Route path="/reportes" element={
              <WithSidebar>
                <ReportesPage />
              </WithSidebar>
          } />

<<<<<<< HEAD

      </Routes>
=======
        </Routes>
>>>>>>> 9e2bcc2848340c7e97565f9908d2bd0216959937
      </GlobalProvider>
    </BrowserRouter>
  );
};

const WithSidebar = ({ children }) => (
  <div className="flex">
    <Sidebar>
      {/* estas son las secciones de el rol de Coordinador */}
      <SidebarItem nav="/" icon={<Home size={20} />} text="Home" />
      <SidebarItem nav="/nomina" icon={<Users size={20} />} text="Nomina" />
      <SidebarItem nav="/fichas" icon={<BookMarked size={20} />} text="Fichas" />
      <SidebarItem nav="/matriculas" icon={<BookUser size={20} />} text="Matriculas" />
      <SidebarItem nav="/asignaciones" icon={<UserCheck size={20} />} text="Asignaciones" />
      <SidebarItem nav="/empresa" icon={<Building2 size={20} />} text="Empresa" />
      <SidebarItem nav="/etapapractica" icon={<GraduationCap size={20} />} text="Etapa Practica" />

      <SidebarItem nav="/seguimiento" icon={<FolderSearch2 size={20} />} text="Seguimineto" />
      <SidebarItem nav="/reportes" icon={<BookText size={20} />} text="Reportes" />
      <SidebarItem nav="/estadisticas" text="Estadisticas" />


      {/* <SidebarAccordion icon={<FolderSearch2 size={20} />} text="Seguimientos">
      
      </SidebarAccordion> */}
      {/* fin de secciones de el rol de Coordinador */}
    </Sidebar>
    <div className="w-full bg-white h-screen overflow-auto">
      <Navbar2 />
      {children}
    </div>
  </div>
);
