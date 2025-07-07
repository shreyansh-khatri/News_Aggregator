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

router.get("/settings", authMiddleware,adminOnly, AdminController.getSettings);
router.put("/settings", authMiddleware,adminOnly, AdminController.updateSettings);
router.get(
  "/reported-articles",
  authMiddleware,
  adminOnly,
  AdminController.getReportedArticles
);

router.post(
  "/hide-article/:articleId",
  authMiddleware,
  adminOnly,
  AdminController.hideArticle
);

router.get(
  "/categories",
  authMiddleware,
  // adminOnly,
  AdminController.getAllCategories
);

router.post(
  "/hide-categories",
  authMiddleware,
  adminOnly,
  AdminController.hideCategories
);

router.get(
  "/blocked-keywords",
  authMiddleware,
  adminOnly,
  AdminController.getBlockedKeywords
);

router.put(
  "/blocked-keywords",
  authMiddleware,
  adminOnly,
  AdminController.updateBlockedKeywords
);

router.get("/categories", AdminController.getAllCategories);


export default router;
