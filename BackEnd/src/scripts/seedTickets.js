import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TicketType from '../models/TicketType.js';

dotenv.config({ path: './.env' });

const ticketTypes = [
  {
    name: "Single-Day Fun Pass",
    nameAr: "تذكرة المرح ليوم واحد",
    category: "INDIVIDUAL",
    price: 150,
    icon: "Sparkles",
    color: "#005caa", // Royal Blue
    description: [
      "Access to all standard rides & attractions",
      "Full entry to all interactive digital exhibits",
      "Access to the animal conservatory and zones",
      "Free park-wide high-speed Wi-Fi access"
    ],
    descriptionAr: [
      "دخول غير محدود لجميع الألعاب والمعالم العادية",
      "دخول كامل للمعارض الرقمية التفاعلية",
      "دخول محمية ومناطق الحيوانات الفريدة",
      "خدمة إنترنت لاسلكي عالي السرعة مجاني"
    ],
    discount: 0,
    isActive: true
  },
  {
    name: "Ultimate Magic VIP Pass",
    nameAr: "تذكرة كبار الشخصيات السحرية",
    category: "INDIVIDUAL",
    price: 350,
    icon: "Crown",
    color: "#755700", // Sleek Gold
    description: [
      "Priority Fast-Track skip-the-line queue access",
      "Free premium international lunch buffet voucher",
      "Unlimited professional digital photo pass package",
      "Premium reserved seating at all live shows and events",
      "Access to exclusive VIP rest lounges"
    ],
    descriptionAr: [
      "دخول سريع ذو أولوية وتخطي الطوابير لجميع الألعاب",
      "قسيمة مجانية لبوفيه الغداء العالمي الممتاز",
      "حزمة صور رقمية احترافية مجانية بالكامل",
      "مقاعد مميزة محجوزة في جميع العروض الحية والفعاليات",
      "دخول حصري لاستراحات كبار الشخصيات الراقية"
    ],
    discount: 10, // 10% discount seeded
    isActive: true
  },
  {
    name: "Family Adventure Pass",
    nameAr: "تذكرة المغامرة العائلية",
    category: "GROUP",
    price: 500,
    icon: "Users",
    color: "#008080", // Vibrant Teal
    description: [
      "Valid for group up to 4 people (Adults/Kids)",
      "Includes 4 complimentary custom soft drinks",
      "Access to all rides, playgrounds, and events",
      "15% off at all Dream Park retail merchandise shops"
    ],
    descriptionAr: [
      "صالحة لمجموعة تصل إلى ٤ أشخاص (بالغين وأطفال)",
      "تشمل ٤ مشروبات غازية مخصصة ومجانية",
      "دخول كامل لجميع الألعاب، ملاعب الأطفال والفعاليات",
      "خصم ١٥٪ في جميع متاجر الهدايا والتجزئة الخاصة بالمنتزه"
    ],
    discount: 5,
    isActive: true
  },
  {
    name: "Mega Squad Group Pass",
    nameAr: "تذكرة المجموعة الكبرى",
    category: "GROUP",
    price: 1100,
    icon: "Award",
    color: "#b5161e", // Premium Crimson Red
    description: [
      "Valid for groups up to 10 people",
      "Dedicated personal tour host for 2 hours",
      "Free deluxe locker rentals for the entire day",
      "20% off all dining & food purchases park-wide",
      "Exclusive group digital souvenir package"
    ],
    descriptionAr: [
      "صالحة للمجموعات والفرق حتى ١٠ أشخاص",
      "مضيف جولات شخصي مخصص للمجموعة لمدة ساعتين",
      "تأجير خزائن مجانية فاخرة طوال اليوم",
      "خصم ٢٠٪ على جميع وجبات الطعام والمشتريات بالمنتزه",
      "حزمة تذكارية رقمية حصرية للمجموعات"
    ],
    discount: 15,
    isActive: true
  }
];

const seedTickets = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully!');

    console.log('Clearing existing TicketTypes...');
    const deleteResult = await TicketType.deleteMany();
    console.log(`Deleted ${deleteResult.deletedCount} existing ticket types.`);

    console.log('Inserting new TicketTypes...');
    const insertedResult = await TicketType.insertMany(ticketTypes);
    console.log(`Successfully seeded ${insertedResult.length} ticket types!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding TicketTypes database:', error);
    process.exit(1);
  }
};

seedTickets();
