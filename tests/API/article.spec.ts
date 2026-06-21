import { test } from "../fixtures/auth.fixture";
import { expect } from "@playwright/test";
import { Endpoints } from "../../utils/endpoints";

test.describe("", async () => {
  test("Creating article by API", async ({ token, request }) => {
    const tagList = ['api', 'automation'];
    const articleResponse = await request.post(
        `${process.env.API_URL}${Endpoints.articles()}`,
        {
          data: {
            article: {
              title: `title test from API ${Date.now()}`,
              description: `Descript from API from browser ${Date.now()}`,
              body: `Body from API from browser ${Date.now()}`,
              tagList: tagList,
            },
          },
          headers: {
            authorization: `Token ${token}`,
          },
        }
      );
    expect(articleResponse.status()).toBe(201);

    // const body = await articleResponse.json();
    // body.article.tagList.map((tag: string, index) => {
    //     expect(tag).toContain(tagList[index]);
    // })
  });
});
