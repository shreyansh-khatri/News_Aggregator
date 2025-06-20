import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    content: String,
    // category: String,
    category: { type: [String], default: [] },
    source: String,
    url: { type: String, unique: true },
    publishedAt: Date,
    isHidden: { type: Boolean, default: false },
    reports: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("News", newsSchema);

