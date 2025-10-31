import { NewsService } from '../NewsService';

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

describe('NewsService', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  describe('getAllNews', () => {
    it('should return empty array when no news exist', async () => {
      localStorageMock.getItem.mockReturnValue('[]');

      const result = await NewsService.getAllNews();
      
      expect(result).toEqual([]);
    });

    it('should return existing news', async () => {
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

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockNews));

      const result = await NewsService.getAllNews();
      
      expect(result).toEqual(mockNews);
    });
  });

  describe('createNews', () => {
    it('should create new news item', async () => {
      localStorageMock.getItem.mockReturnValue('[]');

      const newsData = {
        title: 'New News',
        content: 'New content',
        image: 'new.jpg',
        author: 'test@example.com'
      };

      const result = await NewsService.createNews(newsData);
      
      expect(result.title).toBe('New News');
      expect(result.content).toBe('New content');
      expect(result.author).toBe('test@example.com');
      expect(result.id).toBeDefined();
      expect(result.comments).toEqual([]);
      expect(result.createdAt).toBeDefined();
    });
  });

  describe('addComment', () => {
    it('should add comment to news item', async () => {
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

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockNews));

      await NewsService.addComment('1', {
        text: 'Test comment',
        author: 'commenter@example.com'
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'gaminghub_news',
        expect.stringContaining('Test comment')
      );
    });
  });

  describe('likeComment', () => {
    it('should like a comment', async () => {
      const mockNews = [
        {
          id: '1',
          title: 'Test News',
          content: 'Test content',
          image: 'test.jpg',
          author: 'test@example.com',
          comments: [
            {
              id: 'comment1',
              text: 'Test comment',
              author: 'commenter@example.com',
              likes: 0,
              liked: false,
              createdAt: '2023-01-01T00:00:00.000Z'
            }
          ],
          createdAt: '2023-01-01T00:00:00.000Z'
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockNews));

      await NewsService.likeComment('1', 'comment1');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'gaminghub_news',
        expect.stringContaining('"likes":1')
      );
    });
  });

  describe('deleteNews', () => {
    it('should delete news item', async () => {
      const mockNews = [
        {
          id: '1',
          title: 'Test News',
          content: 'Test content',
          image: 'test.jpg',
          author: 'test@example.com',
          comments: [],
          createdAt: '2023-01-01T00:00:00.000Z'
        },
        {
          id: '2',
          title: 'Another News',
          content: 'Another content',
          image: 'another.jpg',
          author: 'test@example.com',
          comments: [],
          createdAt: '2023-01-01T00:00:00.000Z'
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockNews));

      await NewsService.deleteNews('1');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'gaminghub_news',
        expect.not.stringContaining('"id":"1"')
      );
    });
  });
});
