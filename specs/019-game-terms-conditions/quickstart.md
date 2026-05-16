# Quickstart: Game Terms and Conditions

This guide explains how to validate the new "Terms and Conditions" section on the Game Details page.

## Prerequisites

- Node.js LTS installed
- MongoDB instance running locally or accessible via connection string
- Terminal windows for both frontend (`/my-app`) and backend (`/BackEnd`)
- An existing Attraction document in the database that has items in the `tags` array.

## Validating the Feature

1. Ensure both the backend (`npm run dev` in `BackEnd`) and frontend (`npm run dev` in `my-app`) are running.
2. Obtain a valid Attraction ID from the backend that contains `tags` (you may need to add tags to an attraction via MongoDB Compass or the backend API if none exist).
3. Open your browser and navigate to the Arabic locale version:
   `http://localhost:3000/ar/games/[valid_attraction_id]`
4. Scroll down past the Booking Panel. You should see a section titled "الشروط والأحكام" containing the tag labels.
5. Test the English locale version:
   `http://localhost:3000/en/games/[valid_attraction_id]`
6. Verify the section title is translated to "Terms and Conditions".
7. Verify that if you navigate to an attraction with an empty `tags` array, the "Terms and Conditions" section does not render at all.
