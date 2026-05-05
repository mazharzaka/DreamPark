# Quickstart: Attractions Localization and Pagination

## Overview

This guide provides the steps to implement the Attractions Localization and Pagination feature, integrating it into the DreamPark backend.

## Implementation Steps

### 1. Update `Attraction` Model
- Open `BackEnd/src/models/attractionModel.js`.
- Add `name_ar`, `name_en`, `description_ar`, `description_en`, and `pageKey` to the Mongoose schema.
- (Optional) Provide a fallback or migration script if existing `name` and `description` data exists.

### 2. Update `attractionController.js`
- Open `BackEnd/src/controllers/attractionController.js`.
- Create a new controller function (e.g., `getAttractionsByLangAndPage`).
- In this function, extract `lang` and `pageKey` from `req.params`.
- Extract `page`, `limit`, `sort`, and `order` from `req.query`.
- Implement querying logic using Mongoose:
  - `const filter = { pageKey };`
  - Compute `skip` based on `page` and `limit`.
  - Perform `Attraction.find(filter).sort(...).skip(...).limit(...)`.
  - Map the returned data so the frontend receives a generic `name` and `description` property containing the appropriate localized value (e.g., if `lang === 'ar'`, then `mapped.name = attr.name_ar`).
- Return the response conforming to `{ success: true, data: { items: [...], totalPages, currentPage, totalItems } }`.
- Ensure all logic is wrapped in `try-catch` passing to `next(err)`.
- Create/update admin functions (`addAttraction`, `updateAttraction`) to accept the new localized fields and `pageKey`.

### 3. Update `attractionRoutes.js`
- Open `BackEnd/src/routes/attractionRoutes.js`.
- Add `router.get('/:lang/:pageKey', getAttractionsByLangAndPage);`.
- Ensure this route is placed correctly to avoid colliding with `/:id` (you might need to validate `lang` using a middleware or regex, or simply place `/:lang/:pageKey` before `/:id` if length distinguishes them).
- Update the admin routes (POST, PATCH) to ensure they expect the localized payloads.

### 4. Verification
- Verify `GET /api/attractions/ar/games?page=1&limit=5&sort=name_ar&order=asc`.
- Verify the payload structure and pagination metadata.
- Ensure Swagger documentation is updated in `attractionRoutes.js` for the new endpoints.
