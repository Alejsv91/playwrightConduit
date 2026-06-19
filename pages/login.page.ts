import { Locator, Page } from "@playwright/test";
import MainPage from "./main.page";

export default class LoginPage extends MainPage {
  private readonly signInTitle: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly invalidUserPasswordError: Locator;

  constructor(page: Page) {
    super(page);
    this.signInTitle = page.getByRole("heading", { name: "Sign In" });
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.passwordInput = page.getByRole("textbox", { name: "password" });
    this.signInButton = page.getByRole("button", { name: "Sign In" });
    this.invalidUserPasswordError = page.getByText('email or password is invalid');
  }

  async addLoginCredentials(username: string){

  }

  async clickOnSignInButton(){
    await this.signInButton.click();
  }

  async addValueOnPasswordInput(password: string){
    await this.passwordInput.fill(password);
  }

  async addValueOnEmailInput(email: string){
    await this.emailInput.fill(email);
  }

  getInvalidUserPasswordError(){
    return this.invalidUserPasswordError;
  }

  getSignInTitle() {
    return this.signInTitle;
  }

  getEmailInput(){
    return this.emailInput;
  }

  getPasswordInput(){
    return this.passwordInput;
  }

  getSignInButton() {
    return this.signInButton;
  }
}

