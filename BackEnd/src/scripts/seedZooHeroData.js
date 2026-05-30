import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Hero from '../models/Hero.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const slidesAr = [
  {
    title: "اكتشف سحر الطبيعة في",
    subtitle: "Dream Zoo",
    description: "استمتع برحلة سفاري حية وقضاء يوم لا يُنسى مع أندر الحيوانات. 🦁 حجزك يبدأ من هنا!",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200",
    ctaText: "احجز تذكرتك الآن",
    ctaLink: "/zoo/tickets"
  },
  {
    title: "مغامرة لا تُنسى في",
    subtitle: "السفاري الأفريقية",
    description: "اخرج عن المألوف وشاهد الأسود والزرافات طليقة في بيئتها الطبيعية بالسيارات المفتوحة. 🚙✨",
    imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1200",
    ctaText: "استكشف السفاري",
    ctaLink: "/zoo/safari"
  },
  {
    title: "لحظات عائلية مميزة في",
    subtitle: "منطقة الألعاب التفاعلية",
    description: "أطفالك هيعيشوا تجربة إطعام الزرافات واللعب مع الباندا في أجواء آمنة ومبهجة. 🐼 جربوها اليوم!",
    imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&q=80&w=1200",
    ctaText: "شاهد الأنشطة",
    ctaLink: "/zoo/activities"
  }
];

const slidesEn = [
  {
    title: "Discover the Magic of Nature in",
    subtitle: "Dream Zoo",
    description: "Enjoy a live safari trip and spend an unforgettable day with the rarest animals. 🦁 Your booking starts here!",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200",
    ctaText: "Book Your Ticket Now",
    ctaLink: "/zoo/tickets"
  },
  {
    title: "An Unforgettable Adventure in the",
    subtitle: "African Safari",
    description: "Step out of the ordinary and watch lions and giraffes roam free in their natural habitat from open vehicles. 🚙✨",
    imageUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1200",
    ctaText: "Explore Safari",
    ctaLink: "/zoo/safari"
  },
  {
    title: "Special Family Moments in the",
    subtitle: "Interactive Games Area",
    description: "Your kids will experience feeding giraffes and playing with pandas in a safe, joyful environment. 🐼 Try it today!",
    imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&q=80&w=1200",
    ctaText: "View Activities",
    ctaLink: "/zoo/activities"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    // Upsert Arabic Hero
    await Hero.findOneAndUpdate(
      { pageKey: 'zoo_ar' },
      { pageKey: 'zoo_ar', slides: slidesAr },
      { new: true, upsert: true }
    );
    
    // Upsert English Hero
    await Hero.findOneAndUpdate(
      { pageKey: 'zoo_en' },
      { pageKey: 'zoo_en', slides: slidesEn },
      { new: true, upsert: true }
    );
    
    console.log('Successfully inserted Hero data for zoo in Arabic and English');
    process.exit();
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
