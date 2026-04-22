import { Router, type Request, Response } from 'express';
import Contact from '../models/Contact.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/admin/contacts
 * Get all contacts (admin only)
 */
router.get('/contacts', protect, adminOnly, async (req: Request, res: Response) => {
  try {
    // Get all contacts sorted by creation date (newest first)
    const contacts = await Contact.find({})
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 contacts

    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener los contactos' 
    });
  }
});

/**
 * DELETE /api/admin/contacts/:id
 * Delete a contact (admin only)
 */
router.delete('/contacts/:id', protect, adminOnly, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({ 
        success: false,
        message: 'Contacto no encontrado' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Contacto eliminado correctamente' 
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al eliminar el contacto' 
    });
  }
});

export default router;