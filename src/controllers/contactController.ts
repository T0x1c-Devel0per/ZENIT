import { isValidEmail, isValidPhone } from '../utils/helpers.js';
import type { ContactForm } from '../models/types.js';

/**
 * Controller para formulario de contacto
 */

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
}

export function validateContactForm(data: ContactForm): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'El nombre es requerido';
  } else if (data.name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres';
  }

  if (!data.email.trim()) {
    errors.email = 'El email es requerido';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Ingresa un email válido';
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = 'Ingresa un teléfono válido';
  }

  if (!data.service.trim()) {
    errors.service = 'Selecciona un servicio';
  }

  if (!data.message.trim()) {
    errors.message = 'El mensaje es requerido';
  } else if (data.message.trim().length < 10) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres';
  }

  return errors;
}

export function isFormValid(errors: FormErrors): boolean {
  return Object.keys(errors).length === 0;
}

export async function submitContactForm(
  data: ContactForm
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Verificar si la respuesta es exitosa antes de intentar parsear JSON
    if (!response.ok) {
      // Si el servidor devuelve un error, intentar leer el cuerpo como texto
      let errorMessage = 'Error al enviar el formulario.';
      try {
        const errorResult = await response.json();
        errorMessage = errorResult.message || errorMessage;
      } catch (parseError) {
        // Si no se puede parsear como JSON, usar el status text
        errorMessage = response.statusText || errorMessage;
      }

      return {
        success: false,
        message: errorMessage,
      };
    }

    // Intentar parsear la respuesta como JSON
    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      // Si no se puede parsear como JSON, devolver un mensaje genérico
      return {
        success: false,
        message: 'La respuesta del servidor no es válida.',
      };
    }

    return {
      success: result.success,
      message: result.message,
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      message: 'Error de conexión. Por favor verifica tu conexión a internet.',
    };
  }
}
