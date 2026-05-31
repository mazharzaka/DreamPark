# Quickstart Guide: Dynamic Heroes and Merch

Follow these instructions to spin up the services and verify that the backend API is working and integrated into the frontend.

## 1. Backend Verification

Start the Express backend server:
```bash
# In BackEnd directory
npm run dev
```

Verify the new endpoint `/api/services` by making a GET request:
```bash
curl http://localhost:5000/api/services?lang=en
```

This should return:
```json
{
  "success": true,
  "data": {
    "heroes": [...],
    "merch": [...]
  }
}
```

---

## 2. Frontend Verification

Start the Next.js frontend dev server:
```bash
# In my-app directory
npm run dev
```

### Pages to Test:
1. **Home Portal**: `http://localhost:3000/en` or `http://localhost:3000/ar`
   - Observe that the sliding banners (`OurHeroesSlider`) and product list (`Merch`) are loaded dynamically.
   - Skeletons are briefly visible while fetching.
2. **Zoo Animals Page**: `http://localhost:3000/en/zoo/animals` or `http://localhost:3000/ar/zoo/animals`
   - Verify that the featured animals slider (`OurHeroesSlider`) loads its slides from the attractions RTK Query hook.
