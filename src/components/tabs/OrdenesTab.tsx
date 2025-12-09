import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { User } from '../../services/AuthService';
import { OrdenService, Orden } from '../../services/OrdenService';
import { ProductService, Producto } from '../../services/ProductService';


interface OrdenesTabProps {
  currentUser: User | null;
  currentRole: string | null;
}

const OrdenesTab: React.FC<OrdenesTabProps> = ({ currentUser, currentRole }) => {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [productos, setProductos] = useState<Map<number, Producto>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState<Orden | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEstado, setEditEstado] = useState('');

  useEffect(() => {
    loadOrdenes();
    loadProductos();
  }, []);

  const loadOrdenes = async () => {
    setLoading(true);
    setError(null);
    setConnectionError(false);
    
    try {
      // El servicio retorna array vacío en caso de error de conexión o permisos
      const data = await OrdenService.getAllOrdenes();
      
      // Verificar si hay datos válidos
      if (data && Array.isArray(data)) {
        setOrdenes(data);
        // Si el array está vacío, puede ser porque no hay órdenes o hubo un error
        // Revisamos los logs en consola para determinar
      } else {
        setOrdenes([]);
      }
      
    } catch (err) {
      // Este catch solo se ejecutará si hay un error no manejado por el servicio
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      
      // Si el error es por conexión, mostrar mensaje más amigable
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('fetch')) {
        setConnectionError(true);
        setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 8082.');
      } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        setError('No tienes permisos para ver todas las órdenes. Se requiere rol de Moderador, Propietario o Influencer.');
      } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        setError('No estás autenticado. Por favor inicia sesión.');
      } else {
        setError('Error al cargar órdenes. Verifica que el backend esté corriendo y que tengas los permisos necesarios.');
      }
      
      console.error('Error loading ordenes:', err);
      setOrdenes([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProductos = async () => {
    try {
      const data = await ProductService.getAllProductos();
      const productosMap = new Map<number, Producto>();
      data.forEach(p => productosMap.set(p.productoId, p));
      setProductos(productosMap);
    } catch (err) {
      console.error('Error loading productos:', err);
    }
  };

  const handleViewDetails = (orden: Orden) => {
    setSelectedOrden(orden);
    setShowDetailModal(true);
  };

  const handleEditOrden = (orden: Orden) => {
    setSelectedOrden(orden);
    setEditEstado(orden.estado);
    setShowEditModal(true);
  };

  const handleUpdateOrden = async () => {
    if (!selectedOrden) return;

    try {
      await OrdenService.updateOrden(selectedOrden.ordenId, {
        ...selectedOrden,
        estado: editEstado,
      });
      await loadOrdenes();
      setShowEditModal(false);
      alert('Orden actualizada exitosamente');
    } catch (err) {
      console.error('Error updating orden:', err);
      alert('Error al actualizar la orden');
    }
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
          <span className="visually-hidden">Cargando órdenes...</span>
        </Spinner>
      </div>
    );
  }

  if (error && ordenes.length === 0) {
    return (
      <Alert variant="warning">
        <Alert.Heading>
          <i className="fas fa-exclamation-triangle me-2"></i>
          No se pudieron cargar las órdenes
        </Alert.Heading>
        <p>{error}</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button variant="outline-primary" onClick={loadOrdenes}>
            <i className="fas fa-redo me-2"></i>
            Reintentar
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Todas las Órdenes</h2>
        {ordenes.length > 0 && (
          <Badge bg="primary">Total: {ordenes.length} órdenes</Badge>
        )}
      </div>

      {error && connectionError && (
        <Alert variant="warning" className="mb-3">
          <Alert.Heading>
            <i className="fas fa-exclamation-triangle me-2"></i>
            Problema de Conexión
          </Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-primary" size="sm" onClick={loadOrdenes}>
            <i className="fas fa-redo me-2"></i>
            Reintentar
          </Button>
        </Alert>
      )}

      {ordenes.length === 0 && !loading && !error ? (
        <Alert variant="info">
          <i className="fas fa-info-circle me-2"></i>
          No hay órdenes disponibles en este momento.
        </Alert>
      ) : ordenes.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario ID</th>
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
                <td>{orden.ordenId}</td>
                <td>{orden.usuarioId}</td>
                <td>
                  {orden.productoIds.map((id, idx) => {
                    const producto = productos.get(id);
                    return (
                      <span key={idx}>
                        {producto ? producto.nombre : `Producto ${id}`}
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
                    className="me-2"
                    onClick={() => handleViewDetails(orden)}
                  >
                    Ver
                  </Button>
                  {(currentRole === 'Moderador' || currentRole === 'ROLE_MODERADOR' || 
                    currentRole === 'Propietario' || currentRole === 'ROLE_PROPIETARIO') && (
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEditOrden(orden)}
                    >
                      Editar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : null}

      {/* Modal de Detalles */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de Orden #{selectedOrden?.ordenId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrden && (
            <>
              <p><strong>Usuario ID:</strong> {selectedOrden.usuarioId}</p>
              <p><strong>Fecha:</strong> {new Date(selectedOrden.fecha).toLocaleString()}</p>
              <p><strong>Total:</strong> ${Number(selectedOrden.total).toFixed(2)}</p>
              <p><strong>Estado:</strong> {getEstadoBadge(selectedOrden.estado)}</p>
              <div>
                <strong>Productos:</strong>
                <ul>
                  {selectedOrden.productoIds.map((id, idx) => {
                    const producto = productos.get(id);
                    return (
                      <li key={idx}>
                        {producto ? `${producto.nombre} - $${Number(producto.precio).toFixed(2)}` : `Producto ${id}`}
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

      {/* Modal de Edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Orden #{selectedOrden?.ordenId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={editEstado}
                onChange={(e) => setEditEstado(e.target.value)}
              >
                <option value="PENDIENTE">PENDIENTE</option>
                <option value="COMPLETADA">COMPLETADA</option>
                <option value="CANCELADA">CANCELADA</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateOrden}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrdenesTab;

