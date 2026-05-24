# API Contracts: Ticket Management & Date Change

**Feature**: 025-profile-ticket  
**Created**: 2026-05-24  

---

## 1. PATCH `/api/v1/bookings/:id/change-date`
*(Also aliased / mapped as `PATCH /api/tickets/bookings/:id/change-date`)*

Allows a user to extend or change the target date of their upcoming booking.

* **Auth Level Required**: `USER` or higher (must own the booking, or be an `ADMIN`)
* **Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "visitDate": "2026-06-15T00:00:00.000Z"
}
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "data": {
    "bookingId": "65e237fb31a89c9225b212f4",
    "targetDate": "2026-06-15T00:00:00.000Z",
    "message": "Visit date updated successfully."
  }
}
```

**Response (Bad Request / Past Date - 400)**:
```json
{
  "success": false,
  "error": "New target date must be in the future."
}
```

**Response (Unauthorized / Not Owner - 401)**:
```json
{
  "success": false,
  "error": "You do not have permission to modify this booking."
}
```

**Response (Not Found - 404)**:
```json
{
  "success": false,
  "error": "Booking not found."
}
```

---

## 2. GET `/api/tickets/bookings/user`
*(Enhanced response schema including populated ticket types)*

Retrieves the active user's bookings, supporting optional time filtering.

* **Auth Level Required**: `USER` or higher
* **Headers**: `Authorization: Bearer <access_token>`
* **Query Parameters**:
  * `from`: ISO date string (optional, defaults to 30 days ago to prevent huge list loads)
  * `sort`: field name (optional, defaults to `targetDate`)
  * `order`: `asc` or `desc` (optional, defaults to `desc`)

**Response (Success - 200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "65e237fb31a89c9225b212f4",
      "userId": "65e237fb31a89c9225b21200",
      "ticketTypeId": {
        "id": "65e237fb31a89c9225b212aa",
        "name": "Gold Edition",
        "nameAr": "الإصدار الذهبي",
        "price": 350,
        "discount": 10
      },
      "targetDate": "2026-06-15T00:00:00.000Z",
      "totalPrice": 315,
      "quantity": 1,
      "qrCodeId": "f784e27f-94d0-4bf2-be72-9b2ee3970b78",
      "status": "PENDING_PAYMENT",
      "phoneNumber": "01012345678",
      "createdAt": "2026-05-24T13:00:00.000Z",
      "updatedAt": "2026-05-24T13:10:00.000Z"
    }
  ]
}
```
