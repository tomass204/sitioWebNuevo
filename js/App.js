import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPageFixed';
import RegisterPage from './pages/RegisterPageFixed';
import ProfilePage from './pages/ProfilePage';
import NewsPage from './pages/NewsPage';
import DebatesPage from './pages/DebatesPage';
import GamesPage from './pages/GamesPage';
import FavoritesPage from './pages/FavoritesPage';
import AboutPage from './pages/AboutPage';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage on app load
    const storedUser = localStorage.getItem('currentUser');
    const storedRole = localStorage.getItem('currentRole');
    if (storedUser && storedRole) {
      const profilePic = storedRole === 'Influencer' ? 'img/Influencer.png' : 'img/UsuarioBasico.png';
      setUser({ email: storedUser, role: storedRole, profilePic });
    }
    // Add animations on load
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .bounce, .glow');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate');
      }, index * 100);
    });
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentRole');
  };

  const handleLogin = (userData) => {
    const profilePic = userData.role === 'Influencer' ? 'img/Influencer.png' : 'img/UsuarioBasico.png';
    setUser({ ...userData, profilePic });
    localStorage.setItem('currentUser', userData.email);
    localStorage.setItem('currentRole', userData.role);
  };

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/profile" /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={user ? <ProfilePage user={user} /> : <Navigate to="/" />} />
        <Route path="/news" element={user ? <NewsPage user={user} /> : <Navigate to="/" />} />
        <Route path="/debates" element={user ? <DebatesPage user={user} /> : <Navigate to="/" />} />
        <Route path="/games" element={user ? <GamesPage user={user} /> : <Navigate to="/" />} />
        <Route path="/favorites" element={user ? <FavoritesPage user={user} /> : <Navigate to="/" />} />
        <Route path="/about" element={<AboutPage user={user} />} />
      </Routes>
      <Footer />

      {/* Floating game elements */}
      <div className="floating-phone"></div>
      <div className="floating-minecraft"></div>
      <div className="floating-batman"></div>

      {/* Bouncing icons side by side */}
      <div className="bouncing-icons">
        <div className="bouncing-icon llorando"></div>
        <div className="bouncing-icon emote"></div>
        <div className="bouncing-icon troll"></div>
      </div>
    </Router>
  );
};

export default App;
