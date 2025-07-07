import express, { Request, Response } from "express";
import NotificationController from "../controllers/NotificationController";
import authMiddleware from "../utils/authMiddleware";
import News from "../models/News";

const router = express.Router();

router.put(
  "/configure",
  authMiddleware,
  NotificationController.configureNotifications
);

router.post(
  "/send",
  authMiddleware,
  NotificationController.sendNotificationEmails
);

router.get("/", authMiddleware, NotificationController.getUserNotifications);

router.put(
  "/mark-as-read/:notificationId",
  authMiddleware,
  NotificationController.markNotificationAsRead
);


export default router;
