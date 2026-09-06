import mongoose, { Schema, model, models } from "mongoose";

export interface ILeagueSetting {
  _id?: string;
  elementaryVisible?: boolean;
  highschoolVisible?: boolean;
  lastUpdate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const LeagueSettingSchema = new Schema<ILeagueSetting>(
  {
    elementaryVisible: { type: Boolean, default: true },
    highschoolVisible: { type: Boolean, default: true },
    lastUpdate: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

export default models.LeagueSetting ||
  model<ILeagueSetting>("LeagueSetting", LeagueSettingSchema);