import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import newsRoutes from "./routes/newsRoutes"
import savedArticleRoutes from "./routes/savedArticleRoutes"
import notificationRoutes from "./routes/notificationRoutes"
import adminRoutes from "./routes/adminRoutes"

dotenv.config();
export const JWT_SECRET = (process.env.JWT_SECRET || "secret_key") as string;
console.log(JWT_SECRET)
export const ENV = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "default_secret",
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",
};

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/news",newsRoutes)
app.use("/api/saved", savedArticleRoutes); 
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
  res.send("News Aggregator API is running...");
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
