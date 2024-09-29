import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Users, BookMarked, BookUser, Building2, GraduationCap, FolderSearch2, UserCheck, BookText, BarChart3Icon } from 'lucide-react';
import Sidebar, { SidebarItem, SidebarAccordion } from './components/Sidebar';
import { LoginPage } from '../src/components/pages/LoginPage';
import { Navbar2 } from './components/Navbar';
import GlobalProvider from './context/GlobalContext';
<<<<<<< HEAD
import ProtectedRoute from './configs/ProtectedRoute.jsx';
=======
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

// Importa las páginas directamente

import FichasPage from './components/pages/FichasPage.jsx';
import NominaPage from './components/pages/NominaPage.jsx';
import MatriculasPage from './components/pages/MatriculasPage.jsx';
<<<<<<< HEAD

=======
import EmpresaPage from './components/pages/EmpresaPage.jsx';
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
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
<<<<<<< HEAD
          <Route path='/registro' element={
            <Registro />
          } />
          <Route path="/home" element={
            <ProtectedRoute>
              <WithSidebar>
                <HomePage />
              </WithSidebar>
            </ProtectedRoute>
          }
          />

          <Route path="/nomina" element={
            <ProtectedRoute>
              <WithSidebar>
                <NominaPage />
              </WithSidebar>
            </ProtectedRoute>

          } />

          <Route path="/fichas" element={
            <ProtectedRoute>
              <WithSidebar>
                <FichasPage />
              </WithSidebar>
            </ProtectedRoute>
          } />

          <Route path="/matriculas" element={
            <ProtectedRoute>
              <WithSidebar>
                <MatriculasPage />
              </WithSidebar>
            </ProtectedRoute>
          } />


          <Route path="/asignaciones" element={
            <ProtectedRoute>
              <WithSidebar>
                <AsignacionPage />
              </WithSidebar>
            </ProtectedRoute>
          } />

          <Route path="/etapapractica" element={
            <ProtectedRoute>
              <WithSidebar>
                <EtapaPracticaPage />
              </WithSidebar>
            </ProtectedRoute>

          } />

          <Route path="/seguimiento" element={
            <ProtectedRoute>
              <WithSidebar>
                <SeguimientoPage />
              </WithSidebar>
            </ProtectedRoute>
          } />

          <Route path="/estadisticas" element={
            <ProtectedRoute>
              <WithSidebar>
                <EstadisticasPage />
              </WithSidebar>
            </ProtectedRoute>
          } />

          <Route path="/reportes" element={
            <ProtectedRoute>
              <WithSidebar>
                <ReportesPage />
              </WithSidebar>
              </ProtectedRoute>
              } />

            </Routes>
=======
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

          <Route path="/empresa" element={
            <WithSidebar>
              <EmpresaPage />
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
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
      </GlobalProvider>
    </BrowserRouter>
  );
};

export function WithSidebar({ children }) {
  const [userRole, setUserRole] = useState(null);
<<<<<<< HEAD
  const [userRol, setUserRol] = useState(null);
=======
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.cargo);
<<<<<<< HEAD
        setUserRol(user.rol);
=======
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
      } catch (error) {
        console.error("Error al parsear el JSON del usuario:", error);
      }
    }
  }, []);


  return (
    <div className="flex">
      <Sidebar>
<<<<<<< HEAD
        <SidebarItem nav="/home" icon={<Home size={20} />} text="Home" />
        {(userRole !== 'Instructor' && userRole !== 'Aprendiz') && (
          <SidebarItem nav="/nomina" icon={<Users size={20} />} text="Instructores" />
        )}
        {(userRole !== 'Aprendiz' && userRole !== 'Instructor') && (
          <SidebarItem nav="/fichas" icon={<BookMarked size={20} />} text="Fichas" />
        )}
        {(userRole !== 'Aprendiz' && userRol !== 'Instructor') && (
          <SidebarItem nav="/matriculas" icon={<BookUser size={20} />} text="Matriculas" />
        )}
        {/*  {(userRole !== 'Aprendiz' && userRol !== 'Instructor') && (
        <SidebarItem nav="/empresa" icon={<Building2 size={20} />} text="Empresa" />
        )} */}
        {(userRole !== 'Aprendiz' && userRol !== 'Instructor') && (
          <SidebarItem nav="/etapapractica" icon={<GraduationCap size={20} />} text="Etapa Practica" />
=======
        <SidebarItem nav="/" icon={<Home size={20} />} text="Home" />
        {(userRole !== 'Instructor' && userRole !== 'Aprendiz') && (
          <SidebarItem nav="/nomina" icon={<Users size={20} />} text="Instructores" />
        )}
        {(userRole !== 'Aprendiz') && (
          <SidebarItem nav="/fichas" icon={<BookMarked size={20} />} text="Fichas" />
        )}
        {(userRole !== 'Aprendiz') && (
          <SidebarItem nav="/matriculas" icon={<BookUser size={20} />} text="Matriculas" />
        )}
        {(userRole !== 'Aprendiz') && (
        <SidebarItem nav="/empresa" icon={<Building2 size={20} />} text="Empresa" />
        )}
        {(userRole !== 'Aprendiz') && (
        <SidebarItem nav="/etapapractica" icon={<GraduationCap size={20} />} text="Etapa Practica" />
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
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