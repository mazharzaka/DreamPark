# Quickstart & Verification Guide

This document describes how to launch, seed, and manually verify the secure RBAC ticketing system in your local environment.

---

## 1. Quickstart Commands

### Step 1: Environment Variables
Ensure the following are present in your backend `.env` file:
```env
JWT_SECRET=super-secret-key-at-least-32-chars-long
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=longer-secret-for-refresh-token-cookies
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:3000
```

### Step 2: Seed Database
We will create a database seeding script (`BackEnd/src/utils/seedRbacData.js`) that provisions testing accounts and a set of test tickets:
- **Admin**: `admin@dreampark.com` / `Password123`
- **Marketing Agent**: `agent@dreampark.com` / `Password123`
- **Financial Manager**: `finance@dreampark.com` / `Password123`
- **Standard User**: `user@dreampark.com` / `Password123`

To run the seeder:
```bash
npm run seed:rbac
```

### Step 3: Run Development Servers
**Backend**:
```bash
cd BackEnd
npm run dev
```

**Frontend**:
```bash
cd my-app
npm run dev
```

---

## 2. Interactive Manual Testing Checklist

### Scenario A: Concurrency Rejection (Box-Office Test)
1. Log into the scanner page (`/marketing-dashboard/scan`) from two separate browser windows (or one Chrome window + one Incognito window) using the same credentials `agent@dreampark.com`.
2. Generate a mock scan request for the same `qrCodeId`.
3. Hit the scan verification button in both browsers at the exact same moment.
4. **Expected Result**: Browser 1 shows the visitor confirmation panel. Browser 2 shows the prominent red Arabic error: `"تم مسح هذه التذكرة بالفعل من جهاز آخر"`.

### Scenario B: Client Date Spoofing Test
1. Access a booking dated for tomorrow or yesterday.
2. Change your local computer clock to tomorrow's date.
3. Scan the ticket from the agent scanner dashboard.
4. **Expected Result**: The backend rejects the ticket with: `"هذه التذكرة ليست لتاريخ اليوم"`, comparing exclusively against the server's time.

### Scenario C: Offline Freeze Test
1. Open the agent scanner page `/marketing-dashboard/scan`.
2. Turn off your local internet (or toggle offline mode in Chrome DevTools Network tab).
3. **Expected Result**: The camera feed instantly stops/freezes, and a full-screen, high-blur Editorial-Joy layout displays the Arabic warning instructing you not to collect any cash manually.
