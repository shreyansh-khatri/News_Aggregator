import { fetchNewsFromAPI } from "./newsService";
import {
  classifyMultipleCategories,
} from "../utils/categoryClassifier";
import News from "../models/News";
import NotificationController from "../controllers/NotificationController";
import NotificationService from "./NotificationService";

export const fetchAndStoreByCategory = async () => {
  const articles = await fetchNewsFromAPI();

  let count = 0;

  for (const article of articles) {
    const exists = await News.findOne({ url: article.url });
    if (exists) continue;

    const textToScan = `${article.title || ""} ${article.description || ""} ${
      article.content || ""
    }`;

    const categories = classifyMultipleCategories(textToScan);

    await News.create({
      title: article.title,
      description: article.description,
      content: article.content,
      category: categories,
      source: article.source?.name || "Unknown",
      url: article.url,
      publishedAt: article.publishedAt,
    });

    count++;
  }

  await NotificationService.createNotificationsForNewArticles()
  
  return articles;
};
