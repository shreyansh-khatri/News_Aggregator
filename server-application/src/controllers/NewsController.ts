import { Request, Response } from "express";
import { AuthenticatedRequest } from "../utils/authMiddleware";
import NewsServices from "../services/NewsServices";
import { HTTP_STATUS } from "../constants/constants";

class NewsController {
  async searchNews(req: Request, res: Response) {
    try {
      const { keyword, start, end } = req.query;
      const results = await NewsServices.searchNews(
        keyword as string,
        start as string,
        end as string
      );
      res.json({ results });
    } catch (err) {
      res.status(500).json({ message: "Failed to search news", error: err });
    }
  }

  async getHeadlines(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const headlines = await NewsServices.getHeadlines(userId, req.query);
      res.json({ headlines });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch headlines", error: err });
    }
  }

  async reportArticle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await NewsServices.reportArticle(id);
      res.json(result);
    } catch (err: any) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Report failed" });
    }
  }

  async fetchAndStoreByCategory(req: Request, res: Response) {
    try {
      const result = await NewsServices.fetchAndStore();
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: "Failed to fetch and store articles", error });
    }
  }

  async likeArticle(req: AuthenticatedRequest, res: Response) {
    try {
      const { articleId } = req.params;
      const userId = req.user!.id;
      const result = await NewsServices.likeArticle(articleId, userId);
      res.json(result);
    } catch (err: any) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Like failed" });
    }
  }

  async dislikeArticle(req: AuthenticatedRequest, res: Response) {
    try {
      const { articleId } = req.params;
      const userId = req.user!.id;
      const result = await NewsServices.dislikeArticle(articleId, userId);
      res.json(result);
    } catch (err: any) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Dislike failed" });
    }
  }
}

export default new NewsController();
