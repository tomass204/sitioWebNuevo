import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Badge, Spinner, Container, Modal } from 'react-bootstrap';
import { ProductService, Producto } from '../../services/ProductService';
import { useAuth } from '../../contexts/AuthContext';

const OfertasTab: React.FC = () => {
  const navigate = (path: string) => {
    window.location.href = path;
  };
  const { isLoggedIn } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosEnOferta, setProductosEnOferta] = useState<Producto[]>([]);
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
      const data = await ProductService.getAllProductos();
      setProductos(data);
      
      // Consideramos productos en oferta aquellos con precio menor a un umbral
      // o que tengan ciertas palabras clave en el nombre/descripción
      const ofertas = data.filter(producto => {
        const precio = Number(producto.precio);
        const nombre = producto.nombre.toLowerCase();
        const descripcion = producto.descripcion?.toLowerCase() || '';
        
        // Productos con precio menor a $50.000 o que contengan palabras clave
        return precio < 50000 || 
               nombre.includes('oferta') || 
               nombre.includes('descuento') ||
               nombre.includes('rebaja') ||
               descripcion.includes('oferta') ||
               descripcion.includes('descuento');
      });

      // Si no hay productos con esas características, mostramos los más baratos
      if (ofertas.length === 0) {
        const sortedByPrice = [...data].sort((a, b) => Number(a.precio) - Number(b.precio));
        setProductosEnOferta(sortedByPrice.slice(0, 6));
      } else {
        setProductosEnOferta(ofertas);
      }
    } catch (err) {
      setError('Error al cargar productos. Verifica que el microservicio de Product esté corriendo.');
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
    const userData = JSON.parse(localStorage.getItem('gaminghub_user') || '{}');
    if (!userData.email) {
      alert('No se pudo obtener la información del usuario. Por favor, inicia sesión nuevamente.');
      navigate('/login');
      return;
    }

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
    alert(`${producto.nombre} agregado al carrito`);
  };

  const calcularDescuento = (producto: Producto): number => {
    // Simular un descuento basado en el precio
    const precio = Number(producto.precio);
    if (precio < 30000) return 15;
    if (precio < 50000) return 20;
    return 25;
  };

  return (
    <Container className="ofertas-page">
      <div className="mb-5 text-center">
        <h1 className="mb-3">
          <i className="fas fa-tags me-2 text-danger"></i>
          Productos en Oferta
        </h1>
        <p className="text-muted lead">
          ¡Aprovecha nuestras mejores ofertas en productos gaming!
        </p>
        <Badge bg="danger" className="fs-6 p-2">
          🔥 OFERTAS ESPECIALES 🔥
        </Badge>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando ofertas...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : productosEnOferta.length === 0 ? (
        <Alert variant="info">
          No hay productos en oferta en este momento. Vuelve pronto para nuevas ofertas.
        </Alert>
      ) : (
        <Row>
          {productosEnOferta.map((producto) => {
            const descuento = calcularDescuento(producto);
            const precioOriginal = Number(producto.precio);
            const precioConDescuento = precioOriginal * (1 - descuento / 100);

            return (
              <Col key={producto.productoId} md={4} lg={3} className="mb-4">
                <Card className="h-100 oferta-card" style={{ position: 'relative', border: '2px solid #dc3545' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#dc3545',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      zIndex: 1
                    }}
                  >
                    -{descuento}%
                  </div>
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
                      {producto.descripcion?.substring(0, 80)}...
                    </Card.Text>
                    <div className="mb-2">
                      <Badge bg="secondary">{producto.categoria}</Badge>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted text-decoration-line-through">
                        ${precioOriginal.toFixed(2)}
                      </small>
                      <div>
                        <strong className="text-danger fs-4">
                          ${precioConDescuento.toFixed(2)}
                        </strong>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="w-100 mb-2"
                        onClick={() => handleViewDetails(producto)}
                      >
                        Ver Detalles
                      </Button>
                      {isLoggedIn ? (
                        <Button
                          variant="success"
                          size="sm"
                          className="w-100"
                          onClick={() => handleAddToCart(producto)}
                        >
                          <i className="fas fa-cart-plus me-1"></i>
                          Agregar al Carrito
                        </Button>
                      ) : (
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="w-100"
                          onClick={() => navigate('/login')}
                        >
                          Iniciar Sesión para Comprar
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Modal de Detalles */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedProducto?.nombre}
            {selectedProducto && (
              <Badge bg="danger" className="ms-2">
                -{calcularDescuento(selectedProducto)}% OFF
              </Badge>
            )}
          </Modal.Title>
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
              <div>
                <p><strong>Precio Original:</strong> 
                  <span className="text-muted text-decoration-line-through ms-2">
                    ${Number(selectedProducto.precio).toFixed(2)}
                  </span>
                </p>
                <p><strong>Precio con Descuento:</strong> 
                  <span className="text-danger fs-4 ms-2">
                    ${(Number(selectedProducto.precio) * (1 - calcularDescuento(selectedProducto) / 100)).toFixed(2)}
                  </span>
                </p>
                <Badge bg="danger">Ahorras ${(Number(selectedProducto.precio) * calcularDescuento(selectedProducto) / 100).toFixed(2)}</Badge>
              </div>
              <p><strong>Estado:</strong> {selectedProducto.activo ? 'Disponible' : 'No disponible'}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Cerrar
          </Button>
          {selectedProducto && isLoggedIn && (
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

export default OfertasTab;

