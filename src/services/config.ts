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

