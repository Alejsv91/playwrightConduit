import { test, expect, request } from "@playwright/test";
import HomePage from "../../pages/home.page";
import LoginPage from "../../pages/login.page";

test.describe("Login Test Cases", async () => {
  test.beforeEach(async ({ page }) => {
    const [apiResponse] = await Promise.all([
      page.waitForResponse('**/api/articles?limit=10&offset=0'),
      page.goto('/')
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
    
  });

  test("Login page renders components correctly", async ({ page }) => {
    const lp = new LoginPage(page);
    await expect(lp.getSignInTitle()).toBeVisible();
    await expect(lp.getEmailInput()).toBeVisible();
    await expect(lp.getPasswordInput()).toBeVisible();
    await expect(lp.getSignInButton()).toBeVisible();
  });

  // test('')



});
