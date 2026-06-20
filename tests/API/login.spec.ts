import { expect, test } from "@playwright/test";
import { UserFactory } from "../../utils/userFactory";
import { Endpoints } from "../../utils/endpoints";

test.describe("UI Login test", () => {
  const realUser = UserFactory.realUser();
  const fakeUser = UserFactory.fakeUser();
  const apiUrl = process.env.API_URL;

  test("Login with expected credentials", {tag: ['@API', '@Positive']}, async ({ request }) => {
    const loginApiUrl = `${apiUrl}${Endpoints.login}`;
    console.log(`API Login is:${loginApiUrl}`);
    console.log(`Username is: ${realUser.email} and password is ${realUser.password}`);
    const response = await request.post(
      loginApiUrl,

      {
        data: {
          user: { email: realUser.email, password: realUser.password },
        },
      }
    );
    //405 - Method Not Allowed (We found the method, but the action is not allowed)
    //404 - Server don't found the URL
    //403 - Server knows how I am, But I don't have permissions

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.user).toHaveProperty("token");

    const token = body.user.token;
    if (response.status() !== 200) {
      const errorBody = await response.json();
      console.error(
        `Login failed with status ${response.status()}:`,
        errorBody
      );
    }
    expect(response.status()).toBe(200);
    expect(token).not.toBeNull();
    expect(body.user.username).toEqual(realUser.username);
  });
});
