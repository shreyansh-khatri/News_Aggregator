import { Request, Response } from "express";
import ExternalServer from "../models/ExternalServer";
import Category from "../models/Category";
import { MESSAGES, STATUS } from "../constants/constants";
import { HTTP_STATUS } from "../constants/constants";

class AdminController {
  async fetchServerStatuses(_req: Request, res: Response) {
    const servers = await ExternalServer.find().select(
      "name status lastChecked"
    );
     res.status(HTTP_STATUS.OK).json({ servers });
     return;
  }

  async fetchServerDetails(_req: Request, res: Response) {
    const servers = await ExternalServer.find();
     res.status(HTTP_STATUS.OK).json({ servers });
     return;
  }

  async updateExternalServer(req: Request, res: Response) {
    const { id } = req.params;
    const { name, baseUrl, status } = req.body;

    const updatedServer = await ExternalServer.findByIdAndUpdate(
      id,
      { name, baseUrl, status },
      { new: true }
    );

    if (!updatedServer) {
       res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: MESSAGES.SERVER_NOT_FOUND });
        return;
    }

     res.status(HTTP_STATUS.OK).json({
      message: MESSAGES.SERVER_UPDATED,
      server: updatedServer,
    });
    return;
  }

  async createCategory(req: Request, res: Response) {
    const { name, keywords = [] } = req.body;

    if (!name?.trim()) {
       res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: MESSAGES.CATEGORY_REQUIRED });
        return;
    }

    const normalized = name.trim().toLowerCase();
    const existingCategory = await Category.findOne({ name: normalized });

    if (existingCategory) {
       res
        .status(HTTP_STATUS.CONFLICT)
        .json({ message: MESSAGES.CATEGORY_EXISTS });
        return;
    }

    const newCategory = await Category.create({
      name: normalized,
      keywords,
    });

     res.status(HTTP_STATUS.CREATED).json({
      message: MESSAGES.CATEGORY_CREATED,
      category: newCategory,
    });
    return;
  }


  async seedExternalServers(_req: Request, res: Response) {
    await ExternalServer.deleteMany();

    await ExternalServer.insertMany([
      {
        name: "News API Server",
        baseUrl: "https://newsapi.org/v2",
        status: STATUS.ACTIVE,
        lastChecked: new Date(),
      },
      {
        name: "The News API",
        baseUrl: "https://api.thenewsapi.com/v1",
        status: STATUS.INACTIVE,
        lastChecked: new Date(),
      },
    ]);

     res
      .status(HTTP_STATUS.CREATED)
      .json({ message: MESSAGES.SERVER_SEEDED });
      return;
  }
}

export default new AdminController();
