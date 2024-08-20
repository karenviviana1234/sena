import React, { useState, useEffect } from 'react';
import logo from "../../assets/img/logo-sena-verde.png";
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = { username, password };
      // const response = await axiosClient.post('auth/login/', data);
      
      // if (response.status === 200) {
        const token = "acncnask askcnnascnkcasoichnaCKOACN";
        localStorage.setItem('token', token);
        navigate("/home");
      // } else {
      //   alert("Error al iniciar sesión");
      // }
    } catch (error) {
      console.error('Error during login:', error);
      alert("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUsernameFocus = () => {
    setUsernameFocused(true);
  };

  const handleUsernameBlur = () => {
    if (!username) {
      setUsernameFocused(false);
    }
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordFocused(false);
    }
  };

  const handleUsernameClick = () => {
    setUsernameFocused(true);
  };

  const handlePasswordClick = () => {
    setPasswordFocused(true);
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-gray-50">
      <div className='bg-gradient-to-b from-lime-300 to-lime-600 w-[100%] h-auto flex justify-center items-center'>
        <img className='w-[95%] pt-31' src="index.svg" alt="estadisticas" />
      </div>
      <div className="flex flex-col justify-center w-full px-6 py-12 sm:py-24">
        <div className="relative w-full max-w-md mx-auto   p-8">
          <div className="text-center flex flex-col items-center">
            <img className="w-32 mb-6" src={logo} alt="logo" />
            <h4 className="mb-4 text-2xl font-semibold">TrackProductivo</h4>
            <p className="mb-6 text-gray-600">Por favor, ingrese a su cuenta</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  className="peer w-full rounded border border-gray-300 bg-white px-3 py-2 placeholder-transparent focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={handleUsernameChange}
                  onFocus={handleUsernameFocus}
                  onBlur={handleUsernameBlur}
                  onClick={handleUsernameClick}
                />
                <label
                  htmlFor="username"
                  className={`absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all ${username || usernameFocused ? 'transform -translate-y-4 text-lime-500' : ''}`}
                >
                  Username
                </label>
              </div>
            </div>
            <div className="mb-6">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="peer w-full rounded border border-gray-300 bg-white px-3 py-2 placeholder-transparent focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                  onClick={handlePasswordClick}
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
                  className={`absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all ${password || passwordFocused ? 'transform -translate-y-4 text-lime-500' : ''}`}
                >
                  Password
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
              <a href="#!" className="text-sm text-lime-500 hover:underline">¿No tienes una cuenta?</a>
            </div>
           
          </form>
        </div>
      </div>
    </div>
  );
};
