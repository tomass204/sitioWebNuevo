import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
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
    </Router>
  );
};

export default App;
