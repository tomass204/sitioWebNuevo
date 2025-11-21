import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Modal, Form, Spinner } from 'react-bootstrap';
import { User } from '../../services/AuthService';
import { ProductService, Producto } from '../../services/ProductService';
import { OrdenService, CreateOrdenRequest } from '../../services/OrdenService';

interface CartItem {
  productoId: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
  descripcion: string;
  cantidad: number;
  type?: 'product' | 'game';
}

interface CartTabProps {
  currentUser: User | null;
  currentRole: string | null;
}

const CartTab: React.FC<CartTabProps> = ({ currentUser, currentRole }) => {
  const [gamesCart, setGamesCart] = useState<CartItem[]>([]);
  const [productsCart, setProductsCart] = useState<CartItem[]>([]);
  const [gamesTotal, setGamesTotal] = useState(0);
  const [productsTotal, setProductsTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCart();
  }, []);

  const updateLocalStorage = (games: CartItem[], products: CartItem[]) => {
    if (!currentUser) return;
    const combinedCart = [...games.map(item => ({ ...item, type: 'game' })), ...products.map(item => ({ ...item, type: 'product' }))];
    localStorage.setItem(`gaminghub_cart_${currentUser.email}`, JSON.stringify(combinedCart));
  };

  const loadCart = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    console.log('GET /cart - Obteniendo carrito del usuario');
    setLoading(true);
    setError(null);

    try {
      const cartData: CartItem[] = JSON.parse(localStorage.getItem(`gaminghub_cart_${currentUser.email}`) || '[]');

      // Add type to items that don't have it (backward compatibility)
      const updatedCartData = cartData.map(item => ({
        ...item,
        type: item.type || 'product'
      }));

      // Separar juegos y productos
      const gamesItems = updatedCartData.filter(item => item.type === 'game');
      const productsItems = updatedCartData.filter(item => item.type === 'product');

      // Intentar obtener juegos actualizados del backend (microservicio de Game)
      try {
        const { GameServiceBackend } = await import('../../services/GameServiceBackend');
        const juegos = await GameServiceBackend.getAllGames();
        const juegosMap = new Map(juegos.map(j => [j.juegoId, j]));

        // Actualizar carrito de juegos con datos del backend
        const updatedGamesCart = gamesItems.map((item: any) => {
          const juego = juegosMap.get(item.productoId);
          if (juego) {
            return {
              productoId: item.productoId,
              nombre: juego.titulo || item.nombre,
              precio: Number(juego.precio) || item.precio,
              imagenUrl: juego.imagenUrl || item.imagenUrl || '/img/default_product.png',
              descripcion: juego.descripcion || item.descripcion || '',
              cantidad: item.cantidad || 1,
              type: 'game',
            };
          }
          return item;
        }).filter((item: CartItem) => item && item.productoId);

        console.log('GET /cart/games - Status: 200 - Éxito');
        console.log(`Juegos en carrito: ${updatedGamesCart.length}`);
        setGamesCart(updatedGamesCart as CartItem[]);
        const gamesCartTotal = updatedGamesCart.reduce((sum: number, item: any) => sum + (item.precio * item.cantidad), 0);
        setGamesTotal(gamesCartTotal);
      } catch (gameError) {
        // Si falla el microservicio de Game, usar datos del localStorage
        console.warn('No se pudo conectar con el microservicio de Game, usando datos locales');
        setGamesCart(gamesItems as CartItem[]);
        const gamesCartTotal = gamesItems.reduce((sum: number, item: any) => sum + (item.precio * item.cantidad), 0);
        setGamesTotal(gamesCartTotal);
      }

      // Intentar obtener productos actualizados del backend (microservicio de Product)
      try {
        const { ProductService } = await import('../../services/ProductService');
        const productos = await ProductService.getAllProductos();
        const productosMap = new Map(productos.map(p => [p.productoId, p]));

        // Actualizar carrito de productos con datos del backend
        const updatedProductsCart = productsItems.map((item: any) => {
          const producto = productosMap.get(item.productoId);
          if (producto) {
            return {
              productoId: item.productoId,
              nombre: producto.nombre || item.nombre,
              precio: Number(producto.precio) || item.precio,
              imagenUrl: producto.imagenUrl || item.imagenUrl || '/img/default_product.png',
              descripcion: producto.descripcion || item.descripcion || '',
              cantidad: item.cantidad || 1,
              type: 'product',
            };
          }
          return item;
        }).filter((item: CartItem) => item && item.productoId);

        console.log('GET /cart/products - Status: 200 - Éxito');
        console.log(`Productos en carrito: ${updatedProductsCart.length}`);
        setProductsCart(updatedProductsCart as CartItem[]);
        const productsCartTotal = updatedProductsCart.reduce((sum: number, item: any) => sum + (item.precio * item.cantidad), 0);
        setProductsTotal(productsCartTotal);
      } catch (productError) {
        // Si falla el microservicio de Product, usar datos del localStorage
        console.warn('No se pudo conectar con el microservicio de Product, usando datos locales');
        setProductsCart(productsItems);
        const productsCartTotal = productsItems.reduce((sum: number, item: CartItem) => sum + (item.precio * item.cantidad), 0);
        setProductsTotal(productsCartTotal);
      }
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      setError('Error al cargar el carrito. Los datos locales se mantendrán.');
      // Fallback a localStorage
      const cartData: CartItem[] = JSON.parse(localStorage.getItem(`gaminghub_cart_${currentUser.email}`) || '[]');
      const gamesItems = cartData.filter(item => item.type === 'game');
      const productsItems = cartData.filter(item => item.type === 'product');
      setGamesCart(gamesItems as CartItem[]);
      setProductsCart(productsItems as CartItem[]);
      const gamesCartTotal = gamesItems.reduce((sum: number, item: any) => sum + (item.precio * item.cantidad), 0);
      const productsCartTotal = productsItems.reduce((sum: number, item: any) => sum + (item.precio * item.cantidad), 0);
      setGamesTotal(gamesCartTotal);
      setProductsTotal(productsCartTotal);
    } finally {
      setLoading(false);
    }
  };

  const removeFromGamesCart = (index: number) => {
    if (!currentUser) return;

    console.log(`DELETE /cart/games/${gamesCart[index].productoId} - Eliminando juego del carrito`);
    console.log(`Juego: ${gamesCart[index].nombre}, ID: ${gamesCart[index].productoId}`);
    const newGamesCart = gamesCart.filter((_, i) => i !== index);
    setGamesCart(newGamesCart);
    updateLocalStorage(newGamesCart, productsCart);
    const gamesCartTotal = newGamesCart.reduce((sum: number, item: CartItem) => sum + (item.precio * item.cantidad), 0);
    setGamesTotal(gamesCartTotal);
    console.log('DELETE /cart/games - Status: 200 - Juego eliminado exitosamente');
  };

  const removeFromProductsCart = (index: number) => {
    if (!currentUser) return;

    console.log(`DELETE /cart/products/${productsCart[index].productoId} - Eliminando producto del carrito`);
    console.log(`Producto: ${productsCart[index].nombre}, ID: ${productsCart[index].productoId}`);
    const newProductsCart = productsCart.filter((_, i) => i !== index);
    setProductsCart(newProductsCart);
    updateLocalStorage(gamesCart, newProductsCart);
    const productsCartTotal = newProductsCart.reduce((sum: number, item: CartItem) => sum + (item.precio * item.cantidad), 0);
    setProductsTotal(productsCartTotal);
    console.log('DELETE /cart/products - Status: 200 - Producto eliminado exitosamente');
  };

  const increaseGamesQuantity = (index: number) => {
    if (!currentUser) return;

    console.log(`PUT /cart/games/${gamesCart[index].productoId}/quantity - Aumentando cantidad`);
    const newGamesCart = [...gamesCart];
    newGamesCart[index].cantidad += 1;
    setGamesCart(newGamesCart);
    updateLocalStorage(newGamesCart, productsCart);
    const gamesCartTotal = newGamesCart.reduce((sum: number, item: CartItem) => sum + (item.precio * item.cantidad), 0);
    setGamesTotal(gamesCartTotal);
    console.log(`PUT /cart/games - Status: 200 - Cantidad actualizada: ${newGamesCart[index].cantidad}`);
  };

  const decreaseGamesQuantity = (index: number) => {
    if (!currentUser) return;

    const newGamesCart = [...gamesCart];
    if (newGamesCart[index].cantidad > 1) {
      console.log(`PUT /cart/games/${gamesCart[index].productoId}/quantity - Disminuyendo cantidad`);
      newGamesCart[index].cantidad -= 1;
      setGamesCart(newGamesCart);
      updateLocalStorage(newGamesCart, productsCart);
      const gamesCartTotal = newGamesCart.reduce((sum: number, item: CartItem) => sum + (item.precio * item.cantidad), 0);
      setGamesTotal(gamesCartTotal);
      console.log(`PUT /cart/games - Status: 200 - Cantidad actualizada: ${newGamesCart[index].cantidad}`);
    }
  };

  const increaseProductsQuantity = (index: number) => {
    if (!currentUser) return;

    console.log(`PUT /cart/products/${productsCart[index].productoId}/quantity - Aumentando cantidad`);
    const newProductsCart = [...productsCart];
    newProductsCart[index].cantidad += 1;
    setProductsCart(newProductsCart);
    updateLocalStorage(gamesCart, newProductsCart);
    const productsCartTotal = newProductsCart.reduce((sum: number, item: CartItem) => sum + (item.precio * item.cantidad), 0);
    setProductsTotal(productsCartTotal);
    console.log(`PUT /cart/products - Status: 200 - Cantidad actualizada: ${newProductsCart[index].cantidad}`);
  };

  const decreaseProductsQuantity = (index: number) => {
    if (!currentUser) return;

    const newProductsCart = [...productsCart];
    if (newProductsCart[index].cantidad > 1) {
      console.log(`PUT /cart/products/${productsCart[index].productoId}/quantity - Disminuyendo cantidad`);
      newProductsCart[index].cantidad -= 1;
      setProductsCart(newProductsCart);
      updateLocalStorage(gamesCart, newProductsCart);
      const productsCartTotal = newProductsCart.reduce((sum: number, item: CartItem) => sum + (item.precio * item.cantidad), 0);
      setProductsTotal(productsCartTotal);
      console.log(`PUT /cart/products - Status: 200 - Cantidad actualizada: ${newProductsCart[index].cantidad}`);
    }
  };

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [currentCheckoutType, setCurrentCheckoutType] = useState<'games' | 'products' | null>(null);

  const handleGamesCheckout = async () => {
    if (gamesCart.length === 0) {
      alert('El carrito de juegos está vacío. Agrega juegos antes de proceder al pago.');
      return;
    }

    if (!currentUser) {
      alert('Debes iniciar sesión para comprar juegos.');
      return;
    }

    setCurrentCheckoutType('games');
    setShowPaymentModal(true);
  };

  const handleProductsCheckout = async () => {
    if (productsCart.length === 0) {
      alert('El carrito de productos está vacío. Agrega productos antes de proceder al pago.');
      return;
    }

    if (!currentUser) {
      alert('Debes iniciar sesión para comprar productos.');
      return;
    }

    setCurrentCheckoutType('products');
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate card details
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardholderName) {
      alert('Por favor complete todos los campos de la tarjeta');
      return;
    }

    // Validar que los campos no sean solo números repetidos o espacios
    const cardNumber = cardDetails.cardNumber.replace(/\s/g, '');
    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
      alert('Número de tarjeta inválido. Debe tener exactamente 16 dígitos numéricos.');
      return;
    }
    
    // Validar que no sean todos el mismo dígito
    if (/^(\d)\1{15}$/.test(cardNumber)) {
      alert('Número de tarjeta inválido. No puede ser el mismo dígito repetido.');
      return;
    }

    // Validar formato de fecha MM/YY
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      alert('Fecha de expiración inválida. Use el formato MM/YY (ejemplo: 12/25)');
      return;
    }

    if (cardDetails.cvv.length < 3 || !/^\d+$/.test(cardDetails.cvv)) {
      alert('CVV inválido. Debe tener al menos 3 dígitos numéricos.');
      return;
    }

    if (!cardDetails.cardholderName || cardDetails.cardholderName.trim().length < 3) {
      alert('Nombre del titular inválido. Debe tener al menos 3 caracteres.');
      return;
    }

    if (!currentUser) {
      alert('Usuario no encontrado');
      return;
    }

    try {
      // Obtener usuarioId del usuario actual
      const { UsuarioService } = await import('../../services/UsuarioService');
      let usuarioId = (currentUser as any)?.usuarioID;
      
      if (!usuarioId) {
        usuarioId = await UsuarioService.getCurrentUsuarioId();
      }
      
      if (!usuarioId) {
        // Fallback: intentar obtener del email o usar valor temporal
        console.warn('No se pudo obtener usuarioID, usando fallback');
        usuarioId = 1; // Fallback temporal - en producción esto debería fallar
      }
      
      console.log(`Usuario ID obtenido: ${usuarioId}`);

      const cart = currentCheckoutType === 'games' ? gamesCart : productsCart;
      const total = currentCheckoutType === 'games' ? gamesTotal : productsTotal;
      const productoIds = cart.map(item => item.productoId);

      console.log('═══════════════════════════════════════════');
      console.log('🛒 CREANDO ORDEN DE COMPRA');
      console.log('═══════════════════════════════════════════');
      console.log(`👤 Usuario ID: ${usuarioId}`);
      console.log(`🛍️ Productos: ${productoIds.join(', ')}`);
      console.log(`💰 Total: $${total.toFixed(2)}`);
      console.log(`📊 Estado: PENDIENTE`);
      console.log('═══════════════════════════════════════════');

      // Crear orden en el backend
      const ordenRequest: CreateOrdenRequest = {
        usuarioId: usuarioId,
        productoIds: productoIds,
        total: total,
        estado: currentCheckoutType === 'games' ? 'COMPLETADA' : 'PENDIENTE',
      };

      console.log('POST /v1/ordenes - Enviando solicitud al microservicio...');
      let nuevaOrden;
      try {
        nuevaOrden = await OrdenService.createOrden(ordenRequest);
      } catch (error) {
        // Si falla la conexión, mostrar mensaje claro
        if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
          alert('❌ Error: No se pudo conectar con el microservicio de órdenes.\n\nPor favor verifica que:\n- El microservicio de Product esté corriendo en el puerto 8082\n- La base de datos esté configurada correctamente\n- No haya problemas de red');
          console.error('Error de conexión con el microservicio de órdenes');
          return;
        }
        throw error;
      }
      
      console.log('═══════════════════════════════════════════');
      console.log('✅ ORDEN CREADA EXITOSAMENTE');
      console.log('═══════════════════════════════════════════');
      console.log(`📦 Orden ID: ${nuevaOrden.ordenId}`);
      console.log(`👤 Usuario ID: ${nuevaOrden.usuarioId}`);
      console.log(`🛍️ Productos: ${nuevaOrden.productoIds?.join(', ') || 'N/A'}`);
      console.log(`💰 Total: $${nuevaOrden.total}`);
      console.log(`📊 Estado: ${nuevaOrden.estado}`);
      console.log(`📅 Fecha: ${nuevaOrden.fecha}`);
      console.log('═══════════════════════════════════════════');

      // Guardar en compras pendientes para juegos y productos
      const purchaseData = cart.map(item => ({
        id: `orden-${nuevaOrden.ordenId}-${item.productoId}`,
        title: item.nombre,
        price: item.precio,
        image: item.imagenUrl,
        description: item.descripcion,
        quantity: item.cantidad,
        purchaseDate: new Date().toISOString(),
        total: item.precio * item.cantidad,
  status: 'Completado',
        ordenId: nuevaOrden.ordenId,
        type: currentCheckoutType === 'games' ? 'game' : 'product',
      }));
      const existingPurchases = JSON.parse(localStorage.getItem(`gaminghub_pending_purchases_${currentUser.email}`) || '[]');
      const updatedPurchases = [...existingPurchases, ...purchaseData];
      localStorage.setItem(`gaminghub_pending_purchases_${currentUser.email}`, JSON.stringify(updatedPurchases));

      // Mensaje de confirmación con datos de la orden
      let purchaseMessage = '═══════════════════════════\n';
      purchaseMessage += '   ¡COMPRA EXITOSA!\n';
      purchaseMessage += '═══════════════════════════\n\n';
      purchaseMessage += `📦 ORDEN #${nuevaOrden.ordenId}\n\n`;
      purchaseMessage += '🛒 PRODUCTOS COMPRADOS:\n';
      purchaseMessage += '───────────────────────────\n';
      cart.forEach(item => {
        purchaseMessage += `\n• ${item.nombre}\n`;
        purchaseMessage += `  Cantidad: ${item.cantidad}\n`;
        purchaseMessage += `  Precio unitario: $${item.precio.toFixed(2)}\n`;
        purchaseMessage += `  Subtotal: $${(item.precio * item.cantidad).toFixed(2)}\n`;
      });
      purchaseMessage += '\n───────────────────────────\n';
      purchaseMessage += `💰 TOTAL: $${total.toFixed(2)}\n`;
      purchaseMessage += `📊 Estado: ${nuevaOrden.estado}\n`;
      purchaseMessage += `📅 Fecha: ${new Date(nuevaOrden.fecha).toLocaleString()}\n`;
      purchaseMessage += '═══════════════════════════\n\n';
      purchaseMessage += '✅ Puedes ver el detalle de tu orden en "Mis Órdenes"';

      alert(purchaseMessage);

      // Mostrar mensaje adicional para juegos
      if (currentCheckoutType === 'games') {
        alert('🎮 ¡Recuerda! Ve a "Mis Órdenes" para descargar tus juegos 😜');
      }
      
      console.log('═══════════════════════════════════════════');
      console.log('✅ COMPRA COMPLETADA EXITOSAMENTE');
      console.log('═══════════════════════════════════════════');
      console.log(`📦 Orden ID: ${nuevaOrden.ordenId}`);
      console.log(`👤 Usuario ID: ${nuevaOrden.usuarioId}`);
      console.log(`🛒 Productos: ${nuevaOrden.productoIds.join(', ')}`);
      console.log(`💰 Total: $${nuevaOrden.total}`);
      console.log(`📊 Estado: ${nuevaOrden.estado}`);
      console.log(`📅 Fecha: ${nuevaOrden.fecha}`);
      console.log('═══════════════════════════════════════════');

      // Reset form and close modal
      setCardDetails({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
      });
      setShowPaymentModal(false);

      // Clear only the purchased cart section
      if (currentCheckoutType === 'games') {
        setGamesCart([]);
        updateLocalStorage([], productsCart);
        setGamesTotal(0);
      } else {
        setProductsCart([]);
        updateLocalStorage(gamesCart, []);
        setProductsTotal(0);
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      if (error instanceof Error) {
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          alert('❌ Error de conexión: No se pudo conectar con el microservicio de órdenes.\n\nPor favor verifica que el microservicio esté corriendo en el puerto 8082.');
        } else {
          alert(`Error al procesar la compra: ${error.message}`);
        }
      } else {
        alert('Error al procesar la compra. Por favor intenta de nuevo.');
      }
    }
  };

  return (
    <div>
      <h2>Carrito de Compras</h2>

      {gamesCart.length === 0 && productsCart.length === 0 ? (
        <Alert variant="info">
          Tu carrito está vacío. Agrega algunos juegos o productos desde las pestañas correspondientes.
        </Alert>
      ) : (
        <Row>
          <Col md={8}>
            {/* Juegos Cart */}
            {gamesCart.length > 0 && (
              <div className="mb-4">
                <h4>Juegos</h4>
                {gamesCart.map((item, index) => (
                  <Card key={`game-${index}`} className="cart-item mb-3">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col md={3}>
                          <img
                            src={item.imagenUrl || '/img/default_product.png'}
                            alt={item.nombre}
                            style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/img/default_product.png';
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <h5>{item.nombre}</h5>
                          <p className="text-muted">{item.descripcion?.substring(0, 100)}...</p>
                          <div className="d-flex align-items-center">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => decreaseGamesQuantity(index)}
                              disabled={item.cantidad <= 1}
                            >
                              -
                            </Button>
                            <span className="mx-2">Cantidad: {item.cantidad}</span>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => increaseGamesQuantity(index)}
                            >
                              +
                            </Button>
                          </div>
                        </Col>
                        <Col md={2}>
                          <span className="fw-bold">${(item.precio * item.cantidad).toFixed(2)}</span>
                        </Col>
                        <Col md={1}>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeFromGamesCart(index)}
                            aria-label="trash"
                          >
                            <i className="fas fa-trash" aria-hidden="true"></i>
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span>Total Juegos: ${gamesTotal.toFixed(2)}</span>
                  <Button
                    variant="success"
                    onClick={handleGamesCheckout}
                  >
                    Comprar Juegos
                  </Button>
                </div>
              </div>
            )}

            {/* Products Cart */}
            {productsCart.length > 0 && (
              <div className="mb-4">
                <h4>Productos</h4>
                {productsCart.map((item, index) => (
                  <Card key={`product-${index}`} className="cart-item mb-3">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col md={3}>
                          <img
                            src={item.imagenUrl || '/img/default_product.png'}
                            alt={item.nombre}
                            style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/img/default_product.png';
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <h5>{item.nombre}</h5>
                          <p className="text-muted">{item.descripcion?.substring(0, 100)}...</p>
                          <div className="d-flex align-items-center">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => decreaseProductsQuantity(index)}
                              disabled={item.cantidad <= 1}
                            >
                              -
                            </Button>
                            <span className="mx-2">Cantidad: {item.cantidad}</span>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => increaseProductsQuantity(index)}
                            >
                              +
                            </Button>
                          </div>
                        </Col>
                        <Col md={2}>
                          <span className="fw-bold">${(item.precio * item.cantidad).toFixed(2)}</span>
                        </Col>
                        <Col md={1}>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeFromProductsCart(index)}
                            aria-label="trash"
                          >
                            <i className="fas fa-trash" aria-hidden="true"></i>
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span>Total Productos: ${productsTotal.toFixed(2)}</span>
                  <Button
                    variant="success"
                    onClick={handleProductsCheckout}
                  >
                    Comprar Productos
                  </Button>
                </div>
              </div>
            )}
          </Col>
          <Col md={4}>
            <Card className="sticky-top">
              <Card.Header>
                <h4>Resumen del Pedido</h4>
              </Card.Header>
              <Card.Body>
                {gamesCart.length > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Juegos ({gamesCart.length} items):</span>
                    <span>${gamesTotal.toFixed(2)}</span>
                  </div>
                )}
                {productsCart.length > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Productos ({productsCart.length} items):</span>
                    <span>${productsTotal.toFixed(2)}</span>
                  </div>
                )}
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span>Total General:</span>
                  <span className="fw-bold">${(gamesTotal + productsTotal).toFixed(2)}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Procesar Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>Total a pagar: ${(currentCheckoutType === 'games' ? gamesTotal : productsTotal).toFixed(2)}</strong>
          </div>

          <Form onSubmit={handlePaymentSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Número de Tarjeta</Form.Label>
              <Form.Control
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber.replace(/(.{4})/g, '$1 ').trim()}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                  if (value.length <= 16) {
                    setCardDetails({ ...cardDetails, cardNumber: value });
                  }
                }}
                maxLength={19}
                required
              />
              <Form.Text className="text-muted">
                Ingrese 16 dígitos sin espacios
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Expiración</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.substring(0, 2) + '/' + value.substring(2, 4);
                      }
                      if (value.length <= 5) {
                        setCardDetails({ ...cardDetails, expiryDate: value });
                      }
                    }}
                    maxLength={5}
                    required
                  />
                  <Form.Text className="text-muted">
                    Formato: MM/YY
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) {
                        setCardDetails({ ...cardDetails, cvv: value });
                      }
                    }}
                    maxLength={4}
                    required
                  />
                  <Form.Text className="text-muted">
                    3 o 4 dígitos
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Nombre del Titular</Form.Label>
              <Form.Control
                type="text"
                placeholder="Como aparece en la tarjeta"
                value={cardDetails.cardholderName}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  setCardDetails({ ...cardDetails, cardholderName: value });
                }}
                required
              />
              <Form.Text className="text-muted">
                Solo letras y espacios
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                Confirmar Pago
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CartTab;
