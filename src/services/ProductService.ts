import { API_CONFIG, getAuthHeaders, handleResponse } from './config';

const API_BASE_URL = API_CONFIG.PRODUCT_SERVICE;

export interface Producto {
  titulo: any;
  productoId: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagenUrl: string;
  activo: boolean;
}

export class ProductService {
  private static getAuthHeaders(): HeadersInit {
    return getAuthHeaders();
  }

  static async getAllProductos(): Promise<Producto[]> {
    console.log('GET /v1/productos - Obteniendo todos los productos');
    try {
      const response = await fetch(`${API_BASE_URL}/v1/productos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.log(`GET /v1/productos - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const productos = await response.json();
      console.log(`GET /v1/productos - Status: ${response.status} - Éxito`);
      console.log(`Productos obtenidos: ${productos.length}`);
      return productos;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  static async getProductoById(id: number): Promise<Producto> {
    console.log(`GET /v1/productos/${id} - Obteniendo producto por ID`);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/productos/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.log(`GET /v1/productos/${id} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const producto = await response.json();
      console.log(`GET /v1/productos/${id} - Status: ${response.status} - Éxito`);
      console.log(`Producto obtenido:`, producto);
      return producto;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  }

  static async createProducto(producto: Omit<Producto, 'productoId'>): Promise<Producto> {
    console.log('POST /v1/productos - Creando nuevo producto');
    console.log('Parámetros:', producto);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/productos`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(producto),
      });
      
      if (!response.ok) {
        console.log(`POST /v1/productos - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const nuevoProducto = await response.json();
      console.log(`POST /v1/productos - Status: ${response.status} - Éxito`);
      console.log(`Producto creado:`, nuevoProducto);
      return nuevoProducto;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  static async updateProducto(id: number, producto: Partial<Producto>): Promise<Producto> {
    console.log(`PUT /v1/productos/${id} - Actualizando producto`);
    console.log('Parámetros:', producto);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/productos/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(producto),
      });
      
      if (!response.ok) {
        console.log(`PUT /v1/productos/${id} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const productoActualizado = await response.json();
      console.log(`PUT /v1/productos/${id} - Status: ${response.status} - Éxito`);
      console.log(`Producto actualizado:`, productoActualizado);
      return productoActualizado;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }

  static async deleteProducto(id: number): Promise<void> {
    console.log(`DELETE /v1/productos/${id} - Eliminando producto`);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/productos/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.log(`DELETE /v1/productos/${id} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      console.log(`DELETE /v1/productos/${id} - Status: ${response.status} - Éxito`);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }

  static async getProductosByCategoria(categoria: string): Promise<Producto[]> {
    console.log(`GET /v1/productos/categoria/${categoria} - Obteniendo productos por categoría`);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/productos/categoria/${encodeURIComponent(categoria)}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.log(`GET /v1/productos/categoria/${categoria} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const productos = await response.json();
      console.log(`GET /v1/productos/categoria/${categoria} - Status: ${response.status} - Éxito`);
      console.log(`Productos obtenidos: ${productos.length}`);
      return productos;
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      throw error;
    }
  }

  static async searchProductos(nombre: string): Promise<Producto[]> {
    console.log(`GET /v1/productos/search?nombre=${nombre} - Buscando productos`);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/productos/search?nombre=${encodeURIComponent(nombre)}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.log(`GET /v1/productos/search?nombre=${nombre} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const productos = await response.json();
      console.log(`GET /v1/productos/search?nombre=${nombre} - Status: ${response.status} - Éxito`);
      console.log(`Productos encontrados: ${productos.length}`);
      return productos;
    } catch (error) {
      console.error('Error al buscar productos:', error);
      throw error;
    }
  }

  // V2 Endpoints - Con estadísticas detalladas
  static async getAllProductosV2(): Promise<Producto[]> {
    console.log('GET /v2/productos - Obteniendo todos los productos con estadísticas detalladas');
    try {
      const response = await fetch(`${API_BASE_URL}/v2/productos`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.log(`GET /v2/productos - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const productos = await response.json();
      console.log(`GET /v2/productos - Status: ${response.status} - Éxito`);
      console.log(`Productos obtenidos: ${productos.length}`);
      return productos;
    } catch (error) {
      console.error('Error al obtener productos v2:', error);
      throw error;
    }
  }

  static async updateProductoV2(id: number, producto: Partial<Producto>): Promise<Producto> {
    console.log(`PUT /v2/productos/${id} - Actualizando producto con validaciones mejoradas`);
    console.log('Parámetros:', producto);
    try {
      const response = await fetch(`${API_BASE_URL}/v2/productos/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(producto),
      });
      
      if (!response.ok) {
        console.log(`PUT /v2/productos/${id} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const productoActualizado = await response.json();
      console.log(`PUT /v2/productos/${id} - Status: ${response.status} - Éxito`);
      console.log(`Producto actualizado:`, productoActualizado);
      return productoActualizado;
    } catch (error) {
      console.error('Error al actualizar producto v2:', error);
      throw error;
    }
  }
}

