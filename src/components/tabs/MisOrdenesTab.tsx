import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { User } from '../../services/AuthService';
import { OrdenService, Orden } from '../../services/OrdenService';
import { GameServiceBackend, GameItem } from '../../services/GameServiceBackend';
import { ProductService, Producto } from '../../services/ProductService';
import { UsuarioService } from '../../services/UsuarioService';

interface MisOrdenesTabProps {
  currentUser: User | null;
  currentRole: string | null;
}

const MisOrdenesTab: React.FC<MisOrdenesTabProps> = ({ currentUser, currentRole }) => {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [juegos, setJuegos] = useState<Map<number, GameItem>>(new Map());
  const [productos, setProductos] = useState<Map<number, Producto>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrden, setSelectedOrden] = useState<Orden | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadMisOrdenes();
      loadJuegos();
      loadProductos();
    }
  }, [currentUser]);

  const loadJuegos = async () => {
    try {
      const data = await GameServiceBackend.getAllGames();
      const juegosMap = new Map<number, GameItem>();
      data.forEach(j => juegosMap.set(j.juegoId, j));
      setJuegos(juegosMap);
    } catch (err) {
      // Solo loguear errores reales, no errores de conexión esperados
      if (err instanceof Error && !err.message.includes('fetch') && !err.message.includes('Failed to fetch')) {
        console.error('Error loading juegos:', err);
      }
    }
  };

  const loadProductos = async () => {
    try {
      const data = await ProductService.getAllProductos();
      const productosMap = new Map<number, Producto>();
      data.forEach(p => productosMap.set(p.productoId, p));
      setProductos(productosMap);
    } catch (err) {
      // Solo loguear errores reales, no errores de conexión esperados
      if (err instanceof Error && !err.message.includes('fetch') && !err.message.includes('Failed to fetch')) {
        console.error('Error loading productos:', err);
      }
    }
  };

  const loadMisOrdenes = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    try {
      // Obtener usuarioId
      let usuarioId = (currentUser as any)?.usuarioID;
      if (!usuarioId) {
        usuarioId = await UsuarioService.getCurrentUsuarioId();
      }

      if (!usuarioId) {
        setError('No se pudo obtener el ID del usuario');
        setLoading(false);
        return;
      }

      console.log(`GET /v1/ordenes/usuario/${usuarioId} - Obteniendo órdenes del usuario`);
      const data = await OrdenService.getOrdenesByUsuario(usuarioId);
      console.log(`GET /v1/ordenes/usuario/${usuarioId} - Status: 200 - Éxito`);
      console.log(`Órdenes obtenidas: ${data.length}`);
      setOrdenes(data);
    } catch (err) {
      setError('Error al cargar tus órdenes. Verifica que el backend esté corriendo.');
      console.error('Error loading ordenes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (orden: Orden) => {
    setSelectedOrden(orden);
    setShowDetailModal(true);
  };

  const getEstadoBadge = (estado: string) => {
    const variants: { [key: string]: string } = {
      'PENDIENTE': 'warning',
      'COMPLETADA': 'success',
      'CANCELADA': 'danger',
    };
    return <Badge bg={variants[estado] || 'secondary'}>{estado}</Badge>;
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2>Mis Órdenes</h2>

      {ordenes.length === 0 ? (
        <Alert variant="info">No tienes órdenes aún. ¡Agrega productos al carrito y realiza tu primera compra!</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID Orden</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.ordenId}>
                <td>#{orden.ordenId}</td>
                <td>
                  {orden.productoIds.map((id, idx) => {
                    const juego = juegos.get(id);
                    const producto = productos.get(id);
                    const item = juego || producto;
                    return (
                      <span key={idx}>
                        {item ? (juego ? juego.titulo : producto?.nombre) : `Producto ${id}`}
                        {idx < orden.productoIds.length - 1 && ', '}
                      </span>
                    );
                  })}
                </td>
                <td>${Number(orden.total).toFixed(2)}</td>
                <td>{new Date(orden.fecha).toLocaleString()}</td>
                <td>{getEstadoBadge(orden.estado)}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleViewDetails(orden)}
                  >
                    Ver Detalles
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal de Detalles */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de Orden #{selectedOrden?.ordenId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrden && (
            <>
              <div className="mb-3">
                <h5>Información de la Orden</h5>
                <p><strong>ID de Orden:</strong> #{selectedOrden.ordenId}</p>
                <p><strong>Usuario ID:</strong> {selectedOrden.usuarioId}</p>
                <p><strong>Fecha:</strong> {new Date(selectedOrden.fecha).toLocaleString()}</p>
                <p><strong>Total:</strong> ${Number(selectedOrden.total).toFixed(2)}</p>
                <p><strong>Estado:</strong> {getEstadoBadge(selectedOrden.estado)}</p>
              </div>
              {currentUser && (
                <div className="mb-3">
                  <h5>Información del Usuario</h5>
                  <p><strong>Email:</strong> {currentUser.email}</p>
                  <p><strong>Nombre:</strong> {currentUser.username}</p>
                  <p><strong>Rol:</strong> {currentRole}</p>
                </div>
              )}
              <div>
                <h5>Productos en la Orden:</h5>
                <ul>
                  {selectedOrden.productoIds.map((id, idx) => {
                    const juego = juegos.get(id);
                    const producto = productos.get(id);
                    const item = juego || producto;
                    return (
                      <li key={idx}>
                        {item ? (
                          <>
                            <strong>{juego ? juego.titulo : producto?.nombre}</strong> - ${juego ? Number(juego.precio).toFixed(2) : Number(producto?.precio).toFixed(2)}
                            <br />
                            <small className="text-muted">
                              {juego ? `Categoría: ${juego.categoria} | Autor: ${juego.autor}` : `Categoría: ${producto?.categoria}`}
                            </small>
                            {(juego?.descripcion || producto?.descripcion) && (
                              <p className="text-muted small mt-1">
                                {(juego?.descripcion || producto?.descripcion)?.substring(0, 100)}...
                              </p>
                            )}
                            {juego?.downloadUrl && (
                              <div className="mt-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => {
                                    alert(`Link de descarga: ${juego.downloadUrl}`);
                                    window.open(juego.downloadUrl, '_blank');
                                  }}
                                >
                                  Mostrar Link de Descarga
                                </Button>
                              </div>
                            )}
                          </>
                        ) : (
                          `Producto ID: ${id}`
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MisOrdenesTab;

