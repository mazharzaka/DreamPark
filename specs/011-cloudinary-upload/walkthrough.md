# Walkthrough: Cloudinary Image Upload System

## Accomplished Integrations

Successfully engineered the Cloudinary media pipeline binding standard multipart payloads securely as a middleware.

### 1. Infrastructure Routing
- Created isolated configurations inside [cloudinary.js](file:///d:/projects/DreamPark/BackEnd/src/config/cloudinary.js).
- Integrated `upload.single('image')` directly inside:
  - [attractionRoutes.js](file:///d:/projects/DreamPark/BackEnd/src/routes/attractionRoutes.js)
  - [heroRoutes.js](file:///d:/projects/DreamPark/BackEnd/src/routes/heroRoutes.js)

### 2. Standardized Controllers
- Established direct bindings taking `req.file` into:
  - [attractionController.js](file:///d:/projects/DreamPark/BackEnd/src/controllers/attractionController.js)
  - [heroController.js](file:///d:/projects/DreamPark/BackEnd/src/controllers/heroController.js)

