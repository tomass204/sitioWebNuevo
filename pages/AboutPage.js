import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage = ({ user }) => {
  return (
    <div>
      <Header user={user} activeTab="about" />
      <main>
        <section id="about">
          <h2>Acerca de Nosotros</h2>
          <img src="tomas4/img/Nosotros.png" alt="Nosotros" style={{ maxWidth: '50%', height: 'auto', display: 'block', margin: '0 auto' }} />
          <p>Somos un equipo nuevo creando esta página web para la comunidad de gamers.</p>
          <p>Síguenos en nuestras redes sociales:</p>
          <ul>
            <li><a href="https://www.instagram.com/gaminghub_oficial" target="_blank"><i className="fab fa-instagram"></i> Instagram</a></li>
            <li><a href="https://www.facebook.com/T4MS8282" target="_blank"><i className="fab fa-facebook"></i> Facebook</a></li>
          </ul>
          <p>Si encuentras algún error, por favor comunícalo a nuestro equipo.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
