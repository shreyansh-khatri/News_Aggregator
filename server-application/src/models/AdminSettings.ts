import mongoose from "mongoose";

const AdminSettingsSchema = new mongoose.Schema({
  blockedCategories: { type: [String], default: [] },
  blockedKeywords: { type: [String], default: [] },
  reportThreshold: { type: Number, default: 3 },
});

export default mongoose.model("AdminSettings", AdminSettingsSchema);
