# Research: Swagger Integration for DreamPark Backend

## Phase 0: Outline & Research

### Research Questions & Findings

#### 1. How to configure Bearer Authentication in OpenAPI 3.0?
- **Decision**: Use `components.securitySchemes` with `type: 'http'` and `scheme: 'bearer'`.
- **Rationale**: This is the standard way in OpenAPI 3.0.0 to declare JWT authentication, which enables the "Authorize" button in Swagger UI.
- **Alternatives considered**: OAuth2 (unnecessary complexity for simple JWT), custom headers (less interactive support).

#### 2. How to ensure `swagger-jsdoc` works properly with ES Modules?
- **Decision**: Define options in `src/config/swagger.js` and use ES Module imports.
- **Rationale**: Keeps the route file logic clean, and delegates configuration parsing to a dedicated file conforming to the Constitution's modular approach.
- **Paths configuration**: The `apis` property should point to `./src/routes/*.js` (assuming the app runs from the `BackEnd/` root directory).

### Example JSDoc for a Route:

```javascript
/**
 * @swagger
 * /api/hero/{pageKey}:
 *   get:
 *     summary: Fetch hero content for a specific page
 *     tags: [Hero]
 *     parameters:
 *       - in: path
 *         name: pageKey
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique key for the target page
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
```
