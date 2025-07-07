import { Request, Response } from "express";
import ExternalServer from "../models/ExternalServer";
import Category from "../models/Category";
import { MESSAGES, STATUS } from "../constants/constants";
import { HTTP_STATUS } from "../constants/constants";
import AdminSettings from "../models/AdminSettings";
import News from "../models/News";

class AdminController {
  async fetchServerStatuses(_req: Request, res: Response) {
    const servers = await ExternalServer.find().select(
      "name status lastChecked"
    );
    res.status(HTTP_STATUS.OK).json({ servers });
    return;
  }

  async fetchServerDetails(_req: Request, res: Response) {
    const servers = await ExternalServer.find();
    res.status(HTTP_STATUS.OK).json({ servers });
    return;
  }

  async updateExternalServer(req: Request, res: Response) {
    const { id } = req.params;
    const { name, baseUrl, status } = req.body;

    const updatedServer = await ExternalServer.findByIdAndUpdate(
      id,
      { name, baseUrl, status },
      { new: true }
    );

    if (!updatedServer) {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: MESSAGES.SERVER_NOT_FOUND });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: MESSAGES.SERVER_UPDATED,
      server: updatedServer,
    });
    return;
  }

  async createCategory(req: Request, res: Response) {
    const { name, keywords = [] } = req.body;

    if (!name?.trim()) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: MESSAGES.CATEGORY_REQUIRED });
      return;
    }

    const normalized = name.trim().toLowerCase();
    const existingCategory = await Category.findOne({ name: normalized });

    if (existingCategory) {
      res
        .status(HTTP_STATUS.CONFLICT)
        .json({ message: MESSAGES.CATEGORY_EXISTS });
      return;
    }

    const newCategory = await Category.create({
      name: normalized,
      keywords,
    });

    res.status(HTTP_STATUS.CREATED).json({
      message: MESSAGES.CATEGORY_CREATED,
      category: newCategory,
    });
    return;
  }

  async getSettings(_req: Request, res: Response) {
    const settings = await AdminSettings.findOne();
    res.json({ settings });
  }

  async updateSettings(req: Request, res: Response) {
    const { blockedCategories, blockedKeywords, reportThreshold } = req.body;
    const updated = await AdminSettings.findOneAndUpdate(
      {},
      { blockedCategories, blockedKeywords, reportThreshold },
      { new: true, upsert: true }
    );
    res.json({ message: "Settings updated", settings: updated });
  }

  async getReportedArticles(req: Request, res: Response) {
    try {
      console.log("callecd");
      const reportedArticles = await News.find({
        reports: { $gt: 0 },
        isHidden: false,
      }).sort({ reportCount: -1 });
      console.log(reportedArticles);

      res.status(HTTP_STATUS.OK).json({
        message: "Reported articles fetched successfully",
        articles: reportedArticles,
      });
    } catch (error) {
      res.status(HTTP_STATUS.SERVER_ERROR).json({
        message: "Failed to fetch reported articles",
        error,
      });
    }
  }

  async hideArticle(req: Request, res: Response) {
    try {
      const { articleId } = req.params;

      const updated = await News.findByIdAndUpdate(
        articleId,
        { isHidden: true },
        { new: true }
      );

      if (!updated) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
          message: "Article not found",
        });
        return;
      }

      res.status(HTTP_STATUS.OK).json({
        message: "Article hidden successfully",
        article: updated,
      });
    } catch (error) {
      res.status(HTTP_STATUS.SERVER_ERROR).json({
        message: "Failed to hide article",
        error,
      });
    }
  }

  async seedExternalServers(_req: Request, res: Response) {
    await ExternalServer.deleteMany();

    await ExternalServer.insertMany([
      {
        name: "News API Server",
        baseUrl: "https://newsapi.org/v2",
        status: STATUS.ACTIVE,
        lastChecked: new Date(),
      },
      {
        name: "The News API",
        baseUrl: "https://api.thenewsapi.com/v1",
        status: STATUS.INACTIVE,
        lastChecked: new Date(),
      },
    ]);

    res.status(HTTP_STATUS.CREATED).json({ message: MESSAGES.SERVER_SEEDED });
    return;
  }

  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await News.distinct("category");
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories", error });
    }
  }

  async hideCategories(req: Request, res: Response) {
    try {
      const { categories } = req.body;

      if (!Array.isArray(categories)) {
        res.status(400).json({ message: "Categories must be an array" });
        return;
      }

      let update;

      if (categories.length > 0) {
        update = { $addToSet: { blockedCategories: { $each: categories } } };
      } else {
        update = { $set: { blockedCategories: [] } };
      }

      const settings = await AdminSettings.findOneAndUpdate({}, update, {
        upsert: true,
        new: true,
      });

      res.json({
        message: "Blocked categories updated successfully",
        blockedCategories: settings.blockedCategories,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to update blocked categories", error });
    }
  }

  async getBlockedKeywords(req: Request, res: Response) {
    try {
      const settings = await AdminSettings.findOne();
      const blockedKeywords = settings?.blockedKeywords || [];
      res.status(200).json({ blockedKeywords });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch blocked keywords",
        error,
      });
    }
  }

  async updateBlockedKeywords(req: Request, res: Response) {
    try {
      const { keywords } = req.body;

      if (!Array.isArray(keywords)) {
         res.status(400).json({ message: "Keywords must be an array" });
         return;
      }

      const updatedSettings = await AdminSettings.findOneAndUpdate(
        {},
        { blockedKeywords: keywords },
        { new: true, upsert: true }
      );

      res.status(200).json({
        message: "Blocked keywords updated successfully",
        blockedKeywords: updatedSettings.blockedKeywords,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update blocked keywords",
        error,
      });
    }
  }
}

export default new AdminController();
