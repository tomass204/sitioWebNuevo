import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Container, Image, Badge } from 'react-bootstrap';

interface Blog {
  id: number;
  titulo: string;
  descripcionCorta: string;
  descripcionLarga: string;
  imagen: string;
  fecha: string;
  categoria: string;
}

const blogsData: Blog[] = [
  {
    id: 1,
    titulo: 'Las Mejores Sillas Gamer de 2024',
    descripcionCorta: 'Descubre las sillas gamer más cómodas y ergonómicas para tus largas sesiones de juego.',
    descripcionLarga: `Las sillas gamer se han convertido en un elemento esencial para cualquier setup de gaming profesional. En GamingHub, hemos probado las mejores opciones del mercado para traerte esta guía completa.

En 2024, las tendencias en sillas gamer se han enfocado en la ergonomía, el soporte lumbar y la calidad de los materiales. Las sillas más destacadas incluyen características como:

- Ajuste lumbar dinámico
- Reposabrazos 4D
- Materiales transpirables
- Rango de inclinación de 180 grados
- Diseño ergonómico certificado

Nuestro equipo ha probado más de 20 modelos diferentes, evaluando comodidad, durabilidad y relación calidad-precio. Las marcas más destacadas incluyen Secretlab, DXRacer, y AKRacing, cada una con sus propias ventajas.

Si estás buscando la mejor silla gamer para tu setup, considera factores como tu altura, el tiempo que pasas jugando, y tu presupuesto. Una buena silla no solo mejora tu experiencia de gaming, sino que también cuida tu salud postural.

En GamingHub ofrecemos una amplia selección de sillas gamer con diferentes rangos de precio, desde opciones económicas hasta modelos premium. Todos nuestros productos cuentan con garantía oficial y envío rápido a todo Chile.`,
    imagen: '/img/silla-gamer.jpg',
    fecha: '2024-01-15',
    categoria: 'Hardware'
  },
  {
    id: 2,
    titulo: 'Guía Completa de Teclados Mecánicos para Gaming',
    descripcionCorta: 'Todo lo que necesitas saber sobre teclados mecánicos: switches, layouts y recomendaciones.',
    descripcionLarga: `Los teclados mecánicos han revolucionado la experiencia de gaming. A diferencia de los teclados de membrana tradicionales, los mecánicos ofrecen mejor respuesta táctil, durabilidad y personalización.

En esta guía completa, exploraremos:

**Tipos de Switches:**
- Cherry MX Red: Lineales y silenciosos, ideales para FPS
- Cherry MX Blue: Táctiles y ruidosos, perfectos para escritura
- Cherry MX Brown: Táctiles pero silenciosos, balance perfecto

**Layouts Populares:**
- 100%: Todas las teclas, ideal para trabajo y gaming
- TKL (Tenkeyless): Sin teclado numérico, más espacio
- 60%: Compacto y minimalista

**Marcas Recomendadas:**
- Corsair: Excelente calidad y software
- Razer: Switches personalizados y RGB
- Logitech: Confort y durabilidad
- Keychron: Opciones inalámbricas premium

**Factores a Considerar:**
- Tipo de juegos que juegas
- Si necesitas teclado numérico
- Preferencia de switches
- Presupuesto

En GamingHub tenemos una selección cuidadosa de los mejores teclados mecánicos del mercado, con asesoría personalizada para encontrar el perfecto para ti.`,
    imagen: '/img/teclado-mecanico.jpg',
    fecha: '2024-01-20',
    categoria: 'Periféricos'
  },
  {
    id: 3,
    titulo: 'Monitores Gaming: 144Hz vs 240Hz',
    descripcionCorta: '¿Vale la pena invertir en un monitor 240Hz? Analizamos las diferencias y beneficios.',
    descripcionLarga: `La frecuencia de refresco es uno de los aspectos más importantes al elegir un monitor gaming. En esta comparación, analizamos 144Hz vs 240Hz para ayudarte a tomar la mejor decisión.

**144Hz - El Estándar:**
- Suficiente para la mayoría de jugadores
- Mejor relación calidad-precio
- Amplia selección de modelos
- Funciona bien con GPUs de gama media

**240Hz - Para Competitivos:**
- Ventaja competitiva en esports
- Requiere GPU de alta gama
- Diferencia notable en juegos rápidos
- Inversión más alta

**Nuestra Recomendación:**
- Jugadores casuales: 144Hz es más que suficiente
- Jugadores competitivos: 240Hz puede darte ventaja
- Presupuesto limitado: 144Hz ofrece mejor valor

En GamingHub trabajamos con las mejores marcas de monitores gaming como ASUS, Acer, y MSI, ofreciendo opciones tanto en 144Hz como 240Hz para todos los presupuestos.`,
    imagen: '/img/monitor-gaming.jpg',
    fecha: '2024-01-25',
    categoria: 'Monitores'
  },
  {
    id: 4,
    titulo: 'Auriculares Gaming: Audio Inmersivo',
    descripcionCorta: 'Cómo elegir los mejores auriculares gaming para una experiencia de audio superior.',
    descripcionLarga: `El audio es crucial en gaming, especialmente en juegos competitivos donde cada sonido cuenta. Los auriculares gaming adecuados pueden darte una ventaja significativa.

**Características Importantes:**
- Audio 7.1 surround virtual
- Micrófono cancelador de ruido
- Confort para sesiones largas
- Bajo latencia

**Marcas Destacadas:**
- SteelSeries: Excelente para esports
- HyperX: Confort y calidad
- Razer: Audio inmersivo
- Logitech: Balance precio-calidad

Elegir los auriculares correctos depende de tus necesidades y presupuesto. En GamingHub te ayudamos a encontrar el par perfecto.`,
    imagen: '/img/auriculares-gaming.jpg',
    fecha: '2024-02-01',
    categoria: 'Audio'
  }
];

