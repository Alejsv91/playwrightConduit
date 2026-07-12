import { test } from "../fixtures/article.fixture";
import { expect } from "@playwright/test";
import { UserFactory } from "../../utils/userFactory";
import { ArticleResponse, Article, ArticlePutRequest } from "../../utils/interfaces/article";
import { Author } from "../../utils/interfaces/author";
import { ArticleFactory } from "../../utils/articleFactory";
import {
  updateArticleRequest,
  getArticleRequest,
  deleteArticleRequest,
} from "../../utils/api/article.app";

test.describe("API testing for Articles", async () => {
  let testArticle: Article;
  let realUser = UserFactory.realUser();
  let createdBodyResponse: {};

  test(
    "Creating article by API",
    { tag: ["@api", "@positive"] },
    async ({ createdArticleByApi, articleObject }) => {
      testArticle = articleObject;
      realUser.following = false;

      const articleResponse = createdArticleByApi;
      const body = await articleResponse.json();
      const expectedSlug = testArticle.title.replace(/ /g, "-");

      expect(body.article.slug).toContain(expectedSlug);
      expect(body.createdAt).not.toBeNull();
      expect(body.article.updatedAt).toEqual(body.article.createdAt);
      expect(body.article.favorited).toEqual(false);
      expect(body.article.favoritesCount).toEqual(0);
      validateAuthor(body.article.author, { ...realUser } as Author);

      createdBodyResponse = body;
    }
  );

  test(
    "Read the created article",
    { tag: ["@api", "@positive"] },
    async ({ request, createdArticleByApi }) => {
      const createdArticle = createdArticleByApi;
      const bodyResponse = await createdArticle.json();
      const slugId = bodyResponse.article.slug;
      expect(createdArticle.status()).toBe(201);

      const getArticleResponse = await getArticleRequest(request, slugId);
      expect(getArticleResponse.status()).toBe(200);
    }
  );

  test(
    "Update article by API",
    { tag: ["@api", "@positive"] },
    async ({ createdArticleByApi, token, request }) => {
      const newArticleResponse = createdArticleByApi;
      const body = await newArticleResponse.json();
      const originalArticle: ArticleResponse = body.article;
      const updatedArticle: ArticlePutRequest =
        ArticleFactory.updatedArticle(originalArticle);
      const updateResponse = await updateArticleRequest(
        request,
        updatedArticle,
        token
      );

      expect(updateResponse.status()).toBe(200);

      const updatedBody = await updateResponse.json();
      const updatedArticleBody = updatedBody.article;

      validateArticleResponse(updatedArticleBody, updatedArticle);
      expect(updatedArticleBody.slug).not.toEqual(updatedArticle.slug);
      expect(updatedArticleBody.updatedAt).not.toEqual(
        updatedArticleBody.createdAt
      );
      expect(updatedArticleBody.favorited).toEqual(originalArticle.favorited);
      expect(updatedArticleBody.favoritesCount).toEqual(
        originalArticle.favoritesCount
      );
      validateAuthor(updatedArticleBody.author, originalArticle.author);

      const getArticleResponse = await getArticleRequest(
        request,
        updatedArticleBody.slug
      );
      expect(getArticleResponse.status()).toBe(200);
      validateArticleResponse(
        (await getArticleResponse.json()).article,
        updatedArticle
      );
    }
  );

  test(
    "Delete article by API",
    { tag: ["@api", "@positive"] },
    async ({ createdArticleByApi, request, token }) => {
      const createdArticle = createdArticleByApi;
      const bodyResponse = await createdArticle.json();
      const slugId = bodyResponse.article.slug;
      const deleteResponse = await deleteArticleRequest(request, slugId, token);
      
      expect(deleteResponse.status()).toBe(204);

      const getDeletedArticleResponse = await getArticleRequest(
        request,
        slugId
      );

      expect(getDeletedArticleResponse.status()).toBe(404);
    }
  );

  function validateAuthor(author: Author, expectedAuthor: Author) {
    expect(author.username).toEqual(expectedAuthor.username);
    expect(author.bio).toEqual(expectedAuthor.bio);
    expect(author.image).toEqual(expectedAuthor.image);
    expect(author.following).toEqual(expectedAuthor.following);
  }

  function validateArticleResponse(
    article: ArticleResponse,
    expectedArticle: Article
  ) {
    expect(article.title).toEqual(expectedArticle.title);
    expect(article.description).toEqual(expectedArticle.description);
    expect(article.body).toEqual(expectedArticle.body);
    expect(article.tagList.sort()).toEqual(expectedArticle.tagList.sort());
  }
});
