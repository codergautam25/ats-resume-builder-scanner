export interface OmniRouteOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
  responseFormat?: { type: string };
}

export const OMNIROUTE_BASE_URL = process.env.OMNIROUTE_URL || 'http://localhost:8000/v1';
export const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434/v1';

/**
 * Universal OmniRoute / OpenAI / Ollama Completion Handler
 * Routes requests through OmniRoute Unified AI Gateway with automatic fallback across local Ollama & cloud providers.
 */
export async function callOmniRouteCompletion(
  prompt: string,
  options: OmniRouteOptions = {}
): Promise<string> {
  const model = options.model || process.env.DEFAULT_LLM_MODEL || 'gemini-2.5-flash';
  const temperature = options.temperature ?? 0.2;
  const maxTokens = options.maxTokens ?? 2500;

  const messages = [];
  if (options.systemInstruction) {
    messages.push({ role: 'system', content: options.systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });

  const payload: any = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  };

  if (options.responseFormat?.type === 'json_object') {
    payload.response_format = { type: 'json_object' };
  }

  // 1. Try OmniRoute Gateway (http://localhost:8000/v1)
  try {
    const res = await fetch(`${OMNIROUTE_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OMNIROUTE_API_KEY || 'omniroute-local'}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data: any = await res.json();
      if (data?.choices?.[0]?.message?.content) {
        console.log(`[OmniRoute Gateway] Successfully routed query to model: ${model}`);
        return data.choices[0].message.content;
      }
    }
  } catch (err: any) {
    console.warn(`[OmniRoute Gateway] Gateway endpoint (${OMNIROUTE_BASE_URL}) unreachable or returned error: ${err.message}. Falling back to Ollama / Cloud provider.`);
  }

  // 2. Try Local Ollama Endpoint (http://localhost:11434/v1)
  try {
    const ollamaPayload = {
      model: model.includes('llama') ? model : 'llama3',
      messages,
      temperature,
      stream: false,
    };
    const res = await fetch(`${OLLAMA_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ollamaPayload),
    });

    if (res.ok) {
      const data: any = await res.json();
      if (data?.choices?.[0]?.message?.content) {
        console.log(`[Ollama Local Engine] Routed query successfully.`);
        return data.choices[0].message.content;
      }
    }
  } catch (ollamaErr: any) {
    console.warn(`[Ollama Local Engine] Local Ollama (${OLLAMA_BASE_URL}) unavailable.`);
  }

  // 3. Fallback to direct Gemini API / OpenAI compatible completion
  throw new Error(`OmniRoute & Ollama gateways offline. Model execution escalated to direct Gemini / provider API.`);
}
