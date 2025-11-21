import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Modal, Alert, Badge, InputGroup, Form, Spinner } from 'react-bootstrap';
import { User } from '../../services/AuthService';
import { GameServiceBackend, GameItem } from '../../services/GameServiceBackend';
import { SearchBar } from '../SearchBar';
import { PreviousSearches } from '../PreviousSearches';



interface GamesTabProps {
  currentUser: User | null;
  currentRole: string | null;
}

const GamesTab: React.FC<GamesTabProps> = ({ currentUser }) => {
  const [games, setGames] = useState<GameItem[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Games search state
  const [gameSearches, setGameSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('gaminghub_game_searches');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadGames();
  }, []);

  const handleGameQuery = (query: string) => {
    if (query.trim() === '') {
      setFilteredGames([]);
    } else {
      const filtered = games.filter(game =>
        game.titulo.toLowerCase().includes(query.toLowerCase()) ||
        game.categoria.toLowerCase().includes(query.toLowerCase()) ||
        game.descripcion.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredGames(filtered);
      if (query.trim() && !gameSearches.includes(query.trim())) {
        const newSearches = [query.trim(), ...gameSearches.slice(0, 4)];
        setGameSearches(newSearches);
        localStorage.setItem('gaminghub_game_searches', JSON.stringify(newSearches));
      }
    }
  };

  const handleCategoryFilter = async (categoria: string) => {
    if (categoria === '') {
      setFilteredGames([]);
      setSelectedCategory('');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const gamesByCategory = await GameServiceBackend.getGamesByCategoria(categoria);
      setFilteredGames(gamesByCategory);
      setSelectedCategory(categoria);
    } catch (error) {
      setError('Error al filtrar juegos por categoría.');
      setFilteredGames([]);
    }
    setLoading(false);
  };

  const loadGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const gamesData = await GameServiceBackend.getAllGames();
      setGames(gamesData);
    } catch (error) {
      setError('Error al cargar juegos. Verifica que el microservicio de Game esté corriendo.');
      setGames([]);
    }
    setLoading(false);
  };



  const handleViewDetails = (game: GameItem) => {
    setSelectedGame(game);
    setShowDetailModal(true);
  };

  const addToCart = (game: GameItem) => {
    if (!currentUser) {
      alert('Debes iniciar sesión para agregar juegos al carrito.');
      return;
    }
    const cart = JSON.parse(localStorage.getItem(`gaminghub_cart_${currentUser.email}`) || '[]');
    const existingItem = cart.find((item: any) => item.productoId === game.juegoId && item.type === 'game');
    if (existingItem) {
      existingItem.cantidad += 1;
    } else {
      cart.push({
        productoId: game.juegoId,
        nombre: game.titulo,
        precio: Number(game.precio),
        imagenUrl: game.imagenUrl || '/img/default_game.jpg',
        descripcion: game.descripcion || '',
        cantidad: 1,
        type: 'game',
      });
    }
    localStorage.setItem(`gaminghub_cart_${currentUser.email}`, JSON.stringify(cart));
    alert('Juego agregado al carrito');
  };

  const handleGameLabelClicked = (term: string) => {
    setSearchQuery(term);
    handleGameQuery(term);
  };

  const handleRemoveSearch = (term: string) => {
    const updatedSearches = gameSearches.filter(search => search !== term);
    setGameSearches(updatedSearches);
    localStorage.setItem('gaminghub_game_searches', JSON.stringify(updatedSearches));
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

  const displayGames = filteredGames.length > 0 ? filteredGames : games;

  return (
    <div>
      <h2 className="mb-4">Juegos</h2>

      {/* Filtro por Categorías */}
      <Card className="mb-4">
        <Card.Body>
          <h5>Filtrar por Categoría</h5>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            <option value="Terror">Terror</option>
            <option value="Carreras">Carreras</option>
            <option value="Accion">Acción</option>
            <option value="Aventura">Aventura</option>
            <option value="Shooter">Shooter</option>
            <option value="Deportes">Deportes</option>
            <option value="Lucha">Lucha</option>
            <option value="Simulación">Simulación</option>
            <option value="Supervivencia">Supervivencia</option>
            <option value="Musical">Musical</option>
          </Form.Select>
        </Card.Body>
      </Card>

      <SearchBar placeHolder="Buscar juegos..." value={searchQuery} onChange={setSearchQuery} onSearch={handleGameQuery} />
      <PreviousSearches searches={gameSearches} onLabelClicked={handleGameLabelClicked} onRemoveSearch={handleRemoveSearch} />



      {displayGames.length === 0 ? (
        <Alert variant="info">
          {selectedCategory ? `No hay juegos disponibles en la categoría "${selectedCategory}"` : 'No hay juegos disponibles'}
        </Alert>
      ) : (
        <Row>
          {displayGames.map((game) => (
            <Col key={game.juegoId} md={4} className="mb-4">
              <Card>
                {game.imagenUrl && (
                  <Card.Img
                    variant="top"
                    src={game.imagenUrl}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/img/default_game.png';
                    }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{game.titulo}</Card.Title>
                  <Card.Text>{game.descripcion?.substring(0, 100)}...</Card.Text>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg="secondary">{game.categoria}</Badge>
                    <strong>${Number(game.precio).toFixed(2)}</strong>
                  </div>

                  <div className="mt-3">
                    <Button
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => handleViewDetails(game)}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => addToCart(game)}
                    >
                      Agregar al Carrito
                    </Button>
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
          <Modal.Title>{selectedGame?.titulo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGame && (
            <>
              {selectedGame.imagenUrl && (
                <img
                  src={selectedGame.imagenUrl}
                  alt={selectedGame.titulo}
                  className="img-fluid mb-3"
                  style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                />
              )}
              <p><strong>Descripción:</strong> {selectedGame.descripcion}</p>
              <p><strong>Categoría:</strong> <Badge bg="secondary">{selectedGame.categoria}</Badge></p>
              <p><strong>Precio:</strong> ${Number(selectedGame.precio).toFixed(2)}</p>

              <p><strong>Estado:</strong> {selectedGame.activo ? 'Disponible' : 'No disponible'}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Cerrar
          </Button>
          <Button
            variant="success"
            onClick={() => {
              if (selectedGame) {
                addToCart(selectedGame);
                setShowDetailModal(false);
              }
            }}
          >
            Agregar al Carrito
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GamesTab;
