# API Contract: Game Terms and Conditions

This feature uses the existing Attraction API endpoint without any modifications to the contract.

## Fetch Attraction by ID

**Endpoint:** `GET /api/attractions/:id`

The endpoint returns the full `Attraction` document, which includes the `tags` array used by this feature.

### Partial Successful Response Example (200 OK)

```json
{
  "success": true,
  "data": {
    "_id": "60d5ecb8b392cb001f5f3b9a",
    "name_en": "Nebula Falls",
    "tags": [
      {
        "label": "Must be accompanied by an adult",
        "variant": "white",
        "_id": "60d5ecb8b392cb001f5f3b9b"
      },
      {
        "label": "Not recommended for pregnant women",
        "variant": "outline",
        "_id": "60d5ecb8b392cb001f5f3b9c"
      }
    ]
  }
}
```
