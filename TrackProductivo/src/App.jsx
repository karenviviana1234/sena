import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Users, BookMarked, BookUser, Building2, GraduationCap, FolderSearch2, BookPlus } from 'lucide-react';
import Sidebar, { SidebarItem, SidebarAccordion } from './components/Sidebar';
import { LoginPage } from '../src/components/pages/LoginPage';
import { Navbar2 } from './components/Navbar';
import GlobalProvider from './context/GlobalContext';

// Importa las páginas directamente
import NominaPage  from './components/pages/NominaPage.jsx';
import FichasPage from './components/pages/FichasPage.jsx';
import MatriculasPage from './components/pages/MatriculasPage.jsx';
import EmpresaPage from './components/pages/EmpresaPage.jsx';
import ReportesPage from './components/pages/ReportesPage.jsx';
import EstadisticasPage from './components/pages/EstadisticasPage.jsx';
import EtapaPracticaPage from './components/pages/EtapaPracticaPage.jsx';
import BitacorasPage from './components/pages/BitacorasPage.jsx';
import HomePage from './components/pages/HomePage.jsx';

export const App = () => {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={
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

          <Route path="/etapapractica" element={
              <WithSidebar>
                <EtapaPracticaPage />
              </WithSidebar>
          } />

          <Route path="/reportes" element={
              <WithSidebar>
                <ReportesPage />
              </WithSidebar>
          } />

          <Route path="/estadisticas" element={
              <WithSidebar>
                <EstadisticasPage />
              </WithSidebar>
          } />

          <Route path="/bitacoras" element={
              <WithSidebar>
                <BitacorasPage />
              </WithSidebar>
          } />
        </Routes>
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
      <SidebarItem nav="/empresa" icon={<Building2 size={20} />} text="Empresa" />
      <SidebarItem nav="/etapapractica" icon={<GraduationCap size={20} />} text="Etapa Practica" />
      <SidebarItem nav="/bitacoras" icon={<BookPlus size={20} />} text="Bitacoras" />

      <SidebarAccordion icon={<FolderSearch2 size={20} />} text="Seguimientos">
        <SidebarItem nav="/reportes" text="Reportes" />
        <SidebarItem nav="/estadisticas" text="Estadisticas" />
      </SidebarAccordion>
      {/* fin de secciones de el rol de Coordinador */}
    </Sidebar>
    <div className="w-full bg-white h-screen overflow-auto">
      <Navbar2 />
      {children}
    </div>
  </div>
);
