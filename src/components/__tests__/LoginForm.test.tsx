import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../LoginForm';

const mockOnLogin = jest.fn();
const mockOnToggleForm = jest.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form correctly', () => {
    render(<LoginForm onLogin={mockOnLogin} onToggleForm={mockOnToggleForm} />);
    
    expect(screen.getByText('Iniciar Sesión en GamingHub')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico:')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
  });

  it('should show error when form is submitted with empty fields', async () => {
    render(<LoginForm onLogin={mockOnLogin} onToggleForm={mockOnToggleForm} />);
    
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Por favor completa todos los campos')).toBeInTheDocument();
    });
  });

  it('should call onLogin when form is submitted with valid data', async () => {
    render(<LoginForm onLogin={mockOnLogin} onToggleForm={mockOnToggleForm} />);
    
    const emailInput = screen.getByLabelText('Correo electrónico:');
    const passwordInput = screen.getByLabelText('Contraseña:');
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should toggle password visibility', () => {
    render(<LoginForm onLogin={mockOnLogin} onToggleForm={mockOnToggleForm} />);
    
    const passwordInput = screen.getByLabelText('Contraseña:');
    const showPasswordCheckbox = screen.getByLabelText('Mostrar contraseña');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(showPasswordCheckbox);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(showPasswordCheckbox);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should call onToggleForm when register link is clicked', () => {
    render(<LoginForm onLogin={mockOnLogin} onToggleForm={mockOnToggleForm} />);
    
    const registerLink = screen.getByText('¿No tienes cuenta? Regístrate');
    fireEvent.click(registerLink);
    
    expect(mockOnToggleForm).toHaveBeenCalled();
  });

  it('should display error message when onLogin throws error', async () => {
    mockOnLogin.mockImplementation(() => {
      throw new Error('Invalid credentials');
    });
    
    render(<LoginForm onLogin={mockOnLogin} onToggleForm={mockOnToggleForm} />);
    
    const emailInput = screen.getByLabelText('Correo electrónico:');
    const passwordInput = screen.getByLabelText('Contraseña:');
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
