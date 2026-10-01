import mongoose, { Schema, Document } from 'mongoose';

export interface IChecklist extends Document {
  category: 'سرگروه' | 'دانش‌آموز' | 'دبیر' | 'فضای آموزشی';
  studentName?: string; // فقط برای دسته دانش‌آموز
  itemText: string; // متن انتخاب شده یا تایپ شده
  priority: 'مطلوب' | 'کم‌اهمیت' | 'مهم' | 'خیلی مهم';
  persianDate: string; // تاریخ شمسی
  isCompleted: boolean; // آیا رسیدگی شده است؟
  createdAt: Date;
}

const ChecklistSchema = new Schema<IChecklist>({
  category: { 
    type: String, 
    required: true, 
    enum: ['سرگروه', 'دانش‌آموز', 'دبیر', 'فضای آموزشی'] 
  },
  studentName: { type: String, default: '' },
  itemText: { type: String, required: true },
  priority: { 
    type: String, 
    required: true, 
    enum: ['مطلوب', 'کم‌اهمیت', 'مهم', 'خیلی مهم'] 
  },
  persianDate: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Checklist || mongoose.model<IChecklist>('Checklist', ChecklistSchema);