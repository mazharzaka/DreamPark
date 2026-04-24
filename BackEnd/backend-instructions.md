# Dream Park Backend - Project Instructions

## Project Overview
This is a Node.js/Express backend for "Dream Park", using MongoDB (Mongoose). The goal is a highly dynamic, API-driven website where every section (Hero, Zoo, Attractions) is manageable via API.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB via Mongoose
- **Architecture:** Controller-Route-Model (Modular)

## Folder Structure Rules
Always follow this structure when creating new features:
1. `src/models/`: For Mongoose schemas.
2. `src/controllers/`: For business logic and DB queries.
3. `src/routes/`: For defining endpoints and linking them to controllers.
4. `src/middlewares/`: For Auth and Error handling.

## Database Modeling Strategy
- **Dynamic Content:** Each page section (e.g., Hero Home, Hero Zoo) should have a `pageKey` to distinguish data.
- **Image Handling:** Use Cloudinary URLs for optimized assets.
- **Relational Data:** Use Mongoose `.populate()` for linking things like Tickets to Bookings.

## Coding Standards
- Use **ES Modules** (`import/export`) instead of CommonJS.
- Always include **Error Handling** using try-catch blocks in controllers.
- Ensure **CORS** is configured to allow requests from the Next.js frontend.
- Keep the responses consistent: `{ success: true, data: [...] }` or `{ success: false, error: "message" }`.

## Active Endpoints Roadmap
- `GET /api/hero/:pageKey` -> Fetch specific hero content.
- `GET /api/attractions` -> Fetch all rides/attractions.
- `POST /api/bookings` -> Handle ticket purchasing logic.