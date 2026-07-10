import { Locator, Page } from "@playwright/test";
import { SelfHealingMcp } from "./interfaces/selfHealingMcp";
import { AiLocatorSuggestion } from "./interfaces/aiLocatorSuggestion";
import { getAiLocatorSuggestions } from "./aiLocatorClient";
import { logSelectorFailure } from "./cloudwatch-logger";

function buildLocatorFromSuggestion(
  page: Page,
  suggestion: AiLocatorSuggestion
): Locator {
  switch (suggestion.method) {
    case "role":
      if (!suggestion.role) throw new Error("Missing 'role' suggestion");
      return page.getByRole(suggestion.role as Parameters<Page["getByRole"]>[0], {
        name: suggestion.name,
      });
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
      throw new Error(`Unknow suggested method: ${suggestion.method}`);
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
      console.log(`Locator ${l.strategy} at index ${index} matched successfully.`);
      logSelectorFailure('Any Test', l.strategy, `Locator at index ${index} matched successfully.`);
      return l.locator;
    } catch (error) {
      logSelectorFailure('Any Test', l.strategy, `Locator at index ${index} did not match any elements. Error: ${error}`);
      console.warn(
        `Locator ${l.strategy} at index ${index} did not match any elements. Trying next locator.`
      );
    }
  }

  console.warn(
    `Static strategies fail "${selfHealingMcp.prompt}". Trying with AI.`
  );

  const accessibilitySnapshot = await page.locator("body").ariaSnapshot();
  const suggestions = await getAiLocatorSuggestions(
    selfHealingMcp.prompt,
    accessibilitySnapshot
  );

  for (const [index, suggestion] of suggestions.entries()) {
    try {
      const aiLocator = buildLocatorFromSuggestion(page, suggestion);
      await aiLocator.waitFor({ state: "visible", timeout: 5000 });
      logSelectorFailure('Any Test', suggestion.method, `AI suggestion at index ${index} matched successfully.`);
      console.warn(
        `AI Fallback works method="${suggestion.method}" (suggestion ${index}).`
      );
      return aiLocator;
    } catch {
      logSelectorFailure('Any Test', suggestion.method, `AI suggestion at index ${index} did not match any elements.`);
      console.warn(
        `AI suggestion ${index} (method="${suggestion.method}") element not found. Trying next AI suggestion.`
      );
    }
  }

  logSelectorFailure('Any Test', 'All Strategies', `Element "${selfHealingMcp.prompt}" not found with static and AI strategies.`);

  throw new Error(
    `Element is not finded "${selfHealingMcp.prompt}" with static and AI strategies.`
  );
}