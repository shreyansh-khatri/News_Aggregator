import { Request, Response } from "express";
import Notification from "../models/Notifcation";
import User from "../models/User";
import News from "../models/News";
import sendMail from "../utils/sendMail";
import { EMAIL, HTTP_STATUS, MESSAGES } from "../constants/constants";
import NotificationConfig from "../models/NotificationConfig";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

import { Types } from "mongoose";

interface Article {
  _id: Types.ObjectId;
  title?: string | null;
  description?: string | null;
  content?: string | null;
  category?: string | null;
}



class NotificationController {
  async configureNotifications(req: AuthenticatedRequest, res: Response) {
    const { categories = [], keywords = [] } = req.body;

    try {
      await NotificationConfig.findOneAndUpdate(
        { userId: req.user?.id },
        {
          categories,
          keywords,
          updatedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      res.status(HTTP_STATUS.OK).json({
        message: MESSAGES.NOTIFICATION_SAVED,
      });
    } catch (error) {
      console.error("Error configuring notifications:", error);
      res.status(HTTP_STATUS.SERVER_ERROR).json({
        message: MESSAGES.NOTIFICATION_SAVE_ERROR,
        error,
      });
    }
  }



  public async sendNotificationEmailsJob() {
    const notificationConfigs = await NotificationConfig.find().lean();

    for (const config of notificationConfigs) {
      const user = await User.findById(config.userId);
      if (!user?.email) continue;

      const { categories = [], keywords = [] } = config;

      const keywordRegex = keywords.map(
        (k: string) => new RegExp(`\\b${k}\\b`, "i")
      );

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

      const articles = await News.find({
        $or: [categoryQuery, keywordQuery],
      })
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

    console.log("Notification emails sent successfully by cron job.");
  }

  public sendNotificationEmails = async (_req: Request, res: Response) => {
    try {
      await this.sendNotificationEmailsJob();
      res.status(HTTP_STATUS.OK).json({ message: MESSAGES.EMAILS_SENT });
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: MESSAGES.EMAILS_FAILED, error });
    }
  };


  public getUserNotifications = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const notifications = await Notification.find({
        userId: req.user!.id,
        isRead: false, 
      })
        .populate("articleId")
        .sort({ createdAt: -1 });

      res.status(HTTP_STATUS.OK).json({
        message: "Notifications fetched successfully",
        notifications,
      });
    } catch (error) {
      res.status(HTTP_STATUS.SERVER_ERROR).json({
        message: "Failed to fetch notifications",
        error,
      });
    }
  };

  public markNotificationAsRead = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const { notificationId } = req.params;

      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId: req.user!.id },
        { isRead: true },
        { new: true }
      );

      if (!notification) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Notification not found" });
        return;
      }

      res.status(HTTP_STATUS.OK).json({
        message: "Notification marked as read",
        notification,
      });
    } catch (error) {
      res.status(HTTP_STATUS.SERVER_ERROR).json({
        message: "Failed to mark notification as read",
        error,
      });
    }
  };



public createNotificationsForNewArticles = async () => {
  const newArticles = await News.find()
    .sort({ publishedAt: -1 })
    .limit(50)
    .lean();

  if (newArticles.length === 0) {
    console.log("No new articles found for notifications");
    return;
  }

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
          (keyword: string) =>
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

  console.log(
    ` Notifications created/checked for ${newArticles.length} new articles.`
  );
};
}



export default new NotificationController();
