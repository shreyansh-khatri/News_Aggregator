import News from "../models/News";
import AdminSettings from "../models/AdminSettings";
import { buildNewsFilterQuery } from "../utils/buildNewsFilterQuery";
import { Request, Response } from "express";
import { fetchAndStoreByCategory } from "../services/fetchAndStoreByCategory";
import { HTTP_STATUS, MESSAGES } from "../constants/constants";
import { AuthenticatedRequest } from "../utils/authMiddleware";
import Reaction from "../models/Reaction";
import { buildPersonalizedQuery } from "../utils/personalization";
import mongoose from "mongoose";

class NewsController {
  //   async getHeadlines(req: Request, res: Response) {
  //     try {
  //       const query = await buildNewsFilterQuery(req.query);
  //       const headlines = await News.find(query).sort({ publishedAt: -1 });
  // console.log(headlines.length)
  //       res.json({ headlines });
  //     } catch (err) {
  //       res
  //         .status(500)
  //         .json({ message: "Failed to fetch headlines", error: err });
  //     }
  //   }

  async searchNews(req: Request, res: Response) {
    try {
      const { keyword, start, end } = req.query;

      const query: any = {
        isHidden: false,
      };

      if (start && end) {
        const startDate = new Date(start as string);
        const endDate = new Date(end as string);
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

      const results = await News.find(query).sort({ publishedAt: -1 });

      res.json({ results });
    } catch (err) {
      console.error("Search error:", err);
      res.status(500).json({ message: "Failed to search news", error: err });
    }
  }

  async getHeadlines(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.id;

    try {
      let headlines;

      const personalizedQuery = userId
        ? await buildPersonalizedQuery(userId)
        : await buildNewsFilterQuery(req.query);

      headlines = await News.aggregate([
        { $match: personalizedQuery },
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
        {
          $project: {
            reactions: 0,
          },
        },
        { $sort: { publishedAt: -1 } },
        { $limit: 50 },
      ]);

      res.json({ headlines });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Failed to fetch headlines", error: err });
    }
  }

  async reportArticle(req: Request, res: Response) {
    const { id } = req.params;
    console.log(id);
    const settings = await AdminSettings.findOne();
    const threshold = settings?.reportThreshold || 3;

    const article = await News.findById(id);
    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    article.reports += 1;
    if (article.reports >= threshold) article.isHidden = true;

    await article.save();
    res.json({ message: "Reported", isHidden: article.isHidden });
  }

  async fetchAndStoreByCategory(req: Request, res: Response) {
    try {
      const articles = await fetchAndStoreByCategory();

      res.status(HTTP_STATUS.OK).json({
        message: MESSAGES.FETCH_AND_STORE_SUCCESS,
        articles,
      });
    } catch (error) {
      res.status(HTTP_STATUS.SERVER_ERROR).json({
        message: MESSAGES.FETCH_AND_STORE_ERROR,
        error,
      });
    }
  }

  async likeArticle(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { articleId } = req.params;
    const userId = req.user!.id;

    try {
      const article = await News.findById(articleId);
      if (!article) {
        res.status(404).json({ message: "Article not found" });
        return;
      }

      const existingReaction = await Reaction.findOne({
        userId,
        articleId,
      });

      if (existingReaction) {
        if (existingReaction.type === "like") {
          res.json({ message: "Already liked" });
          return;
        } else {
          existingReaction.type = "like";
          await existingReaction.save();

          article.likes = (article.likes || 0) + 1;
          article.dislikes = Math.max((article.dislikes || 0) - 1, 0);
          await article.save();
        }
      } else {
        await Reaction.create({
          userId,
          articleId,
          type: "like",
        });

        article.likes = (article.likes || 0) + 1;
        await article.save();
      }

      res.json({ message: "Liked successfully", likes: article.likes });
    } catch (err) {
      res.status(500).json({ message: "Like failed", error: err });
    }
  }

  async dislikeArticle(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    const { articleId } = req.params;
    const userId = req.user!.id;

    try {
      const article = await News.findById(articleId);
      if (!article) {
        res.status(404).json({ message: "Article not found" });
        return;
      }

      const existingReaction = await Reaction.findOne({
        userId,
        articleId,
      });

      if (existingReaction) {
        if (existingReaction.type === "dislike") {
          res.json({ message: "Already disliked" });
          return;
        } else {
          existingReaction.type = "dislike";
          await existingReaction.save();

          article.dislikes = (article.dislikes || 0) + 1;
          article.likes = Math.max((article.likes || 0) - 1, 0);
          await article.save();
        }
      } else {
        await Reaction.create({
          userId,
          articleId,
          type: "dislike",
        });

        article.dislikes = (article.dislikes || 0) + 1;
        await article.save();
      }

      res.json({
        message: "Disliked successfully",
        dislikes: article.dislikes,
      });
    } catch (err) {
      res.status(500).json({ message: "Dislike failed", error: err });
    }
  }
}

export default new NewsController();
