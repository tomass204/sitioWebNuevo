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
  login: (email: string, password: string) => void;
  register: (email: string, password: string, username: string, role: string, reason?: string) => any;
  logout: () => void;
  toggleForm: () => void;
  showLogin: boolean;
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

  useEffect(() => {
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
      // Restore existing session
      const user = UserService.getUser(savedUserEmail);
      if (user && user.role === savedRole) {
        // Check if user is banned
        if (user.bannedUntil && user.bannedUntil > Date.now()) {
          setIsBanned(true);
          const remaining = Math.ceil((user.bannedUntil - Date.now()) / (60 * 1000));
          setBanTimeRemaining(remaining);
          return;
        }

        setCurrentUser(user);
        setCurrentRole(user.role);
        setIsLoggedIn(true);
        console.log('Session restored for user:', savedUserEmail);
      } else {
        // Invalid session, clear it
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentRole');
        localStorage.removeItem('token');
        console.log('Invalid session cleared');
      }
    }
    // If no valid session, stay on login screen
  }, []);

  const login = (email: string, password: string) => {
    const result = AuthService.login(email, password);
    // Simulate POST request response with status code
    if (result.success) {
      console.log(`POST /api/GamingHub/v1/Login - Status: ${result.statusCode} - ${result.message}`);
      console.log(`Parameters: Correo electrónico: ${email}, Contraseña: ********`);
    } else {
      console.log(`POST /api/GamingHub/v1/Login - Status: ${result.statusCode} - Error: ${result.message}`);
      console.log(`Parameters: Correo electrónico: ${email}, Contraseña: ********`);
    }

    if (result.success && result.user) {
      const user = result.user;
      if (user.bannedUntil && user.bannedUntil > Date.now()) {
        setIsBanned(true);
        const remaining = Math.ceil((user.bannedUntil - Date.now()) / (60 * 1000));
        setBanTimeRemaining(remaining);
        return;
      }

      setCurrentUser(user);
      setCurrentRole(user.role);
      setIsLoggedIn(true);

      // Save session
      localStorage.setItem('currentUser', email);
      localStorage.setItem('currentRole', user.role);
      localStorage.setItem('token', 'local-session-token');
    }
  };

  const register = (email: string, password: string, username: string, role: string, reason?: string) => {
    const result = AuthService.register(email, password, username, role, reason);
    // Simulate POST request response with status code and parameters
    if (result.success) {
      console.log(`POST /api/GamingHub/v1/Usuario - Status: ${result.statusCode} - ${result.message}`);
      console.log(`ID: ${result.userId}, Nombre de usuario: ${username}, Correo electrónico: ${email}, Contraseña: ********, Rol: ${role}`);
    } else {
      console.log(`POST /api/GamingHub/v1/Usuario - Status: ${result.statusCode} - Error: ${result.message}`);
      console.log(`Parameters: Nombre de usuario: ${username}, Correo electrónico: ${email}, Contraseña: ********, Rol: ${role}`);
    }
    return result;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentRole');
    localStorage.removeItem('token');
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
    login,
    register,
    logout,
    toggleForm,
    showLogin,
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
