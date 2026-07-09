import { APIResponse } from "@playwright/test";
import { ArticleFactory } from "../../utils/articleFactory";
import { Endpoints } from "../../utils/endpoints";
import { test as base } from "../fixtures/auth.fixture";
import { Article } from "../../utils/interfaces/article";

type ArticleFixtures = {
  createdArticleByApi: APIResponse;
  articleObject: Article;
};

export const test = base.extend<ArticleFixtures>({
    articleObject: async ({browserName}, use) =>{
        await use(ArticleFactory.multipleTagsArticle(browserName, true));
    },
  createdArticleByApi: async ({ request, token, articleObject }, use) => {
    const articleURL = `${process.env.API_URL}${Endpoints.articles()}`;

    const articleResponse = await request.post(articleURL, {
      data: { article: articleObject },
      headers: { authorization: `Token ${token}` },
    });

    await use(articleResponse);
  },
});
