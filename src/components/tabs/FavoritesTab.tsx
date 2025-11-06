import React, { useState, useEffect } from 'react';
import { Card, Alert } from 'react-bootstrap';
import { User } from '../../services/AuthService';

interface FavoriteItem {
  type: string;
  id: string;
  content: string;
  author: string;
  likes: number;
  liked: boolean;
  favorite: boolean;
  createdAt: string;
}

interface FavoritesTabProps {
  currentUser: User | null;
  currentRole: string | null;
}

const storage = (() => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return localStorage;
  } catch (e) {
    return {
      getItem: (key: string) => (window as any)[key] || '[]',
      setItem: (key: string, value: string) => (window as any)[key] = value
    };
  }
})();

const FavoritesTab: React.FC<FavoritesTabProps> = ({ currentUser, currentRole }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    loadFavorites();

    // Listen for favorites updates
    const handleFavoritesUpdate = () => {
      loadFavorites();
    };

    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);

    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, []);

  const loadFavorites = () => {
    console.log('Calling GET FAVORITES endpoint');
    const favoritesData = JSON.parse(storage.getItem('gaminghub_favorites') || '[]');
    console.log('Favorites list retrieved successfully, status: 200, count:', favoritesData.length, 'favorites:', favoritesData);
    setFavorites(favoritesData);
  };



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
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">Tipo: {item.type}</small>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted">Likes: {item.likes}</span>
                    {item.liked && <span className="text-success">❤️</span>}
                    {item.favorite && <span className="text-warning">⭐</span>}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesTab;
