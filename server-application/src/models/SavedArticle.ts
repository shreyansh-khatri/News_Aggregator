import mongoose, { Document } from "mongoose";

export interface ISavedArticle extends Document {
  userId: mongoose.Types.ObjectId;
  articleId: mongoose.Types.ObjectId;
}

const savedArticleSchema = new mongoose.Schema<ISavedArticle>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISavedArticle>(
  "SavedArticle",
  savedArticleSchema
);
