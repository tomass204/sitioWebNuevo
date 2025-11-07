import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (path) => {
    navigate(path);
  };

  return (
    <header>
      <img src="img/gaminghub_logo.png" alt="Gaming Hub Logo" id="logo" />
      <div>
        <h1>GamingHub - Comunidad de Juegos</h1>
        <p>Debates, noticias y comunidad de juegos populares</p>
      </div>
      {user && (
        <div className="user-profile">
          <img id="profile-pic" src={user?.profilePic || "img/default_profile.png"} alt="Foto de Perfil" />
          <p>Bienvenido, <span id="user-role">{user?.role || "Usuario"}</span></p>
        </div>
      )}
      {user && <button id="logout-btn" onClick={onLogout}>Cerrar Sesión</button>}

      <nav id="tabs">
        {user && (
          <>
            <button className={`tab-button ${location.pathname === '/profile' ? 'active' : ''}`} onClick={() => handleTabClick('/profile')}>
              <i className="fas fa-user"></i> Perfil
            </button>
            <button className={`tab-button ${location.pathname === '/news' ? 'active' : ''}`} onClick={() => handleTabClick('/news')}>
              <i className="fas fa-newspaper"></i> Noticias
            </button>
            <button className={`tab-button ${location.pathname === '/debates' ? 'active' : ''}`} onClick={() => handleTabClick('/debates')}>
              <i className="fas fa-comments"></i> Debates
            </button>
            <button className={`tab-button ${location.pathname === '/games' ? 'active' : ''}`} onClick={() => handleTabClick('/games')}>
              <i className="fas fa-gamepad"></i> Juegos
            </button>
            {(user?.role === 'Influencer' || user?.role === 'Moderador') && (
              <button className={`tab-button ${location.pathname === '/favorites' ? 'active' : ''}`} onClick={() => handleTabClick('/favorites')}>
                <i className="fas fa-heart"></i> Favoritos
              </button>
            )}
          </>
        )}
        <button className={`tab-button ${location.pathname === '/about' ? 'active' : ''}`} onClick={() => handleTabClick('/about')}>
          <i className="fas fa-info-circle"></i> Acerca de
        </button>
      </nav>
    </header>
  );
};

export default Header;
