import React from 'react';
import { Container, Navbar, Nav, Image } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const navigate = (path: string) => {
    window.location.href = path;
  };
  const getCurrentPath = () => {
    return window.location.pathname;
  };
  const { isLoggedIn } = useAuth();

  return (
    <div className="public-layout">
      <Navbar expand="lg" className="navbar-custom" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Container>
          <Navbar.Brand 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            style={{ cursor: 'pointer', color: 'white' }}
          >
            <Image src="/img/gaminghub_logo.png" alt="GamingHub Logo" height="40" className="me-2" />
            <span style={{ color: 'white' }}>GamingHub</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                onClick={() => navigate('/')}
                className={getCurrentPath() === '/' ? 'active' : ''}
                style={{ color: 'white' }}
              >
                <i className="fas fa-home me-1"></i> Inicio
              </Nav.Link>
              <Nav.Link 
                onClick={() => navigate('/productos')}
                style={{ color: 'white' }}
              >
                <i className="fas fa-store me-1"></i> Productos
              </Nav.Link>
              <Nav.Link 
                onClick={() => navigate('/categorias')}
                style={{ color: 'white' }}
              >
                <i className="fas fa-th-large me-1"></i> Categorías
              </Nav.Link>
              <Nav.Link 
                onClick={() => navigate('/ofertas')}
                style={{ color: 'white' }}
              >
                <i className="fas fa-tags me-1"></i> Ofertas
              </Nav.Link>
              <Nav.Link 
                onClick={() => navigate('/blogs')}
                style={{ color: 'white' }}
              >
                <i className="fas fa-blog me-1"></i> Blog
              </Nav.Link>
              <Nav.Link 
                onClick={() => navigate('/contacto')}
                style={{ color: 'white' }}
              >
                <i className="fas fa-envelope me-1"></i> Contacto
              </Nav.Link>
              <Nav.Link 
                onClick={() => navigate('/about')}
                style={{ color: 'white' }}
              >
                <i className="fas fa-info-circle me-1"></i> Nosotros
              </Nav.Link>
            </Nav>
            
            <Nav>
              {isLoggedIn ? (
                <Nav.Link 
                  onClick={() => navigate('/dashboard')}
                  style={{ color: 'white' }}
                >
                  <i className="fas fa-tachometer-alt me-1"></i> Dashboard
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link 
                    onClick={() => navigate('/login')}
                    style={{ color: 'white' }}
                  >
                    <i className="fas fa-sign-in-alt me-1"></i> Iniciar Sesión
                  </Nav.Link>
                  <Nav.Link 
                    onClick={() => navigate('/register')}
                    style={{ color: 'white' }}
                  >
                    <i className="fas fa-user-plus me-1"></i> Registrarse
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main style={{ minHeight: 'calc(100vh - 200px)' }}>
        {children}
      </main>

      <footer style={{ 
        background: '#2c3e50', 
        color: 'white', 
        padding: '2rem 0', 
        marginTop: '4rem',
        textAlign: 'center'
      }}>
        <Container>
          <p>&copy; 2024 GamingHub. Todos los derechos reservados.</p>
          <div>
            <a href="https://www.instagram.com/gaminghub_oficial" target="_blank" rel="noopener noreferrer" style={{ color: 'white', margin: '0 10px' }}>
              <i className="fab fa-instagram fa-2x"></i>
            </a>
            <a href="https://www.facebook.com/T4MS8282" target="_blank" rel="noopener noreferrer" style={{ color: 'white', margin: '0 10px' }}>
              <i className="fab fa-facebook fa-2x"></i>
            </a>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default PublicLayout;