const BlogsTab: React.FC = () => {
  const navigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <Container className="blogs-page">
      <div className="mb-5">
        <h1 className="text-center mb-4">
          <i className="fas fa-blog me-2"></i>
          Blog GamingHub
        </h1>
        <p className="text-center text-muted lead">
          Noticias, guías y datos curiosos sobre el mundo gaming
        </p>
      </div>

      <Row>
        {blogsData.map((blog) => (
          <Col key={blog.id} md={6} lg={4} className="mb-4">
            <Card className="h-100 blog-card" style={{ cursor: 'pointer' }}>
              {blog.imagen && (
                <Card.Img
                  variant="top"
                  src={blog.imagen}
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/img/default_blog.jpg';
                  }}
                />
              )}
              <Card.Body className="d-flex flex-column">
                <Badge bg="primary" className="mb-2">{blog.categoria}</Badge>
                <Card.Title>{blog.titulo}</Card.Title>
                <Card.Text className="flex-grow-1">
                  {blog.descripcionCorta}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <small className="text-muted">
                    <i className="fas fa-calendar me-1"></i>
                    {new Date(blog.fecha).toLocaleDateString('es-CL')}
                  </small>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/blogs/${blog.id}`)}
                  >
                    Leer Más
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export const BlogDetail: React.FC = () => {
  // Obtener ID de la URL directamente
  const getBlogIdFromUrl = (): number => {
    const path = window.location.pathname;
    const match = path.match(/\/blogs\/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };
  
  const blogId = getBlogIdFromUrl();
  const navigate = (path: string) => {
    window.location.href = path;
  };
  const blog = blogsData.find(b => b.id === blogId);

  if (!blog) {
    return (
      <Container className="text-center mt-5">
        <h2>Blog no encontrado</h2>
        <Button variant="primary" onClick={() => navigate('/blogs')}>
          Volver a Blogs
        </Button>
      </Container>
    );
  }

  return (
    <Container className="blog-detail-page">
      <Button 
        variant="outline-secondary" 
        className="mb-4"
        onClick={() => navigate('/blogs')}
      >
        <i className="fas fa-arrow-left me-2"></i>Volver a Blogs
      </Button>

      <article>
        <Badge bg="primary" className="mb-3">{blog.categoria}</Badge>
        <h1 className="mb-4">{blog.titulo}</h1>
        
        <div className="mb-4">
          <small className="text-muted">
            <i className="fas fa-calendar me-1"></i>
            Publicado el {new Date(blog.fecha).toLocaleDateString('es-CL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </small>
        </div>

        {blog.imagen && (
          <Image
            src={blog.imagen}
            alt={blog.titulo}
            fluid
            className="mb-4"
            style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/img/default_blog.jpg';
            }}
          />
        )}

        <div className="blog-content" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          {blog.descripcionLarga.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-3">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      <div className="mt-5 pt-4 border-top">
        <Button 
          variant="primary" 
          onClick={() => navigate('/blogs')}
          className="me-2"
        >
          <i className="fas fa-arrow-left me-2"></i>Volver a Blogs
        </Button>
        <Button 
          variant="outline-primary"
          onClick={() => navigate('/productos')}
        >
          <i className="fas fa-store me-2"></i>Ver Productos
        </Button>
      </div>
    </Container>
  );
};

export default BlogsTab;

