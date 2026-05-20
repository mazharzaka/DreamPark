# Server Actions Contracts

Since the user explicitly requested Server Actions for Next.js, the core communication between the frontend components and the database will happen via these actions instead of REST APIs.

## `createBooking`
Creates a new booking for the authenticated user.
- **Input**: `{ ticketTypeId: string, targetDate: string, quantity: number }`
- **Output**: `{ success: true, data: { bookingId: string, qrCodeId: string } } | { success: false, error: string }`
- **Validation**: Checks if date is in the future. Calculates total price server-side using the DB ticket price.

## `verifyAndConfirmPayment`
Confirms payment for a booking via QR code scan (Marketing Agent only).
- **Input**: `{ qrCodeId: string }`
- **Output**: `{ success: true, data: { bookingId: string, status: string } } | { success: false, error: string }`
- **Validation**: Requires MARKETING_AGENT role. Validates that booking exists, is for today, and is not already PAID.

## `updateTicketPrice`
Updates the price of a ticket type (Admin only).
- **Input**: `{ ticketTypeId: string, newPrice: number }`
- **Output**: `{ success: true } | { success: false, error: string }`
- **Validation**: Requires ADMIN role. Price must be positive.

## `getTicketTypes`
Fetches all available ticket types.
- **Input**: None
- **Output**: `{ success: true, data: TicketType[] }`

## `getUserBookings`
Fetches bookings for the current user.
- **Input**: None
- **Output**: `{ success: true, data: Booking[] }`
