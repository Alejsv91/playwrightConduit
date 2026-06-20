import { expect, test, APIRequestContext, APIResponse } from "@playwright/test";
import { UserFactory } from "../../utils/userFactory";
import { Endpoints } from "../../utils/endpoints";
import { User } from "../../utils/user";

test.describe("API Login test", () => {
  const realUser = UserFactory.realUser();
  const fakeUser = UserFactory.fakeUser();
  const loginApiUrl = `${process.env.API_URL}${Endpoints.login}`;

  test("Adding fake email but real password", {tag: ['@negative scenario', '@api']}, async({request})=>{
    const updatedUser = UserFactory.realUser();
      updatedUser.email = "fake@fake.com";
      const response = await createApiLoginRequest(
        updatedUser,
        request,
        loginApiUrl
      );

      ExpectWhenCredsAreInvalid(response);
  })

  test(
    "Adding real email and fake password",
    { tag: ["@negative scenario", "@api"] },
    async ({ request }) => {
      const updatedUser = UserFactory.realUser();
      updatedUser.password = "fakePassword123?";
      const response = await createApiLoginRequest(
        updatedUser,
        request,
        loginApiUrl
      );

      ExpectWhenCredsAreInvalid(response);
    }
  );

  test(
    "Adding fake username and password",
    { tag: ["@negative scenario"] },
    async ({ request }) => {
      const response = await createApiLoginRequest(
        fakeUser,
        request,
        loginApiUrl
      );
      ExpectWhenCredsAreInvalid(response);
    }
  );

  test(
    "Login with expected credentials",
    { tag: ["@API", "@Positive"] },
    async ({ request }) => {
      const response = await createApiLoginRequest(
        realUser,
        request,
        loginApiUrl
      );

      expect(response.status()).toBe(200);

      const body = await response.json();

      expect(body.user).toHaveProperty("token");

      const token = body.user.token;
      
      expect(token).not.toBeNull();
      expect(body.user.username).toEqual(realUser.username);
      expect(body.user.image).toEqual(realUser.image);
      expect(body.user.bio).toBeNull();
    }
  );

  async function ExpectWhenCredsAreInvalid(response: APIResponse) {
    expect(response.status()).not.toEqual(200);
    const body = await response.json();
    expect(body.errors).toHaveProperty("email or password");
    expect(body.errors["email or password"][0]).toBe("is invalid");
  }

  async function createApiLoginRequest(
    user: User,
    request: APIRequestContext,
    url: string
  ) {
    return request.post(url, {
      data: { user: { email: user.email, password: user.password } },
    });
  }
});
