# Research: Cloudinary Media Pipelines

## Core Decisions

### 1. Direct Memory Streaming vs Disk Buffer
- **Decision**: Stream payloads via `multer-storage-cloudinary`.
- **Rationale**: Keeps backend ephemeral nodes disk-clean.
- **Alternatives considered**: Local temporary directory saving (heavy cleanup routines required).

### 2. Mandatory WebP Conversion
- **Decision**: Execute server-side processing at ingestion.
- **Rationale**: Dramatic reduction in overall client data payload sizes.
- **Alternatives considered**: Frontend manipulation prior to transmission.
