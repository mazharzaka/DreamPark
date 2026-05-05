# Data Model: Attractions Page

## Entities

### Attraction (Frontend Interface)
Matches the backend schema but typed for TypeScript frontend usage.

```typescript
interface Attraction {
  _id: string;
  name: string;
  category: 'games' | 'animals';
  description: string;
  images: string[]; // Cloudinary URLs
  minHeight?: number;
  status: 'Operating' | 'Maintenance' | 'Closed';
  waitingTime?: number;
  isFastTrack: boolean;
  createdAt: string;
}
```

### Page State
Managed via local React state or URL params (for pagination/category).

```typescript
interface AttractionsState {
  activeTab: 'games' | 'animals';
  currentPage: number;
  itemsPerPage: number; // default: 8
}
```

## Validation Rules

- **Category**: Must strictly be `"games"` or `"animals"`.
- **Status Colors**:
  - `Operating`: Green
  - `Maintenance`: Yellow/Orange
  - `Closed`: Red
- **Rotation Palette**: `paletteIndex = itemIndex % 6`.
