# API Endpoints Contract: Dream Park Ticketing System

All API endpoints must conform to the unified constitution responses:
- **Success**: `{ "success": true, "data": <Payload> }`
- **Error**: `{ "success": false, "error": "Human readable error message" }`

---

## 1. Create Booking

Create a pending ticket reservation for a visitor.

- **URL**: `/api/bookings`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "ticketTypeId": "65b9dfcf21cf071850109923",
    "targetDate": "2026-05-25",
    "quantity": 2,
    "phoneNumber": "+201234567890"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "bookingId": "65b9dfcf21cf0718501099a4",
      "qrCodeValue": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
    }
  }
  ```

---

## 2. Verify Ticket & Confirm Payment

Executed by marketing agents at the park entrance to scan and verify QR codes. Checks date (must be today) and payment status.

- **URL**: `/api/bookings/verify`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>` (Must have `role === 'MARKETING_AGENT'`)
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "qrCodeValue": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
  }
  ```
- **Response (200 OK - Payment Success)**:
  ```json
  {
    "success": true,
    "data": {
      "bookingId": "65b9dfcf21cf0718501099a4",
      "status": "PAID",
      "customerName": "Mazhar Zaka",
      "ticketName": "تذكرة العائلة الذهبية",
      "quantity": 2,
      "totalPrice": 300
    }
  }
  ```
- **Response (400 Bad Request - Date / Payment Error)**:
  ```json
  {
    "success": false,
    "error": "هذه التذكرة ليست صالحة لليوم"
  }
  ```

---

## 3. Update Ticket Price

Allow park administrators to instantly adjust ticket prices.

- **URL**: `/api/tickets/:id`
- **Method**: `PUT`
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>` (Must have `role === 'ADMIN'`)
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "price": 250
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "65b9dfcf21cf071850109923",
      "name": "الفردية الفضية",
      "category": "INDIVIDUAL",
      "price": 250,
      "description": ["دخول كافة الألعاب المائية", "مشروب مجاني عند الدخول"]
    }
  }
  ```
