import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAPI from '../js/api/auth.js';


const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'UsuarioBasico',
    moderatorReason: ''
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

    // Validaciones
    if (formData.role === 'Moderador' && formData.moderatorReason === '') {
      setError('Por favor describe por qué quieres ser moderador.');
      setIsLoading(false);
      return;
    }

    if (formData.role === 'Influencer' && formData.username === '') {
      setError('Para ser influencer necesitas un nombre de usuario válido.');
      setIsLoading(false);
      return;
    }

    try {
      // Preparar datos para la API
      const userData = {
        nombre: formData.username,
        email: formData.email,
        contrasena: formData.password,
        rol: formData.role
      };

      console.log('Enviando datos de registro:', userData);
      console.log('URL de registro:', 'http://localhost:8081/api/GamingHub/v1/Usuario');

      const response = await AuthAPI.register(userData);

      console.log('Respuesta del servidor:', response);

      // Registro exitoso
      alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
      navigate('/login');

    } catch (error) {
      console.error('Error completo en registro:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      // Manejo de errores más específico
      if (error.message.includes('Ya existe un usuario')) {
        setError('Ya existe una cuenta con este email.');
      } else if (error.message.includes('400')) {
        setError('Error en los datos proporcionados. Verifica que todos los campos estén correctos.');
      } else if (error.message.includes('500')) {
        setError('Error del servidor. Inténtalo de nuevo más tarde.');
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setError('No se puede conectar al servidor. Asegúrate de que el backend esté corriendo en http://localhost:8081');
      } else {
        setError(`Error al crear la cuenta: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <section id="register">
        <h2>Crear Cuenta en GamingHub</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Nombre de usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Ingresa tu nombre de usuario"
            required
          />

          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ingresa tu correo electrónico"
            required
          />

          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            required
          />

          <label htmlFor="role">Rol:</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange}>
            <option value="UsuarioBasico">Usuario Básico</option>
            <option value="Influencer">Influencer</option>
            <option value="Moderador">Moderador</option>
          </select>

          {formData.role === 'Moderador' && (
            <div id="moderator-request">
              <h4>Reglas para Moderadores:</h4>
              <ul>
                <li>No abusar de eliminar comentarios o publicaciones.</li>
                <li>Usar advertencias de manera justa y proporcional.</li>
                <li>Promover un ambiente positivo en la comunidad.</li>
              </ul>
              <label htmlFor="moderator-reason">Describe por qué quieres ser moderador:</label>
              <textarea
                id="moderator-reason"
                name="moderatorReason"
                value={formData.moderatorReason}
                onChange={handleChange}
                placeholder="Escribe tu motivo aquí..."
                required
              ></textarea>
            </div>
          )}

          {formData.role === 'Influencer' && (
            <div id="influencer-info">
              <h4>Beneficios de ser Influencer:</h4>
              <ul>
                <li>Publicar noticias y contenido gaming</li>
                <li>Crear debates sobre juegos</li>
                <li>Agregar juegos a la galería</li>
                <li>Construir tu reputación en la comunidad</li>
              </ul>
              <p style={{fontSize: '14px', color: '#666', fontStyle: 'italic'}}>
                Como influencer podrás compartir tu pasión por los videojuegos con la comunidad.
              </p>
            </div>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
          {error && <p id="register-error" style={{ color: 'red' }}>{error}</p>}
        </form>
          <p><a href="#" id="show-login" onClick={() => navigate('/login')}>¿Ya tienes cuenta? Inicia Sesión</a></p>
      </section>
    </main>
  );
};

export default RegisterPage;
