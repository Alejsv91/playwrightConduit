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

      const articlePage = new ArticlePage(authenticatedPage);
      await expect(articlePage.getTitleElement()).toHaveText(testArticle.title);
      await expect(articlePage.getDescriptionElement()).toHaveText(
        testArticle.body
      );

      const articleResp: ArticleResponse = body.article;
      createdArticles.push(articleResp);
    }
  );

  test.only(
    "Update an article",
    { tag: ["@ui", "@positive"] },
    async ({ createdArticleByApi, authenticatedPage }) => {
      // Creating the new article
      const articleResponse = createdArticleByApi;
      const body = await articleResponse.json();
      const updateArticleInfo = ArticleFactory.updatedArticle(body.article);
      updateArticleInfo.tagList.push("update")

      console.log(`${Routes.article}${body.article.slug}`);
      await authenticatedPage.goto(`${Routes.article}/${body.article.slug}`);
      const articlePage = new ArticlePage(authenticatedPage);
      await articlePage.getEditButtonOnBanner().click();

      const editArticlePage = new EditArticle(authenticatedPage);
      await editArticlePage.fillArticleInfo(updateArticleInfo);
      //validate info was added

      await expect(editArticlePage.getTitleTextBox()).toHaveValue(
        updateArticleInfo.title
      );

      await expect(editArticlePage.getAboutTextBox()).toHaveValue(
        updateArticleInfo.description
      );

      await expect(editArticlePage.getDescriptionTextBox()).toHaveValue(
        updateArticleInfo.body
      );

      await addTags(["update"],editArticlePage, authenticatedPage)

      //Validate article is created as expected
      const putRequestUrl= `${process.env.API_URL}${Endpoints.articles()}${body.article.slug}`
      const [apiResponse] = await Promise.all([
        authenticatedPage.waitForResponse(
          putRequestUrl
        ),
        editArticlePage.clickOnPublishArticle(),
      ]);

      const bodyResponse = await apiResponse.json();
      const expectedUrl = bodyResponse.article.slug;
      await authenticatedPage.waitForURL(`**/${expectedUrl}`);

      // const articlePage = new ArticlePage(authenticatedPage);
      // const updatedArticlePage = new ArticlePage(authenticatedPage)
      await expect(articlePage.getTitleElement()).toHaveText(updateArticleInfo.title);
      await expect(articlePage.getDescriptionElement()).toHaveText(
        updateArticleInfo.body
      );

    })

  async function addTags(
    tags: Array<string>,
    editArticle: EditArticle,
    authenticatedPage: Page
  ) {
    for (const tag of tags) {
      await editArticle.AddTag(tag);
      await authenticatedPage.keyboard.press("Enter");
    }
  }
});
