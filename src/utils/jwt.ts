// Utilidad para generar tokens JWT válidos en el frontend
// Usa la misma clave secreta que el backend del microservicio Product

const JWT_SECRET = 'mySecretKeyForJWTTokenGenerationThatShouldBeAtLeast256BitsLong';

// Función para codificar base64url (similar a base64 pero seguro para URLs)
function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Función para crear la firma HMAC-SHA256
async function createSignature(header: string, payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(JWT_SECRET);
  
  // Importar la clave para uso con Web Crypto API
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  // Crear el mensaje a firmar
  const message = encoder.encode(`${header}.${payload}`);
  
  // Firmar el mensaje
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, message);
  
  // Convertir a base64url
  const signatureArray = Array.from(new Uint8Array(signature));
  const signatureString = String.fromCharCode(...signatureArray);
  return base64UrlEncode(signatureString);
}

/**
 * Genera un token JWT válido para el microservicio Product
 * @param username - Nombre de usuario o email
 * @param role - Rol del usuario (UsuarioBasico, Influencer, Moderador, Propietario)
 * @param expirationHours - Horas de expiración del token (default: 24)
 * @returns Token JWT válido
 */
export async function generateJWT(
  username: string,
  role: string,
  expirationHours: number = 24
): Promise<string> {
  try {
    // Header JWT (tipo de token y algoritmo)
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    // Payload JWT (datos del usuario)
    const now = Math.floor(Date.now() / 1000); // Segundos desde epoch
    const expiration = now + (expirationHours * 60 * 60); // Agregar horas
    
    const payload = {
      sub: username, // Subject (usuario)
      role: role, // Rol del usuario
      iat: now, // Issued at (emitido en)
      exp: expiration // Expiration (expiración)
    };
    
    // Codificar header y payload a base64url
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    
    // Crear la firma
    const signature = await createSignature(encodedHeader, encodedPayload);
    
    // Combinar todo: header.payload.signature
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  } catch (error) {
    console.error('Error generando JWT:', error);
    throw new Error('No se pudo generar el token JWT');
  }
}

/**
 * Decodifica un token JWT (sin validar la firma)
 * Útil para debugging
 */
export function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token JWT inválido');
    }
    
    const payload = parts[1];
    // Agregar padding si es necesario
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
}


