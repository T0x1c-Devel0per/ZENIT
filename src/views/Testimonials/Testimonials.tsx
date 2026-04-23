import { Section } from '../../components/Section/Section.js';
import { Card } from '../../components/Card/Card.js';
import { Rating } from '../../components/Rating/Rating.js';
import { Icon } from '../../components/Icon/Icon.js';
import { useInView } from '../../hooks/index.js';
import { getFeaturedTestimonials, getAverageRating } from '../../controllers/index.js';
import './Testimonials.css';

export function Testimonials() {
  const { setRef } = useInView<HTMLDivElement>(0.1);
  const testimonials = getFeaturedTestimonials();
  const averageRating = getAverageRating();

  return (
    <Section id="testimonios" variant="alternate" padding="lg">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Testimonios</span>
          <h2 className="section-title">
            Lo que dicen{' '}
            <span className="text-primary">nuestros clientes</span>
          </h2>
          
          <div className="testimonials-rating">
            <div className="testimonials-rating__score">
              <span className="testimonials-rating__number">{averageRating}</span>
              <Rating value={Math.round(averageRating)} size="lg" />
              <span className="testimonials-rating__text">
                Basado en {testimonials.length}+ reseñas
              </span>
            </div>
          </div>
        </div>

        <div ref={setRef} className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`testimonial-card animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Icon name="quote" size="lg" className="testimonial-card__quote-icon" />
              
              <div className="testimonial-card__rating">
                <Rating value={testimonial.rating} size="sm" />
              </div>
              
              <blockquote className="testimonial-card__content">
                "{testimonial.content}"
              </blockquote>
              
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">
                  <span>{testimonial.name.charAt(0)}</span>
                </div>
                <div className="testimonial-card__info">
                  <cite className="testimonial-card__name">{testimonial.name}</cite>
                  <span className="testimonial-card__role">{testimonial.role}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
