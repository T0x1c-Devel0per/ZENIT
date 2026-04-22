/**
 * Configuración de la aplicación
 */

export const config = {
  app: {
    name: 'SteamClean',
    tagline: 'Limpieza al Vapor Profesional, Resultados Impecables',
    description: 'Servicio profesional de limpieza al vapor residencial y comercial con los más altos estándares de calidad.',
  },

  contact: {
    email: 'contacto@steamclean.com.co',
    phone: '+57 312 345 6789',
    address: 'Bogotá, Colombia',
  },

  social: {
    facebook: 'https://facebook.com/steamclean',
    instagram: 'https://instagram.com/steamclean',
    twitter: 'https://twitter.com/steamclean',
    linkedin: 'https://linkedin.com/company/steamclean',
  },

  business: {
    hours: {
      weekdays: 'Lunes - Viernes: 8:00 AM - 6:00 PM',
      saturday: 'Sábado: 9:00 AM - 2:00 PM',
      sunday: 'Domingo: Cerrado',
    },
  },
} as const;

export type Config = typeof config;
