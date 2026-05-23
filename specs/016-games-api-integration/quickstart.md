# Quickstart: Games API Integration

## Development Environment
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:3000`
- Database: MongoDB (ensure it has attraction documents with `pageKey: "home"`)

## Backend Implementation
1.  Open `BackEnd/src/controllers/attractionController.js`.
2.  Update `getAttractionsByLangAndPage` to extract `category` from `req.query`.
3.  Add `category` to the `filter` object if it exists.
4.  Test with Postman: `GET http://localhost:5000/api/attractions/ar/home?category=thrill`.

## Frontend Implementation
1.  Update `my-app/src/lib/features/api/apiSlice.ts`:
    - Refactor `getAttractions` query to accept `{ lang, pageKey, category }`.
    - Construct the URL dynamically: `/attractions/${lang}/${pageKey}${category ? `?category=${category}` : ''}`.
2.  Modify `my-app/app/[locale]/games/page.tsx`:
    - Replace mock data usage with `useGetAttractionsQuery`.
    - Extract categories from the initial data response.
    - Handle loading and error states.
3.  Update components in `my-app/src/features/games/components/` to handle the new data structure if necessary.

## Validation
- Verify categories in the filter bar update based on actual backend data.
- Confirm selecting a category triggers a network request with the correct query param.
- Ensure "All" option clears the category filter and re-fetches everything.
