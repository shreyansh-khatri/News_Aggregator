import { Request, Response } from "express";
import NotificationService from "../services/NotificationService";
import { HTTP_STATUS, MESSAGES } from "../constants/constants";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

class NotificationController {
  async configureNotifications(req: AuthenticatedRequest, res: Response) {
    const { categories = [], keywords = [] } = req.body;

    try {
      await NotificationService.configureNotifications(
        req.user!.id,
        categories,
        keywords
      );
      res.status(HTTP_STATUS.OK).json({ message: MESSAGES.NOTIFICATION_SAVED });
    } catch (error) {
      console.error("Error configuring notifications:", error);
      res.status(HTTP_STATUS.SERVER_ERROR).json({
        message: MESSAGES.NOTIFICATION_SAVE_ERROR,
        error,
      });
    }
  }

  async sendNotificationEmails(_req: Request, res: Response) {
    try {
      await NotificationService.sendNotificationEmailsJob();
      res.status(HTTP_STATUS.OK).json({ message: MESSAGES.EMAILS_SENT });
    } catch (error) {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: MESSAGES.EMAILS_FAILED, error });
    }
  }

  async getUserNotifications(req: AuthenticatedRequest, res: Response) {
    try {
      const notifications = await NotificationService.getUserNotifications(
        req.user!.id
      );
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
  }

  async markNotificationAsRead(req: AuthenticatedRequest, res: Response) {
    try {
      const { notificationId } = req.params;
      const notification = await NotificationService.markNotificationAsRead(
        req.user!.id,
        notificationId
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
  }

  async createNotificationsForNewArticles(_req: Request, res: Response) {
    try {
      await NotificationService.createNotificationsForNewArticles();
      res
        .status(HTTP_STATUS.OK)
        .json({ message: "Notifications created for new articles" });
    } catch (error) {
      res.status(HTTP_STATUS.SERVER_ERROR).json({
        message: "Failed to create notifications for new articles",
        error,
      });
    }
  }
}

export default new NotificationController();
