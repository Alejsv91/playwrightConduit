import { Author } from "./author";

export interface Article{
    title: string;
    description: string;
    body: string;
    tagList: Array<string>;
}

export interface ArticleResponse extends Article{
    slug: string;
    createdAt: string;
    updatedAt: string;
    favorited: boolean;
    favoritesCount: number;
    author: Author;
}

export interface ArticlePutRequest extends Article{
    slug: string;
}