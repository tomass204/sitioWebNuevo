// Configuración centralizada de URLs de microservicios
export const API_CONFIG = {
  // Microservicios
  PRODUCT_SERVICE: 'http://localhost:8082',
  GAME_SERVICE: 'http://localhost:8090',
  AUTH_SERVICE: 'http://localhost:8081',
  USUARIOS_SERVICE: 'http://localhost:8081',
  
  // Endpoints
  PRODUCTOS: '/v1/productos',
  ORDENES: '/v1/ordenes',
  JUEGOS: '/v1/juegos',
  AUTH: '/api/auth',
  USUARIOS: '/api/GamingHub/v1/Usuario',
};

// Función helper para obtener headers de autenticación
export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Función helper para manejar errores de respuesta
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Error ${response.status}: ${errorText}`);
  }
  return response.json();
};

// Función helper para verificar permisos basados en roles (según SecurityConfig del backend)
export const hasRole = (requiredRole: string): boolean => {
  const userRole = localStorage.getItem('currentRole');
  if (!userRole) return false;

  // Mapeo de roles del frontend a roles del backend
  const roleMapping: Record<string, string> = {
    'UsuarioBasico': 'USUARIO_BASICO',
    'Influencer': 'CREADOR_CONTENIDO',
    'Moderador': 'MODERADOR',
    'Propietario': 'PROPIETARIO'
  };

  const backendRole = roleMapping[userRole] || userRole;

  // Jerarquía de roles según el backend
  const roleHierarchy: Record<string, number> = {
    'USUARIO_BASICO': 1,
    'CREADOR_CONTENIDO': 2,
    'MODERADOR': 3,
    'PROPIETARIO': 4
  };

  return (roleHierarchy[backendRole] || 0) >= (roleHierarchy[requiredRole] || 0);
};

// Función helper para verificar permisos específicos según SecurityConfig
export const hasPermission = (method: string, endpoint: string): boolean => {
  const userRole = localStorage.getItem('currentRole');
  if (!userRole) return false;

  // Mapeo de roles del frontend a roles del backend
  const roleMapping: Record<string, string> = {
    'UsuarioBasico': 'USUARIO_BASICO',
    'Influencer': 'CREADOR_CONTENIDO',
    'Moderador': 'MODERADOR',
    'Propietario': 'PROPIETARIO'
  };

  const backendRole = roleMapping[userRole] || userRole;

  // Permisos según SecurityConfig del backend
  const permissions: Record<string, string[]> = {
    // Productos
    'GET /v1/productos': ['permitAll'],
    'GET /v1/productos/**': ['permitAll'],
    'POST /v1/productos': ['CREADOR_CONTENIDO', 'MODERADOR', 'PROPIETARIO'],
    'PUT /v1/productos/**': ['MODERADOR', 'PROPIETARIO'],
    'DELETE /v1/productos/**': ['MODERADOR', 'PROPIETARIO'],
    'GET /v2/productos': ['permitAll'],

    // Órdenes
    'POST /v1/ordenes': ['permitAll'], // Public for all users to create orders
    'GET /v1/ordenes': ['permitAll'], // Public for all users to list orders
    'GET /v1/ordenes/**': ['permitAll'], // Public for all users to view specific orders
    'PUT /v1/ordenes/**': ['MODERADOR', 'PROPIETARIO'],
    'DELETE /v1/ordenes/**': ['MODERADOR', 'PROPIETARIO'],

    // Usuarios
    'POST /api/GamingHub/v1/Usuario/iniciar-session': ['permitAll'],
    'POST /api/GamingHub/v1/Usuario': ['permitAll'],
    'PUT /api/GamingHub/v1/Usuario/recuperar-contrasena': ['permitAll'],
    'GET /api/GamingHub/v1/Usuario/**': ['authenticated'],
    'PUT /api/GamingHub/v1/Usuario/**': ['MODERADOR', 'PROPIETARIO'],
    'PATCH /api/GamingHub/v1/Usuario/**': ['MODERADOR', 'PROPIETARIO'],

    // Juegos
    'GET /v1/juegos': ['authenticated'],
    'GET /v1/juegos/**': ['authenticated'],
    'POST /v1/juegos': ['CREADOR_CONTENIDO', 'MODERADOR', 'PROPIETARIO'],
    'PUT /v1/juegos/**': ['MODERADOR', 'PROPIETARIO'],
    'DELETE /v1/juegos/**': ['MODERADOR', 'PROPIETARIO'],
  };

  const requiredRoles = permissions[`${method} ${endpoint}`];
  if (!requiredRoles) return false;

  if (requiredRoles.includes('permitAll')) return true;

  if (requiredRoles.includes('authenticated')) return !!localStorage.getItem('token');

  return requiredRoles.includes(backendRole);
};

// Función helper para verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

