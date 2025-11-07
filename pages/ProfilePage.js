import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProfilePage = ({ user }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update logic here
    console.log('Profile update data:', formData);
  };

  return (
    <div>
      <Header user={user} activeTab="profile" />
      <main>
        <section id="profile">
          <h2>Perfil de Usuario</h2>
          <div className="user-info">
            <img id="profile-pic" src={user?.profilePic || "img/default_profile.png"} alt="Foto de Perfil" />
            <p>Nombre de usuario: {user?.username}</p>
            <p>Rol: {user?.role}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Nombre de usuario:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Correo electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Nueva Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Deja en blanco para no cambiar"
            />

            <button type="submit">Actualizar Perfil</button>
          </form>

          {user?.role === 'Moderador' && (
            <div id="moderator-tools">
              <h3>Herramientas de Moderador</h3>
              <button id="moderate-btn">Moderar Comentarios</button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
