import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Modal, Badge, Spinner, Container, Image } from 'react-bootstrap';
import { ProductService, Producto } from '../../services/ProductService';
import { useAuth } from '../../contexts/AuthContext';

interface HomeTabProps {
  currentUser?: any;
  currentRole?: string | null;
}

const HomeTab: React.FC<HomeTabProps> = () => {
  const { isLoggedIn } = useAuth();
  
  const navigate = (path: string) => {
    window.location.href = path;
  };
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('GET /v1/productos - Cargando productos desde el microservicio');
      const data = await ProductService.getAllProductos();
      console.log(`GET /v1/productos - Status: 200 - Éxito`);
      console.log(`Productos obtenidos: ${data.length}`);
      // Mostrar solo los primeros 6 productos en la página principal
      setProductos(data.slice(0, 6));
    } catch (err) {
      setError('Error al cargar productos. Verifica que el microservicio de Product esté corriendo en el puerto 8082.');
      console.error('Error loading productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (producto: Producto) => {
    setSelectedProducto(producto);
    setShowDetailModal(true);
  };

  const handleAddToCart = (producto: Producto) => {
    if (!isLoggedIn) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }

    const productoId = producto.productoId;
    console.log(`POST /cart - Agregando producto al carrito`);
    console.log(`Producto ID: ${productoId}, Nombre: ${producto.nombre}, Precio: ${producto.precio}`);

    // Obtener usuario del localStorage
    const userData = JSON.parse(localStorage.getItem('gaminghub_user') || '{}');
    if (!userData.email) {
      alert('No se pudo obtener la información del usuario. Por favor, inicia sesión nuevamente.');
      navigate('/login');
      return;
    }

    // Guardar en localStorage
    const cartData = JSON.parse(localStorage.getItem(`gaminghub_cart_${userData.email}`) || '[]');
    const existingItem = cartData.find((item: any) => item.productoId === productoId && item.type === 'product');

    if (existingItem) {
      existingItem.cantidad += 1;
    } else {
      cartData.push({
        productoId: productoId,
        nombre: producto.nombre,
        precio: Number(producto.precio),
        imagenUrl: producto.imagenUrl || '/img/default_product.png',
        descripcion: producto.descripcion || '',
        cantidad: 1,
        type: 'product',
      });
    }

    localStorage.setItem(`gaminghub_cart_${userData.email}`, JSON.stringify(cartData));
    console.log('POST /cart - Status: 200 - Producto agregado exitosamente');
    alert(`${producto.nombre} agregado al carrito`);
  };

  return (
    <Container fluid className="home-page">
      {/* Hero Section */}
      <div className="hero-section text-center mb-5 py-5" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '10px',
        padding: '3rem'
      }}>
        <Image
          src="/img/gaminghub_logo.png"
          alt="GamingHub Logo"
          height="80"
          className="mb-3"
        />
        <h1 className="display-4 mb-3">Bienvenido a GamingHub</h1>
        <p className="lead mb-4">
          Tu tienda de confianza para productos gaming. Encuentra los mejores accesorios, 
          periféricos y equipos para gamers profesionales y aficionados.
        </p>
        <div>
          <Button 
            variant="light" 
            size="lg" 
            className="me-3"
            onClick={() => navigate('/productos')}
          >
            <i className="fas fa-store me-2"></i>Ver Todos los Productos
          </Button>
          {!isLoggedIn && (
            <Button 
              variant="outline-light" 
              size="lg"
              onClick={() => navigate('/login')}
            >
              <i className="fas fa-sign-in-alt me-2"></i>Iniciar Sesión
            </Button>
          )}
        </div>
      </div>

      {/* Productos Destacados */}
      <div className="mb-5">
        <h2 className="mb-4">
          <i className="fas fa-star me-2" style={{ color: '#ffc107' }}></i>
          Productos Destacados
        </h2>
        
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando productos...</span>
            </Spinner>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : productos.length === 0 ? (
          <Alert variant="info">No hay productos disponibles en este momento.</Alert>
        ) : (
          <Row>
            {productos.map((producto) => (
              <Col key={producto.productoId} md={4} lg={4} className="mb-4">
                <Card className="h-100 product-card" style={{ transition: 'transform 0.3s' }}>
                  {producto.imagenUrl && (
                    <Card.Img
                      variant="top"
                      src={producto.imagenUrl}
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/img/default_product.png';
                      }}
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{producto.nombre}</Card.Title>
                    <Card.Text className="flex-grow-1">
                      {producto.descripcion?.substring(0, 100)}...
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Badge bg="secondary">{producto.categoria}</Badge>
                      <strong className="text-primary">${Number(producto.precio).toFixed(2)}</strong>
                    </div>
                    <div className="mt-auto">
                      <Button
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => handleViewDetails(producto)}
                      >
                        <i className="fas fa-eye me-1"></i>Ver Detalles
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => handleAddToCart(producto)}
                      >
                        <i className="fas fa-cart-plus me-1"></i>Agregar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {productos.length > 0 && (
          <div className="text-center mt-4">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/productos')}
            >
              Ver Todos los Productos
            </Button>
          </div>
        )}
      </div>

      {/* Información de la Tienda */}
      <Row className="mt-5 mb-5">
        <Col md={4} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <i className="fas fa-shipping-fast fa-3x text-primary mb-3"></i>
              <h4>Envío Rápido</h4>
              <p className="text-muted">
                Despachos a todo Chile con entrega rápida y segura.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <i className="fas fa-shield-alt fa-3x text-success mb-3"></i>
              <h4>Garantía</h4>
              <p className="text-muted">
                Todos nuestros productos cuentan con garantía oficial.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <i className="fas fa-headset fa-3x text-info mb-3"></i>
              <h4>Soporte 24/7</h4>
              <p className="text-muted">
                Atención al cliente disponible todos los días.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de Detalles */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedProducto?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProducto && (
            <>
              {selectedProducto.imagenUrl && (
                <img
                  src={selectedProducto.imagenUrl}
                  alt={selectedProducto.nombre}
                  className="img-fluid mb-3"
                  style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                />
              )}
              <p><strong>Descripción:</strong> {selectedProducto.descripcion}</p>
              <p><strong>Categoría:</strong> <Badge bg="secondary">{selectedProducto.categoria}</Badge></p>
              <p><strong>Precio:</strong> ${Number(selectedProducto.precio).toFixed(2)}</p>
              <p><strong>Estado:</strong> {selectedProducto.activo ? 'Disponible' : 'No disponible'}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Cerrar
          </Button>
          {selectedProducto && (
            <Button
              variant="success"
              onClick={() => {
                if (selectedProducto) {
                  handleAddToCart(selectedProducto);
                  setShowDetailModal(false);
                }
              }}
            >
              Agregar al Carrito
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HomeTab;

