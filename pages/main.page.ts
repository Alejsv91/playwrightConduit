import { Locator, Page } from "@playwright/test";
import { HeaderComponent } from "./component/header.component";

export default class MainPage {
  protected readonly page: Page;
  protected header: HeaderComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
  }

  getNewArticleLink(): Locator{
    return this.header.getNewArticleLink();
  }

  getSignInLink(): Locator{
    return this.header.getSignInLink();
  }

  getUsernameHeader(username: string) {
    return this.header.getUsernameHeader(username);
  }

  async ClickOnNewArticleLink(){
    await this.header.clickNewArticleLink();
  }

  async clickOnSignInLink() {
    await this.header.clickSignInLink();
  }
}
