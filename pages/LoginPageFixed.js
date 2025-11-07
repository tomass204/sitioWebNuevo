import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAPI from '../js/api/auth.js';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await AuthAPI.login({
        email: formData.email,
        password: formData.password
      });

      // Extraer datos del usuario de la respuesta
      const userData = {
        username: response.content.nombre,
        email: response.content.email,
        role: response.content.rol,
        profilePic: 'img/default_profile.png',
        favorites: []
      };

      onLogin(userData);
      navigate('/profile');

    } catch (error) {
      console.error('Error en login:', error);
      setError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="login-container">
      <div className="auth-form">
        <div id="login-form">
          <h2>Iniciar Sesión en GamingHub</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="login-email">Correo electrónico:</label>
            <input
              type="email"
              id="login-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingresa tu correo electrónico"
              required
            />

            <label htmlFor="login-password">Contraseña:</label>
            <input
              type="password"
              id="login-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              required
            />

            <button id="login-btn" type="submit" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
            {error && <p id="login-error" style={{ color: 'red' }}>{error}</p>}
          </form>
          <p><a href="#" id="show-register" onClick={() => navigate('/register')}>¿No tienes cuenta? Regístrate</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
