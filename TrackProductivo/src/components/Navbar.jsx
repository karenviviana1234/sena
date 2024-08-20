import React from 'react';
import { User } from "@nextui-org/user";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Input } from "@nextui-org/react";
import { SearchIcon } from 'lucide-react';

export const Navbar2 = ({ title }) => {
  return (
    <nav className="sticky top-0 z-20 w-full bg-white shadow-md dark:bg-neutral-800">
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
                Nomina
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
              name="Jorge Enrique Nuñez Molina"
              description="Admin"
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
