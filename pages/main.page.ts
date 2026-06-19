import { Locator, Page } from '@playwright/test';
import { HeaderComponent } from './component/header.component';

export default class MainPage {
    page: Page;
    header: HeaderComponent;

    constructor(page) {
        this.page = page
        this.header = new HeaderComponent(page);
    }

    async clickOnSignInLink(){
        await this.header.clickSignInLnk();
    }

}