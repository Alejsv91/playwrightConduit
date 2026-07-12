import { Article, ArticlePutRequest, ArticleResponse } from "./interfaces/article";

export const ArticleFactory = {
  updatedArticle:(currentArticle: ArticleResponse): ArticlePutRequest => {
    return {...currentArticle,
      title: `${currentArticle.title} updated`,
          description: "Updated Description",
          body: "Updated Body",
          tagList: ["API", "Test", "Updated"]
    }
  },
  
  multipleTagsArticle: (browserName: string, isApiTest: boolean): Article => {
    return {
      title: `Test from ${isApiTest ? 'API' : 'UI'} from ${browserName} ${Date.now()}`,
      description: 'Automation with playwright',
      body: `Description test from ${isApiTest ? 'API' : 'UI'}`,
      tagList: [`${isApiTest ? 'API' : 'UI'}`, 'automation', 'Test'].sort()
    };
  },

  standardArtcile: (browserName: string, isApiTest: boolean): Article => {
    return {
      title: `Test from ${isApiTest ? 'API' : 'UI'} from ${browserName} ${Date.now()}`,
      description: 'Automation with playwright',
      body: `Description test from ${isApiTest ? 'API' : 'UI'}`,
      tagList: [`${isApiTest ? 'API' : 'UI'}`]
    }
  }
};




