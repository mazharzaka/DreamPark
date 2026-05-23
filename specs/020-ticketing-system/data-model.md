# Data Model: Ticketing System

## Prisma Schema (Next.js App)

### `TicketType`
Represents a purchasable ticket tier.
- `id`: String @id @default(auto()) @map("_id") @db.ObjectId
- `name`: String
- `price`: Float
- `description`: String?
- `updatedAt`: DateTime @updatedAt
- `createdAt`: DateTime @default(now())

### `Booking`
Represents a single reservation created by a user.
- `id`: String @id @default(auto()) @map("_id") @db.ObjectId
- `userId`: String @db.ObjectId
- `user`: User @relation(fields: [userId], references: [id])
- `ticketTypeId`: String @db.ObjectId
- `ticketType`: TicketType @relation(fields: [ticketTypeId], references: [id])
- `targetDate`: DateTime
- `totalPrice`: Float
- `qrCodeId`: String @unique @default(uuid())
- `status`: String @default("PENDING_PAYMENT") // PENDING_PAYMENT | PAID
- `quantity`: Int @default(1)
- `createdAt`: DateTime @default(now())
- `updatedAt`: DateTime @updatedAt

### `User` (Updates)
- `bookings`: Booking[]
- `role`: String @default("USER") // USER | MARKETING_AGENT | ADMIN
