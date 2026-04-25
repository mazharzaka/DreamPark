export type MapLocation = {
  id: string;
  name: string;
  category: 'Rides' | 'Zoo' | 'Water' | 'Facilities';
  color: string;
  icon: string; // Lucide icon name
  x: number;    // % from left
  y: number;    // % from top
  desc: string;
};

export const MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'crimson-coaster',
    name: 'The Crimson Coaster',
    category: 'Rides',
    color: '#b5161e',
    x: 75,
    y: 25,
    icon: 'Rocket',
    desc: 'Ultimate adrenaline experience.',
  },
  {
    id: 'dream-zoo-explorer',
    name: 'Dream Zoo Explorer',
    category: 'Zoo',
    color: '#10b981', // Emerald from tailwind.config
    x: 65,
    y: 45,
    icon: 'Camera',
    desc: 'A peaceful green escape.',
  },
  {
    id: 'aqua-lagoon',
    name: 'Aqua Lagoon',
    category: 'Water',
    color: '#005caa',
    x: 45,
    y: 60,
    icon: 'Waves',
    desc: 'Central lake and water rides.',
  },
  {
    id: 'grand-entrance',
    name: 'Grand Entrance',
    category: 'Facilities',
    color: '#755700',
    x: 40,
    y: 85,
    icon: 'Star',
    desc: 'Your gateway to magic.',
  },
];
