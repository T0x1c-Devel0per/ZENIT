import { Section } from '../../components/Section/Section.js';
import { Card } from '../../components/Card/Card.js';
import { Icon } from '../../components/Icon/Icon.js';
import { ScrollParticles } from '../../components/ScrollParticles/ScrollParticles.js';
import { values } from '../../models/data.js';
import './About.css';

const companyInfo = {
  mission: 'Proporcionar servicios de limpieza excepcionales que transformen espacios y superen las expectativas de nuestros clientes, utilizando métodos ecológicos y personal altamente capacitado.',
  vision: 'Ser la empresa líder en servicios de limpieza en Colombia, reconocida por nuestra calidad, innovación y compromiso con la sostenibilidad ambiental.',
};

export function About() {
  return (
    <Section id="nosotros" variant="default" padding="lg">
      <ScrollParticles
        particles={[
          { side: 'left', top: '20%', size: 300, speed: 0.4, color: 'primary', opacity: 0.15 },
          { side: 'right', top: '65%', size: 200, speed: 0.6, color: 'secondary', opacity: 0.18 },
        ]}
      />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="about-grid">
          <div className="about-content">
            <span className="section-tag">Sobre ZENIT SOLUTIONS</span>
            <h2 className="section-title">
              Más que limpieza, creamos{' '}
              <span className="text-primary">experiencias</span>
            </h2>

            <div className="about-cards">
              <Card className="about-card">
                <div className="about-card__icon">
                  <Icon name="badge" size="lg" />
                </div>
                <h3 className="about-card__title">Misión</h3>
                <p className="about-card__text">{companyInfo.mission}</p>
              </Card>

              <Card className="about-card">
                <div className="about-card__icon">
                  <Icon name="star" size="lg" />
                </div>
                <h3 className="about-card__title">Visión</h3>
                <p className="about-card__text">{companyInfo.vision}</p>
              </Card>
            </div>
          </div>

          <div className="about-values">
            <h3 className="about-values__title">Nuestros Valores</h3>
            <p className="about-values__description">
              Los principios que guían cada acción que realizamos
            </p>

            <div className="values-grid">
              {values.map((value, index) => (
                <div
                  key={value.id}
                  className="value-item animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="value-item__icon">
                    <Icon name={value.icon as any} size="lg" />
                  </div>
                  <h4 className="value-item__name">{value.name}</h4>
                  <p className="value-item__description">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
