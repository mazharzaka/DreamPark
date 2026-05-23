export interface Category {
  id: string;
  nameKey?: string; // The translation key, e.g., 'Categories.thrill'
  name?: string; // Raw localized name from API
}

export interface Game {
  id: string;
  titleKey?: string; // Translation key
  descriptionKey?: string; // Translation key
  name?: string; // Raw localized name from API
  description?: string; // Raw localized description from API
  image: string;
  categoryId: string;
}
