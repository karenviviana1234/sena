import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, ArrowLeftRight, Settings, CircleUserRound } from "lucide-react";
import Sidebar, { SidebarItem, SidebarAccordion } from "./components/Sidebar";
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './configs/ProtectedRoute';
import { Navbar2 } from './components/Navbar';




// Lazy load the pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ActividadesPage = lazy(() => import('./pages/ActividadesPage'));
const AmbientesPage = lazy(() => import('./pages/AmbientesPage'));
// las rutas de todos los modulos [tengo que crear la vista y ubicarlas en el sliderbar]
//son los modulos de la base de datos pero vamos a dividir en secciones 

const AsignacionesPage = lazy(() => import('./pages/ActividadesPage'));
const bitacorasPage = lazy(() => import('./pages/ActividadesPage'));
const EmpresaPage = lazy(() => import('./pages/ActividadesPage'));
const FichasPage = lazy(() => import('./pages/ActividadesPage'));
const HorariosPage = lazy(() => import('./pages/ActividadesPage'));
const MatriculasPage = lazy(() => import('./pages/ActividadesPage'));
const MunicipiosPage = lazy(() => import('./pages/ActividadesPage'));
const UsuariosPage = lazy(() => import('./pages/UsuariosPage'));
const ProductivaPage = lazy(() => import('./pages/ActividadesPage'));
const ProgramasPage = lazy(() => import('./pages/ActividadesPage'));
const SeguimientosPage = lazy(() => import('./pages/ActividadesPage'));
const VinculacionPage = lazy(() => import('./pages/ActividadesPage'));








export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<div>Loading...</div>}>
                <HomePage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />
        
        <Route path="/actividades" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<div>Loading...</div>}>
                <ActividadesPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />

        <Route path="/ambientes" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<div>Loading...</div>}>
                <AmbientesPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />

        <Route path="/ambientes" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<div>Loading...</div>}>
                <AmbientesPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />
  
        <Route path="/usuarios" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<div>Loading...</div>}>
                <UsuariosPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />
    






        



      </Routes>
      
    </BrowserRouter>
  );
};

const WithSidebar = ({ children }) => (
  <div className="flex">
    <Sidebar>
      <SidebarItem nav="/home" icon={<Home size={20} />} text="Home" />
      <SidebarItem nav="/actividades" icon={<ArrowLeftRight size={20} />} text="Actividades" />
      <SidebarItem nav="/ambientes" icon={<Settings size={20} />} text="Ambientes" />
      <SidebarItem nav="/usuarios" icon={<CircleUserRound size={20} />} text="Usuarios" />

      <SidebarAccordion icon={<Settings size={20} />} text="Opciones">
        <SidebarItem nav="/areas" text="holi" />
        <SidebarItem nav="/centros" text="pampam" />
      
      </SidebarAccordion>
    </Sidebar>
    <div className='w-full bg-white h-screen overflow-auto'>
      <Navbar2 />
      {children}
    </div>
  </div>
);
