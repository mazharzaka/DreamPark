# Quickstart: Game Card Integration

This guide explains how to validate the updated Game Details page using the existing `Attraction` API endpoint.

## Prerequisites

- Node.js LTS installed
- MongoDB instance running locally or accessible via connection string
- Terminal windows for both frontend (`/my-app`) and backend (`/BackEnd`)
- An existing Attraction document in the database to test with (note its `_id`).

## Validating the Feature

1. Ensure both the backend (`npm run dev` in `BackEnd`) and frontend (`npm run dev` in `my-app`) are running.
2. Obtain a valid Attraction ID from the backend (e.g., via Swagger at `http://localhost:5000/api-docs` or MongoDB Compass).
3. Open your browser and navigate to the Arabic locale version:
   `http://localhost:3000/ar/games/[valid_attraction_id]`
4. Verify RTL layout, Arabic localized text, and smooth entrance animation of the hero, matching the provided premium design.
5. Scroll down to trigger Framer Motion animations for the Booking panel. The pricing and FastPass options should reflect the `isFastTrack` boolean from the database.
6. Test the English locale version:
   `http://localhost:3000/en/games/[valid_attraction_id]`
7. Check error states by navigating to an invalid ID (e.g., `/en/games/invalid-id`) to verify the "Game Not Found" screen renders properly.
