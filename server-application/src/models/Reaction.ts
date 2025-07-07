import mongoose, { Document } from "mongoose";

export interface IReaction extends Document {
  userId: mongoose.Types.ObjectId;
  articleId: mongoose.Types.ObjectId;
  type: "like" | "dislike";
}

const reactionSchema = new mongoose.Schema<IReaction>(
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
    type: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReaction>("Reaction", reactionSchema);
