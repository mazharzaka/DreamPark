# Quickstart: Profile Page & Ticket Management

**Feature**: 025-profile-ticket

## Running Locally

1. **Start the Backend**:
   Ensure MongoDB is running and `BackEnd/.env` is configured.
   ```bash
   cd BackEnd
   npm install
   npm run dev
   ```

2. **Start the Frontend**:
   Ensure `my-app/.env` is configured.
   ```bash
   cd my-app
   npm install
   npm run dev
   ```

## Testing Flow

### 1. Verification of Multi-Language Layout
* Navigate to `http://localhost:3000/en/login` and log in.
* Navigate to `http://localhost:3000/en/profile`.
* Click the language switcher in the Header to switch to Arabic (`/ar/profile`).
* Verify that:
  * The entire layout shifts gracefully to Right-to-Left (RTL) alignment.
  * All labels (Phone, Status, etc.), tabs (Upcoming, Past, Cancelled), and action buttons render with natural native Arabic texts.

### 2. Verification of Ticket Categories Tab
* Generate mock bookings for your test user or book a few passes via the tickets page.
* Ensure you have at least:
  * One ticket with a future `visitDate` (targetDate).
  * One ticket with a past `visitDate`.
  * One ticket marked as `CANCELLED` in the database.
* Navigate back to `/profile` and verify each card is placed in its matching tab (Upcoming, Past, or Cancelled) with no overlap.

### 3. Verification of Ticket Validity Extension
* On the **Upcoming** tab, find an active ticket.
* Click the small **Change Date** (تغيير التاريخ) button.
* A calendar modal opens; choose a future date and press submit.
* Verify that:
  * The card updates its date instantly in the UI.
  * The database confirms the new `targetDate` via `PATCH /api/v1/bookings/:id/change-date`.

### 4. Verification of Secure QR Details & Offline Download
* On any ticket card, click the prominent **Download/View QR Code** button.
* Verify a beautiful, floating modal displays:
  * A scannable QR Code.
  * Precise ticket ID, tier & quantity details, and pricing summary.
* Click the **Save to Device** button.
* Verify that a `.png` image containing the QR code downloads immediately to your local system and is fully scannable offline.
