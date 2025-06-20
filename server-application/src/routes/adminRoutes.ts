import express from "express";
import AdminController from "../controllers/AdminController";
import authMiddleware from "../utils/authMiddleware";
import adminOnly from "../utils/adminOnly";
const router = express.Router();

router.get(
  "/servers/status",
  authMiddleware,
  adminOnly,
  AdminController.fetchServerStatuses
);
router.get(
  "/servers",
  authMiddleware,
  adminOnly,
  AdminController.fetchServerDetails
);
router.put(
  "/servers/:id",
  authMiddleware,
  adminOnly,
  AdminController.updateExternalServer
);
router.post(
  "/categories",
  authMiddleware,
  adminOnly,
  AdminController.createCategory
);
router.post(
  "/servers/seed",
  authMiddleware,
  adminOnly,
  AdminController.seedExternalServers
);

export default router;
