import React from 'react';
import { Card, Row, Col, Image } from 'react-bootstrap';
import { User } from '../../services/AuthService';

interface AboutTabProps {
  currentUser: User | null;
  currentRole: string | null;
}

const AboutTab: React.FC<AboutTabProps> = ({ currentUser, currentRole }) => {
  return (
    <div>
      <h2>Acerca de Nosotros</h2>
      
      <Row>
        <Col md={6}>
          <Image
            src="/img/kurumi.png"
            alt="GamingHub Logo"
            className="img-fluid mb-4"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <h4>GamingHub</h4>
              <p>Somos un equipo nuevo creando esta página web para la comunidad de gamers.</p>
              
              <h5>Síguenos en nuestras redes sociales:</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a 
                    href="https://www.instagram.com/gaminghub_oficial" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    <i className="fab fa-instagram me-2"></i> Instagram
                  </a>
                </li>
                <li className="mb-2">
                  <a 
                    href="https://www.facebook.com/T4MS8282" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    <i className="fab fa-facebook me-2"></i> Facebook
                  </a>
                </li>
              </ul>
              
              <p>
                <strong>Contacto:</strong>{' '}
                <a href="mailto:gaminghuboficial@gmail.com">
                  gaminghuboficial@gmail.com
                </a>
              </p>
              
              <p className="text-muted">
                Si encuentras algún error, por favor comunícalo a nuestro equipo.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AboutTab;
