# Quickstart: Dream Park Ticketing System

Follow these steps to spin up and test the Ticketing, Verification, and Pricing System.

## 1. Prerequisites & Environment Setup

### Backend Environment Configuration
Verify your `BackEnd/.env` file has the following configurations loaded:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dreampark
JWT_SECRET=supersecretjwtkeyforauthentication
CLIENT_ORIGIN=http://localhost:3000
```

### Frontend Environment Configuration
Verify your `my-app/.env` file has the frontend consumer keys correctly specified:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

---

## 2. Running the MERN Stack Localy

### Spin up the Backend (Express + MongoDB)
Open a new shell session at `BackEnd/` directory:
```bash
cd BackEnd
npm install
npm run dev
```

### Spin up the Frontend (Next.js consumer app)
Open a new shell session at `my-app/` directory:
```bash
cd my-app
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your browser to interact with the application.

---

## 3. Seed Mock Tickets

To seed standard Individual and Group tickets into the Database, run the following helper script in the Backend:
```bash
npm run seed-tickets
```
This inserts:
1. **تذكرة الفرد الفضية** (`INDIVIDUAL`): price 150 EGP, color: `#005caa`, icon: `Ticket`
2. **تذكرة المجموعة الذهبية** (`GROUP`): price 600 EGP, color: `#755700`, icon: `Star`

---

## 4. End-to-End Test Workflow

1. **Register/Login User**: Authenticate via the login widget. Keep your JWT token ready or check that the system stores it inside `localStorage('token')` automatically.
2. **Book Ticket**: Choose the category (Individual or Group) using tonal borderless tabs, pick tomorrow's date, specify a quantity, enter your phone number, and complete booking.
3. **Check User Dashboard**: Go to the `/bookings` history view. Confirm your booking is active under status `PENDING_PAYMENT` with a large premium scannable QR Code.
4. **Agent Verification**: Sign in as a `MARKETING_AGENT`, open the `/marketing-dashboard/scan` camera stream, scan your user QR code. Confirm that visitor name, quantity, and EGP price show up inside the success modal, then confirm cash payment.
5. **Admin Price Board**: Sign in as an `ADMIN` on the pricing board, modify the Silver Individual ticket price to 180 EGP inline. Verify that future booking flows instantly calculate the new pricing amount!
