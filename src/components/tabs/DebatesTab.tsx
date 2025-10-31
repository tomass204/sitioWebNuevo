import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Image, Alert } from 'react-bootstrap';
import { User } from '../../services/AuthService';
import { DebateService } from '../../services/DebateService';

interface DebateItem {
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

interface DebatesTabProps {
  currentUser: User | null;
  currentRole: string | null;
}

const DebatesTab: React.FC<DebatesTabProps> = ({ currentUser, currentRole }) => {
  const [debates, setDebates] = useState<DebateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newDebate, setNewDebate] = useState({
    title: '',
    content: '',
    image: null as File | null
  });

  useEffect(() => {
    loadDebates();
  }, []);

  const loadDebates = async () => {
    try {
      const debatesData = await DebateService.getAllDebates();
      setDebates(debatesData);
    } catch (error) {
      console.error('Error loading debates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const imageUrl = newDebate.image ? URL.createObjectURL(newDebate.image) : '/img/Influencer.png';
      await DebateService.createDebate({
        title: newDebate.title,
        content: newDebate.content,
        image: imageUrl,
        author: currentUser.email
      });
      
      setNewDebate({ title: '', content: '', image: null });
      setShowForm(false);
      loadDebates();
    } catch (error) {
      console.error('Error creating debate:', error);
    }
  };

  const addComment = async (debateId: string, text: string) => {
    if (!currentUser) return;

    try {
      await DebateService.addComment(debateId, {
        text,
        author: currentUser.email
      });
      console.log(`Comentario en debate ID: ${debateId}, Usuario ID: ${currentUser?.email || 'Anónimo'}, Nombre: ${currentUser?.username || 'Anónimo'}, Comentario: ${text}`);
      loadDebates();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const likeComment = async (debateId: string, commentId: string) => {
    try {
      await DebateService.likeComment(debateId, commentId);
      loadDebates();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const deleteDebate = async (debateId: string) => {
    if (!currentUser || (currentRole !== 'Moderador' && currentRole !== 'Propietario')) return;

    try {
      await DebateService.deleteDebate(debateId);
      loadDebates();
    } catch (error) {
      console.error('Error deleting debate:', error);
    }
  };

  if (loading) {
    return <div>Cargando debates...</div>;
  }

  return (
    <div>
      <h2>Debates</h2>
      <p>Participa en debates sobre tus juegos favoritos.</p>

      {currentRole === 'Influencer' && (
        <Card className="mb-4">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <h3>Crear debate</h3>
              <Button 
                variant="outline-primary" 
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancelar' : 'Nuevo Debate'}
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
                    value={newDebate.title}
                    onChange={(e) => setNewDebate({ ...newDebate, title: e.target.value })}
                    placeholder="Título del debate"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contenido:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={newDebate.content}
                    onChange={(e) => setNewDebate({ ...newDebate, content: e.target.value })}
                    placeholder="Contenido del debate"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Imagen:</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewDebate({ ...newDebate, image: (e.target as HTMLInputElement).files?.[0] || null })}
                  />
                </Form.Group>

                <Button type="submit" className="btn-custom">
                  Crear debate
                </Button>
              </Form>
            </Card.Body>
          )}
        </Card>
      )}

      <Row>
        {debates.map((item) => (
          <Col md={6} lg={4} key={item.id} className="mb-4">
            <Card className="debate-item h-100">
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
                    onClick={() => deleteDebate(item.id)}
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

export default DebatesTab;
