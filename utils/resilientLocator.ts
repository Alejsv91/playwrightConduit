import { Locator, Page } from "@playwright/test";
import { SelfHealingMcp } from "./interfaces/selfHealingMcp";
import { AiLocatorSuggestion } from "./interfaces/aiLocatorSuggestion";
import { getAiLocatorSuggestions } from "./aiLocatorClient";

function buildLocatorFromSuggestion(
  page: Page,
  suggestion: AiLocatorSuggestion
): Locator {
  switch (suggestion.method) {
    case "role":
      if (!suggestion.role) throw new Error("Missing 'role' suggestion");
      return page.getByRole(
        suggestion.role as Parameters<Page["getByRole"]>[0],
        {
          name: suggestion.name,
        }
      );
    case "text":
      if (!suggestion.value) throw new Error("Missing 'value' suggestion");
      return page.getByText(suggestion.value);
    case "testId":
      if (!suggestion.value) throw new Error("Missing 'value' suggestion");
      return page.getByTestId(suggestion.value);
    case "label":
      if (!suggestion.value) throw new Error("Missing 'value' suggestion");
      return page.getByLabel(suggestion.value);
    default:
      throw new Error(`Unkown suggestion method: ${suggestion.method}`);
  }
}

export async function resilientLocator(
  page: Page,
  selfHealingMcp: SelfHealingMcp
): Promise<Locator> {
  for (const [index, l] of selfHealingMcp.locatorStrategies.entries()) {
    try {
      await l.locator.waitFor({
        state: "visible",
        timeout: index === 0 ? 15000 : 1000,
      });
      return l.locator;
    } catch (error) {
      console.warn(
        `Locator ${l.strategy} at index ${index} did not match any elements. Trying next locator.`
      );
    }
  }

  console.warn( `All strategies failed to locate element ${selfHealingMcp.prompt}. Trying with AI`);

  const accessibilitySnapshot = await page.locator("body").ariaSnapshot();
  const suggestions = await getAiLocatorSuggestions(
    selfHealingMcp.prompt,
    accessibilitySnapshot
  );

  for(const [index, suggestion] of suggestions.entries()) {
    try {
        const aiLocator = buildLocatorFromSuggestion(page, suggestion);
        await aiLocator.waitFor({state: "visible", timeout: 5000});
        console.warn(`AI suggestion ${suggestion.method} at index ${index} matched an element. Using this locator.`);
        return aiLocator;
    } catch (error) {
      console.warn(
        `AI suggestion ${suggestion.method} at index ${index} did not match any elements. Trying next suggestion.`
      );
    }
  }

  throw new Error(
    `All strategies failed inclding AI suggestions for prompt: ${selfHealingMcp.prompt}`
  );
}
