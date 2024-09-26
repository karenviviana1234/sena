import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Users, BookMarked, BookUser, Building2, GraduationCap, FolderSearch2, UserCheck, BookText, BarChart3Icon } from 'lucide-react';
import Sidebar, { SidebarItem, SidebarAccordion } from './components/Sidebar';
import { LoginPage } from '../src/components/pages/LoginPage';
import { Navbar2 } from './components/Navbar';
import GlobalProvider from './context/GlobalContext';

// Importa las páginas directamente

import FichasPage from './components/pages/FichasPage.jsx';
import NominaPage from './components/pages/NominaPage.jsx';
import MatriculasPage from './components/pages/MatriculasPage.jsx';

import SeguimientoPage from './components/pages/SeguimientoPage.jsx';
import EstadisticasPage from './components/pages/EstadisticasPage.jsx';
import EtapaPracticaPage from './components/pages/EtapaPracticaPage.jsx';
import HomePage from './components/pages/HomePage.jsx';
import ReportesPage from './components/pages/ReportesPage.jsx';
import AsignacionPage from './components/pages/AsignacionPage.jsx';
import Registro from './components/pages/RegistroPage.jsx';

export const App = () => {
  return (
    <BrowserRouter>
      <GlobalProvider>

        <Routes>
          <Route path='/' element={
            <LoginPage />
          } />
           <Route path='/registro' element={
            <Registro />
          } />
          <Route path="/home" element={
            <WithSidebar>
              <HomePage />
            </WithSidebar>
          } />

          <Route path="/nomina" element={
            <WithSidebar>
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
              <AsignacionPage />
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

        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  );
};

export function WithSidebar({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [userRol, setUserRol] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.cargo);
        setUserRol(user.rol);
      } catch (error) {
        console.error("Error al parsear el JSON del usuario:", error);
      }
    }
  }, []);


  return (
    <div className="flex">
      <Sidebar>
        <SidebarItem nav="/" icon={<Home size={20} />} text="Home" />
        {(userRole !== 'Instructor' && userRole !== 'Aprendiz') && (
          <SidebarItem nav="/nomina" icon={<Users size={20} />} text="Instructores" />
        )}
        {(userRole !== 'Aprendiz' && userRol !== 'Instructor') && (
          <SidebarItem nav="/fichas" icon={<BookMarked size={20} />} text="Fichas" />
        )}
        {(userRole !== 'Aprendiz' && userRol !== 'Instructor') && (
          <SidebarItem nav="/matriculas" icon={<BookUser size={20} />} text="Matriculas" />
        )}
       {/*  {(userRole !== 'Aprendiz' && userRol !== 'Instructor') && (
        <SidebarItem nav="/empresa" icon={<Building2 size={20} />} text="Empresa" />
        )} */}
        {(userRole !== 'Aprendiz'  && userRol !== 'Instructor') && (
        <SidebarItem nav="/etapapractica" icon={<GraduationCap size={20} />} text="Etapa Practica" />
        )}
        <SidebarItem nav="/seguimiento" icon={<FolderSearch2 size={20} />} text="Seguimiento" />
        {(userRole !== 'Instructor' && userRole !== 'Aprendiz') && (
          <SidebarItem nav="/estadisticas" icon={<BarChart3Icon size={20} />} text="Estadisticas" />
        )}
        {/* fin de secciones de el rol de Coordinador */}
      </Sidebar>
      <div className="w-full bg-white h-screen overflow-auto">
        <Navbar2 />
        {children}
      </div>
    </div>
  );
}