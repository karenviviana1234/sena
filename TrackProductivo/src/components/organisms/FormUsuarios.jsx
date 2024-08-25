import React, { useState, useEffect, useContext } from "react";
import { Button, Input } from "@nextui-org/react";
import axiosClient from "../../configs/axiosClient";
import v from '../../styles/Variables';
import PersonasContext from "../../context/PersonasContext"; // Importar el contexto

function FormUsuarios({ initialData, onClose }) {
  const [identificacion, setIdentificacion] = useState("");
  const [nombres, setNombres] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("Instructor");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [municipiosList, setMunicipiosList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [idPersona, setIdPersona] = useState(null);

  const { setPersonas } = useContext(PersonasContext); // Obtener el contexto y la función de actualización

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

  useEffect(() => {
    if (initialData) {
      setIdentificacion(initialData.identificacion || "");
      setNombres(initialData.nombres || "");
      setCorreo(initialData.correo || "");
      setRol(initialData.rol || "Instructor");
      setTelefono(initialData.telefono || "");
      setMunicipio(initialData.municipio || "");
      setIdPersona(initialData.id_persona); // Establecer el ID de la persona
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [initialData]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      identificacion,
      nombres,
      correo,
      rol,
      telefono,
      municipio,
    };

    if (password) {
      formData.password = password; // Incluir la contraseña solo si se proporciona
    }

    try {
      let response;
      if (isEditing) {
        // Actualizar el usuario
        response = await axiosClient.put(`/personas/actualizar/${idPersona}`, formData);
        if (response.status === 200) {
          alert("Usuario actualizado correctamente");
        } else {
          alert("Error al actualizar el usuario");
        }
      } else {
        // Registrar un nuevo usuario
        response = await axiosClient.post('/personas/registrarI', formData);
        if (response.status === 200) {
          alert("Usuario registrado correctamente");
        } else {
          alert("Error al registrar el usuario");
        }
      }

      // Actualizar el contexto de personas
      const updatedPersonas = await axiosClient.get('/personas/listarA'); // Obtén la lista actualizada de personas
      setPersonas(updatedPersonas.data); // Actualiza el contexto

    } catch (error) {
      console.error("Error del servidor:", error);
      alert("Error del servidor: " + error.message);
    }
    onClose(); // Cierra el modal después de enviar el formulario
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">
        {isEditing ? "Actualizar Instructor" : "Registro de Instructores"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className='relative py-2'>
          <Input
            type="number"
            label='Identificación'
            id='identificacion'
            name="identificacion"
            value={identificacion}
            onChange={(e) => setIdentificacion(e.target.value)}
            required
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
            required
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
            required
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
            required
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

        <select
          name="municipio"
          label="Municipio"
          className="mt-4 h-14 rounded-xl bg-[#f4f4f5] p-2"
          value={municipio}
          style={{ width: '400px' }}
          onChange={(e) => setMunicipio(e.target.value)}
        >
          {municipiosList.map((mun) => (
            <option key={mun.id_municipio} value={mun.id_municipio}>
              {mun.nombre_mpio}
            </option>
          ))}
        </select>

        <select
          name="rol"
          label="Rol"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          className="mt-4 h-14 rounded-xl bg-[#f4f4f5] p-2"
          style={{ width: '400px' }}
        >
          <option value="Instructor">Instructor</option>
          <option value="Lider">Lider</option>
        </select>

        <div className="flex justify-end gap-5 mt-5">
          <Button type="button" color="danger" onClick={onClose}>Cerrar</Button>
          <Button className="bg-[#92d22e] text-white" type="submit" color="success">
            {isEditing ? "Actualizar" : "Registrar"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default FormUsuarios;