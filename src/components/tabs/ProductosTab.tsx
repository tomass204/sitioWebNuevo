import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Modal, Badge, Spinner, InputGroup, Form } from 'react-bootstrap';
import { User } from '../../services/AuthService';
import { ProductService, Producto } from '../../services/ProductService';
import { SearchBar } from '../SearchBar';
import { PreviousSearches } from '../PreviousSearches';

interface ProductosTabProps {
  currentUser: User | null;
  currentRole: string | null;
}

const ProductosTab: React.FC<ProductosTabProps> = ({ currentUser, currentRole }) => {
  // Determinar si el usuario puede comprar (solo UsuarioBasico puede comprar)
  const canPurchase = currentRole === 'UsuarioBasico' || currentRole === 'ROLE_USUARIO_BASICO';
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Products search state
  const [productSearches, setProductSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('gaminghub_product_searches');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');

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
      setProductos(data);
    } catch (err) {
      setError('Error al cargar productos. Verifica que el microservicio de Product esté corriendo en el puerto 8082.');
      console.error('Error loading productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductQuery = (query: string) => {
    if (query.trim() === '') {
      setFilteredProductos([]);
    } else {
      const filtered = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(query.toLowerCase()) ||
        producto.categoria.toLowerCase().includes(query.toLowerCase()) ||
        producto.descripcion?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProductos(filtered);
      if (query.trim() && !productSearches.includes(query.trim())) {
        const newSearches = [query.trim(), ...productSearches.slice(0, 4)];
        setProductSearches(newSearches);
        localStorage.setItem('gaminghub_product_searches', JSON.stringify(newSearches));
      }
    }
  };

  const handleViewDetails = (producto: Producto) => {
    setSelectedProducto(producto);
    setShowDetailModal(true);
  };

  const handleCategoryFilter = async (categoria: string) => {
    if (categoria === '') {
      setFilteredProductos([]);
      setSelectedCategory('');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const productosByCategory = await ProductService.getProductosByCategoria(categoria);
      setFilteredProductos(productosByCategory);
      setSelectedCategory(categoria);
    } catch (error) {
      setError('Error al filtrar productos por categoría.');
      setFilteredProductos([]);
    }
    setLoading(false);
  };

  const handleAddToCart = (producto: Producto) => {
    if (!currentUser) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    const productoId = producto.productoId;
    console.log(`POST /cart - Agregando producto al carrito`);
    console.log(`Producto ID: ${productoId}, Nombre: ${producto.nombre}, Precio: ${producto.precio}`);

    // Guardar en localStorage
    const cartData = JSON.parse(localStorage.getItem(`gaminghub_cart_${currentUser.email}`) || '[]');
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

    localStorage.setItem(`gaminghub_cart_${currentUser.email}`, JSON.stringify(cartData));
    console.log('POST /cart - Status: 200 - Producto agregado exitosamente');
    alert(`${producto.nombre} agregado al carrito`);
  };

  const handleProductLabelClicked = (term: string) => {
    setSearchQuery(term);
    handleProductQuery(term);
  };

  const handleRemoveProductSearch = (term: string) => {
    const updatedSearches = productSearches.filter(search => search !== term);
    setProductSearches(updatedSearches);
    localStorage.setItem('gaminghub_product_searches', JSON.stringify(updatedSearches));
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando juegos...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const displayProductos = filteredProductos.length > 0 ? filteredProductos : productos;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Productos</h2>
      </div>



      {/* Filtro por Categorías */}
      <Card className="mb-4">
        <Card.Body>
          <h5>Filtrar por Categoría</h5>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            <option value="Electronics">Electronics</option>
            <option value="Accesorios">Accesorios</option>
            <option value="Audio">Audio</option>
            <option value="Monitores">Monitores</option>
            <option value="Mouse">Mouse</option>
            <option value="Mousepads">Mousepads</option>
            <option value="Sillas Gamer">Sillas Gamer</option>
            <option value="Micrófonos">Micrófonos</option>
            <option value="Iluminación RGB">Iluminación RGB</option>
          </Form.Select>
        </Card.Body>
      </Card>

      <SearchBar placeHolder="Buscar productos..." value={searchQuery} onChange={setSearchQuery} onSearch={handleProductQuery} />
      <PreviousSearches searches={productSearches} onLabelClicked={handleProductLabelClicked} onRemoveSearch={handleRemoveProductSearch} />

      {displayProductos.length === 0 ? (
        <Alert variant="info">
          {selectedCategory ? `No hay productos disponibles en la categoría "${selectedCategory}"` : 'No hay productos disponibles'}
        </Alert>
      ) : (
        <Row>
          {displayProductos.map((producto) => (
            <Col key={producto.productoId} md={4} className="mb-4">
              <Card>
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
                <Card.Body>
                  <Card.Title>{producto.nombre}</Card.Title>
                  <Card.Text>{producto.descripcion?.substring(0, 100)}...</Card.Text>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg="secondary">{producto.categoria}</Badge>
                    <strong>${Number(producto.precio).toFixed(2)}</strong>
                  </div>

                  <div className="mt-3">
                    <Button
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => handleViewDetails(producto)}
                    >
                      Ver Detalles
                    </Button>
                    {canPurchase && (
                      <Button
                        variant="success"
                        onClick={() => handleAddToCart(producto)}
                      >
                        Agregar al Carrito
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

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
          {selectedProducto && canPurchase && (
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
    </div>
  );
};

export default ProductosTab;
