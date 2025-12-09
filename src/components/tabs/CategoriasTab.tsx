import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Badge, Spinner, Container, Form } from 'react-bootstrap';
import { ProductService, Producto } from '../../services/ProductService';
import { useAuth } from '../../contexts/AuthContext';

const categorias = [
  'Electronics',
  'Accesorios',
  'Audio',
  'Monitores',
  'Mouse',
  'Mousepads',
  'Sillas Gamer',
  'Micrófonos',
  'Iluminación RGB'
];

const CategoriasTab: React.FC = () => {
  const navigate = (path: string) => {
    window.location.href = path;
  };
  const { isLoggedIn } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);

  useEffect(() => {
    loadProductos();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      filterByCategory(selectedCategory);
    } else {
      setProductosFiltrados(productos);
    }
  }, [selectedCategory, productos]);

  const loadProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProductService.getAllProductos();
      setProductos(data);
      setProductosFiltrados(data);
    } catch (err) {
      setError('Error al cargar productos. Verifica que el microservicio de Product esté corriendo.');
      console.error('Error loading productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async (categoria: string) => {
    if (categoria === '') {
      setProductosFiltrados(productos);
      return;
    }

    setLoading(true);
    try {
      const productosByCategory = await ProductService.getProductosByCategoria(categoria);
      setProductosFiltrados(productosByCategory);
    } catch (error) {
      console.error('Error filtering productos:', error);
      // Fallback: filtrar desde productos locales
      const filtered = productos.filter(p => p.categoria === categoria);
      setProductosFiltrados(filtered);
    }
    setLoading(false);
  };

  const handleCategoryClick = (categoria: string) => {
    setSelectedCategory(categoria);
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

  // Agrupar productos por categoría
  const productosPorCategoria = categorias.map(categoria => ({
    categoria,
    productos: productos.filter(p => p.categoria === categoria)
  }));

  return (
    <Container className="categorias-page">
      <div className="mb-5">
        <h1 className="text-center mb-4">
          <i className="fas fa-th-large me-2"></i>
          Categorías de Productos
        </h1>
        <p className="text-center text-muted">
          Explora nuestros productos organizados por categorías
        </p>
      </div>

      {/* Filtro de Categorías */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Filtrar por Categoría</h5>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => handleCategoryClick(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </Form.Select>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando productos...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : selectedCategory ? (
        // Mostrar productos de la categoría seleccionada
        <div>
          <h3 className="mb-4">
            Categoría: <Badge bg="primary">{selectedCategory}</Badge>
          </h3>
          {productosFiltrados.length === 0 ? (
            <Alert variant="info">
              No hay productos disponibles en la categoría "{selectedCategory}"
            </Alert>
          ) : (
            <Row>
              {productosFiltrados.map((producto) => (
                <Col key={producto.productoId} md={4} lg={3} className="mb-4">
                  <Card className="h-100">
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
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Badge bg="secondary">{producto.categoria}</Badge>
                        <strong>${Number(producto.precio).toFixed(2)}</strong>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-100"
                        onClick={() => navigate(`/productos/${producto.productoId}`)}
                      >
                        Ver Detalles
                      </Button>
                      {isLoggedIn && (
                        <Button
                          variant="success"
                          size="sm"
                          className="w-100 mt-2"
                          onClick={() => handleAddToCart(producto)}
                        >
                          Agregar al Carrito
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      ) : (
        // Mostrar todas las categorías con sus productos
        <div>
          {productosPorCategoria.map(({ categoria, productos: productosCategoria }) => {
            if (productosCategoria.length === 0) return null;

            return (
              <div key={categoria} className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3>
                    <Badge bg="primary" className="me-2">{categoria}</Badge>
                    <span className="text-muted">({productosCategoria.length} productos)</span>
                  </h3>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleCategoryClick(categoria)}
                  >
                    Ver Todos
                  </Button>
                </div>
                <Row>
                  {productosCategoria.slice(0, 4).map((producto) => (
                    <Col key={producto.productoId} md={3} className="mb-4">
                      <Card className="h-100">
                        {producto.imagenUrl && (
                          <Card.Img
                            variant="top"
                            src={producto.imagenUrl}
                            style={{ height: '150px', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/img/default_product.png';
                            }}
                          />
                        )}
                        <Card.Body className="d-flex flex-column">
                          <Card.Title style={{ fontSize: '1rem' }}>{producto.nombre}</Card.Title>
                          <div className="mt-auto">
                            <strong className="text-primary">${Number(producto.precio).toFixed(2)}</strong>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="w-100 mt-2"
                              onClick={() => navigate(`/productos/${producto.productoId}`)}
                            >
                              Ver Detalles
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                {productosCategoria.length > 4 && (
                  <div className="text-center mt-3">
                    <Button
                      variant="outline-primary"
                      onClick={() => handleCategoryClick(categoria)}
                    >
                      Ver {productosCategoria.length - 4} productos más
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default CategoriasTab;

