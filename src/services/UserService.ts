export interface User {
  id: string;
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

export class UserService {
  private static getUsers(): { [key: string]: User } {
    return JSON.parse(localStorage.getItem('gaminghub_users') || '{}');
  }

  private static saveUsers(users: { [key: string]: User }): void {
    localStorage.setItem('gaminghub_users', JSON.stringify(users));
  }

  private static getPendingRequestsRaw(): PendingRequest[] {
    const raw = localStorage.getItem('gaminghub_pending');
    try {
      const parsed = JSON.parse(raw || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private static savePendingRequests(requests: PendingRequest[]): void {
    localStorage.setItem('gaminghub_pending', JSON.stringify(requests));
  }

  static getUser(email: string): User | null {
    const users = this.getUsers();
    return users[email] || null;
  }

  static createUser(email: string, password: string, username: string, role: string): string {
    const users = this.getUsers();
    const id = this.generateNextId();
    users[email] = {
      id,
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
    return id;
  }

  private static generateNextId(): string {
    const users = this.getUsers();
    const ids = Object.values(users).map(user => parseInt(user.id)).filter(id => !isNaN(id));
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return (maxId + 1).toString();
  }

  static updateUser(email: string, updates: Partial<User>): void {
    const users = this.getUsers();
    if (users[email]) {
      users[email] = { ...users[email], ...updates };
      this.saveUsers(users);
    }
  }

  static addPendingRequest(email: string, username: string, reason: string): void {
    const requests = this.getPendingRequestsRaw();
    requests.push({
      email,
      username,
      reason,
      date: new Date().toISOString()
    });
    this.savePendingRequests(requests);
  }

  static getPendingRequests(): PendingRequest[] {
    return this.getPendingRequestsRaw();
  }

  static approvePendingRequest(email: string, username: string): void {
    const requests = this.getPendingRequestsRaw();
    const index = requests.findIndex(req => req.email === email && req.username === username);
    if (index !== -1) {
      requests.splice(index, 1);
      this.savePendingRequests(requests);
      
      // Create or update user to Moderator
      const users = this.getUsers();
      if (users[email]) {
        users[email].role = 'Moderador';
        users[email].warnings = [];
        users[email].profilePic = this.getRoleProfilePic('Moderador');
        users[email].bannedUntil = 0;
        users[email].banCount = 0;
      } else {
        users[email] = {
          id: this.generateNextId(),
          email,
          password: 'moderator123',
          username,
          role: 'Moderador',
          warnings: [],
          profilePic: this.getRoleProfilePic('Moderador'),
          bannedUntil: 0,
          banCount: 0
        };
      }
      this.saveUsers(users);
    }
  }

  static rejectPendingRequest(email: string, username: string): void {
    const requests = this.getPendingRequestsRaw();
    const index = requests.findIndex(req => req.email === email && req.username === username);
    if (index !== -1) {
      requests.splice(index, 1);
      this.savePendingRequests(requests);
    }
  }

  static addWarning(email: string, comment: string): void {
    const users = this.getUsers();
    if (users[email]) {
      const warning = {
        comment,
        timestamp: Date.now(),
        read: false
      };
      users[email].warnings.push(warning);
      
      const warningCount = users[email].warnings.length;
      if (warningCount >= 3) {
        users[email].banCount = (users[email].banCount || 0) + 1;
        users[email].warnings = [];
        
        if (users[email].banCount === 1) {
          users[email].bannedUntil = Date.now() + 10 * 60 * 1000; // 10 minutes
        } else if (users[email].banCount === 2) {
          users[email].bannedUntil = Date.now() + 60 * 60 * 1000; // 1 hour
        } else {
          users[email].bannedUntil = Date.now() + 24 * 60 * 60 * 1000; // 1 day
        }
      }
      
      this.saveUsers(users);
    }
  }

  static getRoleProfilePic(role: string): string {
    switch (role) {
      case 'Influencer':
        return 'img/Influencer.png';
      case 'Moderador':
        return 'img/Moderador.png';
      case 'Propietario':
        return 'img/Propietario.png';
      case 'UsuarioBasico':
      default:
        return 'img/UsuarioBasico.png';
    }
  }

  static initializeDefaultUsers(): void {
    const users = this.getUsers();
    if (Object.keys(users).length === 0) {
      // Initialize with default users
      const defaultUsers = {
        'basic@gaminghub.com': {
          id: '1',
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
          id: '2',
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
          id: '3',
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
          id: '4',
          email: 'tomasgarrido512@gmail.com',
          password: '12345',
          username: 'Propietario',
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
}
