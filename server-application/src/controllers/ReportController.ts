import { Request, Response } from "express";
import Report from "../models/Report";
import News from "../models/News";
import {
  REPORT_THRESHOLD,
  HTTP_STATUS,
  MESSAGES,
} from "../constants/constants";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

class ReportController {
  async reportArticle(req: AuthenticatedRequest, res: Response) {
    const { articleId } = req.body;
    const userId = req.user?.id;

    try {
      const alreadyReported = await Report.findOne({ userId, articleId });
      if (alreadyReported) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: MESSAGES.ALREADY_REPORTED });
      }

      await Report.create({ userId, articleId });

      const reportCount = await Report.countDocuments({ articleId });
      if (reportCount >= REPORT_THRESHOLD) {
        await News.findByIdAndUpdate(articleId, { isHidden: true });
      }

      res.status(HTTP_STATUS.OK).json({ message: MESSAGES.ARTICLE_REPORTED });
    } catch (error) {
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .json({ message: MESSAGES.REPORT_ERROR, error });
    }
  }
}

export default new ReportController();
