export type AttractionStatus = 'Operating' | 'Maintenance' | 'Closed';

export interface LayoutOptions {
  colSpan?: number;
  rowSpan?: number;
  customStyle?: string;
}

export interface Attraction {
  _id: string;
  pageKey: string;
  name: string; // The controller will resolve en/ar based on language param
  description: string;
  title?: string;
  subtitle?: string;
  category?: string;
  image?: string;
  images?: string[];
  minHeight?: string;
  status: AttractionStatus;
  waitingTime?: string;
  isFastTrack: boolean;
  bookPass: boolean;
  icon?: string;
  tags?: {
    rules?: { id?: number; type?: string; text?: string; _id?: string }[];
    badges?: { label?: string; variant?: string; _id?: string }[];
  };
  layout?: LayoutOptions;
  createdAt: string;
  updatedAt: string;
}

export interface AttractionApiResponse {
  success: boolean;
  data: Attraction;
}
