import { HeroSlide } from '../types';

export const MOCK_HERO_SLIDES: HeroSlide[] = [
  {
    id: '1',
    tagline: 'STEP INTO THE DREAM',
    title: 'UNREAL',
    titleAccent: 'ADVENTURE',
    description: "Experience the world's most advanced 3D amusement park. Cinematic rides, heart-pumping thrills, and unforgettable memories.",
    image: '/slider/Dream_park_4.jpg', // A rollercoaster/park image
    buttons: [
      { label: 'dream', href: '/magic', variant: 'primary' },
      { label: 'park', href: '/portal', variant: 'secondary' }
    ]
  },
  {
    id: '2',
    tagline: 'WHERE MAGIC HAPPENS',
    title: 'DREAM',
    titleAccent: 'SAFARI',
    description: 'Explore the wonders of nature with our immersive zoo experience. Meet rare species in their curated habitats.',
    image: '/slider/Rollercoster.jpg', // A nature/safari image
    buttons: [
      { label: 'M', href: '/magic', variant: 'primary' },
      { label: 'S', href: '/safari', variant: 'secondary' }
    ]
  }
  , {
    id: '3',
    tagline: 'WHERE MAGIC HAPPENS',
    title: 'DREAM',
    titleAccent: 'Zoo',
    description: 'Explore the wonders of nature with our immersive zoo experience. Meet rare species in their curated habitats.',
    image: '/slider/zoo.jpg', // A nature/safari image
    buttons: [
      { label: 'M', href: '/magic', variant: 'primary' },
      { label: 'S', href: '/safari', variant: 'secondary' }
    ]
  }
];
export const ZooHero: HeroSlide = {
  id: '1',
  title: 'UNREAL',
  description: "Experience the world's most advanced 3D amusement park. Cinematic rides, heart-pumping thrills, and unforgettable memories.",
  image: '/lion1.png', // A rollercoaster/park image
  buttons: [
    { label: 'View our Champion', href: '/magic', variant: 'primary' },
  ]
}