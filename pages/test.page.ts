import { Locator } from '@playwright/test';

export default class TestPage {
    testLocator: Locator;

    constructor(page) {
        this.testLocator = page.locator('selector-for-test-element');
    }
}