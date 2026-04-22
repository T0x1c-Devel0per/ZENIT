import { testimonials } from '../models/data.js';
import type { Testimonial } from '../models/types.js';

/**
 * Controller para testimonios
 */

export function getAllTestimonials(): Testimonial[] {
  return testimonials;
}

export function getFeaturedTestimonials(limit = 3): Testimonial[] {
  return testimonials.slice(0, limit);
}

export function getAverageRating(): number {
  if (testimonials.length === 0) return 0;
  
  const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);
  return Math.round((sum / testimonials.length) * 10) / 10;
}
