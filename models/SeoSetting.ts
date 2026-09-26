import mongoose, { Schema, model, models } from "mongoose";

export interface ISeoSetting {
  _id?: string;
  title: string;
  description: string;
  keywords: string;
  updatedAt?: Date;
}

const SeoSettingSchema = new Schema<ISeoSetting>(
  {
    title: { type: String, required: true, trim: true, maxlength: 70 },
    description: { type: String, required: true, trim: true, maxlength: 200 },
    keywords: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export default models.SeoSetting || model<ISeoSetting>("SeoSetting", SeoSettingSchema);