import { Request, Response } from "express";
import Notification from "../models/Notifcation";
import User from "../models/User";
import News from "../models/News";
import sendMail from "../utils/sendMail";
import { EMAIL, HTTP_STATUS, MESSAGES } from "../constants/constants";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

class NotificationController {
  async configureNotifications(req: AuthenticatedRequest, res: Response) {
    const { categories = [], keywords = [] } = req.body;

    try {
      await Notification.findOneAndUpdate(
        { userId: req.user?.id },
        { categories, keywords, updatedAt: new Date() },
        { upsert: true, new: true }
      );

      res.status(HTTP_STATUS.OK).json({ message: MESSAGES.NOTIFICATION_SAVED });
    } catch (error) {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: MESSAGES.NOTIFICATION_SAVE_ERROR, error });
    }
  }

  async sendNotificationEmails(_req: Request, res: Response) {
    try {
      const notificationConfigs = await Notification.find().lean();

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

        console.log({
          to: user.email,
          subject: EMAIL.SUBJECT,
          html: htmlBody,
        });

        await sendMail({
          to: user.email,
          subject: EMAIL.SUBJECT,
          html: htmlBody,
        });
      }

      res.status(HTTP_STATUS.OK).json({ message: MESSAGES.EMAILS_SENT });
    } catch (error) {
      console.log(error)
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: MESSAGES.EMAILS_FAILED, error });
    }
  }
}

export default new NotificationController();
