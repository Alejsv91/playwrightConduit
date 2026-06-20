import { APIRequestContext } from "@playwright/test";
import { User } from "../user";
import { Endpoints } from "../endpoints";

export async function postLoginRequest(
  user: User,
  request: APIRequestContext
) {
  const loginApiUrl = `${process.env.API_URL}${Endpoints.login}`;
  return request.post(loginApiUrl, {
    data: { user: { email: user.email, password: user.password } },
  });
}
