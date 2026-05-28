# Research & Decision Record: Secure RBAC System

This document outlines the technical research, design choices, and security considerations for implementing a highly secure Role-Based Access Control (RBAC) system in the Dream Park web application.

---

## 1. Concurrency Attack & Race Condition Prevention

### Decision: Atomic Mongoose Updates
We will use MongoDB's atomic single-document updates (`findOneAndUpdate`) with exact state-matching filters as a synchronization mutex.

### Rationale
In high-throughput ticket scanning scenarios, two agents scanning the same QR code in rapid succession can trigger a race condition if verification logic follows a "read-then-write" pattern:
1. Agent A reads booking status (returns `PENDING_PAYMENT`).
2. Agent B reads booking status (returns `PENDING_PAYMENT`).
3. Agent A updates status to `PAID` and lets the visitor in.
4. Agent B updates status to `PAID` and lets a second visitor in (Double scan exploit).

By performing atomic query-updates, MongoDB guarantees thread-safe execution at the database engine level:
```javascript
const updatedBooking = await Booking.findOneAndUpdate(
  {
    qrCodeId: qrCodeId,
    status: 'PENDING_PAYMENT',
    targetDate: serverTodayMidNight
  },
  {
    $set: { status: 'SCANNING' }
  },
  { new: true }
);
```
If two requests execute concurrently, exactly one will find the document matching the filter and modify it to `SCANNING`. The second request will find no matching document and return `null`, allowing an immediate, safe reject response.

---

## 2. Client-Side Time Spoofing Mitigation

### Decision: Strict Server-Side Validation
The server is the absolute source of truth. The frontend does not pass any current date parameter to the verification endpoint. 

### Rationale
- **Client Clock Manipulation**: Visitors could change their device's local clock to today's date to validate a ticket intended for a future/past date.
- **Server Date Normalization**: The backend handles all date comparisons. The `/api/tickets/verify` endpoint extracts the booking's `targetDate`, normalizes both the server's current time and the `targetDate` to UTC midnight (`00:00:00.000Z`), and compares them.
```javascript
const serverToday = new Date();
serverToday.setUTCHours(0, 0, 0, 0);

const bookingDate = new Date(booking.targetDate);
bookingDate.setUTCHours(0, 0, 0, 0);

if (serverToday.getTime() !== bookingDate.getTime()) {
  throw new AppError('هذه التذكرة ليست لتاريخ اليوم', 400);
}
```

---

## 3. Secure Token Storage & Session Expiry

### Decision: In-Memory Access Token + Secure `httpOnly` Refresh Cookie
To prevent Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF) token theft:
1. **Access Token (JWT)**: Has a short lifetime (15 minutes). It is returned in the API response payload and kept strictly in the React `AuthContext` application memory. It is never stored in `localStorage` or `sessionStorage`.
2. **Refresh Token**: Has a longer lifetime (7 days) and is stored in a secure, `httpOnly`, `secure` (production-only), `sameSite="strict"` cookie.
3. **Silent Refresh**: A background timer in `AuthContext` triggers a request to `/api/auth/refresh` every 14 minutes. This endpoint reads the refresh cookie, validates it, and issues a new in-memory access token.

### Security Comparison

| Strategy | XSS Vulnerability | CSRF Vulnerability | Implementation Complexity |
|---|---|---|---|
| JWT in `localStorage` | 🔴 **High** (Readable by any script) | 🟢 **None** | Low |
| JWT in normal cookie | 🔴 **High** (Readable via document.cookie) | 🟡 **Medium** (Mitigated by SameSite) | Medium |
| **httpOnly Cookie (Refresh) + In-Memory (Access)** | 🟢 **None** (Cookie unreadable by JS) | 🟢 **None** (Mitigated via SameSite + custom authorization header) | High (Chosen Strategy) |

---

## 4. Offline Blindspot Prevention in Scanner

### Decision: Real-time Camera Freeze + Interactive Modal Blocking
The agent scanner component utilizes native browser event listeners (`window.addEventListener('offline')`) coupled with Redux/React local state.

### UX Flow on Disconnection
1. **Detection**: Within milliseconds of `navigator.onLine` returning `false` (or the offline event firing), the camera/QR scanner stream is frozen (`stream.getTracks().forEach(t => t.enabled = false)`).
2. **UI State**: An absolute-positioned, editorial-style blur overlay is rendered over the viewport.
3. **Arabic Notification**: Displays a prominent Arabic notice: `"تم قطع الاتصال بالإنترنت. لا تقم بتحصيل المبالغ النقدية يدوياً!"` (Internet disconnected. Do not collect cash manually!).
4. **Reconnection**: When connectivity is restored, the stream is unfrozen, the overlay is dismissed, and the scanner resumes normal operation.
