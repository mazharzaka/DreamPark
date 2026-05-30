import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Attraction from '../models/Attraction.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    const zooDataPath = path.join(__dirname, '../../seedZoo.json');
    const zooData = JSON.parse(fs.readFileSync(zooDataPath, 'utf-8'));

    // Remove existing mock animals before inserting, or just insert them.
    // Let's delete existing ones in 'animals' category with those mock names just in case,
    // or just upsert the ones provided.
    
    for (const item of zooData) {
      if (item.tags && Array.isArray(item.tags.badges)) {
        item.tags.badges = item.tags.badges.map(b => typeof b === 'string' ? { label: b, variant: 'white' } : b);
      }
      
      if (item._id) {
        await Attraction.findByIdAndUpdate(item._id, item, { upsert: true, new: true, setDefaultsOnInsert: true });
      } else {
        await Attraction.create(item);
      }
    }
    
    console.log('Successfully inserted/updated zoo data');
    process.exit();
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
