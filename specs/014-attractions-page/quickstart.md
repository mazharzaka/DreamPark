# Quickstart: Attractions Page

## Development Setup

### 1. API Integration
The `attractionsApi` should extend the base `apiSlice`.

```typescript
// src/features/portal/api/attractionsApi.ts
export const attractionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttractions: builder.query<Attraction[], void>({
      query: () => '/attractions',
      transformResponse: (response: { success: boolean; data: Attraction[] }) => response.data,
    }),
  }),
});
```

### 2. Localization
Add translations to `messages/[locale].json`.

```json
{
  "Attractions": {
    "title": "Attractions",
    "games": "Games",
    "animals": "Animals",
    "minHeight": "Min Height: {val}cm",
    "waitingTime": "Wait: {val}min",
    "fastTrack": "Fast Track Available",
    "noItems": "No attractions found in this category.",
    "back": "Back to Attractions"
  }
}
```

### 3. Routing
- `src/app/[locale]/attractions/page.tsx`: Main grid page.
- `src/app/[locale]/attractions/[id]/page.tsx`: Detail stub.

## Key Commands

```bash
# Run dev environment
npm run dev
```
