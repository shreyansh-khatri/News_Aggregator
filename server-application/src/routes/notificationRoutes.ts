import express from "express";
import NotificationController from "../controllers/NotificationController";
import authMiddleware from "../utils/authMiddleware";

const router = express.Router();

router.put(
  "/configure",
  authMiddleware,
  NotificationController.configureNotifications
);
router.post("/send", authMiddleware,NotificationController.sendNotificationEmails);

export default router;


