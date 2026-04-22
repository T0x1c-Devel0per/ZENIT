import { Router, type Request, Response } from 'express';
import { submitContactForm } from '../controllers/contactController.js';

const router = Router();

/**
 * POST /api/contact
 * Envía el formulario de contacto
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, service, message } = req.body;
    
    const result = await submitContactForm({ name, email, phone, service, message });
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, message: 'Error al enviar el formulario' });
  }
});

export default router;
