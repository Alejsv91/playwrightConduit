import { Locator } from '@playwright/test';

export interface LocatorStrategy {
    strategy: string;
    locator: Locator;
}