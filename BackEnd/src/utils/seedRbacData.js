import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import TicketType from '../models/TicketType.js';
import Booking from '../models/Booking.js';
import ScanAuditLog from '../models/ScanAuditLog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env config from one level up from src
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI env variable is missing.');
    }

    console.log('Connecting to database for seeding...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    // 1) Clean up existing seeded data to keep it idempotent
    const seedEmails = [
      'admin@dreampark.com',
      'agent@dreampark.com',
      'finance@dreampark.com',
      'user@dreampark.com',
    ];
    await User.deleteMany({ email: { $in: seedEmails } });
    await TicketType.deleteMany({ name: { $in: ['VIP Magic Pass', 'Standard Pass'] } });
    
    console.log('Cleaned old seeded users and ticket types.');

    // 2) Seed Users
    const users = await User.create([
      {
        name: 'Super Admin',
        email: 'admin@dreampark.com',
        password: 'Password123',
        passwordConfirm: 'Password123',
        phoneNumber: '+9647700000001',
        gender: 'male',
        dateOfBirth: new Date('1990-01-01'),
        address: 'Baghdad, Iraq',
        role: 'ADMIN',
        isVerified: true,
      },
      {
        name: 'Ahmad Al-Agent',
        email: 'agent@dreampark.com',
        password: 'Password123',
        passwordConfirm: 'Password123',
        phoneNumber: '+9647700000002',
        gender: 'male',
        dateOfBirth: new Date('1995-05-15'),
        address: 'Erbil, Iraq',
        role: 'MARKETING_AGENT',
        isVerified: true,
      },
      {
        name: 'Zainab Al-Finance',
        email: 'finance@dreampark.com',
        password: 'Password123',
        passwordConfirm: 'Password123',
        phoneNumber: '+9647700000003',
        gender: 'female',
        dateOfBirth: new Date('1988-10-20'),
        address: 'Basra, Iraq',
        role: 'FINANCIAL_MANAGER',
        isVerified: true,
      },
      {
        name: 'Mustafa Al-User',
        email: 'user@dreampark.com',
        password: 'Password123',
        passwordConfirm: 'Password123',
        phoneNumber: '+9647700000004',
        gender: 'male',
        dateOfBirth: new Date('2000-02-25'),
        address: 'Sulaymaniyah, Iraq',
        role: 'USER',
        isVerified: true,
      },
    ]);
    console.log('✅ Seeded 4 secure RBAC users.');

    const standardUser = users.find((u) => u.email === 'user@dreampark.com');

    // 3) Seed Ticket Types
    const tickets = await TicketType.create([
      {
        name: 'VIP Magic Pass',
        nameAr: 'تذكرة السحر المتميزة VIP',
        category: 'INDIVIDUAL',
        price: 75000,
        discount: 10,
        description: ['Skip all queues', 'Free meal', 'VIP lounge access'],
        descriptionAr: ['تخطي جميع الطوابير', 'وجبة مجانية', 'دخول صالة كبار الشخصيات'],
        icon: 'Crown',
        color: '#ff766d',
        isActive: true,
      },
      {
        name: 'Standard Pass',
        nameAr: 'التذكرة القياسية',
        category: 'INDIVIDUAL',
        price: 35000,
        discount: 0,
        description: ['Full access to all normal rides'],
        descriptionAr: ['دخول كامل لجميع الألعاب العادية'],
        icon: 'Ticket',
        color: '#b5161e',
        isActive: true,
      },
    ]);
    console.log('✅ Seeded 2 Ticket Types.');

    const vipTicket = tickets.find((t) => t.name === 'VIP Magic Pass');

    // 4) Seed active test Booking for today (PENDING_PAYMENT)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Normalized to UTC midnight

    // Clear any today bookings for standard user to keep it clean
    await Booking.deleteMany({ userId: standardUser._id });
    await ScanAuditLog.deleteMany({}); // Reset scan audit logs

    const booking = await Booking.create({
      userId: standardUser._id,
      ticketTypeId: vipTicket._id,
      targetDate: today,
      totalPrice: 67500, // VIP Pass 75000 * 0.9 discount
      quantity: 1,
      phoneNumber: '+9647700000004',
      status: 'PENDING_PAYMENT',
    });
    console.log('✅ Seeded active test booking for TODAY.');
    console.log(`- Booking ID: ${booking._id}`);
    console.log(`- QR Code UUID: ${booking.qrCodeId}`);

    console.log('Database seeding successfully finished.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
