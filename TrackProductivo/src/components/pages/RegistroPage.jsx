import React, { useState } from 'react'
import Icons from '../../styles/Variables.jsx'
import axiosClient from '../../configs/axiosClient.jsx'
import { Link, useNavigate } from 'react-router-dom'
import AccionesModal from '../molecules/Modal.jsx'
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../NextIU/EyeFilledIcon.jsx";
import { EyeSlashFilledIcon } from "../NextIU/EyeSlashFilledIcon.jsx";
import { Select, SelectItem } from "@nextui-org/select";
import Swal from 'sweetalert2';


export const Registro = () => {

  const navigate = useNavigate()
  const [mensaje, setMensaje] = useState('')
  const [modalAcciones, setModalAcciones] = useState(false)

  const [formData, setFormData] = useState({
    identificacion: '',
    nombres: '',
    correo: '',
    password: '',
    telefono: '',
    rol: '', // Añadir manejo del campo de 'rol'
    cargo: '', // Si es necesario
    municipio: '', // Si es necesario
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/personas/registrar", formData);
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Usuario Registrado Con Exito",
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/');
    } catch (error) {
      console.error("Error al registrar usuario:", error.response || error.message);
      alert('Error en el servidor: ' + (error.response ? error.response.data.message : error.message));
    }

  };
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div>
      <div className='flex items-center justify-center bg-[#EDEBDE] min-h-screen  p-4 w-full' >
        <div className='relative flex flex-col m-2 space-y-5 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0 '>

          <div className='flex flex-col p-5 m-4  md:p-5'>
            <span className='mb-2 text-4xl font-bold text-center'>Registro</span>
            <form onSubmit={handleSubmit}>

              <div className='py-2'>
                <Input
                  type="number"
                  label="Identificación"
                  variant="bordered"
                  className="w-80"
                  name='identificacion'
                  id='identificacion'
                  value={formData.identificacion}
                  onChange={handleChange}
                />
              </div>

              <div className='py-2'>
                <Input
                  type="text"
                  label="Nombre(s)"
                  className="w-80"
                  name='nombres'
                  id='nombres'
                  value={formData.nombres}
                  onChange={handleChange}
                />
              </div>

              <div className='py-2'>
                <Input
                  type="email"
                  label="Correo"
                  variant="bordered"
                  className="w-80"
                  name='correo'
                  id='correo'
                  value={formData.correo}
                  onChange={handleChange}
                />
              </div>

              <div className='py-2'>
                <Input
                  label="Password"
                  variant="bordered"
                  name='password'
                  id='password'
                  value={formData.password}
                  onChange={handleChange}
                  endContent={
                    <button type="button" onClick={toggleVisibility}>
                      {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none mb-2" />
                      )}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                  className="max-w-xs"
                />
              </div>
              <div className='py-2'>
                <Input
                  type="number"
                  label="Telefono"
                  variant="bordered"
                  className="w-80"
                  name='telefono'
                  id='telefono'
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>

              <Select
                variant="bordered"
                label="Rol"
                name="rol"
                value={formData.rol} // Esto asegura que el valor seleccionado se asigne correctamente al estado
                onChange={(e) => handleChange({ target: { name: 'rol', value: e.target.value } })}
                className="max-w-xs"
              >
                <SelectItem value="Aprendiz">Aprendiz</SelectItem>
                <SelectItem value="Instructor">Instructor</SelectItem>
              </Select>


              <div className='py-2'>
                <Select
                  variant="bordered"
                  label="Cargo"
                  className="max-w-xs"
                  name="cargo"
                  value={formData.cargo} // Esto asegura que el valor seleccionado se asigne correctamente al estado
                  onChange={(e) => handleChange({ target: { name: 'cargo', value: e.target.value } })}
                >
                  <SelectItem>Aprendiz</SelectItem>
                  <SelectItem>Instructor</SelectItem>
                </Select>

              </div>

              <div className='py-2'>
                <Input
                  type="text"
                  label="Municipio"
                  className="w-80"
                  name='municipio'
                  id='municipio'
                  value={formData.municipio}
                  onChange={handleChange}
                />
              </div>


              <button className='mt-4 w-full bg-green    hover:bg-green-500 text-white p-2 rounded-lg mb-6' type='submit' >
                Registro
              </button>
            </form>
          </div>


          <AccionesModal
            isOpen={modalAcciones}
            onClose={() => setModalAcciones(false)}
            label={mensaje}
          />
        </div>
      </div>

    </div>

  )
}

export default Registro