import { Locator, Page } from "@playwright/test";
import { HeaderComponent } from "./component/header.component";

export default class MainPage {
  protected readonly page: Page;
  protected header: HeaderComponent;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
  }

  async clickOnSignInLink() {
    await this.header.clickSignInLnk();
  }

  getUserNameHeader(username: string) {
    return this.header.getUsernameHeader(username);
  }
}
