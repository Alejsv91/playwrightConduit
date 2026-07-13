import { test } from "../fixtures/article.fixture";
import { expect } from "@playwright/test";
import HomePage from "../../pages/home.page";
import EditArticle from "../../pages/editArticle.page";
import { UserFactory } from "../../utils/userFactory";
import { Endpoints } from "../../utils/endpoints";
import Article from "../../pages/article.page";
import { Page } from "@playwright/test";
import { ArticleFactory } from "../../utils/articleFactory";
import { ArticleResponse } from "../../utils/interfaces/article";
import { Routes } from "../../utils/routes";

test.describe("test cases related with articles", async () => {
  const realUser = UserFactory.realUser();

  test.beforeEach(async ({ authenticatedPage }) => {
    const homepage = new HomePage(authenticatedPage);
    await expect(homepage.getUsernameHeader(realUser.username!)).toBeVisible();
    await expect(homepage.getNewArticleLink()).toBeVisible();
  });

  test(
    "Creating article",
    { tag: ["@positive", "@ui"] },
    async ({ authenticatedPage, browserName }, testInfo) => {
      const testArticle = ArticleFactory.multipleTagsArticle(
        browserName,
        false
      );
      const homepage = new HomePage(authenticatedPage);
      await homepage.ClickOnNewArticleLink();
      const editArticle = new EditArticle(authenticatedPage);

      //Creating article
      await expect(
        editArticle.getUsernameHeader(realUser.username!)
      ).toBeVisible();
      await editArticle.fillTitleTextbox(testArticle.title);
      await expect(editArticle.getTitleTextBox()).toHaveValue(
        testArticle.title
      );
      await editArticle.fillAboutTextbox(testArticle.description);
      await expect(editArticle.getAboutTextBox()).toHaveValue(
        testArticle.description
      );
      await editArticle.fillDescriptionTextbox(testArticle.body);
      await expect(editArticle.getDescriptionTextBox()).toHaveValue(
        testArticle.body
      );
      await addTags(testArticle.tagList, editArticle, authenticatedPage);

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

      const article = new Article(authenticatedPage, testInfo.title);
      await expect(article.getTitleElement()).toHaveText(testArticle.title);
      await expect(article.getDescriptionElement()).toHaveText(
        testArticle.body
      );
    }
  );

  test('Open article from home page', { tag: ["@positive", "@ui"] }, 
    async ({ page, createArticleByApi }, testInfo) => {
      const bodyResponse = await createArticleByApi.json();
      const article: ArticleResponse = bodyResponse.article;

      await page.goto(`${Routes.article}${article.slug}`);
      await page.waitForURL(`**/${article.slug}`);
      expect(page.url()).toContain(article.slug);

  });

  async function addTags(
    tags: Array<string>,
    editArticle: EditArticle,
    authenticatedPage: Page
  ) {
    for (const tag of tags) {
      await editArticle.AddTag(tag);
      authenticatedPage.keyboard.press("Enter");
    }
  }
});
