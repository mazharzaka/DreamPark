# Research Findings: React Hydration Error Fixes

This document details the research, analysis, and decisions made to resolve the React hydration mismatch errors in the Next.js 16/React 19 application.

## Mismatch 1: SplashScreen Particle Field

### Decision
Generate particles and render the `<ParticleField>` component only after the component has mounted on the client.

### Rationale
- The particles are randomly generated using `Math.random()` to determine coordinates (`left`, `top`), sizes, and animation delay values.
- Generating these values on both server (SSR) and client causes the styling attributes to differ, causing React to throw a severe hydration warning: *“A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.”*
- By adding a `mounted` state toggle inside `SplashScreen.tsx` and deferring particle rendering until `mounted === true`, the server-rendered HTML contains 0 particle nodes. The client then dynamically mounts them immediately after hydration, ensuring flawless alignment with zero warnings.

### Alternatives Considered
- **Using static seeds for randomisation**: We could use a deterministic pseudo-random number generator (PRNG) with a fixed seed. However, this is more complex to implement and could still cause hydration issues if the server/client rendering sequences differ slightly or if browser engines round decimal percentages differently.
- **Using `suppressHydrationWarning` on each particle element**: This would silence the console warnings, but does not solve the underlying DOM synchronization issue, leading to potential layout shifting when React updates. Client-side mount deferral is the cleanest and most correct solution.

---

## Mismatch 2: Localized Bookings Date Formatting

### Decision
Implement a client-side mounting guard in `BookingsHistoryPage` (`my-app/app/[locale]/bookings/page.tsx`). While formatting is pending mount, render an elegant, Awwwards-grade loading skeleton matching the "Editorial Joy" Design System guidelines (using a rounded container, `#f0f1f1` container-low background, and dynamic pulse animation).

### Rationale
- Localized dates formatted with `toLocaleDateString` are highly sensitive to runtime environment variables (timezone, OS-specific locale tables).
- The Next.js Node.js server might run on UTC with a basic ICU database, formatting the date as one string, while the client's browser might render in a local timezone (e.g. Egypt Standard Time) with a richer ICU database, leading to a text content mismatch.
- Rendering a skeleton during SSR/hydration and swapping it with the client-formatted date string upon mount guarantees 100% identical HTML trees during initial load.

### Alternatives Considered
- **Using `suppressHydrationWarning`**: Silences the warning, but can cause visual layout shift if the date formatted by the browser differs significantly in length or value from the server-rendered date.
- **Unified Server-Side Timezone Formatting**: We could parse dates on the backend and pass fully formatted localized date string fields inside the API response payload. While highly consistent, this moves formatting logic to the database/backend layer and reduces flexibility for dynamic client-side locale toggling.
