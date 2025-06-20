import { fetchNewsFromAPI } from "./newsService";
import {
  classifyMultipleCategories,
} from "../utils/categoryClassifier";
import News from "../models/News";

export const fetchAndStoreByCategory = async () => {
  const articles = await fetchNewsFromAPI();

  let count = 0;

  for (const article of articles) {
    const exists = await News.findOne({ title: article.title });
    if (exists) continue;

    const textToScan = `${article.title || ""} ${article.description || ""} ${
      article.content || ""
    }`;

    const categories = classifyMultipleCategories(textToScan);
    console.log(categories);

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

  console.log(`Stored ${count} articles.`);
  return articles;
};
