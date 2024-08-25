import React from "react";
const columns = [
  {name: "Identificacion", uid: "id", sortable: true},
  {name: "Nombres", uid: "name", sortable: true},
  {name: "Fichas", uid: "age", sortable: true},
  {name: "Empresa", uid: "role", sortable: true},
  {name: "EMAIL", uid: "email"},
  {name: "ACTIONS", uid: "actions"},
  {name: "Seguimiento 1", uid: "seguimiento1"},
  {name: "Seguimiento 2", uid: "seguimiento2"},
  {name: "Seguimiento 3", uid: "seguimiento3"},
];



const users = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
    seguimiento1: "01-02-2021",
    seguimiento2: "01-02-2021",
    seguimiento3: "01-02-2021"
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Tech Lead",
    team: "Development",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
    seguimiento1: "01-02-2021",
    seguimiento2: "01-02-2021",
    seguimiento3: "01-02-2021"
  },
  {
    id: 3,
    name: "Jane Fisher",
    role: "Sr. Dev",
    team: "Development",
    age: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
    seguimiento1: "01-02-2021",
    seguimiento2: "01-02-2021",
    seguimiento3: "01-02-2021"
  },
  {
    id: 4,
    name: "William Howard",
    role: "C.M.",
    team: "Marketing",
    age: "28",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
    seguimiento1: "01-02-2021",
    seguimiento2: "01-02-2021",
    seguimiento3: "01-02-2021"
  },
  {
    id: 5,
    name: "Kristen Copper",
    role: "S. Manager",
    team: "Sales",
    age: "24",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
    seguimiento1: "01-02-2021",
    seguimiento2: "01-02-2021",
    seguimiento3: "01-02-2021"
  },
  {
    id: 6,
    name: "Brian Kim",
    role: "P. Manager",
    team: "Management",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "brian.kim@example.com",
    seguimiento1: "01-02-2021",
    seguimiento2: "01-02-2021",
    seguimiento3: "01-02-2021"
  },
  {
    id: 7,
    name: "Michael Hunt",
    role: "Designer",
    team: "Design",
    age: "27",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29027007d",
    email: "michael.hunt@example.com",
    seguimiento1: "01-02-2021",
    seguimiento2: "01-02-2021",
    seguimiento3: "01-02-2021"
  },
  {
    id: 8,
    name: "Samantha Brooks",
    role: "HR Manager",
    team: "HR",
    age: "31",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e27027008d",
    email: "samantha.brooks@example.com",
    seguimiento1: "01-02-2021",
    seguimiento2: "01-02-2021",
    seguimiento3: "01-02-2021"
  },
  {
    id: 9,
    name: "Frank Harrison",
    role: "F. Manager",
    team: "Finance",
    age: "33",
    avatar: "https://i.pravatar.cc/150?img=4",
    email: "frank.harrison@example.com",
    seguimiento1: "01-02-2021",
    seguimiento2: "01-02-2021",
    seguimiento3: "01-02-2021"
  },
  {
    id: 10,
    name: "Emma Adams",
    role: "Ops Manager",
    team: "Operations",
    age: "35",
    avatar: "https://i.pravatar.cc/150?img=5",
    email: "emma.adams@example.com",
    seguimiento1: "01-02-2021",
    seguimiento2: "01-02-2021",
    seguimiento3: "01-02-2021"
  }
];

export {columns, users};
