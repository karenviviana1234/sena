import React, { useState, useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import axiosClient from "../../configs/axiosClient";

function FormVinculaciones() {
  const [instructor, setInstructor] = useState("");
  const [tipo, setTipo] = useState("");
  const [sede, setSede] = useState("");
  const [area, setArea] = useState("");
  const [instructores, setInstructores] = useState([]);
  const [areas, setAreas] = useState([]);

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
            {inst.nombres}
          </SelectItem>
        ))}
      </Select>

      <Select
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
            {ar.nombre_area}
          </SelectItem>
        ))}
      </Select>
    </form>
  );
}

export default FormVinculaciones;