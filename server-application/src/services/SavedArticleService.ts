import SavedArticle from "../models/SavedArticle";
import News from "../models/News";
import { MESSAGES } from "../constants/constants";

class SavedArticleService {
  public async saveArticleForUser(userId: string, articleId: string) {
    const article = await News.findById(articleId);
    if (!article) {
      throw new Error(MESSAGES.ARTICLE_NOT_FOUND);
    }

    const exists = await SavedArticle.findOne({ userId, articleId });
    if (exists) {
      throw new Error(MESSAGES.ARTICLE_ALREADY_SAVED);
    }

    await SavedArticle.create({ userId, articleId });
    return MESSAGES.ARTICLE_SAVED;
  }

  public async deleteSavedArticleForUser(userId: string, articleId: string) {
    const deleted = await SavedArticle.findOneAndDelete({
      userId,
      articleId,
    });

    if (!deleted) {
      throw new Error(MESSAGES.SAVED_NOT_FOUND);
    }

    return MESSAGES.ARTICLE_DELETED;
  }

  public async getSavedArticlesForUser(userId: string) {
    const saved = await SavedArticle.find({ userId }).populate("articleId");
    const articles = saved.map((item) => item.articleId);
    return articles;
  }
}

export default new SavedArticleService();
