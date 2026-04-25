import { ZooFeature, ZooPin } from '../types';

export const ZOO_FEATURES: ZooFeature[] = [
  {
    id: 'safari',
    icon: 'Camera',
    titleKey: 'features.safari.title',
    descriptionKey: 'features.safari.description',
  },
  {
    id: 'conservation',
    icon: 'Heart',
    titleKey: 'features.conservation.title',
    descriptionKey: 'features.conservation.description',
  },
  {
    id: 'interactive',
    icon: 'Info',
    titleKey: 'features.interactive.title',
    descriptionKey: 'features.interactive.description',
  },
  {
    id: 'education',
    icon: 'BookOpen',
    titleKey: 'features.interactive.title', // Reusing for variety
    descriptionKey: 'features.interactive.description',
  },
];

export const ZOO_PINS: ZooPin[] = [
  {
    id: 'lion',
    labelKey: 'zones.lion',
    top: 30,
    left: 40,
    icon: 'Sun',
    variant: 'accent',
  },
  {
    id: 'giraffe',
    labelKey: 'zones.giraffe',
    top: 15,
    left: 65,
    icon: 'Trees',
    variant: 'primary',
  },
  {
    id: 'elephant',
    labelKey: 'zones.elephant',
    top: 65,
    left: 25,
    icon: 'Heart',
    variant: 'secondary',
  },
];
