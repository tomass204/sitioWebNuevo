import { API_CONFIG, getAuthHeaders } from './config';

const API_BASE_URL = API_CONFIG.GAME_SERVICE;

export interface GameItem {
  id?: string; // Para compatibilidad con código existente
  juegoId: number;
  titulo: string;
  categoria: string;
  descripcion: string;
  imagenUrl: string;
  autor: string;
  precio: number;
  fechaCreacion: string;
  downloadUrl?: string;
  activo: boolean;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  likes: number;
  liked: boolean;
  favorite: boolean;
  createdAt: string;
}

export class GameServiceBackend {
  private static getAuthHeaders(): HeadersInit {
    return getAuthHeaders();
  }

  static async getAllGames(): Promise<GameItem[]> {
    console.log('GET /v1/juegos - Obteniendo todos los juegos');
    try {
      const response = await fetch(`${API_BASE_URL}/v1/juegos`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.log(`GET /v1/juegos - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const juegos = await response.json();
      console.log(`GET /v1/juegos - Status: ${response.status} - Éxito`);
      console.log(`Juegos obtenidos: ${juegos.length}`);
      
      // Convertir formato del backend al formato del frontend
      return juegos.map((juego: any) => ({
        id: juego.juegoId.toString(),
        juegoId: juego.juegoId,
        titulo: juego.titulo,
        categoria: juego.categoria,
        descripcion: juego.descripcion,
        imagenUrl: juego.imagenUrl,
        autor: juego.autor,
        precio: Number(juego.precio),
        fechaCreacion: juego.fechaCreacion,
        downloadUrl: juego.downloadUrl,
        activo: juego.activo,
      }));
    } catch (error) {
      console.error('Error al obtener juegos del backend:', error);
      // No usar fallback a localStorage, solo mostrar error
      throw new Error('No se pudo conectar con el microservicio de Game. Asegúrate de que esté corriendo en el puerto 8090.');
    }
  }

  private static getGamesFromLocalStorage(): GameItem[] {
    const games = JSON.parse(localStorage.getItem('gaminghub_games') || '[]');
    return games.map((game: any) => ({
      id: game.id,
      juegoId: parseInt(game.id),
      titulo: game.title,
      categoria: game.category,
      descripcion: game.description,
      imagenUrl: game.image,
      autor: game.author,
      precio: game.price,
      fechaCreacion: game.createdAt,
      downloadUrl: game.downloadUrl,
      activo: true,
    }));
  }

  static async getGameById(id: number): Promise<GameItem | null> {
    console.log(`GET /v1/juegos/${id} - Obteniendo juego por ID`);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/juegos/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.log(`GET /v1/juegos/${id} - Status: ${response.status} - Error`);
        return null;
      }
      
      const juego = await response.json();
      console.log(`GET /v1/juegos/${id} - Status: ${response.status} - Éxito`);
      
      return {
        id: juego.juegoId.toString(),
        juegoId: juego.juegoId,
        titulo: juego.titulo,
        categoria: juego.categoria,
        descripcion: juego.descripcion,
        imagenUrl: juego.imagenUrl,
        autor: juego.autor,
        precio: Number(juego.precio),
        fechaCreacion: juego.fechaCreacion,
        downloadUrl: juego.downloadUrl,
        activo: juego.activo,
      };
    } catch (error) {
      console.error('Error al obtener juego:', error);
      return null;
    }
  }

  static async createGame(gameData: Omit<GameItem, 'juegoId' | 'fechaCreacion'>): Promise<GameItem> {
    console.log('POST /v1/juegos - Creando nuevo juego');
    console.log('Parámetros:', gameData);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/juegos`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          titulo: gameData.titulo,
          categoria: gameData.categoria,
          descripcion: gameData.descripcion,
          imagenUrl: gameData.imagenUrl,
          autor: gameData.autor,
          precio: gameData.precio,
          downloadUrl: gameData.downloadUrl,
          activo: gameData.activo ?? true,
        }),
      });
      
