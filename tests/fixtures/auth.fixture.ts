import { test as base } from "@playwright/test";
import { UserFactory } from "../../utils/userFactory";
import { Endpoints } from "../../utils/endpoints";

type AuthFixtures = {
  token: string;
  authenticatedPage: any;
};

export const test = base.extend<AuthFixtures>({
  token: async ({ request }, use) => {
    const user = UserFactory.realUser();

    const response = await request.post(
      `${process.env.API_URL}${Endpoints.login}`,
      {
        data: {
          user: {
            email: user.email,
            password: user.password,
          },
        },
      }
    );

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
    await page.goto("https://conduit.bondaracademy.com");

    await use(page);
  },
});

export const expect = test.expect;
