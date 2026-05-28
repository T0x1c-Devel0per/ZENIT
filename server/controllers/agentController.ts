import type { Request, Response } from 'express';
import { runCodeAgents } from '../agents/codeAgents.js';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'No se pudo ejecutar el equipo de agentes.';
}

export async function runCodeAgentsController(req: Request, res: Response) {
  try {
    const { prompt, context } = req.body as { prompt?: string; context?: string };

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'El campo prompt es obligatorio.',
      });
    }

    const result = await runCodeAgents({
      prompt,
      context: typeof context === 'string' ? context : undefined,
    });

    return res.json({
      success: true,
      ...result,
    });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    const status = message.includes('OPENAI_API_KEY') ? 503 : 500;

    return res.status(status).json({
      success: false,
      error: message,
    });
  }
}
