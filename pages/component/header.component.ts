import { Locator, Page } from '@playwright/test';

export class HeaderComponent {
    readonly webIcon: Locator;
    readonly page: Page; 

    constructor(page: Page) {
        this.page = page;
        this.webIcon = page.locator('.web-icon');
    }
}

