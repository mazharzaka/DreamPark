# API Contract: Game Card Integration

This document defines the interface for the Attraction endpoint used by the Game Details page.

## Fetch Attraction by ID

**Endpoint:** `GET /api/attractions/:id`
**Description:** Retrieves full details for a single attraction by its MongoDB `_id`. This is an *existing* endpoint in the backend.

### Request Parameters

| Parameter | Type   | In   | Required | Description |
| :-------- | :----- | :--- | :------- | :---------- |
| `id`      | string | path | Yes      | The MongoDB ObjectId of the attraction. |

### Successful Response (200 OK)

The endpoint currently returns the raw database document under the `data` key. The frontend is responsible for selecting the correct localized field (`name_en` vs `name_ar`) based on the current Next.js `[locale]`.

```json
{
  "success": true,
  "data": {
    "_id": "60d5ecb8b392cb001f5f3b9a",
    "pageKey": "home",
    "name_en": "Nebula Falls",
    "name_ar": "شلالات السديم",
    "description_en": "Embark on a journey through the cosmic nebula on the fastest roller coaster in the park.",
    "description_ar": "انطلق في رحلة عبر السديم الكوني في أسرع قطار ملاهي في الحديقة.",
    "category": "Peak Thrill",
    "image": "https://res.cloudinary.com/demo/image/upload/v1626941234/nebula_falls.jpg",
    "status": "Operating",
    "waitingTime": "45 MIN",
    "minHeight": "Min: 140cm",
    "isFastTrack": true,
    "bookPass": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Error Responses

#### Not Found (404 Not Found)
When the ID does not match any existing attraction.

```json
{
  "success": false,
  "message": "Attraction not found with ID: 60d5ecb8b392cb001f5f3b9a"
}
```
