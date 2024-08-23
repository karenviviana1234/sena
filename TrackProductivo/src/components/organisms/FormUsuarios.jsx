import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";
import PersonasContext from "../../context/PersonasContext";
import v from '../../styles/Variables'

function FormUsuarios() {
  const [formData, setFormData] = useState({
    identificacion: '',
    nombres: '',
    correo: '',
    telefono: '',
    password: '',
    rol: '',
    municipio: ''
  });

  const [municipios, setMunicipios] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { registrarInstructor } = useContext(PersonasContext);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);


  useEffect(() => {
    // Fetch municipios cuando el componente se monte
    const fetchMunicipios = async () => {
      try {
        const response = await axios.get('http://localhost:3000/personas/listarM');
        setMunicipios(response.data);
      } catch (error) {
        console.error('Error al obtener los Municipios:', error);
      }
    };

    fetchMunicipios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
  };
  const handlePasswordClick = () => {
    setPasswordFocused(true);
  };


  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordFocused(false);
    }
  };
  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      municipio: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombres) {
      return;
    }

  };

  return (
    <form className='flex flex-col' onSubmit={handleSubmit}>
      <div className='py-2'>
        <Input
          type="number"
          label="Identificación"
          id='identificacion'
          name="identificacion"
          value={formData.identificacion}
          onChange={handleChange}
          required
        />
      </div>
      <div className='py-2'>
        <Input
          type="text"
          label="Nombres Completos"
          id='nombres'
          name="nombres"
          value={formData.nombres}
          onChange={handleChange}
          required
        />
      </div>
      <div className='py-2'>
        <Input
          type="email"
          label="Correo Electronico"
          id='correo'
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          required
        />
      </div>
      <div className='py-2'>
        <Input
          type="number"
          label="Telefono"
          id='telefono'
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />
      </div>
      <div className='relative py-2'>
        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          label="Contraseña"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          onFocus={handlePasswordFocus}
          onBlur={handlePasswordBlur}
          onClick={handlePasswordClick}
        />
        <button
          onClick={togglePasswordVisibility}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2"
        >
          {showPassword ? <v.OjoON size={20} /> : <v.OjoOFF size={20} />}
        </button>
      </div>

      <div className='py-2'>
        <Select
          name='rol'
          id='rol'
          label='Rol'
          value={formData.rol}
          onChange={handleSelectChange}
          required
        >
          <SelectItem value=''>Seleccione un rol</SelectItem>
          <SelectItem >Instructor</SelectItem>
          <SelectItem >Lider</SelectItem>
        </Select>
      </div>
      <div className='py-2'>
        <Select
          name='municipio'
          id='municipio'
          label='Municipio'
          value={formData.municipio}
          onChange={handleSelectChange}
          required
        >
          <SelectItem value=''>Seleccione un municipio</SelectItem>
          {municipios.map((item) => (
            <SelectItem key={item.id_municipio} value={item.id_municipio}>
              {item.nombre_mpio}
            </SelectItem>
          ))}
        </Select>
      </div>
    </form>
  );
}

export default FormUsuarios;
