import { test, expect } from "../fixtures/auth.fixture";
import HomePage from "../../pages/home.page";
import EditArticle from "../../pages/editArticle.page";
import { Routes } from "../../utils/routes";
import { UserFactory } from "../../utils/userFactory";

test.describe("test cases related with articles", async () => {
  const realUser = UserFactory.realUser();

  test.beforeEach(async ({ authenticatedPage }) => {
    const homepage = new HomePage(authenticatedPage);
    await expect(homepage.getUsernameHeader(realUser.username!)).toBeVisible();
    await expect(homepage.getNewArticleLink()).toBeVisible();
    await homepage.ClickOnNewArticleLink();
    await authenticatedPage.waitForURL(Routes.editArticles);
  });

  test("Creating article", async ({ authenticatedPage }) => {
    const editArticles = new EditArticle(authenticatedPage);
    await expect(
      editArticles.getUsernameHeader(realUser.username!)
    ).toBeVisible();

    // console.log('test');
    // await expect(authenticatedPage.getByText('Global Feed')).toBeVisible();
    // await authenticatedPage.getByText(' New Article ').click();
    // await authenticatedPage.waitForURL('https://conduit.bondaracademy.com/editor');
    // await expect(authenticatedPage.getByRole('textbox', {name: 'Article Title'})).toBeVisible();
    // await authenticatedPage.getByRole('textbox', {name: 'Article Title'}).fill('This is a test');
    // await expect(authenticatedPage.getByRole('textbox', {name: 'Article Title'})).toHaveValue('This is a test');
  });
});
