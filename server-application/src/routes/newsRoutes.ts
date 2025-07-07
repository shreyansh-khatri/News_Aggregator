import express from "express";
import NewsController from "../controllers/NewsController";
import authMiddleware from "../utils/authMiddleware";
const router = express.Router();

router.get("/headlines",authMiddleware, NewsController.getHeadlines);
router.get("/search", NewsController.searchNews);
router.post("/fetch", NewsController.fetchAndStoreByCategory);
router.post("/report/:id", authMiddleware, NewsController.reportArticle);
router.post("/like/:articleId", authMiddleware, NewsController.likeArticle);
router.post(
  "/dislike/:articleId",
  authMiddleware,
  NewsController.dislikeArticle
);


export default router;
