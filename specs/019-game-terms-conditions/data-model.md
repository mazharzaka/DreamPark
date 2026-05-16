# Data Model: Game Terms and Conditions

This feature leverages the existing `Attraction` Mongoose model without any structural changes.

## Backend: Existing Mongoose Schema

The feature relies exclusively on the `tags` array defined in `BackEnd/src/models/Attraction.js`:

```javascript
tags: [
  {
    label: String,
    variant: {
      type: String,
      enum: ['white', 'dark', 'outline', 'green'],
      default: 'white',
    },
  },
]
```

## Frontend: TypeScript Interfaces

The frontend `Attraction` interface in `my-app/src/types/attraction.ts` already includes this definition:

```typescript
export interface Attraction {
  // ... other fields
  tags?: { label: string; variant: string }[];
}
```

The new `TermsAndConditions` component will receive the `tags` array as a prop.
