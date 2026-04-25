# Data Model: Swagger API Documentation

## Entities

- **Swagger Configuration**
  - Representation: The global OpenAPI metadata.
  - Attributes:
    - `openapi`: '3.0.0'
    - `info.title`: 'Dream Park API'
    - `info.version`: '1.0.0'
    - `servers`: [{ url: 'http://localhost:5000' }]
    - `components.securitySchemes.bearerAuth`: Bearer JWT specification.

- **Route JSDoc Annotations**
  - Tagged documentation attached directly above each route endpoint definition.
