import { Locator } from "@playwright/test";
import { LocatorStrategy } from "./interfaces/locatorStrategy";

export async function resilientLocator(
  locators: LocatorStrategy[]
): Promise<Locator> {
  for (const [index, l] of locators.entries()) {
    try {
      await l.locator.waitFor({ state: "visible", timeout: index === 0 ? 15000 : 1000 });
        return l.locator;
    } catch (error) {
      console.warn(
        `Locator ${l.strategy} at index ${index} did not match any elements. Trying next locator.`
      );
    }
  }
  throw new Error("No valid locator found");
}
