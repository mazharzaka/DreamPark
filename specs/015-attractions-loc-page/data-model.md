# Data Model: Attractions Localization

## `Attraction` Schema Updates

To support the requirements outlined in the spec and research, the `Attraction` Mongoose schema in `BackEnd/src/models/attractionModel.js` must be updated.

### Existing Fields (Inferred)
- `name`: String
- `description`: String
- `category`: String
- `image`: String
- `createdAt` / `updatedAt`

### New / Updated Fields

- `name_ar`: `String` (Required, Arabic name of the attraction)
- `name_en`: `String` (Required, English name of the attraction)
- `description_ar`: `String` (Optional/Required, Arabic description)
- `description_en`: `String` (Optional/Required, English description)
- `pageKey`: `String` (Required, categorizes the attraction, e.g., 'games', 'animals')

*Note: Existing `name` and `description` fields should either be migrated to the new localized fields or preserved for backward compatibility and deprecated.*

### Validations
- `pageKey` must be a non-empty string.
- When querying, `lang` in the route parameter should be strictly validated against `['ar', 'en']`.

### Relationships
- No direct Mongoose relationships (`ObjectId` refs) are strictly required based on the specification.

### Data Return Format
When responding to a `GET /api/attractions/:lang/:pageKey` request, the backend will return a mapped object representing the single requested language, similar to:

```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "name": "Arabic Name (mapped from name_ar)",
  "description": "Arabic Description (mapped from description_ar)",
  "category": "category value",
  "image": "cloudinary_url",
  "pageKey": "games"
}
```
