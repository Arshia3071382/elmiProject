import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'نام گروه الزامی است'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔴 تمام هوک‌های pre و next() را کاملاً پاک کردیم تا کشِ مانیگوز کلاً ریست شود.
// منطق ساخت slug را مستقیماً و به صورت امن در خود فایل route.ts هندل می‌کنیم.

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default Category;