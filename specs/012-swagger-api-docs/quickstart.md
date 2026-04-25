# Quickstart: Accessing API Docs

## Setup

1. Make sure you are in the `BackEnd` folder.
2. Run `npm install swagger-jsdoc swagger-ui-express`.
3. Start the server via `npm start` or `npm run dev` if configured.

## Usage

Navigate to `http://localhost:5000/api-docs` in your web browser. 

### To authenticate:
1. Hit the `/api/auth/login` endpoint via your preferred HTTP client or directly in Swagger (if supported).
2. Copy the token.
3. Click **Authorize** in Swagger UI.
4. Type `Bearer <your_token>` or just `<your_token>` (depending on swagger setup, we will configure it to expect the raw token if the scheme type is 'http' with 'bearer').
