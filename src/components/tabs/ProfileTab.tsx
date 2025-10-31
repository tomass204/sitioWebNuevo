import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { AuthService, User } from '../../services/AuthService';
import { UserService } from '../../services/UserService';

interface ProfileTabProps {
  currentUser: User | null;
  currentRole: string | null;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ currentUser, currentRole }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentUser) return;

    const updates: { username?: string; password?: string; newEmail?: string } = {};
    if (username && username !== currentUser.username) {
      updates.username = username;
    }
    if (password) {
      updates.password = password;
    }
    if (email && email !== currentUser.email) {
      updates.newEmail = email;
    }

    const result = AuthService.updateProfile(currentUser.email, updates);
    // Simulate PUT request response with status code
    if (result.success) {
      console.log(`PUT /api/GamingHub/v1/Usuario/Perfil - Status: ${result.statusCode} - ${result.message}`);
      console.log(`Parameters: Nombre de usuario: ${username}, Correo electrónico: ${email}, Nueva contraseña: ********`);
      setSuccess(result.message);
      setPassword('');
    } else {
      console.log(`PUT /api/GamingHub/v1/Usuario/Perfil - Status: ${result.statusCode} - Error: ${result.message}`);
      console.log(`Parameters: Nombre de usuario: ${username}, Correo electrónico: ${email}, Nueva contraseña: ********`);
      setError(result.message);
    }
  };

  if (!currentUser) {
    return <div>Cargando...</div>;
  }

  return (
    <Row>
      <Col md={8} className="mx-auto">
        <Card>
          <Card.Header>
            <h2>Perfil de Usuario</h2>
            <p>Administra tu perfil y configuración.</p>
          </Card.Header>
          <Card.Body>
            <div className="text-center mb-4">
              <img 
                src={currentUser.profilePic || '/img/default_profile.png'} 
                alt="Profile" 
                className="profile-pic"
              />
            </div>

            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre de usuario:</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu nombre de usuario"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico:</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo electrónico"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nueva contraseña:</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa nueva contraseña (opcional)"
                />
              </Form.Group>

              <Button type="submit" variant="primary">
                Actualizar Perfil
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfileTab;
