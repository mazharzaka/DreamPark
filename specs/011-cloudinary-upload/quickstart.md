# Quickstart Guide: Media Upload Integration

## Usage Scenarios

### 1. Uploading a File Standalone
Send an HTTP POST payload using standard multipart data mappings.

**Path**: `/api/upload`  
**Payload**: `image=<binary_stream>`  

**Success JSON Response**:
```json
{
  "success": true,
  "data": {
    "secure_url": "https://res.cloudinary.com/...",
    "public_id": "dream-park/..."
  }
}
```
