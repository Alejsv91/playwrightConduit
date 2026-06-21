import { test, expect } from "../fixtures/auth.fixture";
import HomePage from "../../pages/home.page";
import EditArticle from "../../pages/editArticle.page";
import { Routes } from "../../utils/routes";
import { UserFactory } from "../../utils/userFactory";
import { Endpoints } from "../../utils/endpoints";
import Article from "../../pages/article.page";
import { Page } from "@playwright/test";

test.describe("test cases related with articles", async () => {
  const realUser = UserFactory.realUser();

  test.beforeEach(async ({ authenticatedPage }) => {
    const homepage = new HomePage(authenticatedPage);
    await expect(homepage.getUsernameHeader(realUser.username!)).toBeVisible();
    await expect(homepage.getNewArticleLink()).toBeVisible();
    await homepage.ClickOnNewArticleLink();
    await authenticatedPage.waitForURL(Routes.editArticle);
  });

  test("Creating article", async ({ authenticatedPage, browserName }) => {
    const editArticle = new EditArticle(authenticatedPage);
    const title = `Test from UI from ${browserName} at ${Date.now()}`;
    const about = "This test is related with UI testing";
    const description = "Description test from UI";
    const tags = ['automation', 'playwright', 'ui'];

    //Creating article
    await expect(
      editArticle.getUsernameHeader(realUser.username!)
    ).toBeVisible();
    await editArticle.fillTitleTextbox(title);
    await expect(editArticle.getTitleTextBox()).toHaveValue(title);
    await editArticle.fillAboutTextbox(about);
    await expect(editArticle.getAboutTextBox()).toHaveValue(about);
    await editArticle.fillDescriptionTextbox(description);
    await expect(editArticle.getDescriptionTextBox()).toHaveValue(description);
    await addTags(tags, editArticle, authenticatedPage);

    //Validate article is created as expected
    const [apiResponse] = await Promise.all([
      authenticatedPage.waitForResponse(
        `${process.env.API_URL}${Endpoints.articles()}`
      ),
      editArticle.clickOnPublishArticle(),
    ]);

    const body = await apiResponse.json();
    const expectedUrl = body.article.slug;
    await authenticatedPage.waitForURL(`**/${expectedUrl}`);

    const article = new Article(authenticatedPage);
    await expect(article.getTitleElement()).toHaveText(title);
    await expect(article.getDescriptionElement()).toHaveText(description);
    await expect(article.getTags()).toHaveText(tags);
    await expect(article.getAuthorLinkElementInArticleComponent(realUser.username!));
  });

  async function addTags(tags: Array<string>, editArticle: EditArticle, authenticatedPage: Page){
    for(const tag of tags){
      await editArticle.AddTag(tag);
      authenticatedPage.keyboard.press('Enter');
    }
  }
});
