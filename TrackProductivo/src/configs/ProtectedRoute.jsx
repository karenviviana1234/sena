import React from 'react';
import { Navigate } from 'react-router-dom';

<<<<<<< HEAD
const ProtectedRoute = ({ children }) => {
=======
export const ProtectedRoute = ({ children }) => {
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
  const token = localStorage.getItem('token');

  if (!token) {
    // Redirecciona a la página de inicio de sesión si no hay token
    return <Navigate to="/" replace />;
  }

  return children;
};

<<<<<<< HEAD

export default ProtectedRoute;
=======
>>>>>>> 2f26bb9f189b1ea7057056e49def6f0ea00a3a9a
