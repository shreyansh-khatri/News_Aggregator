import express from "express";
import authMiddleware from "../utils/authMiddleware";
import SavedArticleController from "../controllers/SavedArticleController";

const router = express.Router();

router.post("/save", authMiddleware, SavedArticleController.saveArticle);
router.delete(
  "/save/:articleId",
  authMiddleware,
  SavedArticleController.deleteSavedArticle
);
router.get("/saved", authMiddleware, SavedArticleController.getSavedArticles);

export default router;
