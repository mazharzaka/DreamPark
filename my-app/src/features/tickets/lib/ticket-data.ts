export type PassTier = {
  id: string;
  nameKey: string;
  editionKey: string;
  price: number;
  icon: 'Diamond' | 'Star' | 'Ticket';
  color: string;
  isPopular: boolean;
  features: string[];
};

export const TICKET_TIERS: PassTier[] = [
  {
    id: 'diamond',
    nameKey: 'tiers.diamond.name',
    editionKey: 'tiers.diamond.edition',
    price: 499,
    icon: 'Diamond',
    color: '#005caa', // Royal Blue
    isPopular: false,
    features: ['tiers.diamond.features.magicPass', 'tiers.diamond.features.lounge', 'tiers.diamond.features.discount'],
  },
  {
    id: 'gold',
    nameKey: 'tiers.gold.name',
    editionKey: 'tiers.gold.edition',
    price: 249,
    icon: 'Star',
    color: '#d4af37', // Warm Gold
    isPopular: true,
    features: ['tiers.gold.features.fastTrack', 'tiers.gold.features.parking', 'tiers.gold.features.discount'],
  },
  {
    id: 'silver',
    nameKey: 'tiers.silver.name',
    editionKey: 'tiers.silver.edition',
    price: 129,
    icon: 'Ticket',
    color: '#708090', // Slate Silver
    isPopular: false,
    features: ['tiers.silver.features.access', 'tiers.silver.features.parking', 'tiers.silver.features.magicPass'],
  },
];
