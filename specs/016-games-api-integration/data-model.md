# Data Model: Games API Integration

## Entities

### Attraction
Represents a game or attraction in the park.

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| pageKey | String | Page identifier (e.g., "home" for games) |
| name_en | String | English name |
| name_ar | String | Arabic name |
| category | String | Category label (e.g., "Thrill", "Family") |
| description_en | String | English description |
| description_ar | String | Arabic description |
| image | String | Primary image URL (Cloudinary) |
| layout | Object | colSpan, rowSpan, customStyle |

### Mapped Game (Frontend)
The shape used in the React components after backend mapping.

| Field | Type | Description |
|-------|------|-------------|
| id | String | From `_id` |
| name | String | From `name_en` or `name_ar` |
| description | String | From `description_en` or `description_ar` |
| category | String | From `category` |
| image | String | From `image` |
| layout | Object | From `layout` |
