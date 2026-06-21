import { Locator, Page } from "@playwright/test";
import MainPage from "../pages/main.page";

export default class EditArticle extends MainPage {
  private readonly titleTextbox: Locator;
  private readonly aboutTextbox: Locator;
  private readonly descriptionTextbox: Locator;
  private readonly tagsTextbox: Locator;
  private readonly publishArticleButton: Locator;

  constructor(page: Page) {
    super(page);
    this.titleTextbox = page.getByRole("textbox", { name: "Article Title" });
    this.aboutTextbox = page.getByRole("textbox", {
      name: "What's this article about?",
    });
    this.descriptionTextbox = page.getByRole("textbox", {
      name: "Write your article (in markdown)",
    });
    this.tagsTextbox = page.getByRole("textbox", { name: "Enter tags" });
    this.publishArticleButton = page.getByRole("button", {
      name: "Publis Article",
    });
  }

  getPublishArticleButton(){
    return this.publishArticleButton;
  }

  getTagsTextBox(){
    return this.tagsTextbox;
  }

  getDescriptionTextBox(){
    return this.descriptionTextbox;
  }

  getAboutTextBox(){
    return this.aboutTextbox;
  }

  getTitleTextBox(){
    return this.titleTextbox;
  }

  async clickOnPublishArticle(){
    await this.publishArticleButton.click();
  }

  async AddTag(tag: string){
    await this.tagsTextbox.fill(tag);
  }

  async fillDescriptionTextbox(descriptionContent: string){
    await this.descriptionTextbox.fill(descriptionContent);
  }

  async fillAboutTextbox(aboutContent: string){
    await this.aboutTextbox.fill(aboutContent);
  }

  async fillTitleTextbox(title: string) {
    await this.titleTextbox.fill(title);
  }
}
