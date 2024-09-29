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
<<<<<<< HEAD
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
=======
      <Navbar className="bg-white dark:bg-neutral-800 rounded-md">
        <NavbarContent justify="start" className="px-4">
          <NavbarBrand className="mr-4 flex items-center">
            <p className="hidden sm:block font-bold text-xl text-gray-800 dark:text-white">
              TrackProductivo
            </p>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-4">
            <NavbarItem>
              <Link color="inherit" href="/home" className="text-lime-500 dark:text-gray-300">
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

        <NavbarContent as="div" className="items-center px-4" justify="end">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[12rem] h-10",
              mainWrapper: "h-full",
              input: "text-sm text-gray-600 dark:text-gray-300",
              inputWrapper: "h-full bg-gray-100 dark:bg-gray-700",
            }}
            placeholder="Buscar en TrackProductivo"
            size="sm"
            startContent={<SearchIcon size={18} className="text-gray-600 dark:text-gray-300" />}
            type="search"
          />
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
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
