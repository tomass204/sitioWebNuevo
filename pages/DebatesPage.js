import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DebatesPage = ({ user }) => {
  const [debatesList, setDebatesList] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle debate posting logic here
    const newDebate = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      author: user?.username
    };
    setDebatesList([...debatesList, newDebate]);
    setFormData({ title: '', content: '' });
  };

  return (
    <div>
      <Header user={user} activeTab="debates" />
      <main>
        <section id="debates">
          <h2>Debates</h2>
          {user && (
            <form onSubmit={handleSubmit}>
              <label htmlFor="debate-title">Título del Debate:</label>
              <input
                type="text"
                id="debate-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ingresa el título del debate"
                required
              />

              <label htmlFor="debate-content">Contenido:</label>
              <textarea
                id="debate-content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Ingresa el contenido del debate"
                required
              ></textarea>

              <button type="submit">Publicar Debate</button>
            </form>
          )}

          <div id="debates-list">
            {debatesList.map(debate => (
              <div key={debate.id} className="debate-item">
                <h3>{debate.title}</h3>
                <p>{debate.content}</p>
                <p>Por: {debate.author}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DebatesPage;
