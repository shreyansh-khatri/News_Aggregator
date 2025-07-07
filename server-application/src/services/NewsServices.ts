import News from "../models/News";
import AdminSettings from "../models/AdminSettings";
import { buildNewsFilterQuery } from "../utils/buildNewsFilterQuery";
import { fetchAndStoreByCategory } from "../services/fetchAndStoreByCategory";
import { HTTP_STATUS, MESSAGES } from "../constants/constants";
import { buildPersonalizedQuery } from "../utils/personalization";
import mongoose from "mongoose";
import Reaction from "../models/Reaction";

class NewsService {
  async searchNews(keyword?: string, start?: string, end?: string) {
    const query: any = { isHidden: false };

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      endDate.setDate(endDate.getDate() + 1);
      query.publishedAt = { $gte: startDate, $lt: endDate };
    }

    if (keyword) {
      const regex = new RegExp(`\\b${keyword}\\b`, "i");
      query.$or = [
        { title: regex },
        { description: regex },
        { content: regex },
      ];
    }

    return await News.find(query).sort({ publishedAt: -1 });
  }

  async getHeadlines(userId?: string, queryParams?: any) {
    const personalizedQuery = userId
      ? await buildPersonalizedQuery(userId)
      : await buildNewsFilterQuery(queryParams);

    const finalQuery = { ...personalizedQuery, isHidden: { $ne: true } };

    return await News.aggregate([
      { $match: finalQuery },
      {
        $lookup: {
          from: "reactions",
          localField: "_id",
          foreignField: "articleId",
          as: "reactions",
        },
      },
      {
        $addFields: {
          likes: {
            $size: {
              $filter: {
                input: "$reactions",
                as: "r",
                cond: { $eq: ["$$r.type", "like"] },
              },
            },
          },
          dislikes: {
            $size: {
              $filter: {
                input: "$reactions",
                as: "r",
                cond: { $eq: ["$$r.type", "dislike"] },
              },
            },
          },
          userReaction: userId
            ? {
                $let: {
                  vars: {
                    reaction: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$reactions",
                            as: "r",
                            cond: {
                              $eq: [
                                "$$r.userId",
                                new mongoose.Types.ObjectId(userId),
                              ],
                            },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: "$$reaction.type",
                },
              }
            : null,
        },
      },
      { $project: { reactions: 0 } },
      { $sort: { publishedAt: -1 } },
      { $limit: 50 },
    ]);
  }

  async reportArticle(id: string) {
    const settings = await AdminSettings.findOne();
    const threshold = settings?.reportThreshold || 3;

    const article = await News.findById(id);
    if (!article) throw { status: 404, message: "Article not found" };

    article.reports += 1;
    if (article.reports >= threshold) article.isHidden = true;

    await article.save();
    return { message: "Reported", isHidden: article.isHidden };
  }

  async fetchAndStore() {
    const articles = await fetchAndStoreByCategory();
    return { message: MESSAGES.FETCH_AND_STORE_SUCCESS, articles };
  }

  async likeArticle(articleId: string, userId: string) {
    const article = await News.findById(articleId);
    if (!article) throw { status: 404, message: "Article not found" };

    const existingReaction = await Reaction.findOne({ userId, articleId });

    if (existingReaction) {
      if (existingReaction.type === "like") {
        return { message: "Already liked" };
      } else {
        existingReaction.type = "like";
        await existingReaction.save();

        article.likes = (article.likes || 0) + 1;
        article.dislikes = Math.max((article.dislikes || 0) - 1, 0);
        await article.save();
      }
    } else {
      await Reaction.create({ userId, articleId, type: "like" });
      article.likes = (article.likes || 0) + 1;
      await article.save();
    }

    return { message: "Liked successfully", likes: article.likes };
  }

  async dislikeArticle(articleId: string, userId: string) {
    const article = await News.findById(articleId);
    if (!article) throw { status: 404, message: "Article not found" };

    const existingReaction = await Reaction.findOne({ userId, articleId });

    if (existingReaction) {
      if (existingReaction.type === "dislike") {
        return { message: "Already disliked" };
      } else {
        existingReaction.type = "dislike";
        await existingReaction.save();

        article.dislikes = (article.dislikes || 0) + 1;
        article.likes = Math.max((article.likes || 0) - 1, 0);
        await article.save();
      }
    } else {
      await Reaction.create({ userId, articleId, type: "dislike" });
      article.dislikes = (article.dislikes || 0) + 1;
      await article.save();
    }

    return { message: "Disliked successfully", dislikes: article.dislikes };
  }
}

export default new NewsService();
