# Data Model

## Store Configuration
- `makeStore`: Factory function returning an `@reduxjs/toolkit` store instance.
- `RootState` & `AppDispatch`: Types derived from the store definition.

## API Slice (`apiSlice.ts`)
- **Base Query**: Customized `fetchBaseQuery` targeting the DreamPark backend (incorporating `{ cache: 'no-store' }`).
- **Endpoints**:
  - `getHeroByPage`: Fetches Hero section data (`pageKey` specific).

## Expected API Response
Based on the DreamPark Backend Constitution:
```json
{
  "success": true,
  "data": [ ... ]
}
```
Or error:
```json
{
  "success": false,
  "error": "human-readable message"
}
```
RTK Query endpoints will expect and extract `data` accordingly.
