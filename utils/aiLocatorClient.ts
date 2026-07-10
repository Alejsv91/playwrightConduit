import { AiLocatorSuggestion } from "./interfaces/aiLocatorSuggestion";

/**
 * Le pide al modelo, dado un snapshot de accesibilidad de la página y una
 * descripción en lenguaje humano, hasta 3 candidatos de locator.
 *
 * Importante: le pedimos SOLO datos (method/role/name/value), nunca un
 * selector o código para ejecutar directamente. Nosotros decidimos, en
 * buildLocatorFromSuggestion, qué función real de Playwright invocar.
 */
export async function getAiLocatorSuggestions(
  prompt: string,
  accessibilitySnapshot: string
): Promise<AiLocatorSuggestion[]> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are helping to locate a UI element for a Playwright test.
          Description of the element being searched: “${prompt}”
          Accessibility snapshot of the current page: ${accessibilitySnapshot}
          Respond ONLY with a JSON array (no explanation, no markdown, no backticks), 
          with a maximum of 3 candidates ordered from most to least reliable. Each element must have EXACTLY the following structure:
          {"method": "role" | "text" | "testId" | "label", "role"?: string, "name"?: string, "value"?: string}
          
          Use "role" and "name" only when the method is "role". Use "value" for "text", "testId", or "label".`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API respondió con status ${response.status}`);
  }

  const data = await response.json();
  const text = data.content
    .map((block: { type: string; text?: string }) => block.text ?? "")
    .join("");

  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned) as AiLocatorSuggestion[];
  } catch {
    throw new Error(`No se pudo parsear la respuesta del modelo como JSON: ${cleaned}`);
  }
}