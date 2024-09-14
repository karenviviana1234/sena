import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../configs/axiosClient';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react';
import logo from "../../assets/img/logo-sena-verde.png";

export const LoginPage = () => {
  const [mensaje, setMensaje] = useState('');
  const [modalAcciones, setModalAcciones] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const correo = useRef(null);
  const password = useRef(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const emailValue = correo.current.value;
      const passwordValue = password.current.value;
  
      if (!emailValue || !passwordValue) {
        setMensaje('Los campos son obligatorios');
        setModalAcciones(true);
        return;
      }
  
      const data = {
        correo: emailValue,
        password: passwordValue,
      };
  
      const response = await axiosClient.post('/validacion', data);
      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user[0]));

        Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: 'Bienvenido',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          const userRol = user[0]?.rol;
  
          if (userRol === 'seguimiento') {
            navigate('/nomina');
          } else if (userRol === 'aprendiz') {
            navigate('/Inicio');
          } else {
            navigate('/home');
          }
        });
      } else {
        setMensaje('Credenciales incorrectas');
        setModalAcciones(false);
  
        Swal.fire({
          position: 'top-center',
          icon: 'error',
          title: 'Datos Incorrectos',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      alert('Error del servidor' + error);
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-gray-50">
      <div className='bg-gradient-to-b from-lime-300 to-lime-600 w-[100%] h-auto flex justify-center items-center'>
        <img className='w-[95%] pt-31' src="index.svg" alt="estadisticas" />
      </div>
      <div className="flex flex-col justify-center w-full px-6 py-12 sm:py-24">
        <div className="relative w-full max-w-md mx-auto p-8">
          <div className="text-center flex flex-col items-center">
            <img className="w-32 mb-6" src={logo} alt="logo" />
            <h4 className="mb-4 text-2xl font-semibold">TrackProductivo</h4>
            <p className="mb-6 text-gray-600">Por favor, ingrese a su cuenta</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="relative">
                <input
                  className="peer w-full rounded border border-gray-300 bg-white px-3 py-2 placeholder-transparent focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
                  type="email"
                  label="Correo"
                  variant="bordered"
                  name="correo"
                  id="correo"
                  ref={correo}
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={() => setUsernameFocused(false)}
                />
                <label
                  htmlFor="correo"
                  className={`absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all ${usernameFocused || correo.current?.value ? 'transform -translate-y-4 text-lime-500' : ''}`}
                >
                  Correo Electrónico
                </label>
              </div>
            </div>
            <div className="mb-6">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="peer w-full rounded border border-gray-300 bg-white px-3 py-2 placeholder-transparent focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
                  label="Contraseña"
                  variant="bordered"
                  ref={password}
                  name="password"
                  id="password"
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <button
                  onClick={togglePasswordVisibility}
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <label
                  htmlFor="password"
                  className={`absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all ${passwordFocused || password.current?.value ? 'transform -translate-y-4 text-lime-500' : ''}`}
                >
                  Contraseña
                </label>
              </div>
            </div>
            <div className="mb-6">
              <button
                className="w-full px-6 py-2.5 rounded bg-lime-500 text-white text-sm font-medium leading-normal shadow-md hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-600"
                type="submit"
              >
                Log in
              </button>
            </div>
            <div className="flex justify-between items-center mb-6">
              <a href="#!" className="text-sm text-lime-500 hover:underline">¿Has olvidado tu contraseña?</a>
              <a href="/registro" className="text-sm text-lime-500 hover:underline">¿No tienes una cuenta?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
