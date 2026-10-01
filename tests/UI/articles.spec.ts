import { expect } from "../fixtures/auth.fixture";
import { test } from "../fixtures/article.fixture";
import HomePage from "../../pages/home.page";
import EditArticle from "../../pages/editArticle.page";
import { Routes } from "../../utils/routes";
import { UserFactory } from "../../utils/userFactory";
import { Endpoints } from "../../utils/endpoints";
import { Page } from "@playwright/test";
import { ArticleFactory } from "../../utils/articleFactory";
import ArticlePage from "../../pages/article.page";
import { ArticleResponse } from "../../utils/interfaces/article";
import { EditArticleAssertions } from "../../assertions/editArticle.assertions";

test.describe("test cases related with articles", async () => {
  const realUser = UserFactory.realUser();
  const createdArticles: Array<ArticleResponse> = [];

  test.beforeEach(async ({ authenticatedPage }) => {
    const homepage = new HomePage(authenticatedPage);
    await expect(homepage.getUsernameHeader(realUser.username!)).toBeVisible();
    await expect(homepage.getNewArticleLink()).toBeVisible();
    await homepage.ClickOnNewArticleLink();
    await authenticatedPage.waitForURL(Routes.editArticle);
  });

  test(
    "Creating article",
    { tag: ["@positive", "@ui"] },
    async ({ authenticatedPage, browserName }) => {
      const testArticle = ArticleFactory.multipleTagsArticle(
        browserName,
        false
      );
      const editArticle = new EditArticle(authenticatedPage);

      await expect(
        editArticle.getUsernameHeader(realUser.username!)
      ).toBeVisible();

      //Creating article
      await EditArticleAssertions.validateFormIsEnable(editArticle);
      await editArticle.fillArticleInfo(testArticle);
      await editArticle.addTags(testArticle.tagList);

      await EditArticleAssertions.validateArticleInfo(editArticle, testArticle);

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

      const articlePage = new ArticlePage(authenticatedPage);
      await expect(articlePage.getTitleElement()).toHaveText(testArticle.title);
      await expect(articlePage.getDescriptionElement()).toHaveText(
        testArticle.body
      );

      const articleResp: ArticleResponse = body.article;
      createdArticles.push(articleResp);
    }
  );

  test(
    "Update an article",
    { tag: ["@ui", "@positive"] },
    async ({ createdArticleByApi, authenticatedPage }) => {

      // Creating the new article
      const articleResponse = createdArticleByApi;
      const body = await articleResponse.json();
      const currentArticleInfo: ArticleResponse = body.article;
      const updateArticleInfo = ArticleFactory.updatedArticle(body.article);
      updateArticleInfo.tagList.push("update");

      console.log(`${Routes.article}${body.article.slug}`);
      await authenticatedPage.goto(`${Routes.article}/${body.article.slug}`);
      const articlePage = new ArticlePage(authenticatedPage);
      await Promise.all([
        authenticatedPage.waitForURL("**/editor/**"),
        articlePage.getEditButtonOnBanner().click(),
      ]);

      const editArticlePage = new EditArticle(authenticatedPage);
      await expect(editArticlePage.getTitleTextBox()).toBeVisible();
      await expect(editArticlePage.getAboutTextBox()).toBeVisible();
      await expect(editArticlePage.getDescriptionTextBox()).toBeVisible();

      //validate info was added
      await EditArticleAssertions.validateArticleInfo(
        editArticlePage,
        currentArticleInfo
      );

      //Updating info
      await editArticlePage.fillArticleInfo(updateArticleInfo);
      await editArticlePage.addTags(["update"]);

      //validate info was added
      await EditArticleAssertions.validateArticleInfo(
        editArticlePage,
        updateArticleInfo
      );

      //Validate article is created as expected
      const putRequestUrl = `${process.env.API_URL}${Endpoints.articles()}${
        body.article.slug
      }`;

      const [apiResponse] = await Promise.all([
        authenticatedPage.waitForResponse(
          (response) =>
            response.url() === putRequestUrl &&
            response.request().method() === "PUT"
        ),
        editArticlePage.clickOnPublishArticle(),
      ]);

      const bodyResponse = await apiResponse.json();
      const expectedUrl = bodyResponse.article.slug;
      await authenticatedPage.waitForURL(`**/${expectedUrl}`);

      await expect(articlePage.getTitleElement()).toHaveText(
        updateArticleInfo.title
      );

      await expect(articlePage.getDescriptionElement()).toHaveText(
        updateArticleInfo.body
      );
    }
  );

});
