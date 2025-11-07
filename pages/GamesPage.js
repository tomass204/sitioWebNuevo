import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const GamesPage = ({ user }) => {
  const [gamesList, setGamesList] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: 'action',
    description: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle game posting logic here
    const newGame = {
      id: Date.now(),
      title: formData.title,
      category: formData.category,
      description: formData.description,
      image: formData.image,
      author: user?.username
    };
    setGamesList([...gamesList, newGame]);
    setFormData({ title: '', category: 'action', description: '', image: null });
  };

  return (
    <div>
      <Header user={user} activeTab="games" />
      <main>
        <section id="games">
          <h2>Juegos</h2>
          {user && (
            <form onSubmit={handleSubmit}>
              <label htmlFor="game-title">Nombre del Juego:</label>
              <input
                type="text"
                id="game-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ingresa el nombre del juego"
                required
              />

              <label htmlFor="game-category">Categoría:</label>
              <select
                id="game-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="action">Acción</option>
                <option value="strategy">Estrategia</option>
                <option value="adventure">Aventura</option>
                <option value="simulation">Simulación</option>
                <option value="sports">Deportes</option>
                <option value="rpg">RPG</option>
              </select>

              <label htmlFor="game-description">Descripción:</label>
              <textarea
                id="game-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ingresa la descripción del juego"
                required
              ></textarea>

              <label htmlFor="game-image">Imagen:</label>
              <input
                type="file"
                id="game-image"
                name="image"
                onChange={handleChange}
                accept="image/*"
              />

              <button type="submit">Publicar Juego</button>
            </form>
          )}

          <div id="games-list">
            {gamesList.map(game => (
              <div key={game.id} className="game-item">
                <h3>{game.title}</h3>
                <p>Categoría: {game.category}</p>
                <p>{game.description}</p>
                {game.image && <img src={URL.createObjectURL(game.image)} alt="Juego" />}
                <p>Por: {game.author}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GamesPage;
