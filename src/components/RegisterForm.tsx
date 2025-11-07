import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';

interface RegisterFormProps {
  onRegister: (email: string, password: string, username: string, role: string, reason?: string) => { success: boolean; message: string; statusCode?: number; userId?: string };
  onToggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('UsuarioBasico');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setError('');
    setSuccess('');

    const result = onRegister(email, password, username, role, role === 'Moderador' ? reason : undefined);
    
    if (result.success) {
      setSuccess(result.message);
      if (role !== 'Moderador') {
        // Clear form and switch to login after 2 seconds
        setTimeout(() => {
          setEmail('');
          setPassword('');
          setUsername('');
          setRole('UsuarioBasico');
          setReason('');
          setSuccess('');
          onToggleForm();
        }, 2000);
      } else {
        // Clear form but stay on register form for moderator requests
        setEmail('');
        setPassword('');
        setUsername('');
        setRole('UsuarioBasico');
        setReason('');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <Card className="auth-form">
      <Card.Body>
        <h2 className="text-center mb-4">Crear Cuenta en GamingHub</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="register-username">Nombre de usuario:</Form.Label>
            <Form.Control
              id="register-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu nombre de usuario"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="register-email">Correo electrónico:</Form.Label>
            <Form.Control
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo electrónico"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="register-password">Contraseña:</Form.Label>
            <Form.Control
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="register-role">Rol:</Form.Label>
            <Form.Select
              id="register-role"
              value={role}
              onChange={(e) => setRole((e.target as HTMLSelectElement).value)}
            >
              <option value="UsuarioBasico">Usuario Básico</option>
              <option value="Influencer">Influencer</option>
              <option value="Moderador">Moderador</option>
            </Form.Select>
          </Form.Group>

          {role === 'Moderador' && (
            <Form.Group className="mb-3">
              <h4>Reglas para Moderadores:</h4>
              <ul>
                <li>No abusar de eliminar comentarios o publicaciones.</li>
                <li>Usar advertencias de manera justa y proporcional.</li>
                <li>Promover un ambiente positivo en la comunidad.</li>
              </ul>
            </Form.Group>
          )}

          <Form.Group className="mb-3" style={{ display: role === 'Moderador' ? 'block' : 'none' }}>
            <Form.Label htmlFor="register-moderator-reason">Describe por qué quieres ser moderador:</Form.Label>
            <Form.Control
              id="register-moderator-reason"
              as="textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Escribe tu motivo aquí..."
              required={role === 'Moderador'}
            />
          </Form.Group>

          <Button 
            type="button"
            onClick={handleSubmit}
            className="btn-custom w-100 mb-3"
            size="lg"
          >
            {role === 'Moderador' ? 'Enviar Solicitud' : 'Crear Cuenta'}
          </Button>

          <div className="text-center">
            <Button 
              variant="link" 
              onClick={onToggleForm}
              className="text-decoration-none"
            >
              ¿Ya tienes cuenta? Inicia Sesión
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RegisterForm;
