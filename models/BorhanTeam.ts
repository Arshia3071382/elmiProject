import mongoose, { Schema, Document } from 'mongoose';

export interface IBorhanTeam extends Document {
  role: 'teacher' | 'student';
  fullName: string;
  phone: string;
  // فیلدهای اختصاصی معلم
  job?: string;
  teachingExperience?: string;
  honors?: string;
  background?: string;
  // فیلدهای اختصاصی دانش‌آموز
  grade?: string;
  school?: string;
  interests?: string;
  createdAt: Date;
}

const BorhanTeamSchema = new Schema<IBorhanTeam>({
  role: { type: String, required: true, enum: ['teacher', 'student'] },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  job: { type: String },
  teachingExperience: { type: String },
  honors: { type: String },
  background: { type: String },
  grade: { type: String },
  school: { type: String },
  interests: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.BorhanTeam || mongoose.model<IBorhanTeam>('BorhanTeam', BorhanTeamSchema);