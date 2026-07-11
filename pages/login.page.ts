import { Locator, Page } from "@playwright/test";
import { resilientLocator } from "../utils/resilientLocator";
import { SelfHealingMcp } from "../utils/interfaces/selfHealingMcp";
import MainPage from "./main.page";

export default class LoginPage extends MainPage {
  private readonly signInTitle: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: SelfHealingMcp;
  private readonly invalidUserPasswordError: Locator;
  private readonly testName: string;

  constructor(page: Page, testName: string) {
    super(page);
    this.testName = testName;
    this.signInTitle = page.getByRole("heading", { name: "Sign In" });
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.passwordInput = page.getByRole("textbox", { name: "password" });
    this.signInButton = {
      prompt: "Sign In button",
      locatorStrategies: [
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
      ],
    };
    this.invalidUserPasswordError = page.getByText(
      "email or password is invalid"
    );
  }

  async addLoginCredentials(username: string) {}

  async clickOnSignInButton() {
    const locator = await resilientLocator(this.page, this.signInButton, this.testName);
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
    return resilientLocator(this.page, this.signInButton, this.testName);
  }
}
