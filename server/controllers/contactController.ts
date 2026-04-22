import type { Request, Response } from 'express';
import Contact from '../models/Contact.js';
import { sendContactNotification } from '../utils/email.js';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
}

/**
 * Valida los datos del formulario de contacto
 */
function validateContactData(data: ContactFormData): string[] {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('El nombre es requerido y debe tener al menos 2 caracteres');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('El email no es válido');
  }

  if (data.phone) {
    const phoneRegex = /^(\+52)?\s?\d{10}$/;
    if (!phoneRegex.test(data.phone.replace(/[\s-]/g, ''))) {
      errors.push('El teléfono no es válido');
    }
  }

  if (!data.service || data.service.trim().length === 0) {
    errors.push('El servicio es requerido');
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push('El mensaje debe tener al menos 10 caracteres');
  }

  return errors;
}

/**
 * Procesa el envío del formulario de contacto
 * En producción, aquí se enviaría el email o se guardaría en BD
 */
export async function submitContactForm(
  data: ContactFormData
): Promise<{ success: boolean; message: string; contact?: any }> {
  const errors = validateContactData(data);

  if (errors.length > 0) {
    return {
      success: false,
      message: errors.join('. '),
    };
  }

  try {
    // Save to database
    const newContact = new Contact({
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.service,
      message: data.message
    });

    const savedContact = await newContact.save();

    // Send email notification with invoice
    const emailSent = await sendContactNotification(
      data.name,
      data.email,
      data.phone,
      data.service,
      data.message
    );

    if (!emailSent) {
      console.warn('Failed to send email notification for contact:', savedContact._id);
    }

    return {
      success: true,
      message: '¡Gracias por contactarnos! Te hemos enviado una cotización a tu correo.',
      contact: savedContact
    };
  } catch (error) {
    console.error('Error saving contact:', error);
    return {
      success: false,
      message: 'Error al procesar su solicitud. Por favor inténtelo más tarde.'
    };
  }
}
