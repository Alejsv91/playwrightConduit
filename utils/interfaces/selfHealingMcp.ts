import { LocatorStrategy } from "./locatorStrategy";

export interface SelfHealingMcp {
    prompt: string,
    locatorStrategies: LocatorStrategy[],
}