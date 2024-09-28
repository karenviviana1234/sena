import React, { useState, useEffect, useContext } from "react";
import { Button, Input } from "@nextui-org/react";
import PersonasContext from "../../context/PersonasContext"; // Importar el contexto
import Swal from 'sweetalert2'; // Importar SweetAlert2
import axiosClient from "../../configs/axiosClient";

function FormUsuarios({ initialData }) {
  const { registrarInstructor } = useContext(PersonasContext); // Usar el contexto
  const [area, setArea] = useState([]);
  const [selectedArea, setSelectArea] = useState('');
  const [identificacion, setIdentificacion] = useState("");
  const [nombres, setNombres] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("Selecciona");
  const [tipo, setTipo] = useState("Selecciona");
  const [sede, setSede] = useState("Selecciona");
  const [telefono, setTelefono] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [idPersona, setIdPersona] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    
    const fetchArea = async () => {
      try {
        const response = await axiosClient.get('/areas/listar');
        setArea(response.data);
      } catch (error) {
        console.error("Error al cargar areas:", error);
        setErrorMessage("Error al cargar areas. Intenta de nuevo más tarde.");
      }
    };

    fetchArea();
  }, []);

  useEffect(() => {
    if (initialData) {
      setIdentificacion(initialData.identificacion || "");
      setNombres(initialData.nombres || "");
      setCorreo(initialData.correo || "");
      setTelefono(initialData.telefono || "");
      setRol(initialData.rol || "Selecciona");
      setSede(initialData.sede || "Selecciona"); // Establecer sede
      setTipo(initialData.tipo || "Selecciona"); // Establecer tipo
      setSelectArea(initialData.area || "Selecciona"); // Establecer area
      setIdPersona(initialData.id_persona); // Establecer el ID de la persona
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [initialData]);

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
      sede,
      tipo,
      area: selectedArea
    };

/*     console.log("Campos enviados:", formData);
 */

    try {
      if (isEditing) {
        // Actualizar el usuario
        await axiosClient.put(`/personas/actualizar/${idPersona}`, formData);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Usuario actualizado correctamente',
        });
      } else {
        // Registrar un nuevo usuario
        await registrarInstructor(formData);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Usuario registrado correctamente',
        });
      }

      // Puedes omitir la llamada a getPersonas ya que registrarInstructor ya actualiza la lista
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
        <select
          name="rol"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          className={`mt-3 h-14 rounded-xl bg-[#f4f4f5] p-2 ${errors.rol ? 'border-red-500' : ''}`}
          style={{ width: '385px' }}
        >
          <option value="Selecciona">Selecciona un Rol</option>
          <option value="Instructor">Instructor</option>
          <option value="Lider">Líder</option>
        </select>
        {errors.rol && <p className="text-red-500">{errors.rol}</p>}

        <select
          name="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className={`mt-4 h-14 rounded-xl bg-[#f4f4f5] p-2 ${errors.tipo ? 'border-red-500' : ''}`}
          style={{ width: '385px' }}
        >
          <option value="Selecciona">Selecciona una Tipo</option>
          <option value="Contratista">Contratista</option>
          <option value="Planta">Planta</option>
        </select>
        {errors.tipo && <p className="text-red-500">{errors.tipo}</p>}

        <select
          name="sede"
          value={sede}
          onChange={(e) => setSede(e.target.value)}
          className={`mt-4 h-14 rounded-xl bg-[#f4f4f5] p-2 ${errors.sede ? 'border-red-500' : ''}`}
          style={{ width: '385px' }}
        >
          <option value="Selecciona">Selecciona una Sede</option>
          <option value="Yamboro">Yamboro</option>
          <option value="Centro">Centro</option>
        </select>
        {errors.sede && <p className="text-red-500">{errors.sede}</p>}

        <select
          className="mt-4 h-14 rounded-xl bg-[#f4f4f5] p-2 ${errors.sede ? 'border-red-500' : ''}"
          id="areas"
          name="Area"
          value={selectedArea}
          onChange={(e) => setSelectArea(e.target.value)}
          required
        >
          <option value="">Selecciona una Area</option>
          {area.map((areas) => (
            <option key={areas.id_area} value={areas.id_area}>
              {areas.nombre_area}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-5 mt-5">
          <Button className="bg-[#92d22e] text-white" type="submit" color="success">
            {isEditing ? "Actualizar" : "Registrar"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default FormUsuarios;
