import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attraction from '../models/Attraction.js';

dotenv.config({ path: './.env' });

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB successfully!');
    
    const attractions = await Attraction.find();
    console.log(`Found ${attractions.length} attractions:`);
    attractions.forEach(attr => {
      console.log(`- ID: ${attr._id}, Name (EN): ${attr.name_en}, Name (AR): ${attr.name_ar}, Category: ${attr.category}, Tags:`, JSON.stringify(attr.tags));
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error connecting/querying DB:', error);
    process.exit(1);
  }
};

testConnection();
