import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';

interface ContactTabProps {
  currentUser?: any;
  currentRole?: string | null;
}

const ContactTab: React.FC<ContactTabProps> = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    comentario: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    if (email.trim() === '') return true; // Opcional, solo validar si tiene valor
    
    const allowedDomains = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    const isValidDomain = allowedDomains.some(domain => email.includes(domain));
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return emailRegex.test(email) && isValidDomain;
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validar Nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length > 100) {
      newErrors.nombre = 'El nombre no puede exceder 100 caracteres';
    }

    // Validar Correo
    if (formData.correo.trim().length > 0) {
      if (formData.correo.trim().length > 100) {
        newErrors.correo = 'El correo no puede exceder 100 caracteres';
      } else if (!validateEmail(formData.correo)) {
        newErrors.correo = 'El correo debe ser de @duoc.cl, @profesor.duoc.cl o @gmail.com';
      }
    }

    // Validar Comentario
    if (!formData.comentario.trim()) {
      newErrors.comentario = 'El comentario es requerido';
    } else if (formData.comentario.trim().length > 500) {
      newErrors.comentario = 'El comentario no puede exceder 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simular envío (aquí iría la llamada real al backend)
    try {
      // Guardar en localStorage como ejemplo
      const contactMessages = JSON.parse(localStorage.getItem('gaminghub_contact_messages') || '[]');
      contactMessages.push({
        ...formData,
        fecha: new Date().toISOString()
      });
      localStorage.setItem('gaminghub_contact_messages', JSON.stringify(contactMessages));

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      setFormData({
        nombre: '',
        correo: '',
        comentario: ''
      });

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="contact-page">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center mb-4">
            <i className="fas fa-envelope me-2"></i>
            Contáctanos
          </h1>
          <p className="text-center text-muted mb-5">
            ¿Tienes alguna pregunta, sugerencia o comentario? Estamos aquí para ayudarte.
          </p>

          <Card>
            <Card.Body>
              {success && (
                <Alert variant="success" className="mb-4">
                  <i className="fas fa-check-circle me-2"></i>
                  ¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Nombre <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ingresa tu nombre completo"
                    isInvalid={!!errors.nombre}
                    maxLength={100}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nombre}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    {formData.nombre.length}/100 caracteres
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="tu.correo@duoc.cl o tu.correo@gmail.com"
                    isInvalid={!!errors.correo}
                    maxLength={100}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.correo}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Solo aceptamos correos de @duoc.cl, @profesor.duoc.cl o @gmail.com
                    {formData.correo.length > 0 && ` (${formData.correo.length}/100 caracteres)`}
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    Comentario <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="comentario"
                    value={formData.comentario}
                    onChange={handleChange}
                    placeholder="Escribe tu mensaje aquí..."
                    isInvalid={!!errors.comentario}
                    maxLength={500}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.comentario}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    {formData.comentario.length}/500 caracteres
                  </Form.Text>
                </Form.Group>

                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Row className="mt-5">
            <Col md={4} className="text-center mb-4">
              <i className="fas fa-map-marker-alt fa-2x text-primary mb-3"></i>
              <h5>Ubicación</h5>
              <p className="text-muted">
                Chile
              </p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <i className="fas fa-envelope fa-2x text-primary mb-3"></i>
              <h5>Email</h5>
              <p className="text-muted">
                <a href="mailto:gaminghuboficial@gmail.com">
                  gaminghuboficial@gmail.com
                </a>
              </p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <i className="fas fa-phone fa-2x text-primary mb-3"></i>
              <h5>Horario</h5>
              <p className="text-muted">
                Lunes - Viernes: 9:00 - 18:00
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactTab;

