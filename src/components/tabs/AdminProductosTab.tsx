import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Modal, Form, Badge, Spinner, Table } from 'react-bootstrap';
import { User } from '../../services/AuthService';
import { ProductService, Producto } from '../../services/ProductService';

interface AdminProductosTabProps {
  currentUser: User | null;
  currentRole: string | null;
}

const AdminProductosTab: React.FC<AdminProductosTabProps> = ({ currentUser, currentRole }) => {
  // Solo Moderador y Propietario pueden gestionar productos
  const canManage = currentRole === 'Moderador' || currentRole === 'ROLE_MODERADOR' || 
                    currentRole === 'Propietario' || currentRole === 'ROLE_PROPIETARIO';
  
  if (!canManage) {
    return (
      <Alert variant="warning">
        No tienes permisos para gestionar productos. Solo Moderadores y Propietarios pueden hacerlo.
      </Alert>
    );
  }
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    imagenUrl: '',
    activo: true,
  });

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProductService.getAllProductos();
      setProductos(data);
    } catch (err) {
      setError('Error al cargar productos. Verifica que el backend esté corriendo.');
      console.error('Error loading productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: '',
      imagenUrl: '',
      activo: true,
    });
    setShowCreateModal(true);
  };

  const handleEdit = (producto: Producto) => {
    setSelectedProducto(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio.toString(),
      categoria: producto.categoria || '',
      imagenUrl: producto.imagenUrl || '',
      activo: producto.activo,
    });
    setShowEditModal(true);
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ProductService.createProducto({
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: Number(formData.precio),
        categoria: formData.categoria,
        imagenUrl: formData.imagenUrl,
        activo: formData.activo,
      });
      await loadProductos();
      setShowCreateModal(false);
      alert('Producto creado exitosamente');
    } catch (err) {
      console.error('Error creating producto:', err);
      alert('Error al crear el producto');
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProducto) return;

    try {
      await ProductService.updateProducto(selectedProducto.productoId, {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: Number(formData.precio),
        categoria: formData.categoria,
        imagenUrl: formData.imagenUrl,
        activo: formData.activo,
      });
      await loadProductos();
      setShowEditModal(false);
      alert('Producto actualizado exitosamente');
    } catch (err) {
      console.error('Error updating producto:', err);
      alert('Error al actualizar el producto');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await ProductService.deleteProducto(id);
      await loadProductos();
      alert('Producto eliminado exitosamente');
    } catch (err) {
      console.error('Error deleting producto:', err);
      alert('Error al eliminar el producto');
    }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Productos {currentRole === 'Propietario' ? '(Propietario)' : '(Moderador)'}</h2>
        <Button variant="primary" onClick={handleCreate}>
          Crear Producto
        </Button>
      </div>

      {productos.length === 0 ? (
        <Alert variant="info">No hay productos disponibles</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.productoId}>
                <td>{producto.productoId}</td>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion?.substring(0, 50)}...</td>
                <td>${Number(producto.precio).toFixed(2)}</td>
                <td><Badge bg="secondary">{producto.categoria}</Badge></td>
                <td>{producto.activo ? <Badge bg="success">Activo</Badge> : <Badge bg="danger">Inactivo</Badge>}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(producto)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(producto.productoId)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal de Creación */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitCreate}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL de Imagen</Form.Label>
              <Form.Control
                type="text"
                value={formData.imagenUrl}
                onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Activo"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Crear
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de Edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitEdit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL de Imagen</Form.Label>
              <Form.Control
                type="text"
                value={formData.imagenUrl}
                onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Activo"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminProductosTab;

