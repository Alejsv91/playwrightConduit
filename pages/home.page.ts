import {Page, Locator, expect} from '@playwright/test'
import MainPage from './main.page';

export default class HomePage extends MainPage {
    private readonly conduitTitle: Locator;

    constructor(page: Page){
        super(page);
        this.conduitTitle = page.getByRole('heading',{name: 'conduit'});
    }

    async isHomePageLoaded(){
        await expect(this.conduitTitle).toBeVisible();
    };
}