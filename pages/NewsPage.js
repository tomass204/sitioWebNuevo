import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NewsPage = ({ user }) => {
  const [newsList, setNewsList] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });

  useEffect(() => {
    const savedNews = JSON.parse(localStorage.getItem('gaminghub_news')) || [];
    setNewsList(savedNews);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle news posting logic here
    const newNews = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      image: formData.image,
      author: user?.username
    };
    const savedNews = JSON.parse(localStorage.getItem('gaminghub_news')) || [];
    savedNews.push(newNews);
    localStorage.setItem('gaminghub_news', JSON.stringify(savedNews));
    setNewsList([...newsList, newNews]);
    setFormData({ title: '', content: '', image: null });
  };

  return (
    <div>
      <Header user={user} activeTab="news" />
      <main>
        <section id="news">
          <h2>Noticias</h2>
          {user && user.role === 'Influencer' && (
            <form onSubmit={handleSubmit}>
              <label htmlFor="news-title">Título de la Noticia:</label>
              <input
                type="text"
                id="news-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ingresa el título"
                required
              />

              <label htmlFor="news-content">Contenido:</label>
              <textarea
                id="news-content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Ingresa el contenido de la noticia"
                required
              ></textarea>

              <label htmlFor="news-image">Imagen:</label>
              <input
                type="file"
                id="news-image"
                name="image"
                onChange={handleChange}
                accept="image/*"
              />

              <button type="submit">Publicar Noticia</button>
            </form>
          )}

          <div id="news-list">
            {newsList.map(news => (
              <div key={news.id} className="news-item">
                <h3>{news.title}</h3>
                <p>{news.content}</p>
                {news.image && <img src={URL.createObjectURL(news.image)} alt="Noticia" />}
                <p>Por: {news.author}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NewsPage;
