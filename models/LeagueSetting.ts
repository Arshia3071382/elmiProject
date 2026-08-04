import mongoose, { Schema, model, models } from "mongoose";

export interface ILeagueSetting {
  _id?: string;
  lastUpdate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const LeagueSettingSchema = new Schema<ILeagueSetting>(
  {
    lastUpdate: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

export default models.LeagueSetting ||
  model<ILeagueSetting>("LeagueSetting", LeagueSettingSchema);
