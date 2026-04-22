import { useState, type FormEvent } from 'react';
import { Section } from '../../components/Section/Section.js';
import { Card } from '../../components/Card/Card.js';
import { Input } from '../../components/Input/Input.js';
import { Textarea } from '../../components/Textarea/Textarea.js';
import { Select } from '../../components/Select/Select.js';
import { Button } from '../../components/Button/Button.js';
import { Icon } from '../../components/Icon/Icon.js';
import { validateContactForm, submitContactForm, isFormValid } from '../../controllers/index.js';
import { getServiceNames } from '../../controllers/index.js';
import type { ContactForm as ContactFormType } from '../../models/types.js';
import './Contact.css';

const serviceOptions = getServiceNames().map((name) => ({
  value: name,
  label: name,
}));

const initialFormState: ContactFormType = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
};

export function Contact() {
  const [formData, setFormData] = useState<ContactFormType>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormType, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormType]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validateContactForm(formData);
    setErrors(validationErrors);

    if (!isFormValid(validationErrors)) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const result = await submitContactForm(formData);
      setSubmitStatus(result.success ? 'success' : 'error');
      if (result.success) {
        setFormData(initialFormState);
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="contacto" variant="dark" padding="lg">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <span className="section-tag section-tag--light">Contacto</span>
            <h2 className="section-title section-title--light">
              ¿Listo para un espacio{' '}
              <span className="text-accent">impecable</span>?
            </h2>
            <p className="contact-description">
              Solicita tu cotización gratuita. Te responderemos en menos de 24 horas.
            </p>

            <div className="contact-methods">
              <a href="tel:+573123456789" className="contact-method">
                <Icon name="phone" size="lg" />
                <span>Llámanos - Bogotá, Colombia</span>
                <strong>+57 312 345 6789</strong>
              </a>
              <a href="mailto:contacto@steamclean.com.co" className="contact-method">
                <Icon name="mail" size="lg" />
                <span>Escríbenos</span>
                <strong>contacto@steamclean.com.co</strong>
              </a>
            </div>
          </div>

          <Card className="contact-form-card" padding="lg">
            {/* Admin panel link - only visible to authenticated users */}
            {localStorage.getItem('token') && (
              <div className="mb-4">
                <a
                  href="/admin"
                  className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Panel de Administración
                </a>
              </div>
            )}

            {submitStatus === 'success' ? (
              <div className="contact-success">
                <div className="contact-success__icon">
                  <Icon name="check" size="xl" />
                </div>
                <h3>¡Mensaje enviado!</h3>
                <p>Gracias por contactarnos. Te responderemos pronto.</p>
                <Button variant="outline" onClick={() => setSubmitStatus('idle')}>
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <h3 className="contact-form__title">Solicitar Cotización</h3>

                <Input
                  label="Nombre completo"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  placeholder="Tu nombre"
                  icon={<Icon name="user" size="sm" />}
                />

                <Input
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="tu@email.com"
                  icon={<Icon name="mail" size="sm" />}
                />

                <Input
                  label="Teléfono (opcional)"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="55 1234 5678"
                  icon={<Icon name="phone" size="sm" />}
                />

                <Select
                  label="Servicio de interés"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  error={errors.service}
                  options={serviceOptions}
                  placeholder="Selecciona un servicio"
                />

                <Textarea
                  label="Mensaje"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  error={errors.message}
                  placeholder="Cuéntanos sobre tu proyecto..."
                  rows={4}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                </Button>

                {submitStatus === 'error' && (
                  <p className="contact-form__error">
                    Hubo un error al enviar. Por favor intenta de nuevo.
                  </p>
                )}
              </form>
            )}
          </Card>
        </div>
      </div>
    </Section>
  );
}
