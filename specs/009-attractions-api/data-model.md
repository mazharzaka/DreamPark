# Data Model: Attraction

## Entity: Attraction
Represents a ride or game in the park.

### Fields
- `name` (String): Required. Trimmed.
- `category` (String): e.g., 'Kids', 'Family', 'Thrill'.
- `description` (String): Optional description of the attraction.
- `images` ([String]): Array of Cloudinary URLs.
- `minHeight` (Number): Minimum height in cm. Must be >= 0.
- `status` (String): Enum: `['Operating', 'Maintenance', 'Closed']`. Defaults to `'Operating'`.
- `waitingTime` (Number): Wait time in minutes. Must be >= 0.
- `isFastTrack` (Boolean): Fast track access flag. Defaults to `false`.

### Timestamps
- `createdAt`: Automatically generated on creation.
- `updatedAt`: Automatically updated on modification.
