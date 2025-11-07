import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import MainContent from './components/MainContent';
import BanScreen from './components/BanScreen';

// Import context
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const {
    currentUser,
    currentRole,
    isLoggedIn,
    isBanned,
    banTimeRemaining,
    login,
    register,
    logout,
    toggleForm,
    showLogin,
  } = useAuth();

  if (isBanned) {
    return <BanScreen banTimeRemaining={banTimeRemaining} />;
  }

  if (!isLoggedIn) {
    return (
      <Container fluid className="login-container">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={6} lg={4}>
            {showLogin ? (
              <LoginForm onLogin={login} onToggleForm={toggleForm} />
            ) : (
              <RegisterForm onRegister={register} onToggleForm={toggleForm} />
            )}
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <MainContent
      currentUser={currentUser}
      currentRole={currentRole}
      onLogout={logout}
    />
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
