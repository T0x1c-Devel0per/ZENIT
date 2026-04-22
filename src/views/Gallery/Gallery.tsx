import { useState } from 'react';
import { Section } from '../../components/Section/Section.js';
import { Card } from '../../components/Card/Card.js';
import { Button } from '../../components/Button/Button.js';
import { Icon } from '../../components/Icon/Icon.js';
import { useInView } from '../../hooks/index.js';
import { galleryItems } from '../../models/data.js';
import './Gallery.css';

export function Gallery() {
  const { setRef, isInView } = useInView<HTMLDivElement>(0.1);
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggleCompare = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <Section id="galeria" variant="default" padding="lg">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Nuestros Trabajos</span>
          <h2 className="section-title">
            Resultados que{' '}
            <span className="text-primary">hablan por sí mismos</span>
          </h2>
          <p className="section-description">
            Explora nuestra galería de antes y después. Cada proyecto es una
            muestra de nuestro compromiso con la excelencia.
          </p>
        </div>

        <div ref={setRef} className="gallery-grid">
          {galleryItems.map((item, index) => (
            <Card
              key={item.id}
              className={`gallery-item animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
              padding="none"
            >
              <div className="gallery-item__image-wrapper">
                <div className="gallery-compare">
                  <div className="gallery-compare__image gallery-compare__image--before">
                    <img
                      src={item.beforeImage}
                      alt={`Imagen antes de limpieza - ${item.title}`}
                      className="gallery-image"
                      loading="lazy"
                    />
                    <div className="gallery-compare__label">Antes</div>
                  </div>
                  <div className="gallery-compare__image gallery-compare__image--after">
                    <img
                      src={item.afterImage}
                      alt={`Imagen después de limpieza - ${item.title}`}
                      className="gallery-image"
                      loading="lazy"
                    />
                    <div className="gallery-compare__label">Después</div>
                  </div>
                  <div
                    className={`gallery-compare__slider ${activeId === item.id ? 'gallery-compare__slider--active' : ''}`}
                  />
                </div>

                <button
                  className="gallery-item__toggle"
                  onClick={() => toggleCompare(item.id)}
                  aria-label="Comparar antes y después"
                >
                  <Icon name={activeId === item.id ? 'close' : 'sparkles'} size="sm" />
                  <span>{activeId === item.id ? 'Cerrar' : 'Ver cambio'}</span>
                </button>
              </div>

              <div className="gallery-item__info">
                <h3 className="gallery-item__title">{item.title}</h3>
                <p className="gallery-item__description">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="gallery-cta">
          <a href="#contacto">
            <Button variant="primary" size="lg">
              Solicita tu cotización gratuita
              <Icon name="arrow-right" size="md" />
            </Button>
          </a>
        </div>
      </div>
    </Section>
  );
}
