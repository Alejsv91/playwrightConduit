import { test, expect, request } from "@playwright/test";
import HomePage from "../../pages/home.page";
import LoginPage from "../../pages/login.page";
import { UserFactory } from "../../utils/userFactory";

test.describe("Login Test Cases", async () => {
  const fakeUser = UserFactory.fakeUser();
  const realUser = UserFactory.realUser();

  test.beforeEach(async ({ page }) => {
    const [apiResponse] = await Promise.all([
      page.waitForResponse("**/api/articles?limit=10&offset=0"),
      page.goto("/"),
    ]);

    //API Check
    expect(apiResponse.status()).toBe(200);
    const body = await apiResponse.json();
    expect(Array.isArray(body.articles)).toBe(true);

    //UI Check
    const homePage = new HomePage(page);
    await homePage.isHomePageLoaded();

    //Navigate to Login
    await homePage.clickOnSignInLink();
  })

  test("Login page renders components correctly", async ({ page }) => {
    const lp = new LoginPage(page);
    await expect(lp.getSignInTitle()).toBeVisible();
    await expect(lp.getEmailInput()).toBeVisible();
    await expect(lp.getPasswordInput()).toBeVisible();
    await expect(lp.getSignInButton()).toBeVisible();
  })

  test("Adding invalid Credentials", async ({ page }) => {
    const lp = new LoginPage(page);
    await fillAndAssertCredentials(lp, fakeUser.email, fakeUser.password);
    await lp.clickOnSignInButton();
    await expect(lp.getInvalidUserPasswordError()).toBeVisible();
  })

  test("Adding valid username but fake password", async ({ page }) => {
    const lp = new LoginPage(page);
    await fillAndAssertCredentials(lp, realUser.email, fakeUser.password);
    await lp.clickOnSignInButton();
    await expect(lp.getInvalidUserPasswordError()).toBeVisible();
  })

  test("Adding fake username but real password", async ({ page }) => {
    const lp = new LoginPage(page);
    await fillAndAssertCredentials(lp, fakeUser.email, realUser.password);
    await lp.clickOnSignInButton();
    await expect(lp.getInvalidUserPasswordError()).toBeVisible();
  })

  test("Login with expected credentials", async ({page})=>{
    const lp = new LoginPage(page);
    await fillAndAssertCredentials(lp, fakeUser.email, realUser.password);
    await lp.clickOnSignInButton();
    await lp.getUserNameHeader(realUser.username!);
  })

  //PENDING Test
  //WHen user only add username
  //When user only add password
  //When user don't add credentials

  async function fillAndAssertCredentials(
    lp: LoginPage,
    email: string,
    password: string
  ) {
    await lp.addValueOnEmailInput(email);
    await expect(lp.getEmailInput()).toHaveValue(email);
    await lp.addValueOnPasswordInput(password);
    await expect(lp.getPasswordInput()).toHaveValue(password);
  }
})
