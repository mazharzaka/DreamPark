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
  tags?: { _id?: string; label?: string; variant?: string; type?: string; text?: string }[];
  layout?: LayoutOptions;
  createdAt: string;
  updatedAt: string;
}

export interface AttractionApiResponse {
  success: boolean;
  data: Attraction;
}
