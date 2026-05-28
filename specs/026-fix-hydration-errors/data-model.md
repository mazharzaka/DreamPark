# Data Model: React Hydration Error Fixes

This document records the data contract and entity fields relevant to the frontend rendering fixes. No new backend database models or schema migrations are introduced in this feature.

## Consumed Entities

The `/bookings` history page consumes the **Booking** model from the API via Redux Toolkit Query (`bookingsApi.ts`).

### Entity: `Booking`

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier (UUID/MongoDB ID) |
| `ticketType` | `object` | Embedded ticket class details (includes `name`, `price`, `description`) |
| `targetDate` | `string` (Date ISO) | The selected visitation date. Target of localized date string formatting. |
| `quantity` | `number` | Quantity of passes purchased (minimum: 1) |
| `totalPrice` | `number` | Calculated total transaction price in EGP |
| `qrCodeId` | `string` (UUID) | Unique identifier used for check-in QR rendering |
| `status` | `string` | The booking transaction state (e.g. `PENDING_PAYMENT`, `PAID`) |

### Validation Rules (Existing)
- **Date Verification**: `targetDate` must represent today or a future date for active passes. Past bookings are automatically categorized as expired in the UI.

### Rendering Constraints & State Transitions
- **Localized Date Presentation**: When formatting the `targetDate` in the client interface, we must translate the date string using the standard locale databases (`ar-EG` for Arabic, `en-US` for English) without initiating SSR mismatch warnings.
- **Client-Side Mounting Transition**:
  - `mounted === false` (Server Rendering & Initial Hydration): Renders an elegant loader skeleton.
  - `mounted === true` (Client Interactive): Renders the fully localized, dynamic date string.
