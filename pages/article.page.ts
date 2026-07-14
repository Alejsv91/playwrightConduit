import { Locator, Page } from "@playwright/test";
import MainPage from "./main.page";
import { SelfHealingMcp } from "../utils/interfaces/selfHealingMcp";

export default class Article extends MainPage {
  private readonly titleElement: Locator;
  private readonly descriptionElement: Locator;
  private readonly tagElements: Locator;
  private readonly favoriteArticleButton: SelfHealingMcp;
  private readonly titleAuthorLink: Locator;

  constructor(page: Page, testName: string) {
    super(page);
    this.descriptionElement = page.locator("div.row.article-content p");
    this.titleElement = page.locator("div.article-page h1");
    this.tagElements = page.locator("ul.tag-list").getByRole("listitem");
    this.titleAuthorLink = page.locator("div.banner app-article-meta div.info a");
    this.favoriteArticleButton = {
      prompt: "Favorite Article button in title",
      locatorStrategies: [
        {
          strategy: "getByRole",
          locator: page.getByRole("button", {
            name: /Favorite Article\s*\(\d+\)/,
          }),
        },
        {
          strategy: "get",
          locator: page.getByText(/Favorite Article\s*\(\d+\)/),
        },
        {
          strategy: "cssLocator",
          locator: page.locator('button:has-text("Favorite Article")'),
        },
      ],
    };
  }

  getTitleAuthorLink(): Locator {
    return this.titleAuthorLink;
  }

  getTitleElement(): Locator {
    return this.titleElement;
  }

  async clickOnFavoriteArticleButton() {
    //const locator = await this.resilentLocator(this.page, this.favoriteArticleButton, this.testName);
  }

  getAuthorLinkElementInArticleComponent(authorUsername: string): Locator {
    return this.page
      .locator("app-article-meta")
      .getByRole("link", { name: authorUsername });
  }


  getDescriptionElement(): Locator {
    return this.descriptionElement;
  }

  getTags(): Locator {
    return this.tagElements;
  }
}
