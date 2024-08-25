import React, { useState, useEffect, useContext } from "react";
import { Button, Input } from "@nextui-org/react";
import axiosClient from "../../configs/axiosClient";
import v from '../../styles/Variables';
import PersonasContext from "../../context/PersonasContext"; // Importar el contexto
import Swal from 'sweetalert2'; // Importar SweetAlert2

function FormUsuarios({ initialData, onClose }) {
  const [identificacion, setIdentificacion] = useState("");
  const [nombres, setNombres] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("Selecciona");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [municipiosList, setMunicipiosList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [idPersona, setIdPersona] = useState(null);

  const [errors, setErrors] = useState({}); // Estado para manejar errores

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

    // Limpiar errores previos
    setErrors({});

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
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Usuario actualizado correctamente',
        });
      } else {
        // Registrar un nuevo usuario
        response = await axiosClient.post('/personas/registrarI', formData);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Usuario registrado correctamente',
        });
      }
  
      // Actualizar el contexto de personas
      const updatedPersonas = await axiosClient.get('/personas/listarA'); // Obtén la lista actualizada de personas
      setPersonas(updatedPersonas.data); // Actualiza el contexto
  
    } catch (error) {
      console.error("Error del servidor:", error);
      const { response } = error;
  
      // Manejar errores específicos del backend
      if (response && response.data) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Error desconocido',
        });
  
        // Aquí puedes también actualizar el estado de errores si es necesario
        setErrors(response.data.errors || {});
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error del servidor: ' + error.message,
        });
      }
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
            className="w-96"
            value={identificacion}
            onChange={(e) => setIdentificacion(e.target.value)}
            required
            helperText={errors.identificacion} // Mostrar error si existe
            status={errors.identificacion ? 'error' : 'default'}
          />
        </div>
        <div className='relative py-2'>
          <Input
            type="text"
            label='Nombres Completos'
            id='nombres'
            name="nombres"
            className="w-96"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            required
            helperText={errors.nombres} // Mostrar error si existe
            status={errors.nombres ? 'error' : 'default'}
          />
        </div>
        <div className='relative py-2'>
          <Input
            type="email"
            label='Correo Electrónico'
            id='correo'
            name="correo" 
            className="w-96"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            helperText={errors.correo} // Mostrar error si existe
            status={errors.correo ? 'error' : 'default'}
          />
        </div>
        <div className='relative py-2'>
          <Input
            type="number"
            label='Teléfono'
            id='telefono'
            name="telefono"
            className="w-96"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
            helperText={errors.telefono} // Mostrar error si existe
            status={errors.telefono ? 'error' : 'default'}
          />
        </div>
        <div className='relative py-2'>
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            className="w-96"
            label="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText={errors.password} // Mostrar error si existe
            status={errors.password ? 'error' : 'default'}
          />
          <Button
            onClick={togglePasswordVisibility}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-transparent"
          >
            {showPassword ? <v.OjoON size={20} /> : <v.OjoOFF size={20} />}
          </Button>
        </div>

        <select
          name="rol"
          label="Rol"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          className={`mt-4 h-14 rounded-xl bg-[#f4f4f5] p-2 ${errors.rol ? 'border-red-500' : ''}`}
          style={{ width: '385px' }}
        >
          <option value="Selecciona">Selecciona una Opcion</option>
          <option value="Instructor">Instructor</option>
          <option value="Lider">Lider</option>
        </select>
        {errors.rol && <p className="text-red-500">{errors.rol}</p>}

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
