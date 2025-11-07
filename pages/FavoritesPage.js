import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FavoritesPage = ({ user }) => {
  const favoritesList = user?.favorites || [];

  return (
    <div>
      <Header user={user} activeTab="favorites" />
      <main>
        <section id="favorites">
          <h2>Favoritos</h2>
          <p>Tus comentarios guardados.</p>
          <div id="favorites-list">
            {favoritesList.length === 0 ? (
              <p>No tienes comentarios favoritos aún.</p>
            ) : (
              favoritesList.map(fav => (
                <div key={fav.id} className="favorite-item">
                  <p>{fav.content}</p>
                  <p>De: {fav.author}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FavoritesPage;
