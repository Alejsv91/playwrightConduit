import { APIRequestContext } from "@playwright/test";
import { Endpoints } from "../endpoints";
import { Article, ArticlePutRequest } from "../interfaces/article";

const articleURL = `${process.env.API_URL}${Endpoints.articles()}`;

export async function updateArticleRequest(
  request: APIRequestContext,
  updatedArticle: ArticlePutRequest,
  token: string
) {
  return request.put(`${articleURL}${updatedArticle.slug}`, {
    data: { article: updatedArticle },
    headers: { authorization: `Token ${token}` },
  });
}

export async function createArticleRequest(
  request: APIRequestContext,
  articleObject: Article,
  token: string
) {
  return request.post(articleURL, {
    data: { article: articleObject },
    headers: { authorization: `Token ${token}` },
  });
}

export async function getArticleRequest(
  request: APIRequestContext,
  slug: string
){
  return request.get(`${articleURL}${slug}`);
}

export async function deleteArticleRequest(
  request: APIRequestContext,
  slug: string,
  token: string
){
  return request.delete(`${articleURL}${slug}`, {
    headers: { authorization: `Token ${token}` },
  });
}
