import 'dotenv/config';
import { runCodeAgents } from './agents/codeAgents.js';

const prompt = process.argv.slice(2).join(' ');

if (!prompt) {
  console.error('Uso: npm run agents:code -- "Describe la tarea tecnica"');
  process.exit(1);
}

try {
  const result = await runCodeAgents({ prompt });
  console.log(result.output);
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : 'No se pudo ejecutar el equipo de agentes.');
  process.exit(1);
}
