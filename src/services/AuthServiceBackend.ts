import { API_CONFIG } from './config';

// Solo usar el microservicio de Usuarios
const API_BASE_URL_USUARIOS = API_CONFIG.USUARIOS_SERVICE;

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  username: string;
  email?: string;
  roles: string[];
}

export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  rol?: string;
}

export class AuthServiceBackend {
  static async login(email: string, password: string): Promise<{ success: boolean; message: string; statusCode: number; token?: string; user?: any }> {
    console.log('POST /api/GamingHub/v1/Usuario/iniciar-session - Iniciando sesión');
    console.log(`Parámetros: Correo electrónico: ${email}, Contraseña: ********`);
    
    try {
      // Usar solo el microservicio de Usuarios
      const usuariosResponse = await fetch(`${API_BASE_URL_USUARIOS}/api/GamingHub/v1/Usuario/iniciar-session?email=${encodeURIComponent(email)}&contrasena=${encodeURIComponent(password)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (usuariosResponse.ok) {
        const usuarioData = await usuariosResponse.json();
        // Extraer el usuario del EntityModel si viene en ese formato
        const usuario = usuarioData.content || usuarioData;
        console.log(`POST /api/GamingHub/v1/Usuario/iniciar-session - Status: ${usuariosResponse.status} - Éxito`);
        console.log('Usuario obtenido:', usuario);
        
        // Crear token local para compatibilidad
        const localToken = 'local-session-token-' + Date.now();
        localStorage.setItem('token', localToken);
        
        const userData = {
          email: usuario.email,
          username: usuario.nombre,
          role: usuario.rol || 'UsuarioBasico',
          usuarioID: usuario.usuarioID || usuario.usuario_id,
        };
        
        // Guardar datos del usuario para uso posterior
        const { UsuarioService } = await import('./UsuarioService');
        UsuarioService.saveUserData(userData);
        
        return {
          success: true,
          message: 'Inicio de sesión exitoso',
          statusCode: usuariosResponse.status,
          token: localToken,
          user: userData,
        };
      }

      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al iniciar sesión';
      let errorText = '';
      
      try {
        errorText = await usuariosResponse.text();
        // Intentar parsear como JSON si es posible
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorJson.message || errorMessage;
        } catch {
          // Si no es JSON, usar el texto directamente si es útil
          if (errorText && errorText.length < 200) {
            errorMessage = errorText;
          }
        }
      } catch {
        // Si no se puede leer el error, usar mensaje por defecto según el status
        if (usuariosResponse.status === 404) {
          errorMessage = 'Usuario no encontrado';
        } else if (usuariosResponse.status === 401 || usuariosResponse.status === 403) {
          errorMessage = 'Credenciales incorrectas';
        } else if (usuariosResponse.status === 500) {
          errorMessage = 'Error en el servidor. Por favor intenta más tarde o verifica tus credenciales';
        } else {
          errorMessage = 'Error al iniciar sesión';
        }
      }
      
      // Manejar el error 500 de forma silenciosa pero informativa
      if (usuariosResponse.status === 500) {
        // El navegador mostrará el error HTTP automáticamente, pero agregamos un mensaje más claro
        console.warn('⚠️ El servidor reportó un error interno (500). Esto puede deberse a credenciales incorrectas o un problema en el servidor.');
      } else if (usuariosResponse.status !== 404) {
        // Solo loguear otros errores que no sean 404
        console.log(`POST /api/GamingHub/v1/Usuario/iniciar-session - Status: ${usuariosResponse.status} - Error`);
        if (errorText) {
          console.log(`Error: ${errorText}`);
        }
      }
      
      return {
        success: false,
        message: errorMessage,
        statusCode: usuariosResponse.status,
      };
    } catch (error) {
      // Solo loguear errores reales, no errores de red esperados
      if (error instanceof Error && !error.message.includes('fetch') && !error.message.includes('Failed to fetch')) {
        console.error('Error en login:', error);
      }
      return {
        success: false,
        message: 'Error al conectar con el servidor',
        statusCode: 500,
      };
    }
  }

  static async register(
    email: string,
    password: string,
    username: string,
    role: string = 'UsuarioBasico'
  ): Promise<{ success: boolean; message: string; statusCode?: number; userId?: string }> {
    console.log('POST /api/GamingHub/v1/Usuario - Registrando usuario');
    console.log(`Parámetros: Nombre de usuario: ${username}, Correo electrónico: ${email}, Contraseña: ********, Rol: ${role}`);
    
    try {
      // Usar solo el microservicio de Usuarios
      const usuariosResponse = await fetch(`${API_BASE_URL_USUARIOS}/api/GamingHub/v1/Usuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: username,
          email: email,
          contrasena: password,
          rol: role,
        }),
      });

      if (usuariosResponse.ok) {
        const usuarioData = await usuariosResponse.json();
        // Extraer el usuario del EntityModel si viene en ese formato
        const usuario = usuarioData.content || usuarioData;
        console.log(`POST /api/GamingHub/v1/Usuario - Status: ${usuariosResponse.status} - Éxito`);
        console.log(`ID: ${usuario.usuarioID || usuario.usuario_id}, Nombre de usuario: ${username}, Correo electrónico: ${email}, Contraseña: ********, Rol: ${role}`);
        console.log('Usuario creado:', usuario);
        
        return {
          success: true,
          message: 'Cuenta creada exitosamente',
          statusCode: usuariosResponse.status,
          userId: (usuario.usuarioID || usuario.usuario_id)?.toString(),
        };
      }

      const errorData = await usuariosResponse.json().catch(() => ({}));
      if (usuariosResponse.status !== 404) {
        console.log(`POST /api/GamingHub/v1/Usuario - Status: ${usuariosResponse.status} - Error`);
        console.log(`Error: ${errorData.error || usuariosResponse.statusText}`);
      }
      
      return {
        success: false,
        message: errorData.error || 'Error al crear la cuenta',
        statusCode: usuariosResponse.status,
      };
    } catch (error) {
      // Solo loguear errores reales, no errores de red esperados
      if (error instanceof Error && !error.message.includes('fetch') && !error.message.includes('Failed to fetch')) {
        console.error('Error en registro:', error);
      }
      return {
        success: false,
        message: 'Error al conectar con el servidor',
        statusCode: 500,
      };
    }
  }

  static logout(): void {
    console.log('POST /api/auth/logout - Cerrando sesión');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentRole');
    console.log('Logout exitoso');
  }
}

