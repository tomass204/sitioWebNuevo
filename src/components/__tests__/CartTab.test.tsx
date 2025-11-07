import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CartTab from '../tabs/CartTab';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

const mockUser = {
  email: 'test@example.com',
  username: 'testuser',
  role: 'UsuarioBasico',
  warnings: [],
  profilePic: 'img/UsuarioBasico.png',
  bannedUntil: 0,
  banCount: 0
};

describe('CartTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render cart tab correctly', () => {
    localStorageMock.getItem.mockReturnValue('[]');
    
    render(<CartTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    
    expect(screen.getByText('Carrito de Compras')).toBeInTheDocument();
  });

  it('should show empty cart message when cart is empty', () => {
    localStorageMock.getItem.mockReturnValue('[]');
    
    render(<CartTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    
    expect(screen.getByText('Tu carrito está vacío. Agrega algunos juegos desde la pestaña "Juegos".')).toBeInTheDocument();
  });

  it('should display cart items when cart has items', () => {
    const mockCartItems = [
      {
        id: '1',
        title: 'Test Game',
        price: 29.99,
        image: 'test.jpg',
        description: 'Test game description'
      },
      {
        id: '2',
        title: 'Another Game',
        price: 19.99,
        image: 'another.jpg',
        description: 'Another game description'
      }
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCartItems));
    
    render(<CartTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    
    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('Another Game')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  it('should calculate total correctly', () => {
    const mockCartItems = [
      {
        id: '1',
        title: 'Test Game',
        price: 29.99,
        image: 'test.jpg',
        description: 'Test game description'
      },
      {
        id: '2',
        title: 'Another Game',
        price: 19.99,
        image: 'another.jpg',
        description: 'Another game description'
      }
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCartItems));
    
    render(<CartTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    
    expect(screen.getByText('$49.98')).toBeInTheDocument();
    expect(screen.getByText('Total (2 items):')).toBeInTheDocument();
  });

  it('should remove item from cart when remove button is clicked', () => {
    const mockCartItems = [
      {
        id: '1',
        title: 'Test Game',
        price: 29.99,
        image: 'test.jpg',
        description: 'Test game description'
      }
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCartItems));
    
    render(<CartTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    
    const removeButton = screen.getByRole('button', { name: /trash/i });
    fireEvent.click(removeButton);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('gaminghub_cart', '[]');
  });

  it('should show checkout button when cart has items', () => {
    const mockCartItems = [
      {
        id: '1',
        title: 'Test Game',
        price: 29.99,
        image: 'test.jpg',
        description: 'Test game description'
      }
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCartItems));
    
    render(<CartTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    
    expect(screen.getByText('Proceder al Pago')).toBeInTheDocument();
  });

  it('should handle checkout process', () => {
    const mockCartItems = [
      {
        id: '1',
        title: 'Test Game',
        price: 29.99,
        image: 'test.jpg',
        description: 'Test game description'
      }
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCartItems));
    
    // Mock window.alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<CartTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    
    const checkoutButton = screen.getByText('Proceder al Pago');
    fireEvent.click(checkoutButton);
    
    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining('Gracias por tu compra!')
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith('gaminghub_cart', '[]');
    
    alertSpy.mockRestore();
  });

  it('should show alert when checkout is attempted with empty cart', () => {
    localStorageMock.getItem.mockReturnValue('[]');
    
    // Mock window.alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<CartTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    
    const checkoutButton = screen.getByText('Proceder al Pago');
    fireEvent.click(checkoutButton);
    
    expect(alertSpy).toHaveBeenCalledWith('El carrito está vacío. Agrega juegos antes de proceder al pago.');
    
    alertSpy.mockRestore();
  });
});
