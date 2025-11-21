import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterForm from '../RegisterForm';

const mockOnRegister = vi.fn();
const mockOnToggleForm = vi.fn();

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render register form correctly', () => {
    render(<RegisterForm onRegister={mockOnRegister} onToggleForm={mockOnToggleForm} />);
    
    expect(screen.getByText('Crear Cuenta en GamingHub')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre de usuario:')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico:')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña:')).toBeInTheDocument();
    expect(screen.getByLabelText('Rol:')).toBeInTheDocument();
  });

  it('should show moderator request section when Moderador role is selected', () => {
    render(<RegisterForm onRegister={mockOnRegister} onToggleForm={mockOnToggleForm} />);
    
    const roleSelect = screen.getByLabelText('Rol:');
    fireEvent.change(roleSelect, { target: { value: 'Moderador' } });
    
    expect(screen.getByText('Reglas para Moderadores:')).toBeInTheDocument();
    expect(screen.getByLabelText('Describe por qué quieres ser moderador:')).toBeInTheDocument();
  });

  it('should hide moderator request section for other roles', () => {
    render(<RegisterForm onRegister={mockOnRegister} onToggleForm={mockOnToggleForm} />);
    
    const roleSelect = screen.getByLabelText('Rol:');
    fireEvent.change(roleSelect, { target: { value: 'UsuarioBasico' } });
    
    expect(screen.queryByText('Reglas para Moderadores:')).not.toBeInTheDocument();
  });

  it('should call onRegister with correct data for basic user', async () => {
    mockOnRegister.mockReturnValue({ success: true, message: 'Cuenta creada exitosamente' });
    
    render(<RegisterForm onRegister={mockOnRegister} onToggleForm={mockOnToggleForm} />);
    
    const usernameInput = screen.getByLabelText('Nombre de usuario:');
    const emailInput = screen.getByLabelText('Correo electrónico:');
    const passwordInput = screen.getByLabelText('Contraseña:');
    const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnRegister).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'testuser',
        'UsuarioBasico',
        undefined
      );
    });
  });

  it('should call onRegister with reason for moderator', async () => {
    mockOnRegister.mockReturnValue({ success: true, message: 'Solicitud enviada para revisión' });
    
    render(<RegisterForm onRegister={mockOnRegister} onToggleForm={mockOnToggleForm} />);
    
    const usernameInput = screen.getByLabelText('Nombre de usuario:');
    const emailInput = screen.getByLabelText('Correo electrónico:');
    const passwordInput = screen.getByLabelText('Contraseña:');
    const roleSelect = screen.getByLabelText('Rol:');
    const reasonTextarea = screen.getByLabelText('Describe por qué quieres ser moderador:');
    const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' });
    
    fireEvent.change(usernameInput, { target: { value: 'moderator' } });
    fireEvent.change(emailInput, { target: { value: 'moderator@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(roleSelect, { target: { value: 'Moderador' } });
    fireEvent.change(reasonTextarea, { target: { value: 'I want to help the community' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnRegister).toHaveBeenCalledWith(
        'moderator@example.com',
        'password123',
        'moderator',
        'Moderador',
        'I want to help the community'
      );
    });
  });

  it('should display success message when registration is successful', async () => {
    mockOnRegister.mockReturnValue({ success: true, message: 'Cuenta creada exitosamente' });
    
    render(<RegisterForm onRegister={mockOnRegister} onToggleForm={mockOnToggleForm} />);
    
    const usernameInput = screen.getByLabelText('Nombre de usuario:');
    const emailInput = screen.getByLabelText('Correo electrónico:');
    const passwordInput = screen.getByLabelText('Contraseña:');
    const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Cuenta creada exitosamente')).toBeInTheDocument();
    });
  });

  it('should display error message when registration fails', async () => {
    mockOnRegister.mockReturnValue({ success: false, message: 'El correo electrónico ya está registrado' });
    
    render(<RegisterForm onRegister={mockOnRegister} onToggleForm={mockOnToggleForm} />);
    
    const usernameInput = screen.getByLabelText('Nombre de usuario:');
    const emailInput = screen.getByLabelText('Correo electrónico:');
    const passwordInput = screen.getByLabelText('Contraseña:');
    const submitButton = screen.getByRole('button', { name: 'Crear Cuenta' });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('El correo electrónico ya está registrado')).toBeInTheDocument();
    });
  });

  it('should call onToggleForm when login link is clicked', () => {
    render(<RegisterForm onRegister={mockOnRegister} onToggleForm={mockOnToggleForm} />);
    
    const loginLink = screen.getByText('¿Ya tienes cuenta? Inicia Sesión');
    fireEvent.click(loginLink);
    
    expect(mockOnToggleForm).toHaveBeenCalled();
  });
});
