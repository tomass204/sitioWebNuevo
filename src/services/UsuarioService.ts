import { API_CONFIG, getAuthHeaders } from './config';

export interface Usuario {
  usuarioID: number;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
}

export class UsuarioService {
  private static readonly API_BASE_URL = API_CONFIG.USUARIOS_SERVICE;

  /**
   * Obtiene el usuario actual desde el backend usando el email
   */
  static async getUsuarioByEmail(email: string): Promise<Usuario | null> {
    console.log(`GET /api/GamingHub/v1/Usuario - Buscando usuario por email: ${email}`);
    try {
      // Primero intentamos obtener el usuario desde el backend
      // Como no hay endpoint directo por email, usamos el servicio de login para obtener datos
      // O podríamos crear un endpoint específico, pero por ahora usamos el que existe
      
      // Nota: Esto es un workaround. Idealmente debería haber un endpoint GET /usuario/email/{email}
      // Por ahora, guardamos el usuarioID cuando se hace login
      
      return null; // Retornamos null y usamos el usuarioID guardado en localStorage
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  /**
   * Obtiene el usuarioId del usuario actual desde localStorage o del backend
   */
  static async getCurrentUsuarioId(): Promise<number | null> {
    const currentUserEmail = localStorage.getItem('currentUser');
    if (!currentUserEmail) {
      return null;
    }

    // Intentar obtener del usuario guardado
    const userData = localStorage.getItem('currentUserData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.usuarioID) {
          return user.usuarioID;
        }
      } catch (e) {
        // Ignorar error de parsing
      }
    }

    // Si no está en localStorage, intentar obtener del backend
    try {
      const usuario = await this.getUsuarioByEmail(currentUserEmail);
      if (usuario) {
        // Guardar para futuras referencias
        localStorage.setItem('currentUserData', JSON.stringify(usuario));
        return usuario.usuarioID;
      }
    } catch (error) {
      console.error('Error al obtener usuarioId del backend:', error);
    }

    return null;
  }

  /**
   * Guarda los datos del usuario en localStorage
   */
  static saveUserData(user: any): void {
    if (user && user.usuarioID) {
      localStorage.setItem('currentUserData', JSON.stringify({
        usuarioID: user.usuarioID,
        nombre: user.nombre || user.username,
        email: user.email,
        rol: user.rol || user.role,
      }));
    }
  }
}

