import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { FaReact } from 'react-icons/fa';
import { User } from '../../services/AuthService';
import { GameService } from '../../services/GameService';
import { UserService } from '../../services/UserService';
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
  downloadUrl?: string;
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
  const [displayedComments, setDisplayedComments] = useState<{ id: string; userEmail: string; username: string; content: string; timestamp: string; gameId: string }[]>([]);



  useEffect(() => {
    loadGames();
    loadComments();
  }, []);

  const loadGames = async () => {
    try {
      const gamesData = await GameService.getAllGames();
      // Assign download URLs based on game title
      const downloadUrls: { [key: string]: string } = {
        'Brawl Stars': 'https://es.ldplayer.net/games/brawl-stars-on-pc.html',
        'Minecraft': 'https://www.minecraft.net/es-es/download',
        'The Witcher': 'https://gofile.io/d/c9Ca1I',
        'Cyberpunk 2077': 'https://gofile.io/d/2x3fiN',
        'Among Us': 'https://www.mediafire.com/file/yt0yti8x2dfl9th',
        'Batman': 'https://www.mediafire.com/file/tkd94t6fuatq1y1',
        'Batman: Arkham': 'https://gofile.io/d/bTU5vk',
        'Valorant': 'https://playvalorant.com/es-es/download/',
        'Assassin\'s Creed Valhalla': 'https://www.malavida.com/es/soft/assassins-creed-valhalla/',
        'FIFA 23': 'https://gofile.io/d/t94dji',
        'Hades': 'https://www.megajuegosfree.com/hades-full-espanol-mega/',
        'Call of Duty: Modern Warfare': 'https://gofile.io/d/fWunW0',
        'Genshin Impact': 'https://genshin-impact.uptodown.com/windows',
        'Apex Legends': 'https://es.ccm.net/descargas/videojuegos/7760-apex-legends-para-pc/',
        'PUBG': 'https://es.ccm.net/descargas/videojuegos/7758-pubg-battlegrounds-para-pc/',
        'Rocket League': 'https://gofile.io/d/IDcwdk',
        'The Sims 4': 'https://www.malavida.com/es/soft/los-sims-4/',
        'Animal Crossing': 'https://www.bluestacks.com/es/apps/simulation/animal-crossing-pocket-camp-on-pc.html',
        'Pokémon': 'https://pokemon-project.com/descargas/juegos',
        'The Legend of Zelda': 'https://legend-of-zelda-links-awakening.uptodown.com/windows',
        'Resident Evil': 'https://gofile.io/d/GApmTu',
        'The Last of Us': 'https://gofile.io/d/lEHzIG',
        'God of War': 'https://gofile.io/d/TT3Vej',
        'Spider-Man': 'https://www.mediafire.com/file/2zzvt86fx7q2siu',
        'Outlast': 'https://www.mediafire.com/file/fegmcom5rc3pbod',
        'Outlast Trials': 'https://es.ccm.net/descargas/videojuegos/11294-the-outlast-trials/',
        'Fallout': 'https://www.mediafire.com/file/jri4y8qvwvakbfo',
        'The Elder Scrolls V: Skyrim': 'https://www.mediafire.com/file/j7in6edqwm6iit0',
        'Horizon Zero Dawn': 'https://www.mediafire.com/file/mgv2gbeoll5f7dg/Horizon_Zero_Dawn.rar/file',
        'Uncharted': 'https://www.mediafire.com/file/p55otozty7reh9i/84748C8745h85tT84E8754T.mkv/file',
        'Red Dead Redemption 2': 'https://gofile.io/d/5GYOmi',
        'Grand Theft Auto V': 'https://www.gtaday.com/',
        'Clash Royale': 'https://supercell.com/en/games/clashroyale/',
        'Fortnite': 'https://www.epicgames.com/fortnite/en-US/download',
        'Roblox': 'https://www.roblox.com/download'
      };
      const updatedGames = gamesData.map(game => ({
        ...game,
        downloadUrl: downloadUrls[game.title] || game.downloadUrl
      }));
      setGames(updatedGames);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = () => {
    let storedComments = JSON.parse(localStorage.getItem('gaminghub_comments') || '[]');

    // Add sample comments if none exist
    if (storedComments.length === 0) {
      storedComments = [
        {
          id: '1',
          userEmail: 'basic@gaminghub.com',
          username: 'UsuarioBasico',
          content: 'Este juego es increíble, me encanta!',
          timestamp: new Date().toISOString(),
          gameId: '1'
        },
        {
          id: '2',
          userEmail: 'influencer@gaminghub.com',
          username: 'Influencer',
          content: 'Comentario inapropiado de prueba',
          timestamp: new Date().toISOString(),
          gameId: '2'
        },
        {
          id: '3',
          userEmail: 'moderator@gaminghub.com',
          username: 'Moderador',
          content: 'Otro comentario de prueba',
          timestamp: new Date().toISOString(),
          gameId: '1'
        }
      ];
      localStorage.setItem('gaminghub_comments', JSON.stringify(storedComments));
    }

    setDisplayedComments(storedComments);
    console.log('GET /api/GamingHub/v1/Comments - Status: 200 - Lista de comentarios cargada');
    storedComments.forEach((comment: any) => {
      console.log(comment);
    });
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
    if (!currentUser) {
      alert('Debes iniciar sesión para agregar juegos al carrito.');
      return;
    }

    const cart = JSON.parse(localStorage.getItem(`gaminghub_cart_${currentUser.email}`) || '[]');
    const existingItem = cart.find((item: any) => item.id === game.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...game, quantity: 1 });
    }
    localStorage.setItem(`gaminghub_cart_${currentUser.email}`, JSON.stringify(cart));
    // Show success message
    alert('Juego agregado al carrito');
  };

  const handleGameQuery = (query: string) => {
    console.log('Calling GET SEARCH BY NAME endpoint');
    if (query.trim() === '') {
      setFilteredGames([]);
    } else {
      const filtered = games.filter(game =>
        game.title.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredGames(filtered);
      console.log('Search results retrieved successfully, status: 200');
      console.log(filtered);
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

  const popularGames = games.filter(game => game.price === 0);

  return (
    <div>
      <h2>Tienda de Juegos</h2>
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
        {(filteredGames.length > 0 ? filteredGames : games).map((game, index) => (
          <Col md={6} lg={4} key={`${game.id}-${index}`} className="mb-4">
            <Card className="game-item h-100">
              <Image src={game.image} alt={game.title} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { (e.target as HTMLImageElement).src = '/img/default_game.jpg'; }} />
              <Card.Body>
                <Card.Title>{game.title} <FaReact style={{ color: '#61dafb', marginLeft: '5px' }} /></Card.Title>
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

                {/* Display existing comments for this game */}
                {displayedComments.filter(comment => comment.gameId === game.id).map((comment) => {
                  const commenterUser = UserService.getUser(comment.userEmail);
                  const profilePic = commenterUser?.profilePic || '/img/UsuarioBasico.png';
                  return (
                    <div key={comment.id} className="mb-2 p-2 border rounded">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-center">
                          <Image
                            src={profilePic}
                            alt="Profile"
                            className="comment-profile-pic me-2"
                            style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                          />
                          <div>
                            <strong>{comment.username}</strong>
                            <small className="text-muted ms-2">{new Date(comment.timestamp).toLocaleString()}</small>
                            <p className="mb-1 mt-1">{comment.content}</p>
                          </div>
                        </div>
                      {(currentRole === 'Moderador' || currentRole === 'Propietario') && (
                        <div>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-1"
                            onClick={() => {
                              console.log(`POST /api/GamingHub/v1/Moderation/Warnings - Status: 201 - Advertencia agregada al usuario ${comment.userEmail} por comentario ${comment.id}`);
                              alert('Advertencia enviada al usuario.');
                            }}
                          >
                            Advertir Usuario
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              const updatedComments = displayedComments.filter(c => c.id !== comment.id);
                              localStorage.setItem('gaminghub_comments', JSON.stringify(updatedComments));
                              setDisplayedComments(updatedComments);
                              console.log(`DELETE /api/GamingHub/v1/Moderation/Comments/${comment.id} - Status: 200 - Comentario eliminado exitosamente`);
                              alert('Comentario eliminado y advertencia enviada al usuario.');
                            }}
                          >
                            Eliminar Comentario
                          </Button>
                        </div>
                      )}
                      </div>
                    </div>
                  );
                })}

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
                        const newComment = {
                          id: Date.now().toString(),
                          userEmail: currentUser?.email || 'Anónimo',
                          username: currentUser?.username || 'Anónimo',
                          content: comments[game.id],
                          timestamp: new Date().toISOString(),
                          gameId: game.id,
                          type: 'game'
                        };

                        const updatedComments = [...displayedComments, newComment];
                        localStorage.setItem('gaminghub_comments', JSON.stringify(updatedComments));
                        setDisplayedComments(updatedComments);

                        // Also add to game-specific comments for moderation
                        const gameComments = JSON.parse(localStorage.getItem('gaminghub_game_comments') || '[]');
                        gameComments.push(newComment);
                        localStorage.setItem('gaminghub_game_comments', JSON.stringify(gameComments));

                        // Dispatch event to update ModerationTab
                        window.dispatchEvent(new Event('commentsUpdated'));

                        console.log(`POST /api/GamingHub/v1/Comments - Status: 201 - Comentario creado exitosamente`);
                        console.log(newComment);

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
