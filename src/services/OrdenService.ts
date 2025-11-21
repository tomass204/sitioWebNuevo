import { API_CONFIG, getAuthHeaders, handleResponse } from './config';

const API_BASE_URL = API_CONFIG.PRODUCT_SERVICE;

export interface Orden {
  ordenId: number;
  usuarioId: number;
  productoIds: number[];
  fecha: string;
  total: number;
  estado: string;
}

export interface CreateOrdenRequest {
  usuarioId: number;
  productoIds: number[];
  total: number;
  estado?: string;
}

export class OrdenService {
  private static getAuthHeaders(): HeadersInit {
    return getAuthHeaders();
  }

  static async getAllOrdenes(): Promise<Orden[]> {
    console.log('GET /v1/ordenes - Obteniendo todas las órdenes');
    try {
      const response = await fetch(`${API_BASE_URL}/v1/ordenes`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.log(`GET /v1/ordenes - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const ordenes = await response.json();
      console.log(`GET /v1/ordenes - Status: ${response.status} - Éxito`);
      console.log(`Órdenes obtenidas: ${ordenes.length}`);
      return ordenes;
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      throw error;
    }
  }

  static async getOrdenById(id: number): Promise<Orden> {
    console.log(`GET /v1/ordenes/${id} - Obteniendo orden por ID`);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/ordenes/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.log(`GET /v1/ordenes/${id} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const orden = await response.json();
      console.log(`GET /v1/ordenes/${id} - Status: ${response.status} - Éxito`);
      console.log(`Orden obtenida:`, orden);
      return orden;
    } catch (error) {
      console.error('Error al obtener orden:', error);
      throw error;
    }
  }

  static async createOrden(orden: CreateOrdenRequest): Promise<Orden> {
    console.log('═══════════════════════════════════════════');
    console.log('📤 ENVIANDO ORDEN AL MICROSERVICIO');
    console.log('═══════════════════════════════════════════');
    console.log(`POST ${API_BASE_URL}/v1/ordenes`);
    console.log('Datos de la orden:');
    console.log(`  👤 Usuario ID: ${orden.usuarioId}`);
    console.log(`  🛍️ Productos: [${orden.productoIds.join(', ')}]`);
    console.log(`  💰 Total: $${orden.total.toFixed(2)}`);
    console.log(`  📊 Estado: ${orden.estado || 'PENDIENTE'}`);
    console.log('═══════════════════════════════════════════');
    
    try {
      const response = await fetch(`${API_BASE_URL}/v1/ordenes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify({
          usuarioId: orden.usuarioId,
          productoIds: orden.productoIds,
          total: orden.total,
          estado: orden.estado || 'PENDIENTE',
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        console.log(`❌ POST /v1/ordenes - Status: ${response.status} - Error`);
        console.log(`Error: ${errorText}`);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const nuevaOrden = await response.json();
      console.log('═══════════════════════════════════════════');
      console.log('✅ ORDEN CREADA EN EL MICROSERVICIO');
      console.log('═══════════════════════════════════════════');
      console.log(`📦 Orden ID: ${nuevaOrden.ordenId}`);
      console.log(`👤 Usuario ID: ${nuevaOrden.usuarioId}`);
      console.log(`🛍️ Productos: [${nuevaOrden.productoIds?.join(', ') || 'N/A'}]`);
      console.log(`💰 Total: $${nuevaOrden.total}`);
      console.log(`📊 Estado: ${nuevaOrden.estado}`);
      console.log(`📅 Fecha: ${nuevaOrden.fecha}`);
      console.log('═══════════════════════════════════════════');
      
      return nuevaOrden;
    } catch (error) {
      // Solo loguear errores reales, no errores de conexión esperados
      if (error instanceof Error && !error.message.includes('fetch') && !error.message.includes('Failed to fetch')) {
        console.error('❌ Error al crear orden:', error);
      } else {
        console.error('❌ Error de conexión: No se pudo conectar con el microservicio de órdenes. Verifica que esté corriendo en el puerto 8082.');
      }
      throw error;
    }
  }

  static async updateOrden(id: number, orden: Partial<Orden>): Promise<Orden> {
    console.log(`PUT /v1/ordenes/${id} - Actualizando orden`);
    console.log('Parámetros:', orden);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/ordenes/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(orden),
      });
      
      if (!response.ok) {
        console.log(`PUT /v1/ordenes/${id} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const ordenActualizada = await response.json();
      console.log(`PUT /v1/ordenes/${id} - Status: ${response.status} - Éxito`);
      console.log(`Orden actualizada:`, ordenActualizada);
      return ordenActualizada;
    } catch (error) {
      console.error('Error al actualizar orden:', error);
      throw error;
    }
  }

  static async deleteOrden(id: number): Promise<void> {
    console.log(`DELETE /v1/ordenes/${id} - Eliminando orden`);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/ordenes/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.log(`DELETE /v1/ordenes/${id} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      console.log(`DELETE /v1/ordenes/${id} - Status: ${response.status} - Éxito`);
    } catch (error) {
      console.error('Error al eliminar orden:', error);
      throw error;
    }
  }

  static async getOrdenesByUsuario(usuarioId: number): Promise<Orden[]> {
    console.log(`GET /v1/ordenes/usuario/${usuarioId} - Obteniendo órdenes por usuario`);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/ordenes/usuario/${usuarioId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
      });
      
      if (!response.ok) {
        console.log(`GET /v1/ordenes/usuario/${usuarioId} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const ordenes = await response.json();
      console.log(`GET /v1/ordenes/usuario/${usuarioId} - Status: ${response.status} - Éxito`);
      console.log(`Órdenes obtenidas: ${ordenes.length}`);
      return ordenes;
    } catch (error) {
      // Solo loguear errores reales, no errores de conexión esperados
      if (error instanceof Error && !error.message.includes('fetch') && !error.message.includes('Failed to fetch')) {
        console.error('Error al obtener órdenes por usuario:', error);
      } else {
        console.warn('No se pudo conectar con el microservicio de órdenes. Verifica que esté corriendo en el puerto 8082.');
      }
      // Retornar array vacío en lugar de lanzar error
      return [];
    }
  }

  static async getOrdenesByEstado(estado: string): Promise<Orden[]> {
    console.log(`GET /v1/ordenes/estado/${estado} - Obteniendo órdenes por estado`);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/ordenes/estado/${encodeURIComponent(estado)}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.log(`GET /v1/ordenes/estado/${estado} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const ordenes = await response.json();
      console.log(`GET /v1/ordenes/estado/${estado} - Status: ${response.status} - Éxito`);
      console.log(`Órdenes obtenidas: ${ordenes.length}`);
      return ordenes;
    } catch (error) {
      console.error('Error al obtener órdenes por estado:', error);
      throw error;
    }
  }
}

