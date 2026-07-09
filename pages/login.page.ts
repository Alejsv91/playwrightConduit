import { Locator, Page } from "@playwright/test";
import { LocatorStrategy } from "../utils/interfaces/locatorStrategy";
import { resilientLocator } from "../utils/resilientLocator";
import MainPage from "./main.page";

export default class LoginPage extends MainPage {
  private readonly signInTitle: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: LocatorStrategy[];
  private readonly invalidUserPasswordError: Locator;

  constructor(page: Page) {
    super(page);
    this.signInTitle = page.getByRole("heading", { name: "Sign In" });
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.passwordInput = page.getByRole("textbox", { name: "password" });
    this.signInButton = [
      {
        strategy: "getByRole",
        locator: page.getByRole("button", { name: "Sign In" }),
      },
      {
        strategy: "cssLocator",
        locator: page.locator('fieldset > button:has-text("Sign In")'),
      },
      {
        strategy: "getByText",
        locator: page.locator("fieldset").getByText("Sign In"),
      },
    ];
    this.invalidUserPasswordError = page.getByText(
      "email or password is invalid"
    );
  }

  async addLoginCredentials(username: string) {}

  async clickOnSignInButton() {
    const locator = await resilientLocator(this.signInButton);
    await locator.click();
  }

  async addValueOnPasswordInput(password: string) {
    await this.passwordInput.fill(password);
  }

  async addValueOnEmailInput(email: string) {
    await this.emailInput.fill(email);
  }

  getInvalidUserPasswordError() {
    return this.invalidUserPasswordError;
  }

  getSignInTitle() {
    return this.signInTitle;
  }

  getEmailInput() {
    return this.emailInput;
  }

  getPasswordInput() {
    return this.passwordInput;
  }

  getSignInButton(): Promise<Locator> {
    return resilientLocator(this.signInButton);
  }
}
