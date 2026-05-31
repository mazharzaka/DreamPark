import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attraction from '../models/Attraction.js';

dotenv.config({ path: './.env' });

const seedData = [
  // HEROES (pageKey: "dopy")
  {
    pageKey: "dopy",
    name_en: "Pure Discovery",
    name_ar: "اكتشاف نقي",
    title: "Pure Discovery",
    description_en: "Witness the wonder through their eyes.",
    description_ar: "شاهد العجائب والروعة من خلال أعينهم.",
    image: "/doby/dopy1.jpg",
    category: "discovery",
    layout: { colSpan: 1, rowSpan: 1 }
  },
  {
    pageKey: "dopy",
    name_en: "Endless Joy",
    name_ar: "بهجة لا تنتهي",
    title: "Endless Joy",
    description_en: "Capturing moments that last a lifetime.",
    description_ar: "نلتقط لحظات تدوم مدى الحياة.",
    image: "/doby/dopy2.jpg",
    category: "joy",
    layout: { colSpan: 1, rowSpan: 1 }
  },
  {
    pageKey: "dopy",
    name_en: "Young Adventurers",
    name_ar: "المغامرون الصغار",
    title: "Young Adventurers",
    description_en: "Every step is a new dream beginning.",
    description_ar: "كل خطوة هي بداية لحلم جديد.",
    image: "/doby/dopy3.jpg",
    category: "adventure",
    layout: { colSpan: 1, rowSpan: 1 }
  },
  {
    pageKey: "dopy",
    name_en: "Pure Discovery 2",
    name_ar: "اكتشاف نقي ٢",
    title: "Pure Discovery 2",
    description_en: "Witness the wonder through their eyes.",
    description_ar: "شاهد العجائب والروعة من خلال أعينهم.",
    image: "/doby/dopy4.jpg",
    category: "discovery",
    layout: { colSpan: 1, rowSpan: 1 }
  },
  {
    pageKey: "dopy",
    name_en: "Endless Joy 2",
    name_ar: "بهجة لا تنتهي ٢",
    title: "Endless Joy 2",
    description_en: "Capturing moments that last a lifetime.",
    description_ar: "نلتقط لحظات تدوم مدى الحياة.",
    image: "/doby/dopy5.jpg",
    category: "joy",
    layout: { colSpan: 1, rowSpan: 1 }
  },
  {
    pageKey: "dopy",
    name_en: "Young Adventurers 2",
    name_ar: "المغامرون الصغار ٢",
    title: "Young Adventurers 2",
    description_en: "Every step is a new dream beginning.",
    description_ar: "كل خطوة هي بداية لحلم جديد.",
    image: "/doby/dopy6.jpg",
    category: "adventure",
    layout: { colSpan: 1, rowSpan: 1 }
  },
  {
    pageKey: "dopy",
    name_en: "Pure Discovery 3",
    name_ar: "اكتشاف نقي ٣",
    title: "Pure Discovery 3",
    description_en: "Witness the wonder through their eyes.",
    description_ar: "شاهد العجائب والروعة من خلال أعينهم.",
    image: "/doby/dopy7.jpg",
    category: "discovery",
    layout: { colSpan: 1, rowSpan: 1 }
  },
  {
    pageKey: "dopy",
    name_en: "Endless Joy 3",
    name_ar: "بهجة لا تنتهي ٣",
    title: "Endless Joy 3",
    description_en: "Capturing moments that last a lifetime.",
    description_ar: "نلتقط لحظات تدوم مدى الحياة.",
    image: "/doby/dopy8.jpg",
    category: "joy",
    layout: { colSpan: 1, rowSpan: 1 }
  },

  // MERCH (pageKey: "merch")
  {
    pageKey: "merch",
    name_en: "DreamPark Classic T-Shirt",
    name_ar: "تي شيرت دريم بارك الكلاسيكي",
    title: "T-Shirt",
    description_en: "Premium cotton classic brand t-shirt.",
    description_ar: "تي شيرت قطني فاخر بعلامة دريم بارك.",
    image: "/products/product1.png",
    category: "clothing",
    ticketPrice: "10",
    layout: { colSpan: 1, rowSpan: 1 }
  },
  {
    pageKey: "merch",
    name_en: "DreamPark Dynamic Cap",
    name_ar: "كاب دريم بارك الديناميكي",
    title: "Cap",
    description_en: "Adjustable sporty visual cap.",
    description_ar: "كاب رياضي قابل للتعديل بشعار دريم بارك.",
    image: "/products/product2.png",
    category: "caps",
    ticketPrice: "15",
    layout: { colSpan: 1, rowSpan: 1 }
  },
  {
    pageKey: "merch",
    name_en: "DreamPark Magic Mug",
    name_ar: "كوب دريم بارك السحري",
    title: "Mug",
    description_en: "Heat-sensitive color changing magic mug.",
    description_ar: "كوب سحري حساس للحرارة يتغير لونه تلقائياً.",
    image: "/products/product3.png",
    category: "mugs",
    ticketPrice: "15",
    layout: { colSpan: 1, rowSpan: 1 }
  },
  {
    pageKey: "merch",
    name_en: "DreamPark Metal Keychain",
    name_ar: "ميدالية مفاتيح دريم بارك المعدنية",
    title: "Keychain",
    description_en: "Stainless steel premium park keychain.",
    description_ar: "ميدالية مفاتيح معدنية فاخرة مقاومة للصدأ.",
    image: "/products/product4.png",
    category: "accessories",
    ticketPrice: "15",
    layout: { colSpan: 1, rowSpan: 1 }
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB successfully!');

    // Delete existing ones to prevent duplication
    const deletedDopy = await Attraction.deleteMany({ pageKey: "dopy" });
    const deletedMerch = await Attraction.deleteMany({ pageKey: "merch" });
    console.log(`Cleared existing: dopy (${deletedDopy.deletedCount}), merch (${deletedMerch.deletedCount})`);

    const inserted = await Attraction.insertMany(seedData);
    console.log(`Seeded ${inserted.length} records successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seed();
