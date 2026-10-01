import EditArticle from "../pages/editArticle.page";
import { Article } from "../utils/interfaces/article";
import { expect } from "@playwright/test";

export class EditArticleAssertions {
  static async validateArticleInfo(page: EditArticle, article: Article) {
    await expect(page.getTitleTextBox()).toHaveValue(article.title);
    await expect(page.getAboutTextBox()).toHaveValue(article.description);
    await expect(page.getDescriptionTextBox()).toHaveValue(article.body);
  }

  static async validateFormIsEnable(page: EditArticle) {
    await expect(page.getTitleTextBox()).toBeEnabled();
    await expect(page.getAboutTextBox()).toBeEnabled();
    await expect(page.getDescriptionTextBox()).toBeEnabled();
  }
  
}
