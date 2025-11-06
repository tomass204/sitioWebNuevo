import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Row, Col, Form, Table } from 'react-bootstrap';
import { User } from '../../services/AuthService';
import { UserService } from '../../services/UserService';
import { GameService } from '../../services/GameService';

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
  const [usersWithPurchases, setUsersWithPurchases] = useState<{ user: { email: string; username: string; status: string; totalPrice: number }; purchases: { gameId: string; gameTitle: string; purchaseDate: string; quantity: number; price: number }[] }[]>([]);
  const [comments, setComments] = useState<{ id: string; userEmail: string; username: string; content: string; timestamp: string; gameId?: string; type?: string; source?: string }[]>([]);
  const [posts, setPosts] = useState<{ id: string; userEmail: string; username: string; title: string; content: string; timestamp: string }[]>([]);

  useEffect(() => {
    loadPendingRequests();
    loadUsersWithPurchases();
    loadComments();
    loadPosts();

    // Listen for commentsUpdated event
    const handleCommentsUpdated = () => {
      loadComments();
    };

    window.addEventListener('commentsUpdated', handleCommentsUpdated);

    return () => {
      window.removeEventListener('commentsUpdated', handleCommentsUpdated);
    };
  }, []);

  const loadPendingRequests = () => {
    const requests = JSON.parse(localStorage.getItem('gaminghub_pending') || '[]');
    setPendingRequests(requests);
    console.log('GET /api/GamingHub/v1/Moderation/PendingRequests - Status: 200 - Lista de solicitudes pendientes de moderador');
    requests.forEach((request: PendingRequest) => {
      console.log(request);
    });
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

  const loadUsersWithPurchases = async () => {
    const users = await GameService.getAllUsersWithPurchases();
    setUsersWithPurchases(users);
    console.log('GET /api/GamingHub/v1/Moderation/UsersWithPurchases - Status: 200 - Lista de usuarios con compras');
    users.forEach((user: any) => {
      console.log(user);
    });
  };

  const loadComments = () => {
    const commentKeys = ['gaminghub_debate_comments', 'gaminghub_news_comments', 'gaminghub_post_comments'];
    let allComments: any[] = [];

    // Filter out specific test comments from localStorage
    const testComments = [
      "Este juego es increíble, me encanta!",
      "Otro comentario de prueba",
      "Comentario inapropiado de prueba"
    ];

    commentKeys.forEach(key => {
      let stored = JSON.parse(localStorage.getItem(key) || '[]');
      // Remove test comments from stored
      stored = stored.filter((comment: any) => !testComments.includes(comment.content));
      // Save back to localStorage
      localStorage.setItem(key, JSON.stringify(stored));
      allComments = allComments.concat(stored.map((comment: any) => ({ ...comment, source: key })));
    });

    // Filter out comments that have gameId or type 'game' (game comments)
    allComments = allComments.filter(comment => !comment.gameId && comment.type !== 'game');

    setComments(allComments);
    console.log('GET /api/GamingHub/v1/Moderation/Comments - Status: 200 - Lista de comentarios para moderar');
    allComments.forEach((comment: any) => {
      console.log(comment);
    });
  };

  const loadPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem('gaminghub_posts') || '[]');
    setPosts(storedPosts);
    console.log('GET /api/GamingHub/v1/Moderation/Posts - Status: 200 - Lista de publicaciones para moderar');
    storedPosts.forEach((post: any) => {
      console.log(post);
    });
  };

  const deleteComment = (commentId: string, userEmail: string) => {
    if (currentRole !== 'Moderador' && currentRole !== 'Propietario') {
      alert('Solo moderadores pueden eliminar comentarios.');
      return;
    }

    const commentToDelete = comments.find(comment => comment.id === commentId);
    if (!commentToDelete || !commentToDelete.source) {
      console.log(`DELETE /api/GamingHub/v1/Moderation/Comments/${commentId} - Status: 404 - Comentario no encontrado`);
      alert('Comentario no encontrado.');
      return;
    }

    const sourceKey = commentToDelete.source;
    const storedComments = JSON.parse(localStorage.getItem(sourceKey) || '[]');
    const updatedStoredComments = storedComments.filter((comment: any) => comment.id !== commentId);
    localStorage.setItem(sourceKey, JSON.stringify(updatedStoredComments));

    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);

    // Add warning to user for inappropriate comment
    const remainingWarnings = UserService.getRemainingWarnings(userEmail);
    const warningMessage = `Comentario inapropiado eliminado. Por favor, evita comentarios que violen las normas de la comunidad. Te quedan ${remainingWarnings} advertencias antes de ser baneado.`;
    UserService.addWarning(userEmail, warningMessage);

    console.log(`DELETE /api/GamingHub/v1/Moderation/Comments/${commentId} - Status: 200 - Comentario eliminado exitosamente`);
    alert(`Comentario eliminado y advertencia enviada al usuario. Te quedan ${remainingWarnings} advertencias.`);
    loadComments(); // Reload comments after deletion
  };

  const warnComment = (commentId: string, userEmail: string) => {
    if (currentRole !== 'Moderador' && currentRole !== 'Propietario') {
      alert('Solo moderadores pueden advertir usuarios.');
      return;
    }

    // Add warning to user for inappropriate comment
    const remainingWarnings = UserService.getRemainingWarnings(userEmail);
    const warningMessage = `Advertencia por comentario inapropiado. Por favor, evita comentarios que violen las normas de la comunidad. Te quedan ${remainingWarnings} advertencias antes de ser baneado.`;
    UserService.addWarning(userEmail, warningMessage);

    console.log(`POST /api/GamingHub/v1/Moderation/Warnings - Status: 201 - Advertencia agregada al usuario ${userEmail} por comentario ${commentId}`);
    alert(`Advertencia enviada al usuario. Te quedan ${remainingWarnings} advertencias.`);
  };

  const warnPost = (postId: string, userEmail: string) => {
    if (currentRole !== 'Moderador' && currentRole !== 'Propietario') {
      alert('Solo moderadores pueden advertir usuarios.');
      return;
    }

    // Add warning to user for inappropriate post
    const remainingWarnings = UserService.getRemainingWarnings(userEmail);
    const warningMessage = `Advertencia por publicación inapropiada. Por favor, evita publicaciones que violen las normas de la comunidad. Te quedan ${remainingWarnings} advertencias antes de ser baneado.`;
    UserService.addWarning(userEmail, warningMessage);

    console.log(`POST /api/GamingHub/v1/Moderation/Warnings - Status: 201 - Advertencia agregada al usuario ${userEmail} por publicación ${postId}`);
    alert(`Advertencia enviada al usuario. Te quedan ${remainingWarnings} advertencias.`);
  };

  const deletePost = (postId: string, userEmail: string) => {
    if (currentRole !== 'Moderador' && currentRole !== 'Propietario') {
      alert('Solo moderadores pueden eliminar publicaciones.');
      return;
    }

    const updatedPosts = posts.filter(post => post.id !== postId);
    localStorage.setItem('gaminghub_posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);

    console.log(`DELETE /api/GamingHub/v1/Moderation/Posts/${postId} - Status: 200 - Publicación eliminada exitosamente`);
    alert('Publicación eliminada exitosamente.');
  };

  const deleteTestComments = () => {
    if (currentRole !== 'Moderador' && currentRole !== 'Propietario') {
      alert('Solo moderadores pueden eliminar comentarios.');
      return;
    }

    const testComments = [
      "Este juego es increíble, me encanta!",
      "Otro comentario de prueba",
      "Comentario inapropiado de prueba"
    ];

    const commentKeys = ['gaminghub_debate_comments', 'gaminghub_news_comments', 'gaminghub_post_comments'];

    commentKeys.forEach(key => {
      let stored = JSON.parse(localStorage.getItem(key) || '[]');
      const originalLength = stored.length;
      stored = stored.filter((comment: any) => !testComments.includes(comment.content));
      const removedCount = originalLength - stored.length;
      localStorage.setItem(key, JSON.stringify(stored));

      // Log delete for each removed comment
      for (let i = 0; i < removedCount; i++) {
        console.log(`DELETE /api/GamingHub/v1/Moderation/TestComments - Status: 200 - Comentario de prueba eliminado permanentemente`);
      }
    });

    alert('Comentarios de prueba eliminados permanentemente.');
    loadComments(); // Reload comments after deletion
  };

  if (currentRole !== 'Propietario' && currentRole !== 'Moderador') {
    return (
      <Alert variant="warning">
        Esta sección solo está disponible para moderadores y el propietario.
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
          <Row className="mt-3">
            <Col md={12}>
              <Button variant="danger" className="w-100" onClick={deleteTestComments}>
                Eliminar Comentarios de Prueba
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {currentRole === 'Moderador' && (
        <Card className="mb-4">
          <Card.Header>
            <h3>Comentarios por Sección</h3>
          </Card.Header>
          <Card.Body>
            <h4>Comentarios en Juegos</h4>
            {comments.filter(comment => comment.type === 'game').length > 0 ? (
              <div>
                {comments.filter(comment => comment.type === 'game').map((comment, index) => (
                  <Card key={index} className="mb-3">
                    <Card.Body>
                      <h5>Comentario de {comment.username} ({comment.userEmail})</h5>
                      <p><strong>Contenido:</strong> {comment.content}</p>
                      <p><strong>Fecha:</strong> {new Date(comment.timestamp).toLocaleString()}</p>
                      {comment.gameId && <p><strong>Juego ID:</strong> {comment.gameId}</p>}

                      <div className="d-flex gap-2">
                        <Button
                          variant="warning"
                          onClick={() => warnComment(comment.id, comment.userEmail)}
                        >
                          Advertir Usuario
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => deleteComment(comment.id, comment.userEmail)}
                        >
                          Eliminar Comentario
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert variant="info">
                No hay comentarios en juegos.
              </Alert>
            )}

            <h4>Comentarios en Noticias</h4>
            {comments.filter(comment => comment.type === 'news').length > 0 ? (
              <div>
                {comments.filter(comment => comment.type === 'news').map((comment, index) => (
                  <Card key={index} className="mb-3">
                    <Card.Body>
                      <h5>Comentario de {comment.username} ({comment.userEmail})</h5>
                      <p><strong>Contenido:</strong> {comment.content}</p>
                      <p><strong>Fecha:</strong> {new Date(comment.timestamp).toLocaleString()}</p>

                      <div className="d-flex gap-2">
                        <Button
                          variant="warning"
                          onClick={() => warnComment(comment.id, comment.userEmail)}
                        >
                          Advertir Usuario
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => deleteComment(comment.id, comment.userEmail)}
                        >
                          Eliminar Comentario
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert variant="info">
                No hay comentarios en noticias.
              </Alert>
            )}

            <h4>Comentarios en Debates</h4>
            {comments.filter(comment => comment.type === 'debate').length > 0 ? (
              <div>
                {comments.filter(comment => comment.type === 'debate').map((comment, index) => (
                  <Card key={index} className="mb-3">
                    <Card.Body>
                      <h5>Comentario de {comment.username} ({comment.userEmail})</h5>
                      <p><strong>Contenido:</strong> {comment.content}</p>
                      <p><strong>Fecha:</strong> {new Date(comment.timestamp).toLocaleString()}</p>

                      <div className="d-flex gap-2">
                        <Button
                          variant="warning"
                          onClick={() => warnComment(comment.id, comment.userEmail)}
                        >
                          Advertir Usuario
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => deleteComment(comment.id, comment.userEmail)}
                        >
                          Eliminar Comentario
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert variant="info">
                No hay comentarios en debates.
              </Alert>
            )}
          </Card.Body>
        </Card>
      )}

      {(currentRole === 'Propietario' || currentRole === 'Moderador') && (
        <Card className="mb-4">
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
      )}

      {currentRole === 'Propietario' && (
        <Card className="mb-4">
          <Card.Header>
            <h3>Usuarios con Compras</h3>
          </Card.Header>
          <Card.Body>
            {usersWithPurchases.length === 0 ? (
              <Alert variant="info">
                No hay usuarios con compras.
              </Alert>
            ) : (
              <div>
                {usersWithPurchases.map((userData, index) => (
                  <Card key={index} className="mb-3">
                    <Card.Body>
                      <h5>Usuario: {userData.user.username} ({userData.user.email})</h5>
                      <p><strong>Estado:</strong> {userData.user.status}</p>
                      <p><strong>Precio Total:</strong> ${userData.user.totalPrice.toFixed(2)}</p>
                      <h6>Compras:</h6>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Juego</th>
                            <th>Fecha de Compra</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userData.purchases.map((purchase, pIndex) => (
                            <tr key={pIndex}>
                              <td>{purchase.gameTitle}</td>
                              <td>{new Date(purchase.purchaseDate).toLocaleString()}</td>
                              <td>{purchase.quantity}</td>
                              <td>${purchase.price.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      <Card className="mb-4">
        <Card.Header>
          <h3>Comentarios para Moderar</h3>
        </Card.Header>
        <Card.Body>
          {comments.length === 0 ? (
            <Alert variant="info">
              No hay comentarios para moderar.
            </Alert>
          ) : (
            <div>
              {comments.map((comment, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <h5>Comentario de {comment.username} ({comment.userEmail})</h5>
                    <p><strong>Contenido:</strong> {comment.content}</p>
                    <p><strong>Fecha:</strong> {new Date(comment.timestamp).toLocaleString()}</p>
                    {comment.gameId && <p><strong>Juego ID:</strong> {comment.gameId}</p>}

                    <div className="d-flex gap-2">
                      <Button
                        variant="warning"
                        onClick={() => warnComment(comment.id, comment.userEmail)}
                      >
                        Advertir Usuario
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deleteComment(comment.id, comment.userEmail)}
                      >
                        Eliminar Comentario
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h3>Publicaciones para Moderar</h3>
        </Card.Header>
        <Card.Body>
          {posts.length === 0 ? (
            <Alert variant="info">
              No hay publicaciones para moderar.
            </Alert>
          ) : (
            <div>
              {posts.map((post, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <h5>Publicación de {post.username} ({post.userEmail})</h5>
                    <p><strong>Título:</strong> {post.title}</p>
                    <p><strong>Contenido:</strong> {post.content}</p>
                    <p><strong>Fecha:</strong> {new Date(post.timestamp).toLocaleString()}</p>

                    <div className="d-flex gap-2">
                      <Button
                        variant="warning"
                        onClick={() => warnPost(post.id, post.userEmail)}
                      >
                        Advertir Usuario
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deletePost(post.id, post.userEmail)}
                      >
                        Eliminar Publicación
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
