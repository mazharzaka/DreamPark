import mongoose from 'mongoose';

// تعريف الـ Slide كـ Schema فرعي لضمان التنظيم
const slideSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  subtitle: { type: String, trim: true },
  description: { type: String, trim: true },
  imageUrl: { type: String, required: true }, // الصورة أساسية في السلايد
  videoUrl: { type: String, trim: true },
  ctaText: { type: String, trim: true },
  ctaLink: { type: String, trim: true },
});

const heroSchema = new mongoose.Schema(
  {
    pageKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // بيانات عامة للسيكشن (اختيارية لو هتعتمد عالسلايدات فقط)
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },

    // مصفوفة السلايدات
    slides: [slideSchema], // هنا بنستخدم الـ Sub-schema اللي عرفناه فوق

    // لو حبيت تسيب خيارات الـ Single media كـ fallback
    imageUrl: { type: String, trim: true },
    videoUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

const Hero = mongoose.model('Hero', heroSchema);
export default Hero;