import type { Service, Testimonial, GalleryItem, ValueItem } from '../models/types.js';

/**
 * Datos de servicios de limpieza
 */
export const services: Service[] = [
  {
    id: 'residencial',
    name: 'Limpieza Residencial',
    description: 'Mantenemos tu hogar impecable con productos ecológicos y técnicas profesionales.',
    icon: 'home',
    features: [
      'Limpieza profunda de espacios',
      'Productos biodegradables',
      'Personal de confianza',
      'Horarios flexibles',
    ],
  },
  {
    id: 'comercial',
    name: 'Limpieza Comercial',
    description: 'Espacios de trabajo siempre listos para impresionar a tus clientes.',
    icon: 'building',
    features: [
      'Oficinas y locales comerciales',
      'Limpieza de cristales',
      'Mantenimiento de áreas comunes',
      'Servicio nocturno disponible',
    ],
  },
  {
    id: 'post-construccion',
    name: 'Limpieza Post-Construcción',
    description: 'Eliminamos todo rastro de obra para que disfrutes tu espacio nuevo.',
    icon: 'sparkles',
    features: [
      'Remoción de escombros finos',
      'Limpieza de superficies delicadas',
      'Pulido de pisos',
      'Entrega inmediata',
    ],
  },
  {
    id: 'especializada',
    name: 'Limpieza Especializada',
    description: 'Soluciones personalizadas para necesidades específicas.',
    icon: 'star',
    features: [
      'Limpieza de tapicería',
      'Tratamiento de alfombras',
      'Desinfección de espacios',
      'Servicio por eventos',
    ],
  },
];

/**
 * Datos de testimonios de clientes
 */
export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'María González',
    role: 'Cliente Residencial',
    content: 'El servicio de SteamClean transformó completamente mi hogar. El equipo es profesional, puntual y detallista. ¡Los recomiendo al 100%!',
    rating: 5,
  },
  {
    id: '2',
    name: 'Carlos Ramírez',
    role: 'Gerente de Oficina',
    content: 'Contratamos la limpieza comercial para nuestras oficinas y la diferencia es notable. Siempre impecables, sin interrupciones en nuestro trabajo.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Ana Martínez',
    role: 'Cliente Post-Construcción',
    content: 'Después de la remodelación de mi casa, SteamClean dejó todo perfecto. Quitaron hasta el polvo más fino. Excelente relación calidad-precio.',
    rating: 5,
  },
];

/**
 * Datos de galería antes/después
 */
export const galleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'Oficina Corporativa',
    beforeImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
    afterImage: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Limpieza profunda de oficina de 500m²',
  },
  {
    id: '2',
    title: 'Residencia Familiar',
    beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
    afterImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Limpieza general post-evento familiar',
  },
  {
    id: '3',
    title: 'Local Comercial',
    beforeImage: 'https://images.unsplash.com/photo-1515785182275-62a2ab89a2f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
    afterImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Limpieza de local comercial antes de apertura',
  },
];

/**
 * Valores de la empresa
 */
export const values: ValueItem[] = [
  {
    id: 'calidad',
    name: 'Calidad',
    description: 'Estándares excepcionales en cada servicio que brindamos.',
    icon: 'badge',
  },
  {
    id: 'confianza',
    name: 'Confianza',
    description: 'Personal verificado y transparente en cada trabajo.',
    icon: 'shield',
  },
  {
    id: 'sostenibilidad',
    name: 'Sostenibilidad',
    description: 'Productos ecológicos que cuidan tu salud y el medio ambiente.',
    icon: 'leaf',
  },
  {
    id: 'excelencia',
    name: 'Excelencia',
    description: 'Búsqueda constante de la perfección en cada detalle.',
    icon: 'trophy',
  },
];
