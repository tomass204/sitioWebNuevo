import { UserService } from './UserService';
import CryptoJS from 'crypto-js';

export interface User {
  email: string;
  username: string;
  role: string;
  warnings: any[];
  profilePic: string;
  bannedUntil: number;
  banCount: number;
}

export class AuthService {
  private static hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString();
  }

  private static verifyPassword(password: string, hashedPassword: string): boolean {
    return this.hashPassword(password) === hashedPassword;
  }

  static async login(email: string, password: string): Promise<{ success: boolean; message: string; statusCode: number; user?: User }> {
    console.log('Calling LOGIN endpoint for user:', { email });

    if (!email.includes('@')) {
      console.log('Login failed: Invalid email format');
      return { success: false, message: 'El correo electrónico debe contener @', statusCode: 400 };
    }

    // Special handling for owner accounts - bypass password verification
    if (email === 'propietario@gmail.com' || email === 'tomasgarrido512@gmail.com') {
      const user = UserService.getUser(email);
      if (user) {
        // Check if user is banned
        if (user.bannedUntil && user.bannedUntil > Date.now()) {
          console.log('Login failed: User is banned');
          return { success: false, message: 'Usuario baneado', statusCode: 403 };
        }
        console.log('Login successful for owner user:', email);
        return { success: true, message: 'Inicio de sesión exitoso', statusCode: 200, user };
      }
    }

    const user = UserService.getUser(email);
    if (user && this.verifyPassword(password, user.password)) {
      // Check if user is banned
      if (user.bannedUntil && user.bannedUntil > Date.now()) {
        console.log('Login failed: User is banned');
        return { success: false, message: 'Usuario baneado', statusCode: 403 };
      }
      console.log('Login successful for user:', email);
      return { success: true, message: 'Inicio de sesión exitoso', statusCode: 200, user };
    }
    console.log('Login failed: Invalid credentials');
    return { success: false, message: 'Credenciales incorrectas', statusCode: 401 };
  }

  static register(
    email: string,
    password: string,
    username: string,
    role: string,
    reason?: string
  ): { success: boolean; message: string; statusCode?: number; userId?: string } {
    console.log('Calling REGISTER endpoint for user:', { email, username, role, reason: reason || 'N/A' });

    if (!email || !password || !username) {
      console.log('Registration failed: Missing required fields');
      return { success: false, message: 'Por favor completa todos los campos', statusCode: 400 };
    }

    if (!email.includes('@')) {
      console.log('Registration failed: Invalid email format');
      return { success: false, message: 'El correo electrónico debe contener @', statusCode: 400 };
    }

    if (UserService.getUser(email)) {
      console.log('Registration failed: Email already exists');
      return { success: false, message: 'El correo electrónico ya está registrado', statusCode: 409 };
    }

    if (role === 'Moderador') {
      if (!reason || !reason.trim()) {
        console.log('Registration failed: Missing moderator reason');
        return { success: false, message: 'Por favor describe por qué quieres ser moderador', statusCode: 400 };
      }

      // Store pending request with password for later approval
      UserService.addPendingRequest(email, username, reason);

      // Store the registration data temporarily for moderator approval
      const registrationData = JSON.parse(localStorage.getItem('gaminghub_pending_registration') || '{}');
      registrationData[email] = {
        password: this.hashPassword(password),
        username,
        role,
        reason,
        date: new Date().toISOString()
      };
      localStorage.setItem('gaminghub_pending_registration', JSON.stringify(registrationData));

      console.log('Moderator request submitted successfully for:', username);
      return { success: true, message: 'Solicitud enviada para revisión', statusCode: 201 };
    }

    // Create user account with hashed password
    const hashedPassword = this.hashPassword(password);
    const userId = UserService.createUser(email, hashedPassword, username, role);
    console.log('User account created successfully:', { email, username, role, userId });
    return { success: true, message: 'Cuenta creada exitosamente', statusCode: 201, userId };
  }

  static updateProfile(email: string, updates: { username?: string; password?: string; newEmail?: string }): { success: boolean; message: string; statusCode: number } {
    console.log('Calling UPDATE PROFILE endpoint for user:', email, 'with updates:', updates);

    const user = UserService.getUser(email);
    if (!user) {
      console.log('Profile update failed: User not found');
      return { success: false, message: 'Usuario no encontrado', statusCode: 404 };
    }

    if (updates.newEmail && updates.newEmail !== email) {
      if (UserService.getUser(updates.newEmail)) {
        console.log('Profile update failed: New email already exists');
        return { success: false, message: 'El correo electrónico ya está en uso', statusCode: 409 };
      }
      if (!updates.newEmail.includes('@')) {
        console.log('Profile update failed: Invalid new email format');
        return { success: false, message: 'El correo electrónico debe contener @', statusCode: 400 };
      }
    }

    try {
      const updateData = { ...updates };
      if (updates.password) {
        updateData.password = this.hashPassword(updates.password);
      }
      UserService.updateUser(email, updateData);
      if (updates.newEmail && updates.newEmail !== email) {
        // Handle email change
        const users = JSON.parse(localStorage.getItem('gaminghub_users') || '{}');
        users[updates.newEmail] = { ...users[email], email: updates.newEmail };
        delete users[email];
        localStorage.setItem('gaminghub_users', JSON.stringify(users));
        localStorage.setItem('currentUser', updates.newEmail);
      }
      console.log('Profile updated successfully for user:', updates.newEmail || email);
      return { success: true, message: 'Perfil actualizado exitosamente', statusCode: 200 };
    } catch (err) {
      console.log('Profile update failed: Error updating profile');
      return { success: false, message: 'Error al actualizar el perfil', statusCode: 500 };
    }
  }

  static logout(): void {
    console.log('Calling LOGOUT endpoint');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentRole');
    localStorage.removeItem('token');
    console.log('Logout successful');
  }
}
