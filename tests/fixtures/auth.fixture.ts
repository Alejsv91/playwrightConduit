import { test as base, Page } from "@playwright/test";
import { UserFactory } from "../../utils/userFactory";
import { Endpoints } from "../../utils/endpoints";
import { postLoginRequest } from "../../utils/api/auth.app";

type AuthFixtures = {
  token: string;
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  token: async ({ request }, use) => {
    if (!process.env.JWT_TOKEN) {
      const user = UserFactory.realUser();
      const response = await postLoginRequest(user, request);
      const body = await response.json();

      process.env.JWT_TOKEN = body.user.token;
    }
    await use(process.env.JWT_TOKEN!);
  },

  authenticatedPage: async ({ browser, token }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.addInitScript((jwt) => {
      window.localStorage.setItem("jwtToken", jwt);
    }, token);
    await page.goto("/");
    await page.waitForResponse(
      `${process.env.API_URL}${Endpoints.articles(10, 0)}`
    );

    await use(page);
  },
});

export const expect = test.expect;
