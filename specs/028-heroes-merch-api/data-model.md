# Data Models & Payloads: Dynamic Heroes and Merch

## 1. Mongoose Schemas (Backend)

We leverage the existing `Hero` Mongoose model for fetching featured slides, and a static mock configuration or simple data store for merchandise products in the backend.

### Hero Model (Reference: `Hero.js`)
```javascript
const slideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  ctaText: { type: String },
  ctaLink: { type: String },
  image: { type: String, required: true } // Cloudinary URL
});

const heroSchema = new mongoose.Schema({
  pageKey: { type: String, required: true },
  lang: { type: String, required: true, enum: ['en', 'ar'] },
  title: { type: String },
  subtitle: { type: String },
  videoUrl: { type: String },
  slides: [slideSchema]
});
```

---

## 2. API Response Data Contracts

The `/api/services` GET response adheres to the strict Dream Park Constitution payload contract.

### Response Shape (`GET /api/services?lang=en`)
```json
{
  "success": true,
  "data": {
    "heroes": [
      {
        "id": "hero-1",
        "title": "Welcome to Dream Park",
        "description": "The ultimate family destination.",
        "image": "https://images.unsplash.com/photo-1513889961551-6ad87799b541?q=80"
      }
    ],
    "merch": [
      {
        "id": "merch-1",
        "title": "Dream Park Classic Tee",
        "price": 25.00,
        "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80"
      }
    ]
  }
}
```
