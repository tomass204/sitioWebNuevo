import { UserService } from '../UserService';

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

describe('UserService', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  describe('getUser', () => {
    it('should return user when exists', () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        role: 'UsuarioBasico',
        warnings: [],
        profilePic: 'img/UsuarioBasico.png',
        bannedUntil: 0,
        banCount: 0
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'test@example.com': mockUser
      }));

      const result = UserService.getUser('test@example.com');
      
      expect(result).toEqual(mockUser);
    });

    it('should return null when user does not exist', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({}));

      const result = UserService.getUser('nonexistent@example.com');
      
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create new user', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({}));

      UserService.createUser(
        'newuser@example.com',
        'password123',
        'newuser',
        'UsuarioBasico'
      );

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'gaminghub_users',
        expect.stringContaining('newuser@example.com')
      );
    });
  });

  describe('updateUser', () => {
    it('should update existing user', () => {
      const existingUser = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        role: 'UsuarioBasico',
        warnings: [],
        profilePic: 'img/UsuarioBasico.png',
        bannedUntil: 0,
        banCount: 0
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'test@example.com': existingUser
      }));

      UserService.updateUser('test@example.com', { username: 'updateduser' });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'gaminghub_users',
        expect.stringContaining('updateduser')
      );
    });
  });

  describe('addWarning', () => {
    it('should add warning to user', () => {
      const existingUser = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        role: 'UsuarioBasico',
        warnings: [],
        profilePic: 'img/UsuarioBasico.png',
        bannedUntil: 0,
        banCount: 0
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'test@example.com': existingUser
      }));

      UserService.addWarning('test@example.com', 'Inappropriate content');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'gaminghub_users',
        expect.stringContaining('Inappropriate content')
      );
    });

    it('should ban user after 3 warnings', () => {
      const existingUser = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        role: 'UsuarioBasico',
        warnings: [
          { comment: 'Warning 1', timestamp: Date.now(), read: false },
          { comment: 'Warning 2', timestamp: Date.now(), read: false }
        ],
        profilePic: 'img/UsuarioBasico.png',
        bannedUntil: 0,
        banCount: 0
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'test@example.com': existingUser
      }));

      UserService.addWarning('test@example.com', 'Third warning');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'gaminghub_users',
        expect.stringContaining('bannedUntil')
      );
    });
  });

  describe('getRoleProfilePic', () => {
    it('should return correct profile pic for each role', () => {
      expect(UserService.getRoleProfilePic('UsuarioBasico')).toBe('img/UsuarioBasico.png');
      expect(UserService.getRoleProfilePic('Influencer')).toBe('img/Influ.png');
      expect(UserService.getRoleProfilePic('Moderador')).toBe('img/Moderador.png');
      expect(UserService.getRoleProfilePic('Propietario')).toBe('img/Propietario.png');
    });
  });
});
