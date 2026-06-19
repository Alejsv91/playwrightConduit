import { Locator, Page } from '@playwright/test';

export class HeaderComponent {
    protected readonly webIcon: Locator;
    protected readonly page: Page; 
    protected readonly signIn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.webIcon = page.locator('.web-icon');
        this.signIn = page.getByRole('link', {name: 'Sign In'});
    }

    async clickSignInLnk() {
        await this.signIn.click();
    }

}

