import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../LoginForm';

const mockOnLogin = vi.fn();
const mockOnToggleForm = vi.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      expect(screen.getByText('Por favor ingresa tu correo electrónico')).toBeInTheDocument();
    });
    
    expect(mockOnLogin).not.toHaveBeenCalled();
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
    
    expect(mockOnToggleForm).not.toHaveBeenCalled();
  });

  it('should toggle password visibility', () => {
    render(<LoginForm onLogin={mockOnLogin} onToggleForm={mockOnToggleForm} />);
    
    const passwordInput = screen.getByLabelText('Contraseña:') as HTMLInputElement;
    const toggleButton = screen.getByLabelText('Mostrar contraseña');
    
    // Password should be hidden by default
    expect(passwordInput.type).toBe('password');
    
    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    
    // Click again to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
    
    // Verify no side effects
    expect(mockOnLogin).not.toHaveBeenCalled();
    expect(mockOnToggleForm).not.toHaveBeenCalled();
  });

  it('should call onToggleForm when register link is clicked', () => {
    render(<LoginForm onLogin={mockOnLogin} onToggleForm={mockOnToggleForm} />);
    
    const registerLink = screen.getByText('¿No tienes cuenta? Regístrate');
    fireEvent.click(registerLink);
    
    expect(mockOnToggleForm).toHaveBeenCalledTimes(1);
    expect(mockOnLogin).not.toHaveBeenCalled();
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
