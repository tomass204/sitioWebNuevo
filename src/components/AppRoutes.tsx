import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import MainContent from "./MainContent";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { RobotComponent } from "./RobotComponent";

import NewsTab from "./tabs/NewsTab";
import DebatesTab from "./tabs/DebatesTab";
import GamesTab from "./tabs/GamesTab";
import FavoritesTab from "./tabs/FavoritesTab";
import ProfileTab from "./tabs/ProfileTab";
import ModerationTab from "./tabs/ModerationTab";
import AboutTab from "./tabs/AboutTab";

const MainWrapper: React.FC = () => {
  const { currentUser, currentRole, logout } = useAuth();
  return (
    <MainContent
      currentUser={currentUser}
      currentRole={currentRole}
      onLogout={logout}
    />
  );
};

const TabWrapper = ({ Component }: { Component: React.FC<any> }) => {
  const { currentUser, currentRole } = useAuth();
  // Forward currentUser/currentRole to tab components
  return <Component currentUser={currentUser} currentRole={currentRole} />;
};

const LoginWrapper: React.FC = () => {
  const { login, toggleForm } = useAuth();
  return <LoginForm onLogin={login} onToggleForm={toggleForm} />;
};

const RegisterWrapper: React.FC = () => {
  const { register, toggleForm } = useAuth();
  return <RegisterForm onRegister={register} onToggleForm={toggleForm} />;
};

const LogoutWrapper: React.FC = () => {
  const { logout } = useAuth();
  React.useEffect(() => {
    logout();
  }, [logout]);
  return <Navigate to="/login" replace />;
};

export const AppRoutes: React.FC = () => {
  const routes = useRoutes([
    { path: "/", element: <MainWrapper /> },
    { path: "/news", element: <TabWrapper Component={NewsTab} /> },
    { path: "/debates", element: <TabWrapper Component={DebatesTab} /> },
    { path: "/games", element: <TabWrapper Component={GamesTab} /> },
    { path: "/favorites", element: <TabWrapper Component={FavoritesTab} /> },
    { path: "/profile", element: <TabWrapper Component={ProfileTab} /> },
    { path: "/about", element: <TabWrapper Component={AboutTab} /> },
    { path: "/moderation", element: <TabWrapper Component={ModerationTab} /> },
    { path: "/robot-component", element: <RobotComponent /> },
    { path: "/login", element: <LoginWrapper /> },
    { path: "/register", element: <RegisterWrapper /> },
    { path: "/logout", element: <LogoutWrapper /> },
    { path: "*", element: <div>Página no encontrada - 404</div> },
  ]);

  return routes;
};

export default AppRoutes;
