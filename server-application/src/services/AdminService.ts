import ExternalServer from "../models/ExternalServer";
import Category from "../models/Category";
import { MESSAGES, STATUS } from "../constants/constants";
import AdminSettings from "../models/AdminSettings";
import News from "../models/News";
import axios from "axios";

class AdminService {
  async fetchServerStatuses() {
    return await ExternalServer.find().select("name status lastChecked");
  }

  async fetchServerDetails() {
    return await ExternalServer.find();
  }

  async updateExternalServer(id: string, data: any) {
    return await ExternalServer.findByIdAndUpdate(id, data, { new: true });
  }

  async createCategory(name: string, keywords: string[] = []) {
    const normalized = name.trim().toLowerCase();
    const existing = await Category.findOne({ name: normalized });
    if (existing) throw { status: 409, message: MESSAGES.CATEGORY_EXISTS };

    return await Category.create({ name: normalized, keywords });
  }

  async getSettings() {
    return await AdminSettings.findOne();
  }

  async updateSettings(data: any) {
    return await AdminSettings.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
  }

  async getReportedArticles() {
    return await News.find({
      reports: { $gt: 0 },
      isHidden: false,
    }).sort({ reportCount: -1 });
  }

  async hideArticle(articleId: string) {
    return await News.findByIdAndUpdate(
      articleId,
      { isHidden: true },
      { new: true }
    );
  }

  async getAllCategories() {
    return await News.distinct("category");
  }

  async hideCategories(categories: string[]) {
    const update =
      categories.length > 0
        ? { $addToSet: { blockedCategories: { $each: categories } } }
        : { $set: { blockedCategories: [] } };

    return await AdminSettings.findOneAndUpdate({}, update, {
      upsert: true,
      new: true,
    });
  }

  async getBlockedKeywords() {
    const settings = await AdminSettings.findOne();
    return settings?.blockedKeywords || [];
  }

  async updateBlockedKeywords(keywords: string[]) {
    const updated = await AdminSettings.findOneAndUpdate(
      {},
      { blockedKeywords: keywords },
      { new: true, upsert: true }
    );
    return updated.blockedKeywords;
  }

  async checkAndUpdateServerStatuses() {
    const servers = await ExternalServer.find();

    for (const server of servers) {
      try {
        const healthUrl = `${server.baseUrl}/health`;
        const response = await axios.get(healthUrl, { timeout: 5000 });
        server.status =
          response.status === 200 ? STATUS.ACTIVE : STATUS.INACTIVE;
      } catch (error: any) {
        console.error(`Server ${server.name} is inactive:`, error.message);
        server.status = STATUS.INACTIVE;
      }

      server.lastChecked = new Date();
      await server.save();
    }

    return { message: "Server statuses updated successfully" };
  }
}

export default new AdminService();
