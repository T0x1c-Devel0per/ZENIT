import { Router } from 'express';
import { runCodeAgentsController } from '../controllers/agentController.js';

const router = Router();

router.post('/code', runCodeAgentsController);

export default router;
