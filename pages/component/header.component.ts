import { Locator, Page } from "@playwright/test";

export class HeaderComponent {
  protected readonly webIcon: Locator;
  protected readonly page: Page;
  protected readonly signIn: Locator;
  protected readonly username: Locator;
  protected readonly newArticle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.webIcon = page.locator(".web-icon");
    this.signIn = page.getByRole("link", { name: "Sign In" });
    this.newArticle = page.getByText(" New Article ");
  }

  getSignInLink(): Locator{
    return this.signIn;
  }

  getNewArticleLink(): Locator
  {
    return this.newArticle;
  }

  async clickNewArticleLink() {
    await this.newArticle.click();
  }

  async clickSignInLink() {
    await this.signIn.click();
  }

  getUsernameHeader(username: string): Locator {
    return this.page.getByRole("navigation").getByText(username);
  }
}
