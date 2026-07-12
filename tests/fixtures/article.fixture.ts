import { APIResponse, expect } from "@playwright/test";
import { ArticleFactory } from "../../utils/articleFactory";
import { Endpoints } from "../../utils/endpoints";
import { test as base } from "../fixtures/auth.fixture";
import { Article } from "../../utils/interfaces/article";
import { createArticleRequest } from "../../utils/api/article.app";

type ArticleFixtures = {
  createdArticleByApi: APIResponse;
  articleObject: Article;
};

export const test = base.extend<ArticleFixtures>({
  articleObject: async ({ browserName }, use) => {
    await use(ArticleFactory.multipleTagsArticle(browserName, true));
  },
  createdArticleByApi: async ({ request, token, articleObject }, use) => {
    const articleResponse = await createArticleRequest(
      request,
      articleObject,
      token
    );
    expect(articleResponse.status()).toBe(201);
    await use(articleResponse);
  },
});
