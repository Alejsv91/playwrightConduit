import { Article } from "./article";

export const articleFactory = {
  multipleTagsArticle: (browserName: string, isApiTest: boolean): Article => {
    return {
      title: `Test from ${isApiTest ? 'API' : 'UI'} from ${browserName} ${Date.now()}`,
      description: 'Automation with playwright',
      body: `Description test from ${isApiTest ? 'API' : 'UI'}`,
      tagList: [`${isApiTest ? 'API' : 'UI'}`, 'automation', 'Test'].sort()
    };
  }
};
