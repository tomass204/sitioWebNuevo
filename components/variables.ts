export const APP_NAME = "GamingHub";
export const APP_VERSION = "1.0.0";
export const OWNER_EMAIL = "tomasgarrido512@gmail.com";
export const OWNER_PASSWORD = "12345";

export const ROLES = {
  BASIC_USER: "UsuarioBasico",
  INFLUENCER: "Influencer",
  MODERATOR: "Moderador",
  OWNER: "Propietario"
};

export const DEFAULT_PASSWORDS = {
  MODERATOR: "moderator123"
};

export const API_ENDPOINTS = {
  AUTH_LOGIN: "/api/auth/login",
  AUTH_REGISTER: "/api/auth/register",
  NEWS: "/api/news",
  DEBATES: "/api/debates",
  COMMENTS: "/api/comments",
  FAVORITES: "/api/favorites",
  MODERATION: "/api/moderation"
};

export const STORAGE_KEYS = {
  USERS: "gaminghub_users",
  FAVORITES: "gaminghub_favorites",
  PENDING_REQUESTS: "gaminghub_pending",
  CURRENT_USER: "currentUser",
  CURRENT_ROLE: "currentRole",
  NEWS: "gaminghub_news",
  DEBATES: "gaminghub_debates",
  GAMES: "gaminghub_games",
  SCROLL_POSITION: "scrollPosition",
  ACTIVE_TAB: "activeTab"
};
