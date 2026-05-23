# Research: Attractions Localization and Pagination

## Decisions

### 1. Database Querying for Pagination and Sorting
**Decision**: Use standard Mongoose `.find()`, `.sort()`, `.skip()`, and `.limit()` for querying the attractions collection.
**Rationale**: The `Attraction` schema will be updated to include `name_ar`, `name_en`, `description_ar`, `description_en` as well as `pageKey`. This structure naturally supports sorting (e.g. `sort: { name_ar: 1 }`) and pagination natively in MongoDB without any advanced aggregation pipelines.
**Alternatives considered**: Mongoose `aggregate` pipeline was considered but rejected because it is overkill for standard pagination and sorting on a flat schema structure.

### 2. Route Parameters Configuration
**Decision**: Add `/api/attractions/:lang/:pageKey` as a GET route. The `id` operations will be kept but ensuring there's no route collision (since `lang` is specifically `ar` or `en` and ID is a 24-character hex). For query-based operations, sorting and pagination will use query parameters like `?page=1&limit=10&sort=name&order=asc`.
**Rationale**: This perfectly mirrors the requested `heroRoutes.js` (`/:lang/:pageKey`) while enhancing it with standard query strings for list manipulation.
**Alternatives considered**: Passing `lang` and `pageKey` as query parameters (`?lang=ar&pageKey=games`) is cleaner REST technically for lists, but the user explicitly requested to mimic `heroRoutes.js` endpoints.

### 3. API Response Contract
**Decision**: Follow Constitution Principle III exactly, but include metadata in the `data` payload for pagination. Example: `{ success: true, data: { items: [...], totalPages: 5, currentPage: 1, totalItems: 50 } }`.
**Rationale**: Required by constitution, while supporting the frontend's need for pagination controls.
