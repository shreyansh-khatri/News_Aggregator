import { Request, Response } from "express";
import News from "../models/News";
import { fetchAndStoreByCategory } from "../services/fetchAndStoreByCategory";
import { HTTP_STATUS, MESSAGES, QUERY_DATE } from "../constants/constants";

class NewsController {

  async getHeadlines(req: Request, res: Response) {
    const { date, start, end, category } = req.query;

    try {
      const baseQuery: Record<string, any> = {};

      if (date === QUERY_DATE.TODAY) {
        const now = new Date();
        const todayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const todayEnd = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1
        );
        baseQuery.publishedAt = { $gte: todayStart, $lt: todayEnd };
      } else if (start && end) {
        const startDate = new Date(start as string);
        const endDate = new Date(end as string);
        endDate.setDate(endDate.getDate() + 1);
        baseQuery.publishedAt = { $gte: startDate, $lt: endDate };
      }

      if (category && category !== QUERY_DATE.ALL) {
        baseQuery.category = category.toString();
      }

      const query = await buildNewsFilterQuery(baseQuery);
      const headlines = await News.find(query).sort({ publishedAt: -1 });

      res.status(HTTP_STATUS.OK).json({
        message: MESSAGES.HEADLINES_FETCHED,
        count: headlines.length,
        headlines,
      });
    } catch (error) {
      res.status(HTTP_STATUS.SERVER_ERROR).json({
        message: MESSAGES.HEADLINES_ERROR,
        error,
      });
    }
  }

  async searchNews(req: Request, res: Response) {
    const { keyword, start, end, category } = req.query;

    try {
      const baseQuery: Record<string, any> = {};

      if (keyword) {
        const regex = new RegExp(keyword as string, "i");
        baseQuery.$or = [
          { title: regex },
          { description: regex },
          { content: regex },
        ];
      }

      if (start && end) {
        const startDate = new Date(start as string);
        const endDate = new Date(end as string);
        endDate.setDate(endDate.getDate() + 1);
        baseQuery.publishedAt = { $gte: startDate, $lt: endDate };
      }

      if (category) {
        baseQuery.category = category;
      }

      const results = await News.find(query).sort({ publishedAt: -1 });

      res.status(HTTP_STATUS.OK).json({
        message: MESSAGES.SEARCH_SUCCESS,
        count: results.length,
        results,
      });
    } catch (error) {
      res.status(HTTP_STATUS.SERVER_ERROR).json({
        message: MESSAGES.SEARCH_ERROR,
        error,
      });
    }
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
}

export default new NewsController();
