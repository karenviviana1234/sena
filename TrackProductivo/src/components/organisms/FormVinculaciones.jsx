import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { Select, SelectItem } from "@nextui-org/react";
=======
import { Button, Select, SelectItem } from "@nextui-org/react";
>>>>>>> 28fc74a883fc62fcfeaeb5bfc30c3690acb9ac7d
import axiosClient from "../../configs/axiosClient";

function FormVinculaciones() {
  const [instructor, setInstructor] = useState("");
  const [tipo, setTipo] = useState("");
  const [sede, setSede] = useState("");
  const [area, setArea] = useState("");
  const [instructores, setInstructores] = useState([]);
  const [areas, setAreas] = useState([]);

<<<<<<< HEAD
=======
  const tipos = [
    { id: "contratisca", nombre: "Contratista" },
    { id: "planta", nombre: "Planta" }
  ];

  const sedes = [
    { id: "centro", nombre: "Centro" },
    { id: "yamboro", nombre: "Yamboro" }
  ];

>>>>>>> 28fc74a883fc62fcfeaeb5bfc30c3690acb9ac7d
  useEffect(() => {
    const fetchInstructores = async () => {
      try {
        const response = await axiosClient.get("/personas/listarI");
        setInstructores(response.data);
      } catch (error) {
        console.error("Error al obtener instructores", error);
      }
    };

    const fetchAreas = async () => {
      try {
        const response = await axiosClient.get("/areas/listar");
        setAreas(response.data);
      } catch (error) {
        console.error("Error al obtener áreas", error);
      }
    };

    fetchInstructores();
    fetchAreas();
  }, []);

<<<<<<< HEAD
  return (
    <form>
      <Select
        name="instructor" // Añadido el nombre
        placeholder="Selecciona el instructor"
        className="mb-5"
        value={instructor}
        onChange={(value) => setInstructor(value)}
      >
        {instructores.map((inst) => (
          <SelectItem key={inst.id_persona} value={inst.id_persona}>
=======
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar los valores antes de enviar
    console.log("Valores antes de enviar:", {
      instructor: instructor,
      tipo: tipo,
      sede: sede,
      area: area,
    });

    const dataToSend = {
      instructor: parseInt(instructor, 10) || null, 
      tipo: tipo, 
      sede: sede,
      area: parseInt(area, 10) || null 
    };

    console.log("Data enviada:", dataToSend);

    try {
      const response = await axiosClient.post("/vinculacion/registrar", dataToSend);

      if (response.status === 200) {

        alert("Vinculación registrada correctamente");
      } else {
        alert("Error al registrar la vinculación");
      }
    } catch (error) {
      console.error("Error del servidor:", error);
      alert("Error del servidor: " + error.message);
    }
  };

  return (
    <div>
    <h2 className="text-xl font-bold mb-4">Formulario de Vinculación</h2>
    <form onSubmit={handleSubmit}>
      <Select
        name="instructor"
        placeholder="Selecciona el instructor"
        className="mb-5"
        value={instructor}
        onChange={(e) => {
          const value = e.target.value;
          setInstructor(value);
        }}
      >
        {instructores.map((inst) => (
          <SelectItem key={inst.id_persona} value={inst.id_persona.toString()}>
>>>>>>> 28fc74a883fc62fcfeaeb5bfc30c3690acb9ac7d
            {inst.nombres}
          </SelectItem>
        ))}
      </Select>

      <Select
<<<<<<< HEAD
        name="tipo" // Añadido el nombre
        placeholder="Selecciona el tipo"
        className="mb-5"
        value={tipo}
        onChange={(value) => setTipo(value)}
      >
        <SelectItem value="contratista">Contratista</SelectItem>
        <SelectItem value="planta">Planta</SelectItem>
      </Select>

      <Select
        name="sede" // Añadido el nombre
        placeholder="Selecciona la sede"
        className="mb-5"
        value={sede}
        onChange={(value) => setSede(value)}
      >
        <SelectItem value="centro">Centro</SelectItem>
        <SelectItem value="yamboro">Yamboro</SelectItem>
      </Select>

      <Select
        name="area" // Añadido el nombre
        placeholder="Selecciona el área"
        className="mb-5"
        value={area}
        onChange={(value) => setArea(value)}
      >
        {areas.map((ar) => (
          <SelectItem key={ar.id_area} value={ar.id_area}>
=======
        name="tipo"
        placeholder="Selecciona el tipo"
        className="mb-5"
        value={tipo}
        onChange={(e) => {
          const value = e.target.value;
          setTipo(value);
        }}
      >
        {tipos.map((t) => (
          <SelectItem key={t.id} value={t.id}>
            {t.nombre}
          </SelectItem>
        ))}
      </Select>

      <Select
        name="sede"
        placeholder="Selecciona la sede"
        className="mb-5"
        value={sede}
        onChange={(e) => {
          const value = e.target.value;
          setSede(value);
        }}
      >
        {sedes.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            {s.nombre}
          </SelectItem>
        ))}
      </Select>

      <Select
        name="area"
        placeholder="Selecciona el área"
        className="mb-5"
        value={area}
        onChange={(e) => {
          const value = e.target.value;
          setArea(value);
        }}
      >
        {areas.map((ar) => (
          <SelectItem key={ar.id_area} value={ar.id_area.toString()}>
>>>>>>> 28fc74a883fc62fcfeaeb5bfc30c3690acb9ac7d
            {ar.nombre_area}
          </SelectItem>
        ))}
      </Select>
<<<<<<< HEAD
    </form>
  );
}

export default FormVinculaciones;
=======

      <div className="flex justify-end gap-5 mt-5">
        <Button type="button" color="danger">Cerrar</Button>
        <Button type="submit" color="success">Registrar</Button>
      </div>
    </form>
    </div>
  );
}

export default FormVinculaciones;
>>>>>>> 28fc74a883fc62fcfeaeb5bfc30c3690acb9ac7d
