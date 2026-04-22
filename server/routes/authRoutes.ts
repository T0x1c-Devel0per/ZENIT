import { Router, type Request, Response } from 'express';
import { register, login } from '../controllers/authController.js';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const userData = await register({ username, email, password });

    res.status(201).json(userData);
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: (error as Error).message 
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and get token
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userData = await login({ email, password });

    res.status(200).json(userData);
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: (error as Error).message 
    });
  }
});

export default router;