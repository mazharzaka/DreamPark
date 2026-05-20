import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attraction from '../models/Attraction.js';

dotenv.config({ path: './.env' });

const safetyRules = [
  { id: 1, type: "height", text: "الحد الأدنى للارتفاع المسموح به هو 140 سم." },
  { id: 2, type: "health", text: "غير مسموح لمرضى القلب، الضغط، والنساء الحوامل." },
  { id: 3, type: "items", text: "يجب ترك الهواتف والنظارات في الصناديق المخصصة قبل الركوب." },
  { id: 4, type: "behavior", text: "الالتزام بربط حزام الأمان وعدم محاولة الوقوف نهائياً أثناء حركة اللعبة." }
];

const updateDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB successfully!');

    // Update 'ديسكفري' with both badges and safety rules
    const discoveryUpdate = await Attraction.findByIdAndUpdate(
      '69f5bc82aaa4106bfa76108d',
      {
        tags: {
          badges: [
            { label: "HIGH THRILL", variant: "white" },
            { label: "NEW ATTRACTION", variant: "green" }
          ],
          rules: safetyRules
        }
      },
      { returnDocument: 'after' }
    );
    console.log('Updated Discovery attraction:', !!discoveryUpdate);

    // Update all other attractions in games category
    const result = await Attraction.updateMany(
      { category: 'games', _id: { $ne: '69f5bc82aaa4106bfa76108d' } },
      {
        tags: {
          rules: safetyRules,
          badges: []
        }
      }
    );
    console.log(`Updated other games: ${result.modifiedCount} matches`);

    // Verify updating worked
    const allGames = await Attraction.find({ category: 'games' });
    console.log('Verified current games state:');
    allGames.forEach(game => {
      console.log(`- Game: ${game.name_ar || game.name_en || game._id}`);
      console.log(`  Tags Rules: ${JSON.stringify(game.tags?.rules)}`);
      console.log(`  Tags Badges: ${JSON.stringify(game.tags?.badges)}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error updating DB:', error);
    process.exit(1);
  }
};

updateDB();
