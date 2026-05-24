# Research Notes: Profile Page & Ticket Management

**Feature**: 025-profile-ticket  
**Created**: 2026-05-24  

---

## 1. Technical Decisions & Research Findings

### Decision 1: Booking Status Field Enhancement
* **Findings**: Currently, the `Booking` schema in `BackEnd/src/models/Booking.js` only contains `PENDING_PAYMENT` and `PAID` in its status enum. The specification requires support for `Upcoming` (active), `Past` (used/expired), and `Cancelled` tabs.
* **Resolution**: Enhance the `status` enum in `Booking.js` to include the following states:
  * `PENDING_PAYMENT` (Upcoming / Pending payment at gate)
  * `PAID` (Upcoming / Paid & Active)
  * `USED` (Past / Ticket successfully scanned and consumed)
  * `EXPIRED` (Past / Target date passed without being used)
  * `CANCELLED` (Explicitly Cancelled / Payment cancelled or booking invalidated)
* **Rationale**: Align database status values directly with the requirements for robust categorization and state tracking.

---

### Decision 2: API Endpoints & Route Mapping for Date Modification
* **Findings**: The user request specifies `PATCH /api/v1/bookings/:id/change-date` for updating the booking date. However, the existing backend routes in `app.js` are grouped under `/api/tickets` (handled by `ticketingRoutes.js`).
* **Resolution**: To maximize compatibility, robustly implement the date modification endpoint in both namespaces:
  1. Add the path as `/bookings/:id/change-date` in `ticketingRoutes.js` (which translates to `PATCH /api/tickets/bookings/:id/change-date`).
  2. Mount a redirect/alias route group in `app.js` for `/api/v1/bookings` that delegates to `ticketingRoutes.js`, ensuring `PATCH /api/v1/bookings/:id/change-date` works perfectly.
* **Logic**:
  * Verify that the booking belongs to the requesting authenticated user.
  * Verify that the booking's current status is `PENDING_PAYMENT` or `PAID`.
  * Ensure the booking's `targetDate` has not already passed.
  * Restrict the new date to future dates only (must be greater than today's date).
  * Save the new date to the database and return a standardized success response.

---

### Decision 3: Dynamic QR Generation & Offline Image Download
* **Findings**: `qrcode.react` is already installed in `my-app` package dependencies. The package exports both `QRCodeSVG` and `QRCodeCanvas`.
* **Resolution**:
  * We will use `QRCodeCanvas` from `qrcode.react` inside the details modal.
  * The canvas rendering allows direct capture of the image data on the client side.
  * To download the PNG offline:
    ```javascript
    const canvas = document.getElementById(`qr-canvas-${bookingId}`);
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `DreamPark-Pass-${bookingId.substring(0, 8).toUpperCase()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
    ```
  * This is an entirely client-side process requiring no network connectivity, making it the perfect offline fallback at the gate.

---

### Decision 4: Localization & RTL Orientation for Arabic Support
* **Findings**: `next-intl` is active. The root layout correctly sets `<html dir="rtl">` or `dir="ltr"` automatically based on the route language segment (e.g. `/ar/...` or `/en/...`).
* **Resolution**:
  * Read the active locale in components using `const locale = useLocale() || 'en';` or standard `next-intl` helpers.
  * Add custom CSS conditional padding/margins using `rtl:pl-...` / `rtl:text-right` where needed, or adapt structural flex rows dynamically (e.g. `flex-row-reverse` when locale is Arabic).
  * All labels, headers, status badges, buttons, error states, and messages will have matching translation definitions in `en.json` and `ar.json` under a cohesive namespace.

---

## 2. Alternatives Considered

* **Alternative 1 (Server-Side PDF/QR Generation)**: Considered generating a scannable PDF or image on the backend.
  * *Rejected because*: Requires active network connection to download the ticket, violating the "offline fallback check" requirement. Rendering client-side via canvas is faster, fully responsive, and highly reliable.
* **Alternative 2 (Different route file for v1 routes)**: Considered setting up an entirely distinct router for `/api/v1/...` routes.
  * *Rejected because*: Unnecessarily increases codebase complexity. Mapping `/api/v1/bookings` directly to the unified `ticketingRoutes.js` keeps all booking-related logic centralized in `ticketingController.js` in compliance with backend modular principles.
