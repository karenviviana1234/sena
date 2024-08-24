import React, { useState, useEffect } from "react";
import { Button, Select, SelectItem, Input } from "@nextui-org/react";
import axiosClient from "../../configs/axiosClient";
import v from '../../styles/Variables';


function FormUsuarios() {
  const [identificacion, setIdentificacion] = useState("");
  const [nombres, setNombres] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [municipiosList, setMunicipiosList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const response = await axiosClient.get("/personas/listarM");
        setMunicipiosList(response.data);
      } catch (error) {
        console.error("Error al obtener municipios", error);
      }
    };
    fetchMunicipios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      identificacion,
      nombres,
      correo,
      rol,
      telefono,
      password,
      municipio
    };

    try {
      const response = await axiosClient.post("/personas/registrarI", dataToSend);
      if (response.status === 200) {
        alert("Usuario registrado correctamente");
      } else {
        alert("Error al registrar el usuario");
      }
    } catch (error) {
      console.error("Error del servidor:", error);
      alert("Error del servidor: " + error.message);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Formulario de Personas</h1>
      <form onSubmit={handleSubmit}>
        <div className='relative py-2'>
          <Input
            type="number"
            label='Identificación'
            id='identificacion'
            name="identificacion"
            value={identificacion}
            onChange={(e) => setIdentificacion(e.target.value)}
            required={true}
          />
        </div>
        <div className='relative py-2'>
          <Input
            type="text"
            label='Nombres Completos'
            id='nombres'
            name="nombres"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            required={true}
          />
        </div>
        <div className='relative py-2'>
          <Input
            type="email"
            label='Correo Electrónico'
            id='correo'
            name="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required={true}
          />
        </div>
        <div className='relative py-2'>
          <Input
            type="number"
            label='Teléfono'
            id='telefono'
            name="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required={true}
          />
        </div>
        <div className='relative py-2'>
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={togglePasswordVisibility}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-transparent"
          >
            {showPassword ? <v.OjoON size={20} /> : <v.OjoOFF size={20} />}
          </Button>
        </div>

        <Select
          name="municipio"
          label="Municipio"
          className="mb-5"
          value={municipio}
          onChange={(e) => setMunicipio(e.target.value)}
        >
          {municipiosList.map((mun) => (
            <SelectItem key={mun.id_municipio} value={mun.id_municipio}>
              {mun.nombre_mpio}
            </SelectItem>
          ))}
        </Select>

        <Select
          name="rol"
          label="Rol"
          className="mb-5"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        >
          <SelectItem value="Instructor">Instructor</SelectItem>
          <SelectItem value="Lider">Líder</SelectItem>
        </Select>

        <div className="flex justify-end gap-5 mt-5">
          <Button type="button" color="danger">Cerrar</Button>
          <Button type="submit" color="success">Registrar</Button>
        </div>
      </form>
    </div>
  );
}

export default FormUsuarios;
