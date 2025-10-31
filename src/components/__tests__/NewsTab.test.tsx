import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewsTab from '../tabs/NewsTab';

// Mock the NewsService
jest.mock('../../services/NewsService', () => ({
  NewsService: {
    getAllNews: jest.fn(),
    createNews: jest.fn(),
    addComment: jest.fn(),
    likeComment: jest.fn(),
    deleteNews: jest.fn()
  }
}));

const mockUser = {
  email: 'test@example.com',
  username: 'testuser',
  role: 'UsuarioBasico',
  warnings: [],
  profilePic: 'img/UsuarioBasico.png',
  bannedUntil: 0,
  banCount: 0
};

describe('NewsTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render news tab correctly', () => {
    render(<NewsTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    
    expect(screen.getByText('Noticias')).toBeInTheDocument();
    expect(screen.getByText('Lee las últimas noticias sobre juegos.')).toBeInTheDocument();
  });

  it('should show create news form for influencers', () => {
    render(<NewsTab currentUser={mockUser} currentRole="Influencer" />);
    
    expect(screen.getByText('Publicar noticia')).toBeInTheDocument();
    expect(screen.getByText('Nueva Noticia')).toBeInTheDocument();
  });

  it('should not show create news form for non-influencers', () => {
    render(<NewsTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    
    expect(screen.queryByText('Publicar noticia')).not.toBeInTheDocument();
  });

  it('should toggle create news form when button is clicked', () => {
    render(<NewsTab currentUser={mockUser} currentRole="Influencer" />);
    
    const toggleButton = screen.getByText('Nueva Noticia');
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('should render news items when loaded', async () => {
    const mockNews = [
      {
        id: '1',
        title: 'Test News',
        content: 'Test content',
        image: 'test.jpg',
        author: 'test@example.com',
        comments: [],
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    ];

    const { NewsService } = require('../../services/NewsService');
    NewsService.getAllNews.mockResolvedValue(mockNews);

    render(<NewsTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    
    await waitFor(() => {
      expect(screen.getByText('Test News')).toBeInTheDocument();
    });
  });

  it('should show delete button for moderators and owners', async () => {
    const mockNews = [
      {
        id: '1',
        title: 'Test News',
        content: 'Test content',
        image: 'test.jpg',
        author: 'test@example.com',
        comments: [],
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    ];

    const { NewsService } = require('../../services/NewsService');
    NewsService.getAllNews.mockResolvedValue(mockNews);

    render(<NewsTab currentUser={mockUser} currentRole="Moderador" />);
    
    await waitFor(() => {
      expect(screen.getByText('Eliminar Publicación')).toBeInTheDocument();
    });
  });

  it('should not show delete button for regular users', async () => {
    const mockNews = [
      {
        id: '1',
        title: 'Test News',
        content: 'Test content',
        image: 'test.jpg',
        author: 'test@example.com',
        comments: [],
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    ];

    const { NewsService } = require('../../services/NewsService');
    NewsService.getAllNews.mockResolvedValue(mockNews);

    render(<NewsTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    
    await waitFor(() => {
      expect(screen.queryByText('Eliminar Publicación')).not.toBeInTheDocument();
    });
  });

  it('should show comment form for non-owners', async () => {
    const mockNews = [
      {
        id: '1',
        title: 'Test News',
        content: 'Test content',
        image: 'test.jpg',
        author: 'test@example.com',
        comments: [],
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    ];

    const { NewsService } = require('../../services/NewsService');
    NewsService.getAllNews.mockResolvedValue(mockNews);

    render(<NewsTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Escribe un comentario...')).toBeInTheDocument();
    });
  });

  it('should not show comment form for owners', async () => {
    const mockNews = [
      {
        id: '1',
        title: 'Test News',
        content: 'Test content',
        image: 'test.jpg',
        author: 'test@example.com',
        comments: [],
        createdAt: '2023-01-01T00:00:00.000Z'
      }
    ];

    const { NewsService } = require('../../services/NewsService');
    NewsService.getAllNews.mockResolvedValue(mockNews);

    render(<NewsTab currentUser={mockUser} currentRole="Propietario" />);
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Escribe un comentario...')).not.toBeInTheDocument();
    });
  });
});
