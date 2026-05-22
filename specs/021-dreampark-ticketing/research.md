# Research & Technical Decisions: Dream Park Ticketing System

## 1. UI Layout Strategy ("No-Line" Rule)

- **Decision**: Tonal layering backgrounds combined with deep diffused shadows instead of borders and dividers.
- **Rationale**: Strict design system requirement forbidding `1px` borders. Backgrounds will shift smoothly between `#f6f6f6` (base), `#f0f1f1` (container background), and `#ffffff` (card body). High elevation elements will use deep shadows with 4-6% opacity tinted with dark `#2d2f2f` and blur of 40px+.
- **Alternatives Considered**: 
  - Standard borders: Rejected due to strict Editorial Joy guidelines forbidding visible borders.
  - Tonal shifting alone: Hard to read in high-density widgets; hence shadow elevation layering is adopted.

## 2. Dynamic QR Code & Scanner Integration

- **Decision**: Use `qrcode.react` for the visitor's ticket generation, and `html5-qrcode` for the marketing agent's verification camera stream.
- **Rationale**: `qrcode.react` is lightweight, works directly in Next.js, and outputs clean SVGs. `html5-qrcode` is standard, doesn't require native mobile wrappers, supports webcam scanner initialization on modern mobile browsers natively, and provides robust callback interfaces.
- **Alternatives Considered**:
  - React QR Reader: Outdated packages, causing dependency resolution errors in newer React/Next versions.
  - Native Mobile Scanners: Overkill and requires native compilation.

## 3. JWT Authentication & Role-Based Middleware

- **Decision**: Express routes protected using standard JWT middleware verifying roles (`USER`, `MARKETING_AGENT`, `ADMIN`) mapped to incoming headers (`Authorization: Bearer <token>`).
- **Rationale**: JWT is stateless, secure, highly performant, and maps perfectly to decoupled MERN architectures.
- **Alternatives Considered**:
  - Session-based Cookie Auth: Harder to scale and authenticate from external subdomains or Next.js middleware smoothly without CORS complications.

## 4. Ticket Quantity & Relational Modeling

- **Decision**: Include `quantity` field in `Booking` model, calculating `totalPrice` at the backend dynamically by multiplying `ticketType.price * quantity`. Mongoose `.populate('ticketType')` used.
- **Rationale**: Ensured in the clarification session. Users buying for families must not be forced to check out multiple times. Storing total price securely in DB prevents client-side price tampering.
- **Alternatives Considered**:
  - Single Ticket per Booking: Highly restrictive UX.
  - Storing only raw total on client: High security risk (tampering).
