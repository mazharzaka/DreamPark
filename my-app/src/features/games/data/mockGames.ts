import { Product } from '../../portal/types';
import { Category, Game } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'all', nameKey: 'Games.Categories.all' },
  { id: 'thrill', nameKey: 'Games.Categories.thrill' },
  { id: 'family', nameKey: 'Games.Categories.family' },
  { id: 'kids', nameKey: 'Games.Categories.kids' },
];

export const MOCK_GAMES: Game[] = [
  {
    id: 'game-1',
    titleKey: 'Games.Items.game1.title',
    descriptionKey: 'Games.Items.game1.description',
    image: '/games/home.webp', // Reusing some existing mock images
    categoryId: 'thrill',
  },
  {
    id: 'game-2',
    titleKey: 'Games.Items.game2.title',
    descriptionKey: 'Games.Items.game2.description',
    image: '/games/coster.jpg',
    categoryId: 'family',
  },
  {
    id: 'game-3',
    titleKey: 'Games.Items.game3.title',
    descriptionKey: 'Games.Items.game3.description',
    image: '/games/discovery.png',
    categoryId: 'kids',
  },
  {
    id: 'game-4',
    titleKey: 'Games.Items.game4.title',
    descriptionKey: 'Games.Items.game4.description',
    image: '/games/top.jpg',
    categoryId: 'thrill',
  },
  {
    id: 'game-5',
    titleKey: 'Games.Items.game5.title',
    descriptionKey: 'Games.Items.game5.description',
    image: '/child/zoo2.jpg',
    categoryId: 'family',
  },
  {
    id: 'game-6',
    titleKey: 'Games.Items.game6.title',
    descriptionKey: 'Games.Items.game6.description',
    image: '/child/zoo3.jpg',
    categoryId: 'kids',
  },
];


export const mockMerch: Product[] = [
  {
    id: 'merch-1',
    title: "t-shirt",
    image: '/products/product1.png', // Reusing some existing mock images
    price: 10,
  },
  {
    id: 'merch-2',
    title: "cap",
    image: '/products/product2.png',
    price: 15,
  },
  {
    id: 'merch-3',
    title: "mug",
    image: '/products/product3.png',
    price: 15,
  },
  {
    id: 'merch-4',
    title: "keychain",
    image: '/products/product4.png',
    price: 15,
  },

]