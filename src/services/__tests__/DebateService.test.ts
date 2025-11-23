import { describe, it, expect, vi, beforeEach, beforeAll, afterAll, afterEach } from 'vitest';
import { DebateService, DebateItem, Comment } from '../DebateService';

// Mock localStorage similar to UserService tests
class LocalStorageMock implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return index >= 0 && index < keys.length ? keys[index] : null;
  }

  getItem = vi.fn((key: string): string | null => {
    return this.store[key] || null;
  });

  setItem = vi.fn((key: string, value: string): void => {
    this.store[key] = value.toString();
  });

  removeItem = vi.fn((key: string): void => {
    delete this.store[key];
  });

  clear = vi.fn((): void => {
    this.store = {};
  });

  _getStore() {
    return { ...this.store };
  }
}

const localStorageMock = new LocalStorageMock();

beforeAll(() => {
  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true
  });
  if (typeof window === 'undefined') {
    // @ts-ignore
    global.window = {
      localStorage: localStorageMock,
      dispatchEvent: vi.fn(),
      Event: class {
        constructor(public type: string) {}
      }
    } as any;
  }
});

describe('DebateService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterAll(() => {
    vi.restoreAllMocks();
    localStorageMock.clear();
    if (global.window) {
      // @ts-ignore
      delete global.window;
    }
  });

  it('getAllDebates should initialize default debates if none exist', async () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    const debates = await DebateService.getAllDebates();
    expect(debates.length).toBeGreaterThan(0);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'gaminghub_debates',
      expect.any(String)
    );
  });

  it('createDebate should add a new debate and save it', async () => {
    localStorageMock.getItem.mockReturnValueOnce('[]');
    const debateData = {
      title: 'Test Debate',
      content: 'Content of test debate',
      image: '/img/test.png',
      author: 'author@test.com',
    };
    const newDebate = await DebateService.createDebate(debateData);
    expect(newDebate.title).toBe(debateData.title);
    expect(newDebate.comments).toEqual([]);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'gaminghub_debates',
      expect.stringContaining(debateData.title)
    );
  });

  it('addComment should add a comment to the specified debate', async () => {
    const debateId = '1';
    const existingDebates: DebateItem[] = [
      {
        id: debateId,
        title: 'Existing Debate',
        content: 'Some content',
        image: '/img/debate.png',
        author: 'author@test.com',
        comments: [],
        createdAt: new Date().toISOString()
      }
    ];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(existingDebates));
    const commentData = {
      text: 'New Comment',
      author: 'commenter@test.com'
    };
    await DebateService.addComment(debateId, commentData);
    expect(localStorageMock.setItem).toHaveBeenCalled();
    const savedDebates = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
    expect(savedDebates[0].comments.length).toBe(1);
    expect(savedDebates[0].comments[0].text).toBe(commentData.text);
  });

  it('likeComment should toggle like state and update likes', async () => {
    const debateId = '1';
    const commentId = '101';
    const existingDebates: DebateItem[] = [
      {
        id: debateId,
        title: 'Debate',
        content: 'Content',
        image: '/img/debate.png',
        author: 'author@test.com',
        comments: [
          {
            id: commentId,
            text: 'Comment',
            author: 'commenter@test.com',
            likes: 0,
            liked: false,
            favorite: false,
            createdAt: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString()
      }
    ];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(existingDebates));
    await DebateService.likeComment(debateId, commentId);
    let savedDebates = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
    expect(savedDebates[0].comments[0].likes).toBe(1);
    expect(savedDebates[0].comments[0].liked).toBe(true);

    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(savedDebates));
    await DebateService.likeComment(debateId, commentId);
    savedDebates = JSON.parse(localStorageMock.setItem.mock.calls[1][1]);
    expect(savedDebates[0].comments[0].likes).toBe(0);
    expect(savedDebates[0].comments[0].liked).toBe(false);
  });

  it('favoriteComment should toggle favorite state and update favorites storage', async () => {
    const debateId = '1';
    const commentId = '101';
    const existingDebates: DebateItem[] = [
      {
        id: debateId,
        title: 'Debate',
        content: 'Content',
        image: '/img/debate.png',
        author: 'author@test.com',
        comments: [
          {
            id: commentId,
            text: 'Comment',
            author: 'commenter@test.com',
            likes: 0,
            liked: false,
            favorite: false,
            createdAt: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString()
      }
    ];
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'gaminghub_debates') {
        return JSON.stringify(existingDebates);
      }
      if (key === 'gaminghub_favorites') {
        return '[]';
      }
      return null;
    });

    await DebateService.favoriteComment(debateId, commentId);
    let favorites = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
    expect(favorites.some((fav: any) => fav.id === commentId)).toBe(true);

    // Toggle off favorite
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(existingDebates));
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(favorites));

    await DebateService.favoriteComment(debateId, commentId);
    favorites = JSON.parse(localStorageMock.setItem.mock.calls[1][1]);
    expect(favorites.some((fav: any) => fav.id === commentId)).toBe(false);
  });

  it('deleteDebate should remove debate from storage', async () => {
    const debateId = '1';
    const existingDebates: DebateItem[] = [
      { id: debateId, title: 'Debate to delete', content: '', image: '', author: '', comments: [], createdAt: new Date().toISOString() },
      { id: '2', title: 'Another debate', content: '', image: '', author: '', comments: [], createdAt: new Date().toISOString() }
    ];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(existingDebates));
    await DebateService.deleteDebate(debateId);
    expect(localStorageMock.setItem).toHaveBeenCalled();
    const savedDebates = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
    expect(savedDebates.find((d: any) => d.id === debateId)).toBeUndefined();
  });
});
