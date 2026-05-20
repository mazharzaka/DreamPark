# Quickstart: Ticketing System

1. **Database Update**:
   - Ensure your Prisma schema in `my-app/prisma/schema.prisma` includes the `TicketType`, `Booking`, and updated `User` models.
   - Run `npx prisma db push` (or `npx prisma generate`) in the `my-app` directory to sync the schema.

2. **Component Development**:
   - Build the `Magic Pass` booking flow using Next.js App Router (`my-app/app/[locale]/pass/page.tsx`).
   - Implement the `html5-qrcode` scanner for the agent dashboard (`my-app/app/[locale]/marketing-dashboard/scan/page.tsx`).
   - Build the pricing management board (`my-app/app/[locale]/admin/tickets/page.tsx`).

3. **Styling**:
   - Strictly follow the Editorial Joy design system. No 1px borders. Use tonal layering, glassmorphism, and the specified color palette (Primary Crimson, Secondary Royal Blue, Tertiary Gold).
