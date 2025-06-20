import { Request, Response } from "express";
import SavedArticle from "../models/SavedArticle";
import News from "../models/News";
import { HTTP_STATUS, MESSAGES } from "../constants/constants";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

class SavedArticleController {
  async saveArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { articleId } = req.body;
    const userId = req.user?.id;

    try {
      const article = await News.findById(articleId);
      if (!article) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: MESSAGES.ARTICLE_NOT_FOUND });
        return;
      }

      const exists = await SavedArticle.findOne({ userId, articleId });
      if (exists) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: MESSAGES.ARTICLE_ALREADY_SAVED });
        return;
      }

      await SavedArticle.create({ userId, articleId });
      res.status(HTTP_STATUS.CREATED).json({ message: MESSAGES.ARTICLE_SAVED });
    } catch (err) {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: MESSAGES.ARTICLE_SAVE_ERROR, error: err });
    }
  }

  async deleteSavedArticle(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    const { articleId } = req.params;
    const userId = req.user?.id;

    try {
      const deleted = await SavedArticle.findOneAndDelete({
        userId,
        articleId,
      });

      if (!deleted) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: MESSAGES.SAVED_NOT_FOUND });
        return;
      }

      res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ARTICLE_DELETED });
    } catch (err) {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: MESSAGES.ARTICLE_DELETE_ERROR, error: err });
    }
  }

  async getSavedArticles(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    const userId = req.user?.id;

    try {
      const saved = await SavedArticle.find({ userId }).populate("articleId");
      const articles = saved.map((item) => item.articleId);
      res.status(HTTP_STATUS.OK).json({ savedArticles: articles });
    } catch (err) {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: MESSAGES.FETCH_SAVED_ERROR, error: err });
    }
  }
}

export default new SavedArticleController();
