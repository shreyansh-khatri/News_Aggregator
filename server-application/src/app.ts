import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import newsRoutes from "./routes/newsRoutes";
import savedArticleRoutes from "./routes/savedArticleRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import adminRoutes from "./routes/adminRoutes";

dotenv.config();

export const JWT_SECRET = (process.env.JWT_SECRET || "secret_key") as string;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/saved", savedArticleRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_req, res) => {
  res.send("News Aggregator API is running...");
});

export default app;
