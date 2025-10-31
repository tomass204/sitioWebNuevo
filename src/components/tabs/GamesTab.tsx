import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { User } from '../../services/AuthService';
import { GameService } from '../../services/GameService';
import { SearchBar } from '../SearchBar';
import { PreviousSearches } from '../PreviousSearches';

interface GameItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  author: string;
  price: number;
  createdAt: string;
}

interface GamesTabProps {
  currentUser: User | null;
  currentRole: string | null;
}

const GamesTab: React.FC<GamesTabProps> = ({ currentUser, currentRole }) => {
  const [games, setGames] = useState<GameItem[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newGame, setNewGame] = useState({
    title: '',
    category: 'action',
    description: '',
    image: null as File | null
  });

  // Games search state
  const [gameSearches, setGameSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('gaminghub_game_searches');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [comments, setComments] = useState<{[key: string]: string}>({});



  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const gamesData = await GameService.getAllGames();
      setGames(gamesData);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const imageUrl = newGame.image ? URL.createObjectURL(newGame.image) : '/img/default_game.jpg';
      await GameService.createGame({
        title: newGame.title,
        category: newGame.category,
        description: newGame.description,
        image: imageUrl,
        author: currentUser.email,
        price: 0
      });
      
      setNewGame({ title: '', category: 'action', description: '', image: null });
      setShowForm(false);
      loadGames();
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  const addToCart = (game: GameItem) => {
    const cart = JSON.parse(localStorage.getItem('gaminghub_cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === game.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...game, quantity: 1 });
    }
    localStorage.setItem('gaminghub_cart', JSON.stringify(cart));
    // Show success message
    alert('Juego agregado al carrito');
  };

  const handleGameQuery = (query: string) => {
    if (query.trim() === '') {
      setFilteredGames([]);
    } else {
      const filtered = games.filter(game =>
        game.title.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredGames(filtered);
      console.log(`GamesTab.tsx:100 Resultados encontrados: ${filtered.length} juegos`);
      filtered.forEach(game => {
        console.log(`ID: ${game.id}, Título: ${game.title}`);
      });
      if (query.trim() && !gameSearches.includes(query.trim())) {
        const newSearches = [query.trim(), ...gameSearches.slice(0, 4)]; // Keep last 5 searches
        setGameSearches(newSearches);
        localStorage.setItem('gaminghub_game_searches', JSON.stringify(newSearches));
      }
    }
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
    return <div>Cargando juegos...</div>;
  }

  return (
    <div>
      <h2>Juegos Populares</h2>
      <SearchBar placeHolder="Buscar juegos..." value={searchQuery} onChange={setSearchQuery} onSearch={handleGameQuery} />
      <PreviousSearches searches={gameSearches} onLabelClicked={handleGameLabelClicked} onRemoveSearch={handleRemoveSearch} />

      {currentRole === 'Influencer' && (
        <Card className="mb-4">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h3>Publicar juego</h3>
              <Button 
                variant="outline-primary" 
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancelar' : 'Nuevo Juego'}
              </Button>
            </div>
          </Card.Header>
          {showForm && (
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del juego:</Form.Label>
                  <Form.Control
                    type="text"
                    value={newGame.title}
                    onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                    placeholder="Nombre del juego"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Categoría:</Form.Label>
                  <Form.Select
                    value={newGame.category}
                    onChange={(e) => setNewGame({ ...newGame, category: e.target.value })}
                  >
                    <option value="action">Acción</option>
                    <option value="strategy">Estrategia</option>
                    <option value="adventure">Aventura</option>
                    <option value="simulation">Simulación</option>
                    <option value="sports">Deportes</option>
                    <option value="rpg">RPG</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descripción:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newGame.description}
                    onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                    placeholder="Descripción del juego"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Imagen:</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGame({ ...newGame, image: e.target.files?.[0] || null })}
                  />
                </Form.Group>

                <Button type="submit" className="btn-custom">
                  Publicar Juego
                </Button>
              </Form>
            </Card.Body>
          )}
        </Card>
      )}

      <Row>
        {(filteredGames.length > 0 ? filteredGames : games).map((game) => (
          <Col md={6} lg={4} key={game.id} className="mb-4">
            <Card className="game-item h-100">
              <Image src={game.image} alt={game.title} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { (e.target as HTMLImageElement).src = '/img/default_game.jpg'; }} />
              <Card.Body>
                <Card.Title>{game.title}</Card.Title>
                <Card.Text>{game.description}</Card.Text>

                <div className="d-flex align-items-center mb-3">
                  <Image
                    src="/img/Influencer.png"
                    alt="Author"
                    className="author-profile-pic me-2"
                    style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                  />
                  <small className="text-muted">{game.author}</small>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">
                    {game.price > 0 ? `$${game.price.toFixed(2)}` : 'Gratis'}
                  </span>
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => addToCart(game)}
                      className="me-2"
                    >
                      🛒
                    </Button>
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Escribe un comentario..."
                    value={comments[game.id] || ''}
                    onChange={(e) => setComments({ ...comments, [game.id]: e.target.value })}
                  />
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      if (comments[game.id]?.trim()) {
                        console.log(`Comentario en juego ID: ${game.id}, Usuario ID: ${currentUser?.email || 'Anónimo'}, Nombre: ${currentUser?.username || 'Anónimo'}, Comentario: ${comments[game.id]}`);
                        setComments({ ...comments, [game.id]: '' });
                      }
                    }}
                  >
                    Comentar
                  </Button>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>


    </div>
  );
};

export default GamesTab;
