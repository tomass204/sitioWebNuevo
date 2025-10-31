import React, { useState, useEffect } from 'react';
import { Card, Alert } from 'react-bootstrap';
import { User } from '../../services/AuthService';

interface FavoriteItem {
  type: string;
  id: string;
  content: string;
  author: string;
}

interface FavoritesTabProps {
  currentUser: User | null;
  currentRole: string | null;
}

const FavoritesTab: React.FC<FavoritesTabProps> = ({ currentUser, currentRole }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favoritesData = JSON.parse(localStorage.getItem('gaminghub_favorites') || '[]');
    setFavorites(favoritesData);
  };

  if (currentRole !== 'UsuarioBasico') {
    return (
      <Alert variant="warning">
        Esta sección solo está disponible para usuarios básicos.
      </Alert>
    );
  }

  return (
    <div>
      <h2>Favoritos</h2>
      <p>Tus comentarios guardados.</p>
      
      {favorites.length === 0 ? (
        <Alert variant="info">
          No tienes favoritos guardados. Los comentarios que marques como favoritos aparecerán aquí.
        </Alert>
      ) : (
        <div>
          {favorites.map((item, index) => (
            <Card key={index} className="favorite-item mb-3">
              <Card.Body>
                <h5>{item.content}</h5>
                <p className="text-muted">Por: {item.author}</p>
                <small className="text-muted">Tipo: {item.type}</small>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesTab;
