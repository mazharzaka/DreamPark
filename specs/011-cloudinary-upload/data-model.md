# Data Model: Cloudinary Assets

## Entity: ImageAsset

Represents an image asset securely persisted on the Cloudinary CDN.

### Fields
- `secure_url` (String): Fully qualified HTTPS URI for reading the asset safely.
- `public_id` (String): Unique identifier utilized for deletion or administrative transformation rules.

### Validation Rules
- Supported formats strictly bound to: JPG, JPEG, PNG, WebP.
