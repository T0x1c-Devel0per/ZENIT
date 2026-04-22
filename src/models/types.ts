/**
 * Tipos y modelos de datos compartidos
 */

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  beforeImage: string;
  afterImage: string;
  description: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
}

export interface CompanyInfo {
  mission: string;
  vision: string;
  values: ValueItem[];
}

export interface ValueItem {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface NavItem {
  label: string;
  href: string;
}
