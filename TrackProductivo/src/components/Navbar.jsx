import React, { useEffect, useState } from 'react';
import { User } from "@nextui-org/user";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Input } from "@nextui-org/react";
import { SearchIcon } from 'lucide-react';

export const Navbar2 = ({ title }) => {
  const [userData, setUserData] = useState({ nombres: '', cargo: '' });

  useEffect(() => {
    // Obtener el usuario de localStorage al cargar el componente
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserData({
        nombres: storedUser.nombres || 'Usuario', // Asegúrate de que el nombre exista
        cargo: storedUser.cargo || 'Rol desconocido', // Asegúrate de que el cargo exista
      });
    }
  }, []);

  return (
    <nav className="sticky top-0 z-20 w-full bg-white shadow-md dark:bg-neutral-800">
      <Navbar className="bg-white dark:bg-neutral-800 rounded-md">
        <NavbarContent justify="end" className="px-4">
          <NavbarBrand className="mr-4 flex items-center">
            <p className="hidden sm:block font-bold text-xl text-gray-800 dark:text-white">
              TrackProductivo
            </p>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-4">
            <NavbarItem>
              <Link color="inherit" href="/home" className="text-[#6dc15c] font-semibold dark:text-gray-300">
                Dashboard
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="inherit" href="/nomina" className="text-gray-600 dark:text-gray-300">
                Nómina
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="inherit" href="/fichas" className="text-gray-600 dark:text-gray-300">
                Fichas
              </Link>
            </NavbarItem>
          </NavbarContent>
        </NavbarContent>

        <NavbarContent as="div" className="items-center px-4" justify="center">
          <div className="ml-4">
            <User
              name={userData.nombres}
              description={userData.cargo}
              avatarSrc="https://via.placeholder.com/150"
              bordered
              as="button"
              size="sm"
              color="primary"
            />
          </div>
        </NavbarContent>
      </Navbar>
    </nav>
  );
};