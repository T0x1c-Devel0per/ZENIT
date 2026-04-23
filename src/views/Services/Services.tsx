import { Card } from '../../components/Card/Card.js';
import { Icon } from '../../components/Icon/Icon.js';
import { Button } from '../../components/Button/Button.js';
import { Section } from '../../components/Section/Section.js';
import { ScrollParticles } from '../../components/ScrollParticles/ScrollParticles.js';
import { useInView } from '../../hooks/index.js';
import { getAllServices } from '../../controllers/index.js';
import './Services.css';

export function Services() {
  const { setRef } = useInView<HTMLDivElement>(0.1);
  const services = getAllServices();

  return (
    <Section id="servicios" variant="alternate" padding="lg">
      <ScrollParticles
        particles={[
          { side: 'right', top: '10%', size: 280, speed: 0.6, color: 'primary', opacity: 0.25 },
          { side: 'left',  top: '60%', size: 200, speed: 0.4, color: 'secondary', opacity: 0.2 },
        ]}
      />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header">
          <span className="section-tag">Nuestros Servicios</span>
          <h2 className="section-title">
            Soluciones de limpieza para{' '}
            <span className="text-primary">cada necesidad</span>
          </h2>
          <p className="section-description">
            Ofrecemos servicios profesionales adaptados a tus requerimientos 
            específicos, con personal capacitado y productos de la más alta calidad.
          </p>
        </div>

        <div ref={setRef} className="services-grid">
          {services.map((service, index) => (
            <Card
              key={service.id}
              className={`service-card animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="service-card__icon">
                <Icon name={service.icon as any} size="xl" />
              </div>
              
              <h3 className="service-card__title">{service.name}</h3>
              
              <p className="service-card__description">{service.description}</p>
              
              <ul className="service-card__features">
                {service.features.map((feature) => (
                  <li key={feature} className="service-card__feature">
                    <Icon name="check" size="sm" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <a href="#contacto" className="service-card__cta">
                <Button variant="outline" size="sm" fullWidth>
                  Cotizar este servicio
                </Button>
              </a>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
