import { services } from '../models/data.js';
import type { Service } from '../models/types.js';

/**
 * Controller para servicios
 * Maneja la lógica de negocio relacionada con servicios
 */

export function getAllServices(): Service[] {
  return services;
}

export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}

export function getServiceNames(): string[] {
  return services.map((service) => service.name);
}
