import Notification from "../models/Notifcation";
import User from "../models/User";
import News from "../models/News";
import NotificationConfig from "../models/NotificationConfig";
import sendMail from "../utils/sendMail";
import { EMAIL } from "../constants/constants";
import { Types } from "mongoose";

interface Article {
  _id: Types.ObjectId;
  title?: string | null;
  description?: string | null;
  content?: string | null;
  category?: string | null;
}

class NotificationService {
  async configureNotifications(
    userId: string,
    categories: string[],
    keywords: string[]
  ) {
    await NotificationConfig.findOneAndUpdate(
      { userId },
      { categories, keywords, updatedAt: new Date() },
      { upsert: true, new: true }
    );
  }

  async sendNotificationEmailsJob() {
    const notificationConfigs = await NotificationConfig.find().lean();

    for (const config of notificationConfigs) {
      const user = await User.findById(config.userId);
      if (!user?.email) continue;

      const { categories = [], keywords = [] } = config;

      const keywordRegex = keywords.map((k) => new RegExp(`\\b${k}\\b`, "i"));

      const categoryQuery =
        categories.length > 0 ? { category: { $in: categories } } : {};
      const keywordQuery =
        keywords.length > 0
          ? {
              $or: [
                { title: { $in: keywordRegex } },
                { description: { $in: keywordRegex } },
                { content: { $in: keywordRegex } },
              ],
            }
          : {};

      const articles = await News.find({ $or: [categoryQuery, keywordQuery] })
        .sort({ publishedAt: -1 })
        .limit(EMAIL.MAX_ARTICLES);

      if (articles.length === 0) continue;

      const htmlBody = `
        <h3>${EMAIL.DIGEST_HEADER}</h3>
        <ul>
          ${articles
            .map(
              (a) => `
            <li>
              <strong>${a.title}</strong><br/>
              ${a.description || ""}<br/>
              <a href="${a.url}">Read more</a>
            </li>`
            )
            .join("")}
        </ul>
      `;

      await sendMail({
        to: user.email,
        subject: EMAIL.SUBJECT,
        html: htmlBody,
      });
    }
  }

  async getUserNotifications(userId: string) {
    return await Notification.find({ userId, isRead: false })
      .populate("articleId")
      .sort({ createdAt: -1 });
  }

  async markNotificationAsRead(userId: string, notificationId: string) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
  }

  async createNotificationsForNewArticles() {
    const newArticles = await News.find()
      .sort({ publishedAt: -1 })
      .limit(50)
      .lean();

    if (newArticles.length === 0) return;

    const userPrefs = await NotificationConfig.find();

    for (const userPref of userPrefs) {
      const matchingArticles = newArticles.filter((article) => {
        const categoryMatch =
          userPref.categories.length === 0 ||
          (Array.isArray(article.category) &&
            article.category.some((c) => userPref.categories.includes(c)));

        const keywordMatch =
          userPref.keywords.length === 0 ||
          userPref.keywords.some(
            (keyword) =>
              (article.title || "").includes(keyword) ||
              (article.description || "").includes(keyword) ||
              (article.content || "").includes(keyword)
          );

        return categoryMatch || keywordMatch;
      });

      for (const article of matchingArticles) {
        const existingNotification = await Notification.findOne({
          userId: userPref.userId,
          articleId: article._id,
        });

        if (!existingNotification) {
          await Notification.create({
            userId: userPref.userId,
            articleId: article._id,
            isRead: false,
          });
        }
      }
    }
  }
}

export default new NotificationService();
