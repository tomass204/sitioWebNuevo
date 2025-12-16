import { API_CONFIG, getAuthHeaders, handleResponse } from './config';

export interface User {
  id: number;
  email: string;
  password: string;
  username: string;
  role: string;
  warnings: any[];
  profilePic: string;
  bannedUntil: number;
  banCount: number;
}

export interface PendingRequest {
  email: string;
  username: string;
  reason: string;
  date: string;
}

const API_BASE_URL = API_CONFIG.USUARIOS_SERVICE;

export class UserService {
  // API Methods - Integración con backend

  // POST /api/GamingHub/v1/Usuario/iniciar-session - permitAll
  static async login(email: string, password: string): Promise<{ success: boolean; message?: string; user?: User }> {
    console.log('POST /api/GamingHub/v1/Usuario/iniciar-session - Iniciando sesión');
    try {
      const response = await fetch(`${API_BASE_URL}/api/GamingHub/v1/Usuario/iniciar-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        console.log(`POST /api/GamingHub/v1/Usuario/iniciar-session - Status: ${response.status} - Error`);
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`POST /api/GamingHub/v1/Usuario/iniciar-session - Status: ${response.status} - Éxito`);
      return { success: true, user: data.user, message: data.message };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }

  // POST /api/GamingHub/v1/Usuario - permitAll
  static async register(email: string, password: string, username: string, role: string, reason?: string): Promise<{ success: boolean; message?: string }> {
    console.log('POST /api/GamingHub/v1/Usuario - Registrando usuario');
    try {
      const response = await fetch(`${API_BASE_URL}/api/GamingHub/v1/Usuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username, role, reason }),
      });

      if (!response.ok) {
        console.log(`POST /api/GamingHub/v1/Usuario - Status: ${response.status} - Error`);
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`POST /api/GamingHub/v1/Usuario - Status: ${response.status} - Éxito`);
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }

  // PUT /api/GamingHub/v1/Usuario/recuperar-contrasena - permitAll
  static async recoverPassword(email: string): Promise<{ success: boolean; message?: string }> {
    console.log('PUT /api/GamingHub/v1/Usuario/recuperar-contrasena - Recuperando contraseña');
    try {
      const response = await fetch(`${API_BASE_URL}/api/GamingHub/v1/Usuario/recuperar-contrasena`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        console.log(`PUT /api/GamingHub/v1/Usuario/recuperar-contrasena - Status: ${response.status} - Error`);
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`PUT /api/GamingHub/v1/Usuario/recuperar-contrasena - Status: ${response.status} - Éxito`);
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Error al recuperar contraseña:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }

  // GET /api/GamingHub/v1/Usuario/** - authenticated
  static async getUserById(id: string): Promise<User> {
    console.log(`GET /api/GamingHub/v1/Usuario/${id} - Obteniendo usuario por ID`);
    try {
      const response = await fetch(`${API_BASE_URL}/api/GamingHub/v1/Usuario/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        console.log(`GET /api/GamingHub/v1/Usuario/${id} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const user = await response.json();
      console.log(`GET /api/GamingHub/v1/Usuario/${id} - Status: ${response.status} - Éxito`);
      return user;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  }

  // GET /api/GamingHub/v1/Usuario/** - authenticated
  static async getAllUsers(): Promise<User[]> {
    console.log('GET /api/GamingHub/v1/Usuario - Obteniendo todos los usuarios');
    try {
      const response = await fetch(`${API_BASE_URL}/api/GamingHub/v1/Usuario`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        console.log(`GET /api/GamingHub/v1/Usuario - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const users = await response.json();
      console.log(`GET /api/GamingHub/v1/Usuario - Status: ${response.status} - Éxito`);
      return users;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  // PUT /api/GamingHub/v1/Usuario/** - MODERADOR, PROPIETARIO
  static async updateUser(id: string, updates: Partial<User>): Promise<User> {
    console.log(`PUT /api/GamingHub/v1/Usuario/${id} - Actualizando usuario`);
    try {
      const response = await fetch(`${API_BASE_URL}/api/GamingHub/v1/Usuario/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        console.log(`PUT /api/GamingHub/v1/Usuario/${id} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const user = await response.json();
      console.log(`PUT /api/GamingHub/v1/Usuario/${id} - Status: ${response.status} - Éxito`);
      return user;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  // PATCH /api/GamingHub/v1/Usuario/** - MODERADOR, PROPIETARIO
  static async changeUserStatus(id: string, status: string): Promise<User> {
    console.log(`PATCH /api/GamingHub/v1/Usuario/${id} - Cambiando estado del usuario`);
    try {
      const response = await fetch(`${API_BASE_URL}/api/GamingHub/v1/Usuario/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        console.log(`PATCH /api/GamingHub/v1/Usuario/${id} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const user = await response.json();
      console.log(`PATCH /api/GamingHub/v1/Usuario/${id} - Status: ${response.status} - Éxito`);
      return user;
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      throw error;
    }
  }
  // Legacy methods - Mantener para compatibilidad temporal (usar localStorage como fallback)
  private static getUsers(): { [key: string]: User } {
    return JSON.parse(localStorage.getItem('gaminghub_users') || '{}');
  }

  private static saveUsers(users: { [key: string]: User }): void {
    localStorage.setItem('gaminghub_users', JSON.stringify(users));
  }

  static getUser(email: string): User | null {
    const users = this.getUsers();
    return users[email] || null;
  }

  static getRoleProfilePic(role: string): string {
    switch (role) {
      case 'Influencer':
        return '/img/Influencer.png';
      case 'Moderador':
        return '/img/Moderador.png';
      case 'Propietario':
        return '/img/Propietario.png';
      case 'UsuarioBasico':
      default:
        return '/img/UsuarioBasico.png';
    }
  }

  static initializeDefaultUsers(): void {
    const users = this.getUsers();
    if (Object.keys(users).length === 0) {
      // Initialize with default users
      const defaultUsers = {
        'basic@gaminghub.com': {
          id: 1,
          email: 'basic@gaminghub.com',
          password: 'pass',
          username: 'UsuarioBasico',
          role: 'UsuarioBasico',
          warnings: [],
          profilePic: 'img/UsuarioBasico.png',
          bannedUntil: 0,
          banCount: 0
        },
        'influencer@gaminghub.com': {
          id: 2,
          email: 'influencer@gaminghub.com',
          password: 'pass',
          username: 'Influencer',
          role: 'Influencer',
          warnings: [],
          profilePic: 'img/Influencer.png',
          bannedUntil: 0,
          banCount: 0
        },
        'moderator@gaminghub.com': {
          id: 3,
          email: 'moderator@gaminghub.com',
          password: 'pass',
          username: 'Moderador',
          role: 'Moderador',
          warnings: [],
          profilePic: 'img/Moderador.png',
          bannedUntil: 0,
          banCount: 0
        },
        'tomasgarrido512@gmail.com': {
          id: 4,
          email: 'tomasgarrido512@gmail.com',
          password: '123456',
          username: 'Propietario',
          role: 'Propietario',
          warnings: [],
          profilePic: 'img/Propietario.png',
          bannedUntil: 0,
          banCount: 0
        },
        'propietario@gmail.com': {
          id: 5,
          email: 'propietario@gmail.com',
          password: '123456',
          username: 'Propietario2',
          role: 'Propietario',
          warnings: [],
          profilePic: 'img/Propietario.png',
          bannedUntil: 0,
          banCount: 0
        }
      };
      this.saveUsers(defaultUsers);
    }
  }

  static createUser(email: string, password: string, username: string, role: string): string {
    const users = this.getUsers();
    const userId = Date.now().toString(); // Simple ID generation
    users[email] = {
      id: parseInt(userId),
      email,
      password,
      username,
      role,
      warnings: [],
      profilePic: this.getRoleProfilePic(role),
      bannedUntil: 0,
      banCount: 0
    };
    this.saveUsers(users);
    return userId;
  }

  static addPendingRequest(email: string, username: string, reason: string): void {
    const pendingRequests = JSON.parse(localStorage.getItem('gaminghub_pending_requests') || '[]');
    pendingRequests.push({
      email,
      username,
      reason,
      date: new Date().toISOString()
    });
    localStorage.setItem('gaminghub_pending_requests', JSON.stringify(pendingRequests));
  }

  static getPendingRequests(): PendingRequest[] {
    return JSON.parse(localStorage.getItem('gaminghub_pending_requests') || '[]');
  }

  static approvePendingRequest(email: string): void {
    const pendingRequests = this.getPendingRequests();
    const request = pendingRequests.find(req => req.email === email);
    if (request) {
      // Remove from pending
      const updatedRequests = pendingRequests.filter(req => req.email !== email);
      localStorage.setItem('gaminghub_pending_requests', JSON.stringify(updatedRequests));

      // Create user
      const registrationData = JSON.parse(localStorage.getItem('gaminghub_pending_registration') || '{}');
      if (registrationData[email]) {
        const { password, username, role } = registrationData[email];
        this.createUser(email, password, username, role);
        delete registrationData[email];
        localStorage.setItem('gaminghub_pending_registration', JSON.stringify(registrationData));
      }
    }
  }

  static rejectPendingRequest(email: string): void {
    const pendingRequests = this.getPendingRequests();
    const updatedRequests = pendingRequests.filter(req => req.email !== email);
    localStorage.setItem('gaminghub_pending_requests', JSON.stringify(updatedRequests));

    // Clean up registration data
    const registrationData = JSON.parse(localStorage.getItem('gaminghub_pending_registration') || '{}');
    delete registrationData[email];
    localStorage.setItem('gaminghub_pending_registration', JSON.stringify(registrationData));
  }

  static addWarning(email: string, comment: string): void {
    const users = this.getUsers();
    const user = users[email];
    if (user) {
      user.warnings.push({
        comment,
        timestamp: Date.now(),
        read: false
      });

      // Check if user should be banned (3 warnings)
      if (user.warnings.length >= 3) {
        user.bannedUntil = Date.now() + (24 * 60 * 60 * 1000); // Ban for 24 hours
        user.banCount += 1;
      }

      this.saveUsers(users);
    }
  }
}
