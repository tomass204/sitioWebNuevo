import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Modal, Form } from 'react-bootstrap';
import { User } from '../../services/AuthService';
import { GameService } from '../../services/GameService';

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
  downloadUrl?: string;
}

interface CartTabProps {
  currentUser: User | null;
  currentRole: string | null;
}

const CartTab: React.FC<CartTabProps> = ({ currentUser, currentRole }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    if (!currentUser) return;

    console.log('Calling GET CART endpoint');
    const cartData = JSON.parse(localStorage.getItem(`gaminghub_cart_${currentUser.email}`) || '[]');

    // Get current games to ensure we have the latest download URLs
    const currentGames = await GameService.getAllGames();
    const gamesMap = new Map(currentGames.map(game => [game.id, game]));

    // Update cart with latest download URLs
    const updatedCart = cartData.map((item: CartItem) => {
      const currentGame = gamesMap.get(item.id);
      if (currentGame && currentGame.downloadUrl) {
        return { ...item, downloadUrl: currentGame.downloadUrl };
      }
      return item;
    });

    console.log('Cart retrieved successfully, status: 200');
    console.log(updatedCart);
    setCart(updatedCart);
    const cartTotal = updatedCart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
    setTotal(cartTotal);
  };

  const removeFromCart = (index: number) => {
    if (!currentUser) return;

    console.log('Calling DELETE FROM CART endpoint for item:', cart[index].title, 'with data:', cart[index]);
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem(`gaminghub_cart_${currentUser.email}`, JSON.stringify(newCart));
    const cartTotal = newCart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
    setTotal(cartTotal);
    console.log('Item deleted from cart successfully, status: 200');
  };

  const increaseQuantity = (index: number) => {
    if (!currentUser) return;

    const newCart = [...cart];
    newCart[index].quantity += 1;
    setCart(newCart);
    localStorage.setItem(`gaminghub_cart_${currentUser.email}`, JSON.stringify(newCart));
    const cartTotal = newCart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
    setTotal(cartTotal);
  };

  const decreaseQuantity = (index: number) => {
    if (!currentUser) return;

    const newCart = [...cart];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
      setCart(newCart);
      localStorage.setItem(`gaminghub_cart_${currentUser.email}`, JSON.stringify(newCart));
      const cartTotal = newCart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
      setTotal(cartTotal);
    }
  };

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('El carrito está vacío. Agrega juegos antes de proceder al pago.');
      return;
    }

    if (!currentUser) {
      alert('Debes iniciar sesión para comprar juegos.');
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate card details
    if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv || !cardDetails.cardholderName) {
      alert('Por favor complete todos los campos de la tarjeta');
      return;
    }

    // Basic validation
    if (cardDetails.cardNumber.length < 16) {
      alert('Número de tarjeta inválido');
      return;
    }

    if (cardDetails.cvv.length < 3) {
      alert('CVV inválido');
      return;
    }

    if (!currentUser) {
      alert('Usuario no encontrado');
      return;
    }

    try {
      console.log('Calling POST PURCHASE endpoint with data:', {
        user: currentUser.email,
        items: cart,
        paymentDetails: {
          cardNumber: cardDetails.cardNumber,
          expiryDate: cardDetails.expiryDate,
          cvv: cardDetails.cvv,
          cardholderName: cardDetails.cardholderName
        },
        total: total
      });

      // Purchase each game in cart
      for (const item of cart) {
        const result = await GameService.purchaseGame(currentUser.email, item.id);
        if (!result.success) {
          alert(`Error al comprar ${item.title}: ${result.message}`);
          return;
        }
      }

      // Get current games to ensure we have the latest download URLs for purchases
      const currentGames = await GameService.getAllGames();
      const gamesMap = new Map(currentGames.map(game => [game.id, game]));

      // Save purchase to pending purchases with latest download URLs
      const purchaseData = cart.map(item => {
        const currentGame = gamesMap.get(item.id);
        return {
          ...item,
          purchaseDate: new Date().toISOString(),
          total: item.price * item.quantity,
          status: 'Comprado',
          downloadUrl: currentGame?.downloadUrl || item.downloadUrl
        };
      });
      const existingPurchases = JSON.parse(localStorage.getItem(`gaminghub_pending_purchases_${currentUser.email}`) || '[]');
      const updatedPurchases = [...existingPurchases, ...purchaseData];
      localStorage.setItem(`gaminghub_pending_purchases_${currentUser.email}`, JSON.stringify(updatedPurchases));

      console.log('Purchase processed successfully, status: 200');

      // Simulate purchase
      let purchaseMessage = '¡Compra exitosa! Has comprado:\n\n';
      cart.forEach(item => {
        purchaseMessage += `- ${item.title} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
      });
      purchaseMessage += `\nTotal: $${total.toFixed(2)}`;

      alert(purchaseMessage);

      // Reset form and close modal
      setCardDetails({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
      });
      setShowPaymentModal(false);

      // Clear cart
      setCart([]);
      localStorage.setItem(`gaminghub_cart_${currentUser.email}`, JSON.stringify([]));
      setTotal(0);
    } catch (error) {
      console.error('Error during purchase:', error);
      alert('Error al procesar la compra');
    }
  };

  return (
    <div>
      <h2>Carrito de Compras</h2>

      {cart.length === 0 ? (
        <>
          <Alert variant="info">
            Tu carrito está vacío. Agrega algunos juegos desde la pestaña "Juegos".
          </Alert>
          <Button
            variant="success"
            size="lg"
            className="w-100 btn-success-custom"
            onClick={handleCheckout}
          >
            Proceder al Pago
          </Button>
        </>
      ) : (
        <Row>
          <Col md={8}>
            {cart.map((item, index) => (
              <Card key={index} className="cart-item mb-3">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={3}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </Col>
                    <Col md={6}>
                      <h5>{item.title}</h5>
                      <p className="text-muted">{item.description}</p>
                      {item.price > 0 ? (
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => decreaseQuantity(index)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="mx-2">Cantidad: {item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => increaseQuantity(index)}
                          >
                            +
                          </Button>
                        </div>
                      ) : (
                        <p className="text-muted">Cantidad: {item.quantity}</p>
                      )}
                    </Col>
                    <Col md={2}>
                      <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </Col>
                    <Col md={1}>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeFromCart(index)}
                        aria-label="trash"
                      >
                        <i className="fas fa-trash" aria-hidden="true"></i>
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>
          <Col md={4}>
            <Card className="sticky-top">
              <Card.Header>
                <h4>Resumen del Pedido</h4>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-3">
                  <span>Total ({cart.length} items):</span>
                  <span className="fw-bold">${total.toFixed(2)}</span>
                </div>
                <Button
                  variant="success"
                  size="lg"
                  className="w-100 btn-success-custom"
                  onClick={handleCheckout}
                >
                  Proceder al Pago
                </Button>
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
            <strong>Total a pagar: ${total.toFixed(2)}</strong>
          </div>

          <Form onSubmit={handlePaymentSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Número de Tarjeta</Form.Label>
              <Form.Control
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value.replace(/\s/g, '') })}
                maxLength={16}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Expiración</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                    maxLength={5}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CVV</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    maxLength={4}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Nombre del Titular</Form.Label>
              <Form.Control
                type="text"
                placeholder="Como aparece en la tarjeta"
                value={cardDetails.cardholderName}
                onChange={(e) => setCardDetails({ ...cardDetails, cardholderName: e.target.value })}
                required
              />
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
