import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Row, Col } from 'react-bootstrap';
import { User } from '../../services/AuthService';
import { UserService } from '../../services/UserService';

interface PendingRequest {
  email: string;
  username: string;
  reason: string;
  date: string;
}

interface ModerationTabProps {
  currentUser: User | null;
  currentRole: string | null;
}

const ModerationTab: React.FC<ModerationTabProps> = ({ currentUser, currentRole }) => {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = () => {
    const requests = JSON.parse(localStorage.getItem('gaminghub_pending') || '[]');
    setPendingRequests(requests);
  };

  const approveRequest = (email: string, username: string) => {
    if (currentRole !== 'Propietario') {
      alert('Solo el propietario puede aprobar solicitudes de moderador.');
      return;
    }

    UserService.approvePendingRequest(email, username);
    alert('Solicitud aprobada. Usuario actualizado a Moderador.');
    loadPendingRequests();
  };

  const rejectRequest = (email: string, username: string) => {
    const comment = prompt('Razón para rechazar la solicitud (opcional):');
    if (comment !== null) {
      UserService.rejectPendingRequest(email, username);
      alert('Solicitud rechazada.');
      loadPendingRequests();
    }
  };

  if (currentRole !== 'Propietario') {
    return (
      <Alert variant="warning">
        Esta sección solo está disponible para el propietario.
      </Alert>
    );
  }

  return (
    <div>
      <h2>Moderación</h2>
      <p>Gestiona solicitudes de moderador y herramientas de moderación.</p>

      <Card className="mb-4">
        <Card.Header>
          <h3>Herramientas de Moderador</h3>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Button variant="info" className="w-100 mb-2">
                Ver Reportes
              </Button>
            </Col>
            <Col md={4}>
              <Button variant="warning" className="w-100 mb-2">
                Gestionar Usuarios
              </Button>
            </Col>
            <Col md={4}>
              <Button variant="secondary" className="w-100 mb-2">
                Configuración de Moderador
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h3>Solicitudes Pendientes de Moderador</h3>
        </Card.Header>
        <Card.Body>
          {pendingRequests.length === 0 ? (
            <Alert variant="info">
              No hay solicitudes pendientes de moderador.
            </Alert>
          ) : (
            <div>
              {pendingRequests.map((request, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <h5>Solicitud de {request.username} ({request.email})</h5>
                    <p><strong>Motivo:</strong> {request.reason}</p>
                    <p><strong>Fecha:</strong> {new Date(request.date).toLocaleString()}</p>
                    
                    <div className="d-flex gap-2">
                      <Button 
                        variant="success" 
                        onClick={() => approveRequest(request.email, request.username)}
                      >
                        Aprobar
                      </Button>
                      <Button 
                        variant="danger" 
                        onClick={() => rejectRequest(request.email, request.username)}
                      >
                        Rechazar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ModerationTab;
