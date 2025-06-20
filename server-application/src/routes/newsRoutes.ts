import express from "express";
import NewsController from "../controllers/NewsController";
import authMiddleware from "../utils/authMiddleware";
const router = express.Router();

router.get("/headlines", NewsController.getHeadlines);
router.get("/search", NewsController.searchNews);
router.post("/fetch", NewsController.fetchAndStoreByCategory);

export default router;
