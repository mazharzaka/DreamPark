import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attraction from '../models/Attraction.js';

dotenv.config({ path: './.env' });

const attractions = [
  // GAMES
  {
    name: "CRIMSON VELOCITY",
    title: "CRIMSON VELOCITY",
    category: "games",
    image: "/games/discovery.png",
    tags: [
      { label: "HIGH THRILL", variant: "white" },
      { label: "NEW ATTRACTION", variant: "green" },
    ],
    waitTime: "45 MIN",
    minHeight: "Min: 140cm",
    layout: {
      colSpan: 2,
      rowSpan: 2,
      customStyle: "crimson",
    },
  },
  {
    name: "TopSpin",
    title: "TopSpin",
    category: "games",
    subtitle: "FAMILY FRIENDLY",
    image: "/games/Top.jpg",
    waitTime: "15 MIN WAIT",
    bookPass: true,
    layout: {
      colSpan: 2,
      rowSpan: 1,
      customStyle: "sky",
    },
  },
  {
    name: "Rocket",
    title: "Rocket",
    category: "games",
    image: "/games/rocket.jpg",
    icon: "Rocket",
    waitTime: "WAIT: 20M",
    layout: {
      colSpan: 1,
      rowSpan: 1,
      customStyle: "nebula",
    },
  },
  {
    name: "AMAZON PLUNGE",
    title: "AMAZON PLUNGE",
    category: "games",
    image: "/games/coster.jpg",
    icon: "Droplet",
    waitTime: "WAIT: 65M",
    layout: {
      colSpan: 1,
      rowSpan: 1,
      customStyle: "amazon",
    },
  },
  {
    name: "THE ROCKET",
    title: "THE ROCKET",
    category: "games",
    subtitle: "EXTREME THRILL",
    image: "/games/rocket.jpg",
    waitTime: "90 MIN",
    layout: {
      colSpan: 2,
      rowSpan: 1,
      customStyle: "phoenix",
    },
  },
  {
    name: "MIDAS MOUNTAIN",
    title: "MIDAS MOUNTAIN",
    category: "games",
    subtitle: "Interactive Treasure Hunt Experience",
    image: "/games/home.webp",
    layout: {
      colSpan: 2,
      rowSpan: 1,
      customStyle: "midas",
    },
  },
  // ANIMALS
  {
    name: "Lion",
    title: "Lion",
    category: "animals",
    image: "/animals/animal1.png",
    tags: [
      { label: "HIGH THRILL", variant: "white" },
      { label: "NEW ATTRACTION", variant: "green" },
    ],
    waitTime: "45 MIN",
    minHeight: "Min: 140cm",
    layout: {
      colSpan: 2,
      rowSpan: 2,
      customStyle: "crimson",
    },
  },
  {
    name: "TopSpin Animal",
    title: "TopSpin Animal",
    category: "animals",
    subtitle: "FAMILY FRIENDLY",
    image: "/animals/animal2.png",
    waitTime: "15 MIN WAIT",
    bookPass: true,
    layout: {
      colSpan: 2,
      rowSpan: 1,
      customStyle: "sky",
    },
  },
  {
    name: "Rocket Animal",
    title: "Rocket Animal",
    category: "animals",
    image: "/animals/animal3.png",
    icon: "Rocket",
    waitTime: "WAIT: 20M",
    layout: {
      colSpan: 1,
      rowSpan: 1,
      customStyle: "nebula",
    },
  },
  {
    name: "AMAZON PLUNGE Animal",
    title: "AMAZON PLUNGE Animal",
    category: "animals",
    image: "/animals/animal4.png",
    icon: "Droplet",
    waitTime: "WAIT: 65M",
    layout: {
      colSpan: 1,
      rowSpan: 1,
      customStyle: "amazon",
    },
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    await Attraction.deleteMany();
    console.log('Deleted existing attractions');
    
    await Attraction.insertMany(attractions);
    console.log('Inserted new attractions');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
