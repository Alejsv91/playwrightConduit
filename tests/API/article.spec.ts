import { test } from "../fixtures/article.fixture";
import { expect } from "@playwright/test";
import { Endpoints } from "../../utils/endpoints";
import { ArticleFactory } from "../../utils/articleFactory";
import { UserFactory } from "../../utils/userFactory";

test.describe("API testing for Articles", async () => {
  let testArticle;
  let realUser = UserFactory.realUser();
  let createdBodyResponse;
  let articleURL = `${process.env.API_URL}${Endpoints.articles()}`;

  test(
    "Creating article by API",
    { tag: ["@api", "@positive"] },
    async ({ createdArticleByApi, articleObject }) => {
      testArticle = articleObject;
      realUser.following = false;

      const articleResponse = createdArticleByApi;
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

      createdBodyResponse = body;
    }
  );

  test(
    "Read the created article",
    { tag: ["@api", "@positive scenario"] },
    async ({ request, token, createdArticleByApi }) => {
      const createdArticle = createdArticleByApi;
      const bodyResponse = await createdArticle.json();
      const slugId = bodyResponse.article.slug;
      expect(createdArticle.status()).toBe(201);

      const getArticleResponse = await request.get(`${articleURL}${slugId}`, {
        headers: {
          authorization: `Token ${token}`,
        },
      });
      expect(getArticleResponse.status()).toBe(200);
    }
  );
});
