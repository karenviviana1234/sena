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
    <Navbar>
      <NavbarContent>
        <NavbarBrand>
          <p className="font-bold text-xl text-gray-800 dark:text-white ml-80">
            TrackProductivo
          </p>
        </NavbarBrand>
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