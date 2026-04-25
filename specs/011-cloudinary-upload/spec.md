# Feature Specification: Cloudinary Image Upload System

**Feature Branch**: `011-cloudinary-upload`  
**Created**: 2026-04-25  
**Status**: Draft  
**Input**: User description: "دمج خدمة Cloudinary لرفع الصور في المشروع باستخدام cloudinary و multer و multer-storage-cloudinary"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload Image via Standalone Endpoint (Priority: P1)

As a developer or API client, I want to upload an image to a standalone endpoint and get its secure URL, so that I can use the image in various components.

**Why this priority**: It is the foundational capability that enables Cloudinary integration.

**Independent Test**: Can be tested by sending a POST request to `/api/upload` with an image payload and verifying the JSON response.

**Acceptance Scenarios**:

1. **Given** a valid image file (JPG/PNG/WebP), **When** a POST request is sent to `/api/upload`, **Then** the file is uploaded to Cloudinary in the `dream-park` folder, and the response returns `{ success: true, data: { secure_url, public_id } }`.
2. **Given** a non-image file (e.g. PDF), **When** uploaded, **Then** an error is returned by the File Filter.

---

### User Story 2 - Image Processing and Optimization (Priority: P2)

As a site administrator, I want uploaded images to be automatically processed (resized, compressed, and transformed to WebP), so that the website remains fast and bandwidth-optimized.

**Why this priority**: Enhances visual excellence and page speed, directly impacting user engagement.

**Independent Test**: Upload a large high-resolution PNG, and verify that the stored asset in Cloudinary is a compressed WebP format.

**Acceptance Scenarios**:

1. **Given** a high-resolution image, **When** uploaded via the middleware, **Then** Cloudinary performs transformations (e.g., resizing, WebP conversion, quality compression).

---

### User Story 3 - Integration into Attraction Routes (Priority: P3)

As a content administrator, I want to create an attraction along with its image seamlessly.

**Why this priority**: Connects raw uploads directly into functional workflows.

**Independent Test**: Documenting a pathway/middleware approach inside `attractionRoutes.js`.

**Acceptance Scenarios**:

1. **Given** a multipart request creating an attraction, **When** executed, **Then** the middleware interceptor saves the image and binds its URL to the Attraction entity.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST establish connection to Cloudinary using `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in a dedicated configuration file `src/config/cloudinary.js`.
- **FR-002**: System MUST provide a `multer` middleware `uploadMiddleware.js` utilizing `multer-storage-cloudinary` targeting the `dream-park` folder.
- **FR-003**: Middleware MUST filter out unauthorized extensions, supporting strictly `['jpg', 'jpeg', 'png', 'webp']`.
- **FR-004**: System MUST expose a dedicated route `POST /api/upload` resolving URLs securely.
- **FR-005**: All error resolution scenarios MUST process via established `AppError` rules.

### Key Entities

- **Upload Payload**: Ephemeral image byte data mapped into secure URLs.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Valid images resolve into functional Cloudinary URLs in < 2.5s.

## Assumptions

- **Cloudinary account validation**: The provided credentials securely authorize execution workflows.
