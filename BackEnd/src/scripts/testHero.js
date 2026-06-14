import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Hero from '../models/Hero.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const testConnection = async () => {
  try {
    console.log('MONGO_URI is:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB successfully!');
    
    const heroes = await Hero.find();
    console.log(`Found ${heroes.length} heroes:`);
    heroes.forEach(h => {
      console.log(`- PageKey: ${h.pageKey}, Title: ${h.title}, Slides Count: ${h.slides?.length}`);
      h.slides?.forEach((s, idx) => {
        console.log(`  Slide ${idx}: ${s.title} - ${s.imageUrl}`);
      });
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error connecting/querying DB:', error);
    process.exit(1);
  }
};

testConnection();
