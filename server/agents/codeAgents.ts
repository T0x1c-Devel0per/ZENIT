import { Agent, Runner } from '@openai/agents';

const model = process.env.OPENAI_CODE_AGENTS_MODEL || 'gpt-5.5';

const projectContext = `
Proyecto ZENIT:
- Frontend: Vite + React 18 + TypeScript.
- Backend: Express + TypeScript.
- Arquitectura esperada: componentes/vistas/controladores/modelos en frontend y rutas/controladores/modelos/servicios en backend.
- Prioriza cambios pequenos, tipados, testeables y compatibles con los scripts existentes.
`;

export const bestPracticesAgent = new Agent({
  name: 'Agente de buenas practicas',
  model,
  handoffDescription:
    'Convierte errores de revision en buenas practicas concretas para TypeScript, React, Express y seguridad.',
  instructions: `
${projectContext}
Eres el agente de buenas practicas. Recibes errores, riesgos o deuda tecnica encontrados por otros agentes.
Devuelve recomendaciones accionables en espanol, agrupadas por prioridad.
Para cada recomendacion incluye:
- problema detectado;
- practica recomendada;
- ejemplo breve de solucion o criterio de aceptacion.
No inventes archivos ni dependencias. Si falta contexto, dilo.
`,
});

export const backendAgent = new Agent({
  name: 'Agente backend',
  model,
  handoffDescription:
    'Disena e implementa cambios de backend en Express, servicios, rutas, controladores y modelos.',
  instructions: `
${projectContext}
Eres el especialista backend. Enfocate en Express, TypeScript, servicios, rutas, modelos, seguridad, validacion y manejo de errores.
Cuando respondas, entrega:
1. plan backend;
2. archivos o modulos que tocarias;
3. riesgos y pruebas recomendadas.
No modifiques frontend salvo que sea imprescindible para el contrato API.
`,
});

export const frontendAgent = new Agent({
  name: 'Agente frontend',
  model,
  handoffDescription:
    'Disena e implementa cambios de frontend en React, UX, componentes, estado y accesibilidad.',
  instructions: `
${projectContext}
Eres el especialista frontend. Enfocate en React, TypeScript, CSS, accesibilidad, estados de carga/error y experiencia responsive.
Cuando respondas, entrega:
1. plan frontend;
2. componentes, vistas o hooks que tocarias;
3. riesgos visuales y pruebas recomendadas.
No modifiques backend salvo que sea imprescindible para el contrato UI/API.
`,
});

export const codeReviewAgent = new Agent({
  name: 'Agente revisor de codigo',
  model,
  handoffDescription:
    'Revisa cambios de frontend/backend, detecta bugs y envia errores al agente de buenas practicas.',
  tools: [
    bestPracticesAgent.asTool({
      toolName: 'consultar_buenas_practicas',
      toolDescription:
        'Usa esta herramienta para convertir errores de codigo encontrados en recomendaciones de buenas practicas.',
    }),
  ],
  instructions: `
${projectContext}
Eres el revisor de codigo. Busca bugs, regresiones, problemas de seguridad, accesibilidad, performance, tipado y pruebas faltantes.
Si encuentras errores o riesgos, llama a consultar_buenas_practicas con un resumen preciso de los hallazgos.
Devuelve una revision en espanol con:
1. hallazgos ordenados por severidad;
2. buenas practicas recomendadas por el agente especializado;
3. pruebas o comandos para validar.
Si no hay hallazgos, dilo claramente y menciona riesgo residual.
`,
});

export const codeOrchestratorAgent = new Agent({
  name: 'Orquestador de equipo tecnico',
  model,
  handoffDescription:
    'Coordina agentes de backend, frontend y revision para convertir una solicitud en un plan tecnico revisado.',
  tools: [
    backendAgent.asTool({
      toolName: 'consultar_backend',
      toolDescription:
        'Usa esta herramienta cuando la solicitud tenga API, servidor, base de datos, autenticacion, servicios o integraciones.',
    }),
    frontendAgent.asTool({
      toolName: 'consultar_frontend',
      toolDescription:
        'Usa esta herramienta cuando la solicitud tenga UI, React, CSS, accesibilidad, formularios o experiencia de usuario.',
    }),
    codeReviewAgent.asTool({
      toolName: 'revisar_codigo',
      toolDescription:
        'Usa esta herramienta al final para revisar el plan o codigo propuesto y derivar errores a buenas practicas.',
    }),
  ],
  instructions: `
${projectContext}
Eres el orquestador de un pequeno equipo tecnico.
Para cada solicitud:
1. decide si corresponde consultar backend, frontend o ambos;
2. combina sus respuestas en un plan coherente;
3. llama a revisar_codigo antes de cerrar;
4. entrega una respuesta final en espanol con secciones: Resumen, Backend, Frontend, Revision y Siguiente paso.
No prometas que se editaron archivos si solo generaste una recomendacion.
`,
});

export interface CodeAgentRunInput {
  prompt: string;
  context?: string;
}

export async function runCodeAgents({ prompt, context }: CodeAgentRunInput) {
  const cleanPrompt = prompt.trim();

  if (!cleanPrompt) {
    throw new Error('El prompt no puede estar vacio.');
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no esta configurada.');
  }

  const input = context
    ? `Solicitud:\n${cleanPrompt}\n\nContexto adicional:\n${context.trim()}`
    : cleanPrompt;

  const runner = new Runner({
    workflowName: 'ZENIT code agents',
  });
  const result = await runner.run(codeOrchestratorAgent, input);

  return {
    output: result.finalOutput,
  };
}
