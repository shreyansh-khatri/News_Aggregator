import NotificationConfig from "../models/NotificationConfig";
import Reaction from "../models/Reaction";
import SavedArticle from "../models/SavedArticle";


export const buildPersonalizedQuery = async (userId: string) => {
  const notifConfig = await NotificationConfig.findOne({ userId });

  const preferredCategories = notifConfig?.categories || [];
  const preferredKeywords = notifConfig?.keywords || [];

  const likedReactions = await Reaction.find({ userId, type: "like" }).populate(
    "articleId"
  );

  const likedCategories = likedReactions.flatMap((r) => {
    const article = r.articleId as any;
    return article?.category || [];
  });

  const likedKeywords = likedReactions.flatMap((r) => {
    const article = r.articleId as any;
    const keywords: string[] = [];
    if (article && typeof article === "object") {
      if (article.title) keywords.push(article.title);
      if (article.description) keywords.push(article.description);
      if (article.content) keywords.push(article.content);
    }
    return keywords;
  });

  const savedArticles = await SavedArticle.find({ userId }).populate(
    "articleId"
  );

  const savedCategories = savedArticles.flatMap((s) => {
    const article = s.articleId as any;
    return article?.category || [];
  });

  const savedKeywords = savedArticles.flatMap((s) => {
    const article = s.articleId as any;
    const keywords: string[] = [];
    if (article && typeof article === "object") {
      if (article.title) keywords.push(article.title);
      if (article.description) keywords.push(article.description);
      if (article.content) keywords.push(article.content);
    }
    return keywords;
  });

  const query: any = {
    $or: [
      {
        category: {
          $in: [...preferredCategories, ...likedCategories, ...savedCategories],
        },
      },
      { title: { $regex: preferredKeywords.join("|"), $options: "i" } },
      { description: { $regex: preferredKeywords.join("|"), $options: "i" } },
      { content: { $regex: preferredKeywords.join("|"), $options: "i" } },
      { title: { $regex: likedKeywords.join("|"), $options: "i" } },
      { description: { $regex: likedKeywords.join("|"), $options: "i" } },
      { content: { $regex: likedKeywords.join("|"), $options: "i" } },
      { title: { $regex: savedKeywords.join("|"), $options: "i" } },
      { description: { $regex: savedKeywords.join("|"), $options: "i" } },
      { content: { $regex: savedKeywords.join("|"), $options: "i" } },
    ],
  };

  return query;
};
