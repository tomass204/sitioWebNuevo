import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';
import { User } from '../services/AuthService';
import NewsTab from './tabs/NewsTab';
import DebatesTab from './tabs/DebatesTab';
import GamesTab from './tabs/GamesTab';
import CartTab from './tabs/CartTab';
import PendingPurchasesTab from './tabs/PendingPurchasesTab';
import FavoritesTab from './tabs/FavoritesTab';
import ProfileTab from './tabs/ProfileTab';
import ModerationTab from './tabs/ModerationTab';
import AboutTab from './tabs/AboutTab';
import ProductosTab from './tabs/ProductosTab';
import OrdenesTab from './tabs/OrdenesTab';
import AdminProductosTab from './tabs/AdminProductosTab';
import AdminGamesTab from './tabs/AdminGamesTab';
import MisOrdenesTab from './tabs/MisOrdenesTab';

interface MainContentProps {
  currentUser: User | null;
  currentRole: string | null;
  onLogout: () => void;
}

type TabType = 'profile' | 'news' | 'debates' | 'games' | 'cart' | 'pendingPurchases' | 'favorites' | 'moderation' | 'about' | 'productos' | 'ordenes' | 'adminProductos' | 'adminGames' | 'misOrdenes';

const MainContent: React.FC<MainContentProps> = ({ currentUser, currentRole, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  useEffect(() => {
    // Load saved tab from localStorage
    const savedTab = localStorage.getItem('activeTab') as TabType;
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab currentUser={currentUser} currentRole={currentRole} />;
      case 'news':
        return <NewsTab currentUser={currentUser} currentRole={currentRole} />;
      case 'debates':
        return <DebatesTab currentUser={currentUser} currentRole={currentRole} />;
      case 'games':
        return <GamesTab currentUser={currentUser} currentRole={currentRole} />;
      case 'cart':
        return <CartTab currentUser={currentUser} currentRole={currentRole} />;
      case 'pendingPurchases':
        return <PendingPurchasesTab currentUser={currentUser} currentRole={currentRole} />;
      case 'favorites':
        return <FavoritesTab currentUser={currentUser} currentRole={currentRole} />;
      case 'moderation':
        return <ModerationTab currentUser={currentUser} currentRole={currentRole} />;
      case 'about':
        return <AboutTab currentUser={currentUser} currentRole={currentRole} />;
      case 'productos':
        return <ProductosTab currentUser={currentUser} currentRole={currentRole} />;
      case 'ordenes':
        return <OrdenesTab currentUser={currentUser} currentRole={currentRole} />;
      case 'adminProductos':
        return <AdminProductosTab currentUser={currentUser} currentRole={currentRole} />;
      case 'adminGames':
        return <AdminGamesTab currentUser={currentUser} currentRole={currentRole} />;
      case 'misOrdenes':
        return <MisOrdenesTab currentUser={currentUser} currentRole={currentRole} />;
      default:
        return <ProfileTab currentUser={currentUser} currentRole={currentRole} />;
    }
  };

  return (
    <div className="main-content">
      <Navbar expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand href="#">
            <Image src="/img/gaminghub_logo.png" alt="GamingHub Logo" height="40" className="me-2" />
            <span style={{ color: 'white' }}>GamingHub</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                onClick={() => handleTabChange('profile')}
                className={activeTab === 'profile' ? 'active' : ''}
              >
                <i className="fas fa-user me-1"></i> Perfil
              </Nav.Link>
              <Nav.Link 
                onClick={() => handleTabChange('news')}
                className={activeTab === 'news' ? 'active' : ''}
              >
                <i className="fas fa-newspaper me-1"></i> Noticias
              </Nav.Link>
              <Nav.Link 
                onClick={() => handleTabChange('debates')}
                className={activeTab === 'debates' ? 'active' : ''}
              >
                <i className="fas fa-comments me-1"></i> Debates
              </Nav.Link>
              <Nav.Link 
                onClick={() => handleTabChange('games')}
                className={activeTab === 'games' ? 'active' : ''}
              >
                <i className="fas fa-gamepad me-1"></i> Juegos
              </Nav.Link>
              {/* Vistas según rol del sitio web */}
              {/* UsuarioBasico: Solo puede acceder a la tienda */}
              {(currentRole === 'UsuarioBasico' || currentRole === 'ROLE_USUARIO_BASICO') && (
                <>
                  <Nav.Link
                    onClick={() => handleTabChange('productos')}
                    className={activeTab === 'productos' ? 'active' : ''}
                  >
                    <i className="fas fa-store me-1"></i> Tienda
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => handleTabChange('misOrdenes')}
                    className={activeTab === 'misOrdenes' ? 'active' : ''}
                  >
                    <i className="fas fa-shopping-bag me-1"></i> Mis Órdenes
                  </Nav.Link>
                </>
              )}
              {/* Influencer: Puede ver productos y órdenes (solo lectura) */}
              {(currentRole === 'Influencer' || currentRole === 'ROLE_INFLUENCER') && (
                <>
                  <Nav.Link
                    onClick={() => handleTabChange('productos')}
                    className={activeTab === 'productos' ? 'active' : ''}
                  >
                    <i className="fas fa-box me-1"></i> Productos
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => handleTabChange('ordenes')}
                    className={activeTab === 'ordenes' ? 'active' : ''}
                  >
                    <i className="fas fa-shopping-bag me-1"></i> Órdenes
                  </Nav.Link>
                </>
              )}
              {/* Moderador y Propietario: Acceso total */}
              {(currentRole === 'Moderador' || currentRole === 'ROLE_MODERADOR' ||
                currentRole === 'Propietario' || currentRole === 'ROLE_PROPIETARIO') && (
                <>
                  <Nav.Link
                    onClick={() => handleTabChange('adminProductos')}
                    className={activeTab === 'adminProductos' ? 'active' : ''}
                  >
                    <i className="fas fa-box me-1"></i> Productos
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => handleTabChange('adminGames')}
                    className={activeTab === 'adminGames' ? 'active' : ''}
                  >
                    <i className="fas fa-gamepad me-1"></i> Juegos
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => handleTabChange('ordenes')}
                    className={activeTab === 'ordenes' ? 'active' : ''}
                  >
                    <i className="fas fa-shopping-bag me-1"></i> Órdenes
                  </Nav.Link>
                </>
              )}
              <Nav.Link
                onClick={() => handleTabChange('cart')}
                className={activeTab === 'cart' ? 'active' : ''}
              >
                <i className="fas fa-shopping-cart me-1"></i> Carrito
              </Nav.Link>
              <Nav.Link
                onClick={() => handleTabChange('pendingPurchases')}
                className={activeTab === 'pendingPurchases' ? 'active' : ''}
              >
                <i className="fas fa-shopping-bag me-1"></i> Compras
              </Nav.Link>
              {currentRole === 'UsuarioBasico' && (
                <Nav.Link 
                  onClick={() => handleTabChange('favorites')}
                  className={activeTab === 'favorites' ? 'active' : ''}
                >
                  <i className="fas fa-heart me-1"></i> Favoritos
                </Nav.Link>
              )}
              {(currentRole === 'Propietario' || currentRole === 'Moderador') && (
                <Nav.Link
                  onClick={() => handleTabChange('moderation')}
                  className={activeTab === 'moderation' ? 'active' : ''}
                >
                  <i className="fas fa-gavel me-1"></i> Moderación
                </Nav.Link>
              )}
              <Nav.Link 
                onClick={() => handleTabChange('about')}
                className={activeTab === 'about' ? 'active' : ''}
              >
                <i className="fas fa-info-circle me-1"></i> Acerca de
              </Nav.Link>
            </Nav>
            
            <Nav>
              <NavDropdown 
                title={
                  <div className="d-flex align-items-center">
                    <Image
                      src={currentUser?.profilePic || '/img/UsuarioBasico.png'}
                      alt="Profile"
                      className="profile-pic me-2"
                    />
                    <span>Bienvenido, {currentRole}</span>
                  </div>
                } 
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item onClick={onLogout}>
                  <i className="fas fa-sign-out-alt me-1"></i> Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link onClick={onLogout} className="d-none">Cerrar Sesión</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="tab-content">
        {renderTabContent()}
      </Container>
    </div>
  );
};

export default MainContent;
