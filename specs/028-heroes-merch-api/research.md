# Research & Technical Decisions: Dynamic Heroes and Merch

## 1. Unified Content Endpoint

- **Decision**: Introduce a single aggregated GET endpoint `/api/services` in the Express backend that returns both featured heroes (slides) and merchandise products.
- **Rationale**:
  - Decreases the number of HTTP requests initiated by the landing page from 2 down to 1.
  - Mitigates network latency issues for visitors using mobile networks on-site at the park.
  - Matches Express routing principles by delegating to a modular, clean controller.
- **Alternatives Considered**:
  - Two distinct endpoints (`/api/heroes` and `/api/merch`): Rejected due to unnecessary request overhead.
  - Directly using `useGetAttractionsQuery` on the home portal: Rejected because hero slides and merch are structural/promotional content, not primary park attractions.

## 2. Hydration Safety & Client-Side Mounting

- **Decision**: Guard all fetch invocations and layout calculations with a `mounted` local state hook inside `OurHeroesSlider.tsx` and `Merch.tsx`. While mounting is pending, render an Editorial-Joy-compliant pulse skeleton loader.
- **Rationale**:
  - Swiper dynamically queries browser-specific layout dimensions (e.g. `window.innerWidth`), which are undefined on the Node.js server during SSR.
  - Directly executing fetches or initializing swipers during SSR causes major Next.js hydration mismatches.
  - Skeletons provide a highly aesthetic, premium transition state for users.
- **Alternatives Considered**:
  - Code splitting with `next/dynamic` and `ssr: false`: Rejected because it blocks initial HTML page shell construction and decreases SEO indexing efficiency.

## 3. Dynamic Localisation Support

- **Decision**: Pass `lang` as a query parameter (e.g. `/api/services?lang=ar`) from the Next.js locale router to the backend, enabling the backend to automatically return correctly localized titles, subtitles, and descriptions.
- **Rationale**:
  - Maximizes flexibility and aligns with next-intl language segmentation.
  - Keeps the database queries fast and clean.
- **Alternatives Considered**:
  - Fetching both languages at once and filtering client-side: Rejected as it leaks unused translation payloads, increasing data usage.
