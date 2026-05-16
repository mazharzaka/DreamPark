# Research: Games Page API Integration

## Decision: Backend Category Filtering
Rationale: The requirement explicitly states that filtering must be done on the backend via query parameters (`?category=action`). The current `getAttractionsByLangAndPage` controller only filters by `pageKey`. I will update it to also accept a `category` query parameter.

## Decision: Dynamic API Locale
Rationale: The spec clarification session confirmed that the API locale segment should follow the active UI locale. I will use the `lang` parameter from the RTK Query call which will be populated from the `[locale]` segment of the Next.js page.

## Decision: RTK Query for Data Fetching
Rationale: The project already uses RTK Query (`apiSlice.ts`). I will expand the `getAttractions` endpoint to support dynamic `lang`, `pageKey`, and `category`.

## Decision: Client-side Category Extraction
Rationale: Per spec clarification, the categories list for the filter bar will be derived from the unique `category` values present in the initial "all games" response. This avoids an extra API call.

## Alternatives Considered:
- **Client-side filtering**: Rejected because the user explicitly requested backend filtering.
- **Separate categories endpoint**: Rejected to keep the integration simple and avoid extra network calls.
- **Hardcoded categories**: Rejected because categories should be dynamic based on the actual games in the database.
