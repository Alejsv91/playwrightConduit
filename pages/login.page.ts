import { Locator, Page } from "@playwright/test";
import MainPage from "./main.page";

export default class LoginPage extends MainPage{
    private readonly signInTitle: Locator;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signInButton: Locator;

    constructor(page: Page){
        super(page);
        this.signInTitle = page.getByRole('heading', {name: 'Sign In'});
        this.emailInput = page.getByRole('textbox', {name: 'Email'});
        this.passwordInput = page.getByRole('textbox', {name: 'password'});
        this.signInButton = page.getByRole('button', {name: 'Sign In'});
    }

    async signInTitleIsVisible(){
        return await this.signInTitle.isVisible();
    }



}
