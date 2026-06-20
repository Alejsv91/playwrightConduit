import { APIRequestContext } from "@playwright/test";
import { User } from "../user";

export async function postLoginRequest(
  user: User,
  request: APIRequestContext,
  url: string
) {
  return request.post(url, {
    data: { user: { email: user.email, password: user.password } },
  });
}
