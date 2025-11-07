import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainContent from '../MainContent';

const mockUser = {
  email: 'test@example.com',
  username: 'testuser',
  role: 'UsuarioBasico',
  warnings: [],
  profilePic: 'img/UsuarioBasico.png',
  bannedUntil: 0,
  banCount: 0
};

const mockOnLogout = jest.fn();

describe('MainContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render main content with navigation', () => {
    render(<MainContent currentUser={mockUser} currentRole="UsuarioBasico" onLogout={mockOnLogout} />);
    
    expect(screen.getByText('GamingHub')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByText('Noticias')).toBeInTheDocument();
    expect(screen.getByText('Debates')).toBeInTheDocument();
    expect(screen.getByText('Juegos')).toBeInTheDocument();
    expect(screen.getByText('Carrito')).toBeInTheDocument();
    expect(screen.getByText('Favoritos')).toBeInTheDocument();
    expect(screen.getByText('Acerca de')).toBeInTheDocument();
  });

  it('should show favorites tab for basic users', () => {
    render(<MainContent currentUser={mockUser} currentRole="UsuarioBasico" onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Favoritos')).toBeInTheDocument();
  });

  it('should show moderation tab for owner', () => {
    render(<MainContent currentUser={mockUser} currentRole="Propietario" onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Moderación')).toBeInTheDocument();
  });

  it('should not show moderation tab for non-owner users', () => {
    render(<MainContent currentUser={mockUser} currentRole="UsuarioBasico" onLogout={mockOnLogout} />);
    
    expect(screen.queryByText('Moderación')).not.toBeInTheDocument();
  });

  it('should display user profile information', () => {
    render(<MainContent currentUser={mockUser} currentRole="UsuarioBasico" onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Bienvenido, UsuarioBasico')).toBeInTheDocument();
  });

  it('should call onLogout when logout is clicked', () => {
    render(<MainContent currentUser={mockUser} currentRole="UsuarioBasico" onLogout={mockOnLogout} />);
    
    const logoutButton = screen.getByText('Cerrar Sesión');
    fireEvent.click(logoutButton);
    
    expect(mockOnLogout).toHaveBeenCalled();
  });

  it('should switch tabs when navigation items are clicked', () => {
    render(<MainContent currentUser={mockUser} currentRole="UsuarioBasico" onLogout={mockOnLogout} />);
    
    const newsTab = screen.getByText('Noticias');
    fireEvent.click(newsTab);
    
    // The tab content should change (this would be tested more thoroughly with actual tab content)
    expect(newsTab).toHaveClass('active');
  });
});
