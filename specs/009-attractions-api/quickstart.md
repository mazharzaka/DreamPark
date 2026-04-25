# Quickstart Guide: Attractions API

## Endpoints

### 1. Create an Attraction
- **Method**: `POST`
- **Path**: `/api/attractions`
- **Payload**:
```json
{
  "name": "Magic Carousel",
  "category": "Kids",
  "description": "Fun for all children",
  "images": ["https://cloudinary.com/example"],
  "minHeight": 90,
  "waitingTime": 15,
  "isFastTrack": false
}
```

### 2. Get All Attractions
- **Method**: `GET`
- **Path**: `/api/attractions`
- **Query Params**: `?category=Kids` (optional)

### 3. Get Attraction by ID
- **Method**: `GET`
- **Path**: `/api/attractions/:id`

### 4. Partial Update Attraction
- **Method**: `PATCH`
- **Path**: `/api/attractions/:id`
- **Payload**:
```json
{
  "status": "Maintenance",
  "waitingTime": 30
}
```

### 5. Delete Attraction
- **Method**: `DELETE`
- **Path**: `/api/attractions/:id`
