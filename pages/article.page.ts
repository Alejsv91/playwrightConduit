import { Locator, Page } from "@playwright/test"
import MainPage from "./main.page";

export default class ArticlePage extends MainPage{
    private readonly titleElement: Locator;
    private readonly descriptionElement: Locator;
    private readonly tagElements: Locator;
    private readonly editButton: Locator;

    constructor(page: Page){
        super(page);
        this.descriptionElement = page.locator('div.row.article-content p');
        this.titleElement = page.locator('div.article-page h1');
        this.tagElements = page.locator('ul.tag-list').getByRole('listitem');
        this.editButton = page.locator('div.banner').getByRole("link", {name: " Edit Article "});
    }

    getAuthorLinkElementInArticleComponent(authorUsername: string): Locator{
        return this.page.locator('app-article-meta').getByRole('link',{name: authorUsername});
    }

    getEditButtonOnBanner(): Locator {
        return this.editButton;
    }

    getTitleElement(): Locator{
        return this.titleElement;
    }

    getDescriptionElement():Locator{
        return this.descriptionElement;
    }

    getTags():Locator{
        return this.tagElements
    }

}