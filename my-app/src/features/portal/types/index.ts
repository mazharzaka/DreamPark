export interface HeroAction {
  label: string;
  href: string;
  variant: "primary" | "secondary";
}

export interface HeroSlide {
  id: string;
  tagline?: string;
  title: string;
  titleAccent?: string;
  description: string;
  image: string;
  buttons: HeroAction[];
}

export interface AttractionTag {
  label: string;
  variant?: "white" | "dark" | "outline" | "green";
}
export type ticketsetType = {
  id: string;
  title: string;
  image: string;
  layout: {
    colSpan: number;
    rowSpan: number;
  };
};
export interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
}
export interface Attraction {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  tags?: AttractionTag[];
  waitTime?: string;
  minHeight?: string;
  category?: string;
  bookPass?: boolean;
  icon?: string; // name of icon like 'Rocket', 'Droplet'
  layout: {
    colSpan: number;
    rowSpan: number;
    customStyle?: "crimson" | "sky" | "nebula" | "amazon" | "phoenix" | "midas";
  };
}

export interface ZooFeature {
  id: string;
  icon: string; // Lucide icon name
  titleKey: string;
  descriptionKey: string;
}

export interface ZooPin {
  id: string;
  labelKey: string;
  top: number; // percentage
  left: number; // percentage
  icon: string; // Lucide icon name
  variant: "primary" | "secondary" | "accent";
}
