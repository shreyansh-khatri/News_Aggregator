import mongoose from "mongoose";

const connectDB = async () => {
  const MONGO_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/news-db";

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;