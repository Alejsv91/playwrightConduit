import { test } from "../fixtures/auth.fixture";
import { expect } from "@playwright/test";
import { Endpoints } from "../../utils/endpoints";
import { articleFactory } from "../../utils/articleFactory";
import { UserFactory } from "../../utils/userFactory";

test.describe("", async () => {
  let testArticle;
  let realUser = UserFactory.realUser();

  test("Creating article by API", async ({ token, request, browserName }) => {
    testArticle = articleFactory.multipleTagsArticle(browserName, true);
    realUser.following = false;

    const articleResponse = await request.post(
      `${process.env.API_URL}${Endpoints.articles()}`,
      {
        data: {
          article: {
            title: testArticle.title,
            description: testArticle.description,
            body: testArticle.body,
            tagList: testArticle.tagList,
          },
        },
        headers: {
          authorization: `Token ${token}`,
        },
      }
    );
    expect(articleResponse.status()).toBe(201);

    const body = await articleResponse.json();
    const expectedSlug = testArticle.title.replace(/ /g, "-");

    expect(body.article.title).toEqual(testArticle.title);
    expect(body.article.description).toEqual(testArticle.description);
    expect(body.article.body).toEqual(testArticle.body);
    expect(body.article.tagList.sort()).toEqual(testArticle.tagList);
    expect(body.article.slug).toContain(expectedSlug);
    expect(body.createdAt).not.toBeNull();
    expect(body.article.updatedAt).toEqual(body.article.createdAt);
    expect(body.article.favorited).toEqual(false);
    expect(body.article.favoritesCount).toEqual(0);
    expect(body.article.author.username).toEqual(realUser.username);
    expect(body.article.author.bio).toEqual(realUser.bio);
    expect(body.article.author.image).toEqual(realUser.image);
    expect(body.article.author.following).toEqual(realUser.following);
  });
});
