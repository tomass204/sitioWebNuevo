import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';

interface User {
  email: string;
  username: string;
  role: string;
  warnings: any[];
  profilePic: string;
  bannedUntil: number;
  banCount: number;
}

interface AuthContextType {
  currentUser: User | null;
  currentRole: string | null;
  isLoggedIn: boolean;
  isBanned: boolean;
  banTimeRemaining: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string, username: string, role: string, reason?: string) => any;
  logout: () => void;
  toggleForm: () => void;
  showLogin: boolean;
  pendingLoginData: { email: string; password: string } | null;
  clearPendingLoginData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [banTimeRemaining, setBanTimeRemaining] = useState(0);
  const [pendingLoginData, setPendingLoginData] = useState<{ email: string; password: string } | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');

  useEffect(() => {
    const restoreSession = async () => {
      // Initialize default users if they don't exist
      UserService.initializeDefaultUsers();

      // Ensure owner account exists
      let ownerUser = UserService.getUser('propietario@gmail.com');
      if (!ownerUser) {
        console.log('Owner account not found, creating it...');
        UserService.createUser('propietario@gmail.com', '123456', 'Propietario2', 'Propietario');
        ownerUser = UserService.getUser('propietario@gmail.com');
      }

      // Check for existing session
      const savedUserEmail = localStorage.getItem('currentUser');
      const savedRole = localStorage.getItem('currentRole');
      const savedToken = localStorage.getItem('token');

      if (savedUserEmail && savedRole && savedToken) {
        // Try to verify with backend if available
        try {
          const { AuthServiceBackend } = await import('../services/AuthServiceBackend');
          // For now, just check if token exists (since verifyToken doesn't exist)
          if (savedToken && savedToken.length > 0) {
        const user = UserService.getUser(savedUserEmail);
        if (user && user.role === savedRole) {
          // Check if user is banned
          if (user.bannedUntil && user.bannedUntil > Date.now()) {
            setIsBanned(true);
            const remaining = Math.ceil((user.bannedUntil - Date.now()) / (60 * 1000));
            setBanTimeRemaining(remaining);
            return;
          }

          // Asegurar que tenga profilePic basado en el rol
          if (!user.profilePic) {
            user.profilePic = UserService.getRoleProfilePic(user.role);
          }

          setCurrentUser(user);
          setCurrentRole(user.role);
          setIsLoggedIn(true);

              // Restore active tab
              const savedActiveTab = localStorage.getItem('activeTab');
              if (savedActiveTab) {
                setActiveTab(savedActiveTab);
              }

              console.log('Session restored for user:', savedUserEmail);
              return;
            }
          }
        } catch (error) {
          // Backend not available, try local restoration
          console.log('Backend not available, trying local session restoration');
        }

        // Fallback to local session restoration
        const user = UserService.getUser(savedUserEmail);
        if (user && user.role === savedRole) {
          // Check if user is banned
          if (user.bannedUntil && user.bannedUntil > Date.now()) {
            setIsBanned(true);
            const remaining = Math.ceil((user.bannedUntil - Date.now()) / (60 * 1000));
            setBanTimeRemaining(remaining);
            return;
          }

          // Asegurar que tenga profilePic basado en el rol
          if (!user.profilePic) {
            user.profilePic = UserService.getRoleProfilePic(user.role);
          }

          setCurrentUser(user);
          setCurrentRole(user.role);
          setIsLoggedIn(true);

          // Restore active tab
          const savedActiveTab = localStorage.getItem('activeTab');
          if (savedActiveTab) {
            setActiveTab(savedActiveTab);
          }

          console.log('Local session restored for user:', savedUserEmail);
        } else {
          // Invalid session, clear it
          localStorage.removeItem('currentUser');
          localStorage.removeItem('currentRole');
          localStorage.removeItem('token');
          localStorage.removeItem('activeTab');
          console.log('Invalid session cleared');
        }
      }
      // If no valid session, stay on login screen
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // Intentar con AuthServiceBackend primero
      const { AuthServiceBackend } = await import('../services/AuthServiceBackend');
      const result = await AuthServiceBackend.login(email, password);
      
      if (result.success && result.user) {
        const user = result.user;
        if (user.bannedUntil && user.bannedUntil > Date.now()) {
          setIsBanned(true);
          const remaining = Math.ceil((user.bannedUntil - Date.now()) / (60 * 1000));
          setBanTimeRemaining(remaining);
          return { success: false, message: 'Tu cuenta está suspendida temporalmente' };
        }

        setCurrentUser(user);
        setCurrentRole(user.role);
        setIsLoggedIn(true);
        
        // Limpiar datos pendientes después de login exitoso
        setPendingLoginData(null);

        // Save session
        localStorage.setItem('currentUser', email);
        localStorage.setItem('currentRole', user.role);
        if (result.token) {
          localStorage.setItem('token', result.token);
        }
        // Save current active tab
        localStorage.setItem('activeTab', activeTab);
        
        return { success: true };
      } else {
        // Si el backend falló, intentar con servicio local como fallback
        const localResult = await AuthService.login(email, password);
        if (localResult.success && localResult.user) {
          const user = localResult.user;
          // Asegurar que tenga profilePic basado en el rol
          if (!user.profilePic) {
            user.profilePic = UserService.getRoleProfilePic(user.role);
          }
          setCurrentUser(user);
          setCurrentRole(user.role);
          setIsLoggedIn(true);
          setPendingLoginData(null);
        localStorage.setItem('currentUser', email);
        localStorage.setItem('currentRole', user.role);
        localStorage.setItem('token', 'local-session-token');
        // Save current active tab
        localStorage.setItem('activeTab', activeTab);
          return { success: true };
        }
        
        // Retornar el mensaje de error del backend
        return { success: false, message: result.message || 'Credenciales incorrectas' };
      }
    } catch (error) {
      // Solo loguear errores reales, no errores de red esperados
      if (error instanceof Error && !error.message.includes('fetch') && !error.message.includes('404') && !error.message.includes('500')) {
        console.error('Error en login:', error);
      }
      // Fallback a AuthService local
      try {
        const result = await AuthService.login(email, password);
        if (result.success && result.user) {
          const user = result.user;
          setCurrentUser(user);
          setCurrentRole(user.role);
          setIsLoggedIn(true);
          setPendingLoginData(null);
          localStorage.setItem('currentUser', email);
          localStorage.setItem('currentRole', user.role);
          localStorage.setItem('token', 'local-session-token');
          return { success: true };
        }
      } catch (localError) {
        // Ignorar errores del servicio local también
      }
      
      return { success: false, message: 'Error al conectar con el servidor. Verifica tu conexión.' };
    }
  };

  const register = async (email: string, password: string, username: string, role: string, reason?: string) => {
    try {
      // Intentar con AuthServiceBackend primero
      const { AuthServiceBackend } = await import('../services/AuthServiceBackend');
      const result = await AuthServiceBackend.register(email, password, username, role);
      
      // Si el registro fue exitoso y no es Moderador, guardar datos para login automático
      if (result.success && role !== 'Moderador') {
        setPendingLoginData({ email, password });
        setShowLogin(true); // Cambiar a formulario de login
      }
      
      return result;
    } catch (error) {
      // Solo loguear errores reales, no errores esperados
      if (error instanceof Error && !error.message.includes('fetch')) {
        console.error('Error en registro:', error);
      }
      // Fallback a AuthService local
      const result = AuthService.register(email, password, username, role, reason);
      
      // Si el registro fue exitoso y no es Moderador, guardar datos para login automático
      if (result.success && role !== 'Moderador') {
        setPendingLoginData({ email, password });
        setShowLogin(true); // Cambiar a formulario de login
      }
      
      return result;
    }
  };
  
  const clearPendingLoginData = () => {
    setPendingLoginData(null);
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    setIsLoggedIn(false);
    setActiveTab('home');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentRole');
    localStorage.removeItem('token');
    localStorage.removeItem('activeTab');
  };

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  const value: AuthContextType = {
    currentUser,
    currentRole,
    isLoggedIn,
    isBanned,
    banTimeRemaining,
    activeTab,
    setActiveTab,
    login,
    register,
    logout,
    toggleForm,
    showLogin,
    pendingLoginData,
    clearPendingLoginData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
