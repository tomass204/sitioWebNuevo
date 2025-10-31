import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Image, Alert } from 'react-bootstrap';
import { User } from '../../services/AuthService';
import { NewsService } from '../../services/NewsService';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  comments: Comment[];
  createdAt: string;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  likes: number;
  liked: boolean;
  createdAt: string;
}

interface NewsTabProps {
  currentUser: User | null;
  currentRole: string | null;
}

const NewsTab: React.FC<NewsTabProps> = ({ currentUser, currentRole }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newNews, setNewNews] = useState({
    title: '',
    content: '',
    image: null as File | null
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const newsData = await NewsService.getAllNews();
      setNews(newsData);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const imageUrl = newNews.image ? URL.createObjectURL(newNews.image) : '/img/UsuarioBasico.png';
      await NewsService.createNews({
        title: newNews.title,
        content: newNews.content,
        image: imageUrl,
        author: currentUser.email
      });
      
      setNewNews({ title: '', content: '', image: null });
      setShowForm(false);
      loadNews();
    } catch (error) {
      console.error('Error creating news:', error);
    }
  };

  const addComment = async (newsId: string, text: string) => {
    if (!currentUser) return;

    try {
      await NewsService.addComment(newsId, {
        text,
        author: currentUser.email
      });
      console.log(`Comentario en noticia ID: ${newsId}, Usuario ID: ${currentUser?.email || 'Anónimo'}, Nombre: ${currentUser?.username || 'Anónimo'}, Comentario: ${text}`);
      loadNews();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const likeComment = async (newsId: string, commentId: string) => {
    try {
      await NewsService.likeComment(newsId, commentId);
      loadNews();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const deleteNews = async (newsId: string) => {
    if (!currentUser || (currentRole !== 'Moderador' && currentRole !== 'Propietario')) return;

    try {
      await NewsService.deleteNews(newsId);
      loadNews();
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  if (loading) {
    return <div>Cargando noticias...</div>;
  }

  return (
    <div>
      <h2>Noticias</h2>
      <p>Lee las últimas noticias sobre juegos.</p>

      {currentRole === 'Influencer' && (
        <Card className="mb-4">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h3>Publicar noticia</h3>
              <Button 
                variant="outline-primary" 
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancelar' : 'Nueva Noticia'}
              </Button>
            </div>
          </Card.Header>
          {showForm && (
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Título:</Form.Label>
                  <Form.Control
                    type="text"
                    value={newNews.title}
                    onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                    placeholder="Título de la noticia"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contenido:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={newNews.content}
                    onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                    placeholder="Contenido de la noticia"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Imagen:</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewNews({ ...newNews, image: (e.target as HTMLInputElement).files?.[0] || null })}
                  />
                </Form.Group>

                <Button type="submit" className="btn-custom">
                  Publicar
                </Button>
              </Form>
            </Card.Body>
          )}
        </Card>
      )}

      <Row>
        {news.map((item) => (
          <Col md={6} lg={4} key={item.id} className="mb-4">
            <Card className="news-item h-100">
              <Image src={item.image} alt={item.title} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.content}</Card.Text>
                
                <div className="d-flex align-items-center mb-3">
                  <Image
                    src="/img/Influencer.png"
                    alt="Author"
                    className="author-profile-pic me-2"
                    style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                  />
                  <small className="text-muted">{item.author}</small>
                </div>

                {(currentRole === 'Moderador' || currentRole === 'Propietario') && (
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => deleteNews(item.id)}
                    className="mb-3"
                  >
                    Eliminar Publicación
                  </Button>
                )}

                <div className="comments">
                  {item.comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <div className="comment-author">
                        <Image
                          src="/img/UsuarioBasico.png"
                          alt="Profile"
                          className="comment-profile-pic"
                        />
                        <span>{comment.author}</span>
                      </div>
                      <p>{comment.text}</p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => likeComment(item.id, comment.id)}
                        className={comment.liked ? 'liked' : ''}
                      >
                        Me gusta ({comment.likes})
                      </Button>
                    </div>
                  ))}
                </div>

                {currentRole !== 'Propietario' && (
                  <Form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const text = formData.get('comment') as string;
                    if (text.trim()) {
                      addComment(item.id, text);
                      e.currentTarget.reset();
                    }
                  }}>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        name="comment"
                        placeholder="Escribe un comentario..."
                        required
                      />
                    </Form.Group>
                    <Button type="submit" size="sm" variant="primary">
                      Comentar
                    </Button>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default NewsTab;
