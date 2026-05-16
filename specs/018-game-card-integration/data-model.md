# Data Model: Game Card Integration

This document defines the data structures used by the feature, leveraging the existing `Attraction` Mongoose schema and mapping it to the frontend UI.

## Backend: Existing Mongoose Schema

The feature relies exclusively on the existing `Attraction` model located in `BackEnd/src/models/Attraction.js`. We do not need to create a new model.

Key fields used for the Game Details UI:
- `_id`: The unique identifier used in the URL.
- `name_en` / `name_ar`: Localized title.
- `description_en` / `description_ar`: Localized description.
- `image`: Hero background image.
- `waitingTime`: e.g., "45 MIN". Mapped to the Hero stats bar.
- `minHeight`: e.g., "Min: 140cm". Mapped to the Hero stats or Safety section.
- `category`: Mapped to the badge on the Hero section.
- `isFastTrack`: Boolean. Used to determine if the FastPass UI element in the Booking Panel should be shown.
- `status`: ['Operating', 'Maintenance', 'Closed']. Mapped to the availability status in the Booking Panel (Operating -> Available, Maintenance/Closed -> Sold Out/Unavailable).

## Frontend: TypeScript Interfaces

We will update the frontend types to reflect this structure.

```typescript
// /src/types/attraction.ts

export type AttractionStatus = 'Operating' | 'Maintenance' | 'Closed';

export interface LayoutOptions {
  colSpan?: number;
  rowSpan?: number;
  customStyle?: string;
}

export interface Attraction {
  _id: string;
  pageKey: string;
  name: string; // Controller resolves en/ar based on language param
  description: string; // Controller resolves en/ar
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
  tags?: { label: string; variant: string }[];
  layout?: LayoutOptions;
  createdAt: string;
  updatedAt: string;
}

// Data mapping rules for UI Components:
// 1. Hero Stats:
//    - Wait Time -> `waitingTime`
//    - Ride Type -> `category`
//    - Min Height -> `minHeight`
// 2. Booking Panel:
//    - If `status === 'Operating'`, show Available. Otherwise, Unavailable.
//    - If `isFastTrack === true`, show FastPass pricing.
