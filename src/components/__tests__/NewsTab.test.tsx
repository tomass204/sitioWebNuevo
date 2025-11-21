import React from 'react';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewsTab from '../tabs/NewsTab';
import { NewsService } from '../../services/NewsService';

// Mock the NewsService
vi.mock('../../services/NewsService', () => ({
  NewsService: {
    getAllNews: vi.fn(),
    createNews: vi.fn(),
    addComment: vi.fn(),
    likeComment: vi.fn(),
    deleteNews: vi.fn()
  }
}));

// Mock the NewsItem type for testing
const mockNewsItem = (id: string, author: string = 'test@example.com') => ({
  id,
  title: `Test News ${id}`,
  content: 'Test content',
  image: 'test.jpg',
  author,
  comments: [],
  createdAt: new Date().toISOString()
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

describe('NewsTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render news tab correctly', async () => {
    // Mock the getAllNews to return an empty array
    (NewsService.getAllNews as jest.Mock).mockResolvedValue([]);
    
    await act(async () => {
      render(<NewsTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    });
    
    expect(screen.getByText('Noticias')).toBeInTheDocument();
    expect(screen.getByText('Lee las últimas noticias sobre juegos.')).toBeInTheDocument();
  });

  it('should show create news form for influencers', async () => {
    // Mock the getAllNews to return an empty array
    (NewsService.getAllNews as jest.Mock).mockResolvedValue([]);
    
    await act(async () => {
      render(<NewsTab currentUser={mockUser} currentRole="Influencer" />);
    });
    
    expect(screen.getByText('Publicar noticia')).toBeInTheDocument();
    expect(screen.getByText('Nueva Noticia')).toBeInTheDocument();
  });

  it('should not show create news form for non-influencers', async () => {
    // Mock the getAllNews to return an empty array
    (NewsService.getAllNews as jest.Mock).mockResolvedValue([]);
    
    await act(async () => {
      render(<NewsTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    });
    
    expect(screen.queryByText('Publicar noticia')).not.toBeInTheDocument();
  });

  it('should toggle create news form when button is clicked', async () => {
    // Mock the getAllNews to return an empty array
    (NewsService.getAllNews as jest.Mock).mockResolvedValue([]);
    
    await act(async () => {
      render(<NewsTab currentUser={mockUser} currentRole="Influencer" />);
    });
    
    // Wait for the initial render to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /nueva noticia/i })).toBeInTheDocument();
    });
    
    const toggleButton = screen.getByRole('button', { name: /nueva noticia/i });
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    
    // Check for form elements by their placeholders
    expect(screen.getByPlaceholderText('Título de la noticia')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contenido de la noticia')).toBeInTheDocument();
    
    // Check for the cancel button
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await act(async () => {
      fireEvent.click(cancelButton);
    });
    
    // The form should be hidden now
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Título de la noticia')).not.toBeInTheDocument();
    });
  });

  it('should render news items when loaded', async () => {
    const mockNews = [mockNewsItem('1')];
    (NewsService.getAllNews as jest.Mock).mockResolvedValue(mockNews);

    await act(async () => {
      render(<NewsTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Test News 1')).toBeInTheDocument();
    });
  });

  it('should show delete button for moderators and owners', async () => {
    const mockNews = [mockNewsItem('1')];
    (NewsService.getAllNews as jest.Mock).mockResolvedValue(mockNews);

    // Test for moderator
    await act(async () => {
      render(<NewsTab currentUser={{ ...mockUser, role: 'Moderador' }} currentRole="Moderador" />);
    });
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /eliminar/i })).toBeInTheDocument();
    });

    // Clear the mocks and render again for owner test
    vi.clearAllMocks();
    (NewsService.getAllNews as jest.Mock).mockResolvedValue(mockNews);

    // Test for owner
    await act(async () => {
      render(<NewsTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    });
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /eliminar/i })).toBeInTheDocument();
    });
  });

  it('should not show delete button for regular users', async () => {
    const mockNews = [mockNewsItem('1')];
    (NewsService.getAllNews as jest.Mock).mockResolvedValue(mockNews);

    await act(async () => {
      render(<NewsTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    });
    
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /eliminar/i })).not.toBeInTheDocument();
    });
  });

  it('should show comment form for non-owners', async () => {
    const mockNews = [mockNewsItem('1', 'other@example.com')];
    (NewsService.getAllNews as jest.Mock).mockResolvedValue(mockNews);

    await act(async () => {
      render(<NewsTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    });
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Escribe un comentario...')).toBeInTheDocument();
    });
  });

  it('should not show comment form for owners', async () => {
    const newsItem = {
      ...mockNewsItem('1'),
      // Make sure the author matches the current user
      author: mockUser.email,
      comments: []
    };
    
    (NewsService.getAllNews as jest.Mock).mockResolvedValue([newsItem]);

    await act(async () => {
      render(<NewsTab currentUser={mockUser} currentRole="UsuarioBasico" />);
    });
    
    // Wait for the news to load
    await waitFor(() => {
      expect(screen.getByText('Test News 1')).toBeInTheDocument();
    });
    
    // The comment form should not be visible for the owner of the post
    const commentForms = screen.queryAllByRole('form', { name: /comentario/i });
    expect(commentForms.length).toBe(0);
  });
});
