import { expect, test, APIResponse } from "@playwright/test";
import { UserFactory } from "../../utils/userFactory";
import { Endpoints } from "../../utils/endpoints";
import { postLoginRequest } from "../../utils/api/auth.app";

test.describe("API Login test", () => {
  const realUser = UserFactory.realUser();
  const fakeUser = UserFactory.fakeUser();

  test(
    "Adding real username but no password",
    { tag: ["@negative scenario", "@api"] },
    async ({ request }) => {
      const updatedUser = UserFactory.realUser();
      updatedUser.password = "";
      const response = await postLoginRequest(
        updatedUser,
        request
      );

      expect(response.status()).not.toEqual(200);
      const body = await response.json();
      expect(body.errors).toHaveProperty("password");
      expect(body.errors["password"][0]).toBe("can't be blank");
    }
  );

  test(
    "Adding empty username and empty password",
    { tag: ["@negative scenario", "@api"] },
    async ({ request }) => {
      const updatedUser = UserFactory.realUser();
      updatedUser.email = "";
      updatedUser.password = "";
      const response = await postLoginRequest(
        updatedUser,
        request
      );

      expect(response.status()).not.toEqual(200);
      const body = await response.json();
      expect(body.errors).toHaveProperty("email");
      expect(body.errors["email"][0]).toBe("can't be blank");
    }
  );

  test(
    "Adding fake email but real password",
    { tag: ["@negative scenario", "@api"] },
    async ({ request }) => {
      const updatedUser = UserFactory.realUser();
      updatedUser.email = "fake@fake.com";
      const response = await postLoginRequest(
        updatedUser,
        request
      );

      ExpectWhenCredsAreInvalid(response);
    }
  );

  test(
    "Adding real email and fake password",
    { tag: ["@negative scenario", "@api"] },
    async ({ request }) => {
      const updatedUser = UserFactory.realUser();
      updatedUser.password = "fakePassword123?";
      const response = await postLoginRequest(
        updatedUser,
        request
      );

      ExpectWhenCredsAreInvalid(response);
    }
  );

  test(
    "Adding fake username and password",
    { tag: ["@negative scenario", "@api"] },
    async ({ request }) => {
      const response = await postLoginRequest(
        fakeUser,
        request
      );
      ExpectWhenCredsAreInvalid(response);
    }
  );

  test(
    "Login with expected credentials",
    { tag: ["@api", "@positive scenario"] },
    async ({ request }) => {
      const response = await postLoginRequest(
        realUser,
        request
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
});
