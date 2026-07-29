// models/CalendarMonth.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IEvent {
  day: number;
  title: string;
  type: "exam" | "class" | "workshop" | "other";
  hour?: string;   // ساعت برگزاری (مثلا 16)
  minute?: string; // دقیقه برگزاری (مثلا 30)
}

export interface ICalendarMonth extends Document {
  year: number;
  monthNumber: number;
  monthName: string;
  startDayOfWeek: number;
  events: IEvent[];
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["exam", "class", "workshop", "other"], default: "class" },
  hour: { type: String, default: "" },
  minute: { type: String, default: "" },
});

const CalendarMonthSchema = new Schema<ICalendarMonth>({
  year: { type: Number, required: true },
  monthNumber: { type: Number, required: true, unique: true },
  monthName: { type: String, required: true },

  startDayOfWeek: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 6,
  },

  events: [EventSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.CalendarMonth || 
  mongoose.model<ICalendarMonth>("CalendarMonth", CalendarMonthSchema);