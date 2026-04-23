import { useState, useRef, useCallback } from 'react';
import { Section } from '../../components/Section/Section.js';
import { Card } from '../../components/Card/Card.js';
import { Button } from '../../components/Button/Button.js';
import { Icon } from '../../components/Icon/Icon.js';
import { ScrollParticles } from '../../components/ScrollParticles/ScrollParticles.js';
import { useInView } from '../../hooks/index.js';
import { galleryItems } from '../../models/data.js';
import './Gallery.css';

/**
 * BeforeAfterSlider — Draggable comparison slider
 */
function BeforeAfterSlider({ beforeSrc, afterSrc, title }: {
  beforeSrc: string;
  afterSrc: string;
  title: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50); // percentage 0–100
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="ba-slider"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      {/* BEFORE (full width, underneath) */}
      <img
        src={beforeSrc}
        alt={`Antes - ${title}`}
        className="ba-slider__img"
        draggable={false}
      />
      <div className="ba-slider__label ba-slider__label--before">Antes</div>

      {/* AFTER (clipped by position) */}
      <div
        className="ba-slider__after"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <img
          src={afterSrc}
          alt={`Después - ${title}`}
          className="ba-slider__img"
          draggable={false}
        />
        <div className="ba-slider__label ba-slider__label--after">Después</div>
      </div>

      {/* HANDLE */}
      <div className="ba-slider__handle" style={{ left: `${position}%` }}>
        <div className="ba-slider__handle-line" />
        <div className="ba-slider__handle-knob">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function Gallery() {
  const { setRef } = useInView<HTMLDivElement>(0.1);

  return (
    <Section id="galeria" variant="default" padding="lg">
      <ScrollParticles
        particles={[
          { side: 'left',  top: '15%', size: 220, speed: 0.5, color: 'accent', opacity: 0.2 },
          { side: 'right', top: '70%', size: 260, speed: 0.7, color: 'primary', opacity: 0.18 },
        ]}
      />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header">
          <span className="section-tag">Nuestros Trabajos</span>
          <h2 className="section-title">
            Resultados que{' '}
            <span className="text-primary">hablan por sí mismos</span>
          </h2>
          <p className="section-description">
            Arrastra el control deslizante para comparar el antes y después
            de nuestros servicios profesionales.
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
                <BeforeAfterSlider
                  beforeSrc={item.beforeImage}
                  afterSrc={item.afterImage}
                  title={item.title}
                />
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
