import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Modal, Form, Badge, Spinner, Table } from 'react-bootstrap';
import { User } from '../../services/AuthService';
import { GameServiceBackend, GameItem } from '../../services/GameServiceBackend';

interface AdminGamesTabProps {
  currentUser: User | null;
  currentRole: string | null;
}

const AdminGamesTab: React.FC<AdminGamesTabProps> = ({ currentUser, currentRole }) => {
  // Solo Propietario puede gestionar juegos
  const canManage = currentRole === 'Propietario' || currentRole === 'ROLE_PROPIETARIO';

  if (!canManage) {
    return (
      <Alert variant="warning">
        No tienes permisos para gestionar juegos. Solo el Propietario puede hacerlo.
      </Alert>
    );
  }

  const [games, setGames] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    imagenUrl: '',
    autor: '',
    precio: '',
    downloadUrl: '',
    activo: true,
  });

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const gamesData = await GameServiceBackend.getAllGames();
      setGames(gamesData);
    } catch (err) {
      setError('Error al cargar juegos. Verifica que el microservicio de Game esté corriendo.');
      console.error('Error loading games:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      categoria: '',
      imagenUrl: '',
      autor: '',
      precio: '',
      downloadUrl: '',
      activo: true,
    });
    setShowCreateModal(true);
  };

  const handleEdit = (game: GameItem) => {
    setSelectedGame(game);
    setFormData({
      titulo: game.titulo,
      descripcion: game.descripcion || '',
      categoria: game.categoria,
      imagenUrl: game.imagenUrl || '',
      autor: game.autor,
      precio: game.precio.toString(),
      downloadUrl: game.downloadUrl || '',
      activo: game.activo,
    });
    setShowEditModal(true);
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await GameServiceBackend.createGame({
        titulo: formData.titulo,
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        imagenUrl: formData.imagenUrl,
        autor: formData.autor,
        precio: Number(formData.precio),
        downloadUrl: formData.downloadUrl,
        activo: formData.activo,
      });
      await loadGames();
      setShowCreateModal(false);
      alert('Juego creado exitosamente');
    } catch (err) {
      console.error('Error creating game:', err);
      alert('Error al crear el juego');
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGame) return;

    try {
      await GameServiceBackend.updateGame(selectedGame.juegoId, {
        titulo: formData.titulo,
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        imagenUrl: formData.imagenUrl,
        autor: formData.autor,
        precio: Number(formData.precio),
        downloadUrl: formData.downloadUrl,
        activo: formData.activo,
      });
      await loadGames();
      setShowEditModal(false);
      alert('Juego actualizado exitosamente');
    } catch (err) {
      console.error('Error updating game:', err);
      alert('Error al actualizar el juego');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este juego?')) return;

    try {
      await GameServiceBackend.deleteGame(id);
      await loadGames();
      alert('Juego eliminado exitosamente');
    } catch (err) {
      console.error('Error deleting game:', err);
      alert('Error al eliminar el juego');
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
        <h2>Gestión de Juegos (Propietario)</h2>
        <Button variant="primary" onClick={handleCreate}>
          Crear Juego
        </Button>
      </div>

      {games.length === 0 ? (
        <Alert variant="info">No hay juegos disponibles</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Autor</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.juegoId}>
                <td>{game.juegoId}</td>
                <td>{game.titulo}</td>
                <td>{game.descripcion?.substring(0, 50)}...</td>
                <td>${Number(game.precio).toFixed(2)}</td>
                <td><Badge bg="secondary">{game.categoria}</Badge></td>
                <td>{game.autor}</td>
                <td>{game.activo ? <Badge bg="success">Activo</Badge> : <Badge bg="danger">Inactivo</Badge>}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(game)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(game.juegoId)}
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
          <Modal.Title>Crear Juego</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitCreate}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
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
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Autor</Form.Label>
              <Form.Control
                type="text"
                value={formData.autor}
                onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                required
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
              <Form.Label>URL de Imagen</Form.Label>
              <Form.Control
                type="text"
                value={formData.imagenUrl}
                onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL de Descarga</Form.Label>
              <Form.Control
                type="text"
                value={formData.downloadUrl}
                onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
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
          <Modal.Title>Editar Juego</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitEdit}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
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
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Autor</Form.Label>
              <Form.Control
                type="text"
                value={formData.autor}
                onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                required
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
              <Form.Label>URL de Imagen</Form.Label>
              <Form.Control
                type="text"
                value={formData.imagenUrl}
                onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL de Descarga</Form.Label>
              <Form.Control
                type="text"
                value={formData.downloadUrl}
                onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
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

export default AdminGamesTab;
