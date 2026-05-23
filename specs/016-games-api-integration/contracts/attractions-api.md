# API Contract: Attractions Listing

## GET /api/attractions/:lang/:pageKey

Fetches a list of attractions for a specific page and language, with optional category filtering.

### Parameters

| Name | In | Type | Required | Description |
|------|----|------|----------|-------------|
| lang | path | string | Yes | `ar` or `en` |
| pageKey | path | string | Yes | e.g., `home` |
| category | query | string | No | Filter by category name |
| page | query | number | No | Default: 1 |
| limit | query | number | No | Default: 10 |

### Response (Success)

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "...",
        "name": "Localized Name",
        "category": "Action",
        "description": "Localized description",
        "image": "https://...",
        "layout": { ... }
      }
    ],
    "pagination": {
      "totalItems": 100,
      "totalPages": 10,
      "currentPage": 1,
      "limit": 10
    }
  }
}
```

### Response (Error)

```json
{
  "success": false,
  "error": "Error message details"
}
```
