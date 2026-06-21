import { test as base, Page } from "@playwright/test";
import { UserFactory } from "../../utils/userFactory";
import { Endpoints } from "../../utils/endpoints";
import { postLoginRequest } from "../../utils/api/auth.app"

type AuthFixtures = {
  token: string;
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  token: async ({ request }, use) => {
    const user = UserFactory.realUser();

    const response = await postLoginRequest(user, request);

    const body = await response.json();
    await use(body.user.token);
  },

  authenticatedPage: async ({ browser, token }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Inyectar EXACTAMENTE lo que Conduit usa
    await page.addInitScript((jwt) => {
      window.localStorage.setItem("jwtToken", jwt);
    }, token);

    // Abrir la app ya autenticado
    await page.goto("/");
    await page.waitForResponse(`${process.env.API_URL}${Endpoints.articles()}`);

    await use(page);
  },
});

export const expect = test.expect;
