import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login logic here
    if (formData.email === '' || formData.password === '') {
      setError('Credenciales incorrectas');
    } else {
      setError('');
      // Simulate user data returned from backend
      const userData = {
        username: 'UsuarioDemo',
        email: formData.email,
        role: 'UsuarioBasico',
        profilePic: 'img/default_profile.png',
        favorites: [
          { id: 1, content: 'Comentario favorito 1', author: 'Autor1' },
          { id: 2, content: 'Comentario favorito 2', author: 'Autor2' }
        ]
      };
      onLogin(userData);
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

            <button id="login-btn" type="submit">Iniciar Sesión</button>
            <p id="login-error" style={{ color: 'red', display: error ? 'block' : 'none' }}>{error}</p>
          </form>
          <p><a href="#" id="show-register" onClick={() => navigate('/register')}>¿No tienes cuenta? Regístrate</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
