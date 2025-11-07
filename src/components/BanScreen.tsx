import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

interface BanScreenProps {
  banTimeRemaining: number;
}

const BanScreen: React.FC<BanScreenProps> = ({ banTimeRemaining }) => {
  return (
    <Container fluid className="ban-screen">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} className="text-center">
          <img 
            src="/img/Troll.png" 
            alt="Banned" 
            className="ban-image"
          />
          <h1>¡Estás baneado!</h1>
          <p className="fs-4">
            Regresa en {banTimeRemaining} minutos.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default BanScreen;
