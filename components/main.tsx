// Main.tsx - Archivo principal para GamingHub
// Basado en la Especificación de Requisitos de Software (SRS)

// Información del proyecto:
// Proyecto: GamingHub
// Revisión: 1.0
// Fecha: 15 de octubre de 2023
// Propósito: Plataforma web para comunidad gaming con gestión de usuarios, contenido y moderación.

// Roles de usuario definidos en SRS:
// - Usuario Básico: Permisos limitados, navegación y favoritos.
// - Influencer: Publicar contenido (noticias, debates).
// - Moderador: Moderar contenido, banear usuarios.
// - Propietario: Administrador total.

// Funciones principales según SRS:
// - Gestión de usuarios y autenticación.
// - Publicación de noticias, debates y galería de juegos.
// - Sistema de favoritos.
// - Moderación de comunidad.

// Restricciones:
// - Lenguajes: JavaScript, HTML, CSS.
// - Almacenamiento: localStorage.
// - Compatibilidad: Navegadores modernos.

// Requisitos no funcionales:
// - Rendimiento: Carga <3s.
// - Seguridad: Autenticación por roles.
// - Fiabilidad: 99% uptime.
// - Portabilidad: Windows/Mac/Linux.

class GamingHubApp {
  private users: any[] = [];
  private content: any[] = [];
  private favorites: any[] = [];

  constructor() {
    this.loadData();
    this.init();
  }

  private loadData() {
    // Cargar datos desde localStorage según SRS 3.1.3
    const usersData = localStorage.getItem('gamingHub_users');
    if (usersData) {
      this.users = JSON.parse(usersData);
    }

    const contentData = localStorage.getItem('gamingHub_content');
    if (contentData) {
      this.content = JSON.parse(contentData);
    }

    const favoritesData = localStorage.getItem('gamingHub_favorites');
    if (favoritesData) {
      this.favorites = JSON.parse(favoritesData);
    }
  }

  private saveData() {
    localStorage.setItem('gamingHub_users', JSON.stringify(this.users));
    localStorage.setItem('gamingHub_content', JSON.stringify(this.content));
    localStorage.setItem('gamingHub_favorites', JSON.stringify(this.favorites));
  }

  private init() {
    // Inicializar la aplicación según SRS 2.2
    console.log('GamingHub iniciado');
    this.renderNavigation();
    this.showHome();
  }

  private renderNavigation() {
    // Renderizar navegación según SRS 3.1.1
    const nav = document.createElement('nav');
    nav.innerHTML = `
      <ul>
        <li><a href="#" onclick="app.showHome()">Inicio</a></li>
        <li><a href="#" onclick="app.showGames()">Juegos</a></li>
        <li><a href="#" onclick="app.showDebates()">Debates</a></li>
        <li><a href="#" onclick="app.showFavorites()">Favoritos</a></li>
        <li><a href="#" onclick="app.showProfile()">Perfil</a></li>
        <li><a href="#" onclick="app.showModeration()">Moderación</a></li>
      </ul>
    `;
    document.body.appendChild(nav);
  }

  showHome() {
    // Mostrar página principal
    const main = document.querySelector('main') || document.createElement('main');
    main.innerHTML = '<h2>Bienvenido a GamingHub</h2><p>Comunidad gaming</p>';
    document.body.appendChild(main);
  }

  showGames() {
    // Mostrar galería de juegos según SRS 2.2
    const main = document.querySelector('main') || document.createElement('main');
    main.innerHTML = '<h2>Galería de Juegos</h2><div id="games-list"></div>';
    // Lógica para mostrar juegos
    document.body.appendChild(main);
  }

  showDebates() {
    // Mostrar debates según SRS 2.2
    const main = document.querySelector('main') || document.createElement('main');
    main.innerHTML = '<h2>Debates</h2><div id="debates-list"></div>';
    document.body.appendChild(main);
  }

  showFavorites() {
    // Mostrar favoritos según SRS 3.2.4
    const main = document.querySelector('main') || document.createElement('main');
    main.innerHTML = '<h2>Favoritos</h2><ul id="favorites-list"></ul>';
    document.body.appendChild(main);
  }

  showProfile() {
    // Mostrar perfil de usuario
    const main = document.querySelector('main') || document.createElement('main');
    main.innerHTML = '<h2>Perfil</h2><p>Información del usuario</p>';
    document.body.appendChild(main);
  }

  showModeration() {
    // Mostrar panel de moderación según SRS 3.2.3
    const main = document.querySelector('main') || document.createElement('main');
    main.innerHTML = '<h2>Moderación</h2><p>Herramientas para moderadores</p>';
    document.body.appendChild(main);
  }

  // Métodos para gestión de usuarios según SRS 3.2.1
  registerUser(email: string, password: string, role: string) {
    const user = { email, password, role, id: Date.now() };
    this.users.push(user);
    this.saveData();
  }

  loginUser(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  // Métodos para contenido según SRS 3.2.2
  addContent(type: string, title: string, content: string) {
    const item = { type, title, content, id: Date.now() };
    this.content.push(item);
    this.saveData();
  }

  // Método para favoritos según SRS 3.2.4
  addToFavorites(itemId: number) {
    if (!this.favorites.includes(itemId)) {
      this.favorites.push(itemId);
      this.saveData();
    }
  }
}

// Instanciar la aplicación
const app = new GamingHubApp();

// Exportar para uso global
(window as any).app = app;
