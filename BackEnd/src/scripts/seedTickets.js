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
    features: {
      rides_standard: true,
      digital_exhibits: true,
      animal_conservatory: true,
      park_wifi: true,
      fast_track: false,
      vip_lounges: false,
      locker_rental: false,
      meal_voucher: false
    },
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
    features: {
      rides_standard: true,
      digital_exhibits: true,
      animal_conservatory: true,
      park_wifi: true,
      fast_track: true,
      vip_lounges: true,
      locker_rental: true,
      meal_voucher: true
    },
    discount: 10,
    isActive: true
  },
  {
    name: "Family Adventure Pass",
    nameAr: "تذكرة المغامرة العائلية",
    category: "GROUP",
    price: 500,
    icon: "Users",
    color: "#008080", // Vibrant Teal
    features: {
      rides_standard: true,
      digital_exhibits: true,
      animal_conservatory: true,
      park_wifi: true,
      fast_track: false,
      vip_lounges: false,
      locker_rental: false,
      meal_voucher: false
    },
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
    features: {
      rides_standard: true,
      digital_exhibits: true,
      animal_conservatory: true,
      park_wifi: true,
      fast_track: false,
      vip_lounges: false,
      locker_rental: true,
      meal_voucher: false
    },
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
