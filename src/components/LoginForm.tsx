import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onToggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  };

  return (
    <Card className="auth-form">
      <Card.Body>
        <h2 className="text-center mb-4">Iniciar Sesión en GamingHub</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="login-email">Correo electrónico:</Form.Label>
            <Form.Control
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo electrónico"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label htmlFor="login-password">Contraseña:</Form.Label>
            <Form.Control
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              id="login-show-password"
              type="checkbox"
              label="Mostrar contraseña"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
          </Form.Group>

          <Button 
            type="button"
            onClick={handleSubmit}
            className="btn-custom w-100 mb-3"
            size="lg"
          >
            Iniciar Sesión
          </Button>

          <div className="text-center">
            <Button 
              variant="link" 
              onClick={onToggleForm}
              className="text-decoration-none"
            >
              ¿No tienes cuenta? Regístrate
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LoginForm;