      if (!response.ok) {
        console.log(`POST /v1/juegos - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const nuevoJuego = await response.json();
      console.log(`POST /v1/juegos - Status: ${response.status} - Éxito`);
      console.log(`Juego creado:`, nuevoJuego);
      
      return {
        id: nuevoJuego.juegoId.toString(),
        juegoId: nuevoJuego.juegoId,
        titulo: nuevoJuego.titulo,
        categoria: nuevoJuego.categoria,
        descripcion: nuevoJuego.descripcion,
        imagenUrl: nuevoJuego.imagenUrl,
        autor: nuevoJuego.autor,
        precio: Number(nuevoJuego.precio),
        fechaCreacion: nuevoJuego.fechaCreacion,
        downloadUrl: nuevoJuego.downloadUrl,
        activo: nuevoJuego.activo,
      };
    } catch (error) {
      console.error('Error al crear juego:', error);
      throw error;
    }
  }

  static async updateGame(id: number, gameData: Partial<GameItem>): Promise<GameItem> {
    console.log(`PUT /v1/juegos/${id} - Actualizando juego`);
    console.log('Parámetros:', gameData);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/juegos/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          titulo: gameData.titulo,
          categoria: gameData.categoria,
          descripcion: gameData.descripcion,
          imagenUrl: gameData.imagenUrl,
          autor: gameData.autor,
          precio: gameData.precio,
          downloadUrl: gameData.downloadUrl,
          activo: gameData.activo,
        }),
      });
      
      if (!response.ok) {
        console.log(`PUT /v1/juegos/${id} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const juegoActualizado = await response.json();
      console.log(`PUT /v1/juegos/${id} - Status: ${response.status} - Éxito`);
      
      return {
        id: juegoActualizado.juegoId.toString(),
        juegoId: juegoActualizado.juegoId,
        titulo: juegoActualizado.titulo,
        categoria: juegoActualizado.categoria,
        descripcion: juegoActualizado.descripcion,
        imagenUrl: juegoActualizado.imagenUrl,
        autor: juegoActualizado.autor,
        precio: Number(juegoActualizado.precio),
        fechaCreacion: juegoActualizado.fechaCreacion,
        downloadUrl: juegoActualizado.downloadUrl,
        activo: juegoActualizado.activo,
      };
    } catch (error) {
      console.error('Error al actualizar juego:', error);
      throw error;
    }
  }

  static async deleteGame(id: number): Promise<void> {
    console.log(`DELETE /v1/juegos/${id} - Eliminando juego`);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/juegos/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.log(`DELETE /v1/juegos/${id} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      console.log(`DELETE /v1/juegos/${id} - Status: ${response.status} - Éxito`);
    } catch (error) {
      console.error('Error al eliminar juego:', error);
      throw error;
    }
  }

  static async getGamesByCategoria(categoria: string): Promise<GameItem[]> {
    console.log(`GET /v1/juegos/categoria/${categoria} - Obteniendo juegos por categoría`);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/juegos/categoria/${encodeURIComponent(categoria)}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.log(`GET /v1/juegos/categoria/${categoria} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const juegos = await response.json();
      console.log(`GET /v1/juegos/categoria/${categoria} - Status: ${response.status} - Éxito`);
      
      return juegos.map((juego: any) => ({
        id: juego.juegoId.toString(),
        titulo: juego.titulo,
        categoria: juego.categoria,
        descripcion: juego.descripcion,
        imagenUrl: juego.imagenUrl,
        autor: juego.autor,
        precio: Number(juego.precio),
        fechaCreacion: juego.fechaCreacion,
        downloadUrl: juego.downloadUrl,
        activo: juego.activo,
      }));
    } catch (error) {
      console.error('Error al obtener juegos por categoría:', error);
      throw error;
    }
  }

  static async searchGames(titulo: string): Promise<GameItem[]> {
    console.log(`GET /v1/juegos/search?titulo=${titulo} - Buscando juegos`);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/juegos/search?titulo=${encodeURIComponent(titulo)}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        console.log(`GET /v1/juegos/search?titulo=${titulo} - Status: ${response.status} - Error`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const juegos = await response.json();
      console.log(`GET /v1/juegos/search?titulo=${titulo} - Status: ${response.status} - Éxito`);
      
      return juegos.map((juego: any) => ({
        id: juego.juegoId.toString(),
        titulo: juego.titulo,
        categoria: juego.categoria,
        descripcion: juego.descripcion,
        imagenUrl: juego.imagenUrl,
        autor: juego.autor,
        precio: Number(juego.precio),
        fechaCreacion: juego.fechaCreacion,
        downloadUrl: juego.downloadUrl,
        activo: juego.activo,
      }));
    } catch (error) {
      console.error('Error al buscar juegos:', error);
      throw error;
    }
  }
}

