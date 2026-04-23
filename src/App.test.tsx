import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Contact } from './views/Contact';

describe('Contact Component', () => {
  it('renders the contact form correctly', () => {
    render(<Contact />);
    
    // Check if the main elements are present
    expect(screen.getByText('¿Listo para un espacio impecable?')).toBeInTheDocument();
    expect(screen.getByText('Solicitar Cotización')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Servicio de interés')).toBeInTheDocument();
    expect(screen.getByLabelText('Mensaje')).toBeInTheDocument();
  });
});