import { Request, Response } from "express";
import { HTTP_STATUS, MESSAGES } from "../constants/constants";
import AdminService from "../services/AdminService";

class AdminController {
  async fetchServerStatuses(_req: Request, res: Response) {
    const servers = await AdminService.fetchServerStatuses();
    res.status(HTTP_STATUS.OK).json({ servers });
  }

  async fetchServerDetails(_req: Request, res: Response) {
    const servers = await AdminService.fetchServerDetails();
    res.status(HTTP_STATUS.OK).json({ servers });
  }

  async updateExternalServer(req: Request, res: Response) {
    const { id } = req.params;
    const updated = await AdminService.updateExternalServer(id, req.body);
    if (!updated) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: MESSAGES.SERVER_NOT_FOUND });
      return;
    }
    res
      .status(HTTP_STATUS.OK)
      .json({ message: MESSAGES.SERVER_UPDATED, server: updated });
  }

  async createCategory(req: Request, res: Response) {
    const { name, keywords } = req.body;
    if (!name?.trim()) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: MESSAGES.CATEGORY_REQUIRED });
      return;
    }

    try {
      const category = await AdminService.createCategory(name, keywords);
      res
        .status(HTTP_STATUS.CREATED)
        .json({ message: MESSAGES.CATEGORY_CREATED, category });
    } catch (err: any) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Failed to create category" });
    }
  }

  async getSettings(_req: Request, res: Response) {
    const settings = await AdminService.getSettings();
    res.json({ settings });
  }

  async updateSettings(req: Request, res: Response) {
    const updated = await AdminService.updateSettings(req.body);
    res.json({ message: "Settings updated", settings: updated });
  }

  async getReportedArticles(_req: Request, res: Response) {
    try {
      const articles = await AdminService.getReportedArticles();
      res
        .status(HTTP_STATUS.OK)
        .json({ message: "Reported articles fetched successfully", articles });
    } catch (err) {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: "Failed to fetch reported articles", error: err });
    }
  }

  async hideArticle(req: Request, res: Response) {
    try {
      const { articleId } = req.params;
      const updated = await AdminService.hideArticle(articleId);
      if (!updated) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Article not found" });
        return;
      }
      res
        .status(HTTP_STATUS.OK)
        .json({ message: "Article hidden successfully", article: updated });
    } catch (err) {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: "Failed to hide article", error: err });
    }
  }

  async getAllCategories(_req: Request, res: Response) {
    try {
      const categories = await AdminService.getAllCategories();
      res.json({ categories });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch categories", error: err });
    }
  }

  async hideCategories(req: Request, res: Response) {
    try {
      const { categories } = req.body;
      if (!Array.isArray(categories)) {
        res.status(400).json({ message: "Categories must be an array" });
        return;
      }
      const settings = await AdminService.hideCategories(categories);
      res.json({
        message: "Blocked categories updated successfully",
        blockedCategories: settings.blockedCategories,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to update blocked categories", error: err });
    }
  }

  async getBlockedKeywords(_req: Request, res: Response) {
    try {
      const blockedKeywords = await AdminService.getBlockedKeywords();
      res.status(200).json({ blockedKeywords });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to fetch blocked keywords", error: err });
    }
  }

  async updateBlockedKeywords(req: Request, res: Response) {
    try {
      const { keywords } = req.body;
      if (!Array.isArray(keywords)) {
        res.status(400).json({ message: "Keywords must be an array" });
        return;
      }
      const blockedKeywords = await AdminService.updateBlockedKeywords(
        keywords
      );
      res.status(200).json({
        message: "Blocked keywords updated successfully",
        blockedKeywords,
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to update blocked keywords", error: err });
    }
  }

  async checkAndUpdateServerStatuses(_req: Request, res: Response) {
    try {
      const result = await AdminService.checkAndUpdateServerStatuses();
      res.status(HTTP_STATUS.OK).json(result);
    } catch (err) {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: "Failed to update server statuses", error: err });
    }
  }
}

export default new AdminController();
