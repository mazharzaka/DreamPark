# Technical Research: Attractions API

**Feature**: Attractions Section — Full CRUD API

## Technology Choices

### Decision: Mongoose for Data Modeling
- **Rationale**: Built-in validation (e.g., `min: 0`, `enum`, `required`) makes fulfilling constraints like FR-006 and FR-013 effortless.
- **Alternatives Considered**: Native MongoDB Driver (rejected due to lack of schema enforcement).

### Decision: REST API endpoints via Express Router
- **Rationale**: Aligns perfectly with the project's architecture and simplifies mapping actions to controller methods.
- **Alternatives Considered**: GraphQL (overkill for simple CRUD at this stage).

---
*No outstanding unknowns remain.*
