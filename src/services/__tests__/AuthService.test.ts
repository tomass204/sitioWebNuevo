import { AuthService } from '../AuthService';
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

describe('AuthService', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  describe('login', () => {
    it('should return user when credentials are valid', () => {
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

      const result = AuthService.login('test@example.com', 'password123');
      
      expect(result).toEqual(mockUser);
    });

    it('should return null when credentials are invalid', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({}));

      const result = AuthService.login('test@example.com', 'wrongpassword');
      
      expect(result).toBeNull();
    });

    it('should throw error when email is invalid', () => {
      expect(() => {
        AuthService.login('invalid-email', 'password123');
      }).toThrow('El correo electrónico debe contener @');
    });
  });

  describe('register', () => {
    it('should create user account for basic roles', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({}));

      const result = AuthService.register(
        'newuser@example.com',
        'password123',
        'newuser',
        'UsuarioBasico'
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe('Cuenta creada exitosamente');
    });

    it('should return error when email already exists', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'existing@example.com': {
          email: 'existing@example.com',
          password: 'password123',
          username: 'existing',
          role: 'UsuarioBasico',
          warnings: [],
          profilePic: 'img/UsuarioBasico.png',
          bannedUntil: 0,
          banCount: 0
        }
      }));

      const result = AuthService.register(
        'existing@example.com',
        'password123',
        'existing',
        'UsuarioBasico'
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe('El correo electrónico ya está registrado');
    });

    it('should handle moderator requests', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({}));

      const result = AuthService.register(
        'moderator@example.com',
        'password123',
        'moderator',
        'Moderador',
        'I want to help the community'
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe('Solicitud enviada para revisión');
    });
  });

  describe('logout', () => {
    it('should clear localStorage items', () => {
      AuthService.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('currentUser');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('currentRole');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    });
  });
});
