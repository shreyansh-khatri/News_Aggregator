import { Request, Response } from "express";
import { HTTP_STATUS, MESSAGES } from "../constants/constants";
import SavedArticleService from "../services/SavedArticleService";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

class SavedArticleController {
  async saveArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { articleId } = req.body;
    const userId = req.user?.id;

    try {
      const message = await SavedArticleService.saveArticleForUser(
        userId!,
        articleId
      );
      res.status(HTTP_STATUS.CREATED).json({ message });
    } catch (err: any) {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({
          message: err.message || MESSAGES.ARTICLE_SAVE_ERROR,
          error: err,
        });
    }
  }

  async deleteSavedArticle(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    const { articleId } = req.params;
    const userId = req.user?.id;

    try {
      const message = await SavedArticleService.deleteSavedArticleForUser(
        userId!,
        articleId
      );
      res.status(HTTP_STATUS.OK).json({ message });
    } catch (err: any) {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({
          message: err.message || MESSAGES.ARTICLE_DELETE_ERROR,
          error: err,
        });
    }
  }

  async getSavedArticles(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    const userId = req.user?.id;

    try {
      const articles = await SavedArticleService.getSavedArticlesForUser(
        userId!
      );
      res.status(HTTP_STATUS.OK).json({ savedArticles: articles });
    } catch (err) {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: MESSAGES.FETCH_SAVED_ERROR, error: err });
    }
  }
}

export default new SavedArticleController();
