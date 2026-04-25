export interface Category {
  id: string;
  nameKey: string; // The translation key, e.g., 'Categories.thrill'
}

export interface Game {
  id: string;
  titleKey: string; // Translation key
  descriptionKey: string; // Translation key
  image: string;
  categoryId: string; // Single category for simplicity, or we can use array. Let's use string.
}
