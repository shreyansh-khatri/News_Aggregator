import mongoose from "mongoose";

const externalServerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    baseUrl: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    lastChecked: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("ExternalServer", externalServerSchema);
